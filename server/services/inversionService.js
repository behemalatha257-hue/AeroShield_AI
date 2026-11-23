/**
 * AeroShield AI - Winter Thermal Inversion & Atmospheric Boundary Layer Service
 * 
 * Explains and simulates the meteorological dynamics of winter smog:
 * - Nocturnal Radiative Cooling & Ground-level Inversion
 * - Planetary Boundary Layer (PBL) Height (80m at night -> 1200m at midday)
 * - Identifies Golden Natural Ventilation Windows
 */

class InversionService {
  /**
   * Calculate planetary boundary layer height (m) throughout 24 hours
   */
  calculatePBLHeight(hour, isCloudy = false) {
    // Nocturnal baseline: 90m - 140m
    // Midday peak: 900m - 1300m
    // Cloud cover reduces night radiative cooling (higher nocturnal PBL) but dampens midday solar heating
    const baseCurve = [
      110, 100, 95, 90, 85, 95,   // 00:00 - 05:00
      120, 210, 380, 590, 820, 1050, // 06:00 - 11:00
      1220, 1310, 1280, 1100, 850, 520, // 12:00 - 17:00
      310, 220, 170, 150, 130, 120   // 18:00 - 23:00
    ];

    let height = baseCurve[hour];
    if (isCloudy) {
      if (hour < 7 || hour > 18) {
        height *= 1.35; // clouds trap warmth, weaker nocturnal inversion
      } else {
        height *= 0.80; // less solar flux, lower midday mixing height
      }
    }
    return Math.round(height);
  }

  /**
   * Inversion Severity Score (1 - 10)
   * 10 = extreme trapping (PBL < 100m, stagnant wind < 1 m/s)
   */
  getInversionScore(pblHeight, windSpeedMps = 1.2) {
    if (pblHeight <= 100 && windSpeedMps < 1.5) return 10;
    if (pblHeight <= 150) return 9;
    if (pblHeight <= 250) return 8;
    if (pblHeight <= 400) return 6;
    if (pblHeight <= 700) return 4;
    if (pblHeight <= 1000) return 2;
    return 1;
  }

  /**
   * Generate 24-hour meteorological and inversion forecast
   */
  get24HourInversionForecast(city = 'Delhi-NCR', baseTempC = 8) {
    const hours = [];
    let bestWindowStart = null;
    let bestWindowEnd = null;

    for (let h = 0; h < 24; h++) {
      const pbl = this.calculatePBLHeight(h);
      const tempC = baseTempC + (h >= 6 && h <= 15 ? (h - 6) * 1.5 : -(h > 15 ? (h - 15) * 0.7 : (6 - h) * 0.4));
      const windSpeed = (h >= 12 && h <= 16) ? 3.2 : 1.1; // convective breezes during daytime
      const inversionScore = this.getInversionScore(pbl, windSpeed);

      const isSafeAiringWindow = (h >= 13 && h <= 15 && pbl > 900);
      if (isSafeAiringWindow) {
        if (bestWindowStart === null) bestWindowStart = h;
        bestWindowEnd = h;
      }

      let airAction = 'SEAL_WINDOWS';
      let guidance = 'Thermal inversion trapping ground pollution. Keep windows firmly shut.';

      if (h >= 13 && h <= 15) {
        airAction = 'VENTILATE_SAFELY';
        guidance = 'Convective mixing peak: Maximum vertical air dispersion. Air out your home for 20-30 minutes.';
      } else if (h >= 7 && h <= 10) {
        airAction = 'HIGH_EXPOSURE_RISK';
        guidance = 'Morning rush hour exhaust trapped by low inversion lid. Wear N95 outdoors; avoid morning runs.';
      } else if (h >= 19 && h <= 23) {
        airAction = 'NOCTURNAL_STAGNATION';
        guidance = 'Evening inversion reforming. Turn on indoor air filtration in bedrooms; avoid burning anything.';
      }

      hours.push({
        hour: `${String(h).padStart(2, '0')}:00`,
        temperatureC: Number(tempC.toFixed(1)),
        pblHeightMeters: pbl,
        windSpeedMps: windSpeed,
        inversionSeverityIndex: inversionScore, // 1 - 10
        status: inversionScore >= 8 ? 'CRITICAL_INVERSION' : (inversionScore >= 5 ? 'MODERATE_TRAPPING' : 'MIXING_ACTIVE'),
        airAction,
        guidance,
        safeAiringWindow: isSafeAiringWindow
      });
    }

    return {
      location: city,
      summary: {
        currentCondition: 'Severe Winter Boundary Layer Inversion',
        goldenWindow: `${String(bestWindowStart || 13).padStart(2, '0')}:00 - ${String(bestWindowEnd || 15).padStart(2, '0')}:30`,
        goldenWindowExplanation: 'Solar radiation warms the ground surface, triggering convective thermal thermals that punch through the nocturnal cold inversion lid, vertically dispersing trapped particulates.',
        nocturnalRiskHours: '20:00 - 09:00',
        peakInversionPBL: 85 // meters
      },
      forecast: hours
    };
  }
}

module.exports = new InversionService();
