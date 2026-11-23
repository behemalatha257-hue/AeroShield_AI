/**
 * AeroShield AI - Low-Emission Daily Routine & Sustainable Alternatives Engine
 * Generates personalized schedules and clean lifestyle substitutions tailored to family profiles.
 */

class RoutineService {
  /**
   * Generate customized daily routine based on family profile
   */
  generateFamilyRoutine({
    location = 'Delhi-NCR',
    household = ['adult', 'child_infant', 'elderly_asthma'],
    commuteMode = 'car_solo',
    heatingType = 'biomass_wood',
    cookingType = 'gas_lpg',
    housingType = 'apartment_mid',
    currentAQI = 320
  }) {
    const hasInfant = household.includes('child_infant');
    const hasAsthma = household.includes('elderly_asthma') || household.includes('asthma');
    const hasElderly = household.includes('elderly') || household.includes('elderly_asthma');

    // Tailored hourly recommendations
    const hourlySchedule = [
      {
        time: '06:30 - 07:30',
        title: 'Morning Wakeup & Inversion Lockdown',
        phase: 'indoor_protection',
        icon: 'home-lock',
        action: 'Keep all windows firmly closed. Thermal inversion is at maximum strength with ground-level stagnation.',
        specificTips: [
          hasInfant ? 'Infants breathe 3x faster per kg: Keep nursery door shut with DIY Corsi-Rosenthal box on medium speed.' : 'Run air purifier on low in bedroom.',
          hasAsthma ? 'Use prescribed peak flow meter; keep rescue inhaler warm (cold air + PM2.5 triggers bronchospasm).' : 'Drink a glass of warm water with ginger/tulsi to soothe mucosal membranes.',
          'Do NOT perform morning jogging or aerobic outdoor exercise.'
        ],
        emissionImpact: 'Avoiding early morning wood/paper lighting reduces personal exposure by 85%.'
      },
      {
        time: '07:30 - 08:30',
        title: 'Low-Emission Smart Commute Window',
        phase: 'commute',
        icon: 'carpool',
        action: 'Transition from home to school/work using localized smog-defense protocol.',
        specificTips: [
          commuteMode === 'car_solo' ? 'Turn car AC to "INTERNAL RECIRCULATION" before starting. A standard cabin filter in recirculation mode reduces in-car PM2.5 by 70% in 10 minutes.' : 'Equip certified N95/FFP2 respirator with tight nasal seal.',
          hasInfant ? 'Cover stroller with breathable air canopy or keep child indoors until 11:30 AM.' : 'Avoid waiting at busy road intersections where vehicular idling spikes PM2.5 to >600 µg/m³.',
          'Coordinate with the AeroShield Community Carpool syndicate to eliminate 2 redundant cars today.'
        ],
        emissionImpact: 'Carpooling or switching to public transit prevents 3.2 kg CO₂ and 14g vehicular PM2.5 daily.'
      },
      {
        time: '11:00 - 12:30',
        title: 'Midday Work & School Smog Shield',
        phase: 'indoor_study_work',
        icon: 'briefcase',
        action: 'Maintain clean micro-climate in classroom or workstation.',
        specificTips: [
          'Hydrate regularly: Mucociliary clearance requires adequate hydration to expel trapped particulate matter.',
          'Keep classroom doors closed if windows face main roadways.',
          hasAsthma ? 'Avoid stair climbing during smog red alert hours; keep physical exertion low.' : 'Take short indoor stretch breaks.'
        ],
        emissionImpact: 'Encouraging school idle-free drop-off zones cuts playground perimeter PM2.5 by 42%.'
      },
      {
        time: '13:00 - 15:00',
        title: 'Golden Window Convective Airing & Sunning',
        phase: 'safe_ventilation',
        icon: 'wind-sun',
        action: 'THE GOLDEN WINDOW: Solar heating has expanded the boundary layer to >1000m. Outdoor PM2.5 has dropped by 45%.',
        specificTips: [
          'Open opposing windows for 20-30 minutes for cross-ventilation to flush accumulated indoor CO₂, VOCs, and radon.',
          'Place indoor plants (Snake plant, Spider plant) near light sources to boost oxygenation.',
          'Sun laundry or bedding indoors near sunlit glass rather than hanging outside where soot deposits.'
        ],
        emissionImpact: 'Flushing indoor CO₂ naturally prevents stuffiness without running high-draw mechanical ventilation.'
      },
      {
        time: '17:00 - 18:30',
        title: 'Evening Commute & Nightfall Seal',
        phase: 'commute_return',
        icon: 'sunset',
        action: 'Sun descends; boundary layer begins rapid nocturnal collapse. Ground cooling traps evening traffic exhaust.',
        specificTips: [
          'Close and seal all windows before sunset (around 17:30).',
          'Avoid open-rickshaw or motorcycling without N95 during rush hour.',
          'Wipe shoes and coat before entering home to prevent tracked-in road dust and toxic polycyclic aromatic hydrocarbons (PAHs).'
        ],
        emissionImpact: 'Departing 20 minutes before peak evening gridlock cuts vehicle idle emissions by 35%.'
      },
      {
        time: '19:00 - 20:30',
        title: 'Clean Cooking & Negative Pressure Protocol',
        phase: 'cooking_nutrition',
        icon: 'kitchen',
        action: 'Cooking is the #1 indoor particulate spike of the day (frying can release >2000 µg/m³ PM2.5 into the kitchen).',
        specificTips: [
          'Always turn on exhaust hood 1 minute BEFORE lighting cooktop.',
          'Isolate the kitchen by keeping kitchen doors closed to prevent fine aerosol migration to bedrooms.',
          'Crack the kitchen window slightly (1 inch) while exhaust fan runs to create NEGATIVE PRESSURE, directing all smoke outwards.',
          'Wipe floor with a damp micro-fiber mop immediately after cooking (wet mopping reduces particulate resuspension by 80% vs sweeping).'
        ],
        emissionImpact: 'Covering pots while cooking reduces cooking energy by 30% and curbs moisture/oil aerosol dispersal.'
      },
      {
        time: '21:30 - 06:30',
        title: 'Nocturnal Bedroom CADR Shield & Deep Clean Sleep',
        phase: 'deep_sleep',
        icon: 'moon',
        action: 'Nighttime is 8 hours of continuous, vulnerable breathing under peak cold-pool inversion.',
        specificTips: [
          'Keep bedroom door and windows closed to minimize room volume and maximize CADR efficiency.',
          'Run DIY Corsi-Rosenthal box or HEPA on low/whisper mode positioned 1 meter away from bed headboard.',
          hasAsthma || hasInfant ? 'Maintain bedroom relative humidity between 40% and 50% using a water evaporation bowl near radiator/heater (damps particulate suspension).' : 'Ensure no incense or mosquito coils are burned (one coil emits PM2.5 equal to 75-100 cigarettes).',
          'Use draft stopper (rolled damp towel or foam sweep) under bedroom door to block corridor drafts.'
        ],
        emissionImpact: 'Clean bedroom CADR cuts overnight cumulative particulate lung burden by >88%.'
      }
    ];

    // Sustainable Alternatives Catalog tailored to user's current setup
    const sustainableAlternatives = [
      {
        category: 'Space Heating',
        currentSetup: heatingType === 'biomass_wood' ? 'Biomass / Wood / Coal Fire' : (heatingType === 'kerosene' ? 'Kerosene Heater' : 'Electric Resistive Heater'),
        recommendedAlternative: 'Inverter Split Heat Pump (Reverse Cycle) or Far-Infrared Radiant Heating Panels',
        emissionReduction: '92% - 98% reduction in local PM2.5 & CO₂',
        costPayback: 'Saves ~$140/season in fuel; payback period 1.8 years',
        healthCoBenefit: 'Eliminates deadly carbon monoxide (CO), black carbon, and polycyclic aromatic hydrocarbons from living rooms.',
        actionStep: 'Participate in the AeroShield Neighborhood Heat Pump bulk purchase syndicate to receive a 25% group discount.'
      },
      {
        category: 'Cooking Energy',
        currentSetup: cookingType === 'gas_lpg' ? 'LPG / Methane Gas Cooktop' : 'Biomass / Kerosene Chulha',
        recommendedAlternative: 'Smart Induction Cooktop with Magnetic Copper Core Cookware',
        emissionReduction: 'Eliminates 100% of indoor NO₂ and ultrafine unburnt combustion particles',
        costPayback: '84% thermal efficiency vs 40% for gas; cuts monthly cooking energy bill by 32%',
        healthCoBenefit: 'Childhood asthma risk drops by 24% by removing unvented gas combustion from the home.',
        actionStep: 'Start with a single portable $35 induction burner for daily boiling and simmering.'
      },
      {
        category: 'Daily Commute',
        currentSetup: commuteMode === 'car_solo' ? 'Solo ICE (Gasoline/Diesel) Vehicle' : 'Mixed Public Transit',
        recommendedAlternative: 'AeroShield Neighborhood Smog-Syndicate Carpooling or E-Metro + Micro-mobility',
        emissionReduction: 'Prevents 18.5 kg CO₂e and 65g PM2.5 tailpipe emissions per week per commuter',
        costPayback: 'Cuts fuel and parking expenses by 50% - 75%',
        healthCoBenefit: 'Avoiding stop-and-go exhaust corridors lowers cardiovascular stress and blood pressure.',
        actionStep: 'Click "Join Syndicate" in the Community Grid tab to match with 3 neighbors on your route.'
      },
      {
        category: 'Community Green Waste',
        currentSetup: 'Garden Leaf / Biomass Open Burning',
        recommendedAlternative: 'Community Aerobic Shredder & Microbial Leaf Mulch Depots',
        emissionReduction: '100% elimination of toxic open smoldering smoke',
        costPayback: 'Yields rich organic fertilizer for neighborhood community gardens within 60 days',
        healthCoBenefit: 'Removes dense ground-level acrolein and dioxin plumes from residential alleys.',
        actionStep: 'Drop dry leaves at your designated AeroShield Community Compost Grid station.'
      }
    ];

    return {
      profile: {
        location,
        household,
        commuteMode,
        heatingType,
        cookingType,
        housingType,
        currentAQI
      },
      vulnerabilitySummary: {
        infantProtectionActive: hasInfant,
        asthmaAlertActive: hasAsthma,
        elderlyCareActive: hasElderly,
        recommendedMaskType: currentAQI > 200 ? 'N95 / FFP2 (strictly fitted)' : 'N95 for vulnerable groups'
      },
      dailySchedule: hourlySchedule,
      sustainableAlternatives
    };
  }
}

module.exports = new RoutineService();
