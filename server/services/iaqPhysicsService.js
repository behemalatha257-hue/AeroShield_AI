/**
 * AeroShield AI - Indoor Air Quality (IAQ) Physics Engine
 * 
 * Implements the scientific Mass Balance Differential Equation for indoor aerosols:
 * dCin/dt = P * a * Cout + S/V - (a + k + CADR/V) * Cin
 * 
 * Solution:
 * Cin(t) = Cin(0)*exp(-λ*t) + ( (P*a*Cout + S/V) / λ ) * (1 - exp(-λ*t))
 * where:
 *   λ (total loss rate h⁻¹) = a (air exchange) + k (deposition) + CADR/V (filtration)
 *   P = building envelope penetration factor (0.5 - 0.8)
 *   a = air changes per hour (ACH)
 *   Cout = outdoor PM2.5 (µg/m³)
 *   S = indoor source emission rate (µg/h)
 *   V = room volume (m³)
 *   k = natural surface deposition rate (0.2 - 0.4 h⁻¹)
 *   CADR = clean air delivery rate (m³/h)
 */

const { IAQ_PHYSICS, CLEANER_CADR, AQI_STANDARDS } = require('../config/constants');

class IAQPhysicsService {
  /**
   * Calculate effective total loss rate λ (h⁻¹)
   */
  calculateLossRate(ach, roomVolumeM3, cadrM3h, depositionK = IAQ_PHYSICS.DEPOSITION_RATE_K) {
    const filtrationRate = cadrM3h / roomVolumeM3;
    return ach + depositionK + filtrationRate;
  }

  /**
   * Calculate steady-state concentration Cin_ss
   */
  calculateSteadyState(cout, ach, roomVolumeM3, cadrM3h, sourceUgH = 0, penetrationP = IAQ_PHYSICS.PENETRATION_FACTOR_P, depositionK = IAQ_PHYSICS.DEPOSITION_RATE_K) {
    const lambda = this.calculateLossRate(ach, roomVolumeM3, cadrM3h, depositionK);
    const sourceTerm = (penetrationP * ach * cout) + (sourceUgH / roomVolumeM3);
    return Math.max(0, sourceTerm / lambda);
  }

  /**
   * Calculate concentration at time t (hours) from initial Cin0
   */
  calculateConcentrationAtTime(cin0, cout, tHours, ach, roomVolumeM3, cadrM3h, sourceUgH = 0, penetrationP = IAQ_PHYSICS.PENETRATION_FACTOR_P, depositionK = IAQ_PHYSICS.DEPOSITION_RATE_K) {
    const lambda = this.calculateLossRate(ach, roomVolumeM3, cadrM3h, depositionK);
    const steadyState = this.calculateSteadyState(cout, ach, roomVolumeM3, cadrM3h, sourceUgH, penetrationP, depositionK);
    const expTerm = Math.exp(-lambda * tHours);
    return (cin0 * expTerm) + (steadyState * (1 - expTerm));
  }

  /**
   * Calculate time (in minutes) required to reduce indoor PM2.5 to target concentration
   */
  calculateTimeToTarget(cin0, targetConcentration, cout, ach, roomVolumeM3, cadrM3h, sourceUgH = 0) {
    const steadyState = this.calculateSteadyState(cout, ach, roomVolumeM3, cadrM3h, sourceUgH);
    if (cin0 <= targetConcentration) return 0;
    if (steadyState >= targetConcentration) return null; // Impossible to reach target if steady-state is higher

    const lambda = this.calculateLossRate(ach, roomVolumeM3, cadrM3h);
    // target = cin0*e^(-λt) + ss*(1 - e^(-λt)) => (target - ss) / (cin0 - ss) = e^(-λt)
    const ratio = (targetConcentration - steadyState) / (cin0 - steadyState);
    if (ratio <= 0) return null;

    const tHours = -Math.log(ratio) / lambda;
    return Math.round(tHours * 60); // Return minutes
  }

