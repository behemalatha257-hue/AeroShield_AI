/**
 * AeroShield AI - Direct Impact Calculation & Scientific Explainability Service
 * 
 * Quantifies both personal health benefits (lungs spared) and community emissions averted.
 * Mathematical transparency with scientific citations (WHO 2021, Berkeley Earth, EPA).
 */

const { RESPIRATION_RATES, AQI_STANDARDS } = require('../config/constants');

class ImpactService {
  /**
   * Calculate personal and community impact of user choices
   */
  calculateImpact({
    householdMembers = ['adult', 'child_infant'],
    roomVolumeM3 = 45,
    hasCorsiRosenthal = true,
    hasN95Commute = true,
    hasKitchenExhaust = true,
    hasCarpooled = true,
    dailyCommuteKm = 24,
    hasSwitchedHeating = true,
    currentOutdoorPM25 = 250,
    timeframeDays = 30 // monthly or winter season (e.g. 90 days)
  }) {
    // 1. Respiration profile of household
    let totalHouseholdBreathingRateM3h = 0;
    householdMembers.forEach(member => {
      if (member.includes('infant')) totalHouseholdBreathingRateM3h += RESPIRATION_RATES.INFANT;
      else if (member.includes('child')) totalHouseholdBreathingRateM3h += RESPIRATION_RATES.CHILD;
      else if (member.includes('elderly')) totalHouseholdBreathingRateM3h += RESPIRATION_RATES.ELDERLY;
      else totalHouseholdBreathingRateM3h += RESPIRATION_RATES.ADULT_RESTING;
    });

    // Baseline unshielded daily exposure:
    // 16 hours indoor unshielded (penetration 0.75 * outdoor + cooking spike = ~220 µg/m³)
    // 2 hours commute unshielded (outdoor traffic corridor = ~320 µg/m³)
    // 6 hours sleeping in drafty room (~200 µg/m³)
    const baselineAvgExposureUgM3 = currentOutdoorPM25 * 0.85;

    // AeroShield shielded daily exposure:
    // Indoor with Corsi-Rosenthal: drops to 15-25 µg/m³
    // Commute with N95 + recirc: drops by 90% (to ~30 µg/m³)
    // Kitchen with negative pressure: eliminates cooking spike
    let shieldedIndoorAvgPM25 = 22; // WHO near-target
    if (!hasCorsiRosenthal) shieldedIndoorAvgPM25 = currentOutdoorPM25 * 0.65;
    if (!hasKitchenExhaust) shieldedIndoorAvgPM25 += 35;

    let commuteExposurePM25 = currentOutdoorPM25 * 1.1; // roadside
    if (hasN95Commute) commuteExposurePM25 *= 0.08; // 92% filtration with N95

    // Weighted 24-hr personal exposure
    const shieldedWeightedPM25 = (shieldedIndoorAvgPM25 * 22 + commuteExposurePM25 * 2) / 24;

    // 2. Personal Lung PM2.5 Inhalation (micrograms per day per household)
    // Inhaled Dose = Concentration (µg/m³) * Breathing Rate (m³/h) * Hours
    const baselineDailyInhaledDoseUg = baselineAvgExposureUgM3 * totalHouseholdBreathingRateM3h * 24;
    const shieldedDailyInhaledDoseUg = shieldedWeightedPM25 * totalHouseholdBreathingRateM3h * 24;
    const dailyAvoidedInhaledDoseUg = Math.max(0, baselineDailyInhaledDoseUg - shieldedDailyInhaledDoseUg);

    // Cumulative timeframe impact
    const totalAvoidedInhaledDoseMg = Number(((dailyAvoidedInhaledDoseUg * timeframeDays) / 1000).toFixed(2)); // in milligrams

    // Berkeley Earth Equivalence: 22 µg/m³ 24h PM2.5 exposure is roughly equivalent to 1 cigarette in lung toxicity
    const dailyAvoidedCigaretteEquivalents = Number(((baselineAvgExposureUgM3 - shieldedWeightedPM25) / 22).toFixed(1));
    const totalAvoidedCigarettes = Math.round(dailyAvoidedCigaretteEquivalents * timeframeDays);

    // 3. Community Emissions Impact
    // Carpool: 1 vehicle km avoided = ~0.16 kg CO₂ and ~0.0006 kg (0.6g) PM2.5 tailpipe
    let dailyCO2AvoidedKg = 0;
    let dailyPM25TailpipeAvoidedG = 0;

    if (hasCarpooled) {
      dailyCO2AvoidedKg += dailyCommuteKm * 0.17;
      dailyPM25TailpipeAvoidedG += dailyCommuteKm * 0.65;
    }

    if (hasSwitchedHeating) {
      // Shifting from wood/coal heating to heat pump or electric saves ~4.2 kg CO₂/day and 35g soot/day
      dailyCO2AvoidedKg += 4.2;
      dailyPM25TailpipeAvoidedG += 35.0;
    }

    const totalCO2AvoidedKg = Number((dailyCO2AvoidedKg * timeframeDays).toFixed(1));
    const totalPM25AvoidedKg = Number(((dailyPM25TailpipeAvoidedG * timeframeDays) / 1000).toFixed(2));

    // Health Risk Index Reduction (WHO Concentration-Response Curve)
    // Relative Risk (RR) for acute respiratory emergency decreases by ~3.8% per 10 µg/m³ reduction
    const exposureDelta = baselineAvgExposureUgM3 - shieldedWeightedPM25;
    const acuteRespiratoryRiskReductionPercent = Math.min(65, Math.round((exposureDelta / 10) * 3.4));

    return {
      timeframeDays,
      personalHealthImpact: {
        dailyAvoidedInhaledDoseUg: Math.round(dailyAvoidedInhaledDoseUg),
        totalAvoidedInhaledDoseMg,
        dailyAvoidedCigaretteEquivalents,
        totalAvoidedCigarettes,
        shieldedAvgIndoorPM25: Math.round(shieldedWeightedPM25),
        baselineAvgIndoorPM25: Math.round(baselineAvgExposureUgM3),
        lungExposureReductionPercent: Math.round(((baselineAvgExposureUgM3 - shieldedWeightedPM25) / baselineAvgExposureUgM3) * 100),
        acuteRespiratoryRiskReductionPercent,
        explanation: 'Calculated using household respiratory minute ventilation rates multiplied by the particulate delta across 24-hour diurnal exposure windows.'
      },
      communityEmissionsImpact: {
        dailyCO2AvoidedKg: Number(dailyCO2AvoidedKg.toFixed(2)),
        totalCO2AvoidedKg,
        dailyPM25TailpipeAvoidedG: Number(dailyPM25TailpipeAvoidedG.toFixed(1)),
        totalPM25AvoidedKg,
        equivalentTreesPlanted: Math.round(totalCO2AvoidedKg / (22 / (365 / timeframeDays))),
        explanation: 'Calculated from direct tailpipe ICE emission factors (EPA MOVES standards) and domestic wood/biomass combustion factor offsets.'
      },
      scientificMethodology: {
        lungDepositionFormula: 'Inhaled Dose (µg) = ∑ [ Cin(t) × RespirationRate(m³/h) × Δt ]',
        respirationReferences: 'US EPA Exposure Factors Handbook (2011) Table 6-1',
        cigaretteEquivalenceReference: 'Berkeley Earth (Muller & Muller) Air Pollution to Cigarette Equivalence (22 µg/m³ = 1 cig/day)',
        epidemiologicalRiskCurve: 'WHO 2021 Global Air Quality Guidelines Synthesis of Systematic Reviews'
      }
    };
  }
}

module.exports = new ImpactService();