  /**
   * Run a 24-hour simulation under varying conditions
   */
  simulateDay({
    outdoorPM25Curve = null, // array of 24 hourly outdoor PM2.5 readings
    baseOutdoorPM25 = 220,
    roomVolumeM3 = IAQ_PHYSICS.DEFAULT_ROOM_VOLUME_M3,
    filterType = 'CORSI_ROSENTHAL_20INCH',
    windowStatus = 'closed', // 'closed', 'cracked', 'open', 'scheduled'
    cookingEvent = true, // cooking spike at 19:00
    wetMopping = true,
    humidityControl = true
  }) {
    // Generate diurnal outdoor curve if not provided (winter smog peak at 07:00 and 22:00, dip at 14:00)
    const outdoorCurve = outdoorPM25Curve || this.generateWinterDiurnalCurve(baseOutdoorPM25);
    const cadr = CLEANER_CADR[filterType] !== undefined ? CLEANER_CADR[filterType] : CLEANER_CADR.CORSI_ROSENTHAL_20INCH;

    let currentCin = baseOutdoorPM25 * 0.7; // start morning with semi-infiltrated air
    const timeline = [];

    let totalExposureNoIntervention = 0;
    let totalExposureWithIntervention = 0;

    for (let hour = 0; hour < 24; hour++) {
      const cout = outdoorCurve[hour];

      // Determine ACH for this hour
      let ach = IAQ_PHYSICS.AIR_EXCHANGE_CLOSED;
      if (windowStatus === 'open') {
        ach = IAQ_PHYSICS.AIR_EXCHANGE_OPEN;
      } else if (windowStatus === 'cracked') {
        ach = IAQ_PHYSICS.AIR_EXCHANGE_CRACKED;
      } else if (windowStatus === 'scheduled') {
        // Optimal airing window: 13:00 to 15:00
        ach = (hour >= 13 && hour <= 14) ? IAQ_PHYSICS.AIR_EXCHANGE_OPEN : IAQ_PHYSICS.AIR_EXCHANGE_CLOSED;
      }

      // Check indoor sources:
      // Breakfast: 08:00 (500 µg/h), Dinner: 19:00 (1800 µg/h)
      let sourceUgH = 0;
      if (cookingEvent) {
        if (hour === 8) sourceUgH = 400;
        if (hour === 19) sourceUgH = wetMopping ? 1200 : 2500; // Wet mopping & exhaust keeps it lower
      }

      // Humidity buffering adds slight agglomeration deposition (+0.05 h⁻¹)
      const depositionK = humidityControl ? 0.30 : 0.22;

      // Calculate end-of-hour concentration
      const nextCin = this.calculateConcentrationAtTime(
        currentCin,
        cout,
        1.0, // 1 hour step
        ach,
        roomVolumeM3,
        cadr,
        sourceUgH,
        IAQ_PHYSICS.PENETRATION_FACTOR_P,
        depositionK
      );

      // Baseline comparison (No air cleaner, typical drafty room, dry sweeping)
      const baselineNextCin = this.calculateConcentrationAtTime(
        currentCin,
        cout,
        1.0,
        IAQ_PHYSICS.AIR_EXCHANGE_CRACKED,
        roomVolumeM3,
        0, // No cleaner
        cookingEvent && (hour === 8 || hour === 19) ? 2200 : 0,
        0.80,
        0.20
      );

      const avgHourCin = (currentCin + nextCin) / 2;
      const avgBaseline = (currentCin + baselineNextCin) / 2;

      totalExposureWithIntervention += avgHourCin;
      totalExposureNoIntervention += avgBaseline;

      timeline.push({
        hour: `${String(hour).padStart(2, '0')}:00`,
        outdoorPM25: Math.round(cout),
        indoorPM25WithShield: Math.max(1, Math.round(avgHourCin)),
        indoorPM25Unshielded: Math.max(1, Math.round(avgBaseline)),
        ach: Number(ach.toFixed(2)),
        cadrM3h: cadr,
        sourceActive: sourceUgH > 0
      });

      currentCin = nextCin;
    }

    const avgClean = Math.round(totalExposureWithIntervention / 24);
    const avgUnshielded = Math.round(totalExposureNoIntervention / 24);
    const reductionPercent = Math.round(((avgUnshielded - avgClean) / avgUnshielded) * 100);

    return {
      roomVolumeM3,
      filterType,
      cadrM3h: cadr,
      windowStatus,
      averageIndoorPM25: avgClean,
      baselineIndoorPM25: avgUnshielded,
      pm25ReductionPercent: reductionPercent,
      whoLimitComparison: {
        who24hLimit: AQI_STANDARDS.WHO.PM25_24H_LIMIT,
        isWithinWhoLimit: avgClean <= AQI_STANDARDS.WHO.PM25_24H_LIMIT,
        timesAboveWhoLimit: Number((avgClean / AQI_STANDARDS.WHO.PM25_24H_LIMIT).toFixed(1))
      },
      timeToWHOStandardMinutes: this.calculateTimeToTarget(
        baseOutdoorPM25 * 0.7,
        AQI_STANDARDS.WHO.PM25_24H_LIMIT,
        baseOutdoorPM25 * 0.4,
        IAQ_PHYSICS.AIR_EXCHANGE_CLOSED,
        roomVolumeM3,
        cadr
      ),
      hourlyTimeline: timeline
    };
  }

  /**
   * Generates a realistic diurnal winter smog outdoor PM2.5 profile
   * Characteristics: Severe inversion spikes in early morning (05:00-08:00) and late evening (21:00-01:00)
   * Minimum during thermal mixing (13:00-15:00)
   */
  generateWinterDiurnalCurve(baseAQI = 250) {
    const factors = [
      1.25, 1.28, 1.30, 1.32, 1.35, 1.40, // 00:00 - 05:00 (Stagnant cold pool)
      1.45, 1.42, 1.30, 1.10, 0.90, 0.75, // 06:00 - 11:00 (Morning traffic spike + solar heating begins)
      0.65, 0.55, 0.50, 0.58, 0.75, 0.95, // 12:00 - 17:00 (Golden convective mixing window - lowest pollution)
      1.15, 1.25, 1.30, 1.32, 1.30, 1.26  // 18:00 - 23:00 (Evening inversion descent + cooking/heating emissions)
    ];

    return factors.map(f => Math.round(baseAQI * f));
  }
}

module.exports = new IAQPhysicsService();
