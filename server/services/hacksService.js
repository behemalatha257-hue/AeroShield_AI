/**
 * AeroShield AI - Indoor Air Quality (IAQ) Science Hacks & Blueprint Engine
 * Low-cost, peer-reviewed, high-efficacy DIY solutions for families.
 */

class HacksService {
  constructor() {
    this.hacksCatalog = [
      {
        id: 'corsi-rosenthal-box',
        name: 'The Corsi-Rosenthal Box (DIY High-CADR Air Cleaner)',
        category: 'DIY Filtration',
        costUSD: 55,
        commercialEquivalentUSD: 450,
        cadrCFM: 520, // 883 m³/h
        efficacyRating: '★★★★★ (Gold Standard)',
        peerReviewedSource: 'UC Davis / Dr. Richard Corsi & Jim Rosenthal / EPA Indoor Air Testing (2021)',
        summary: 'A cube built from 4 MERV-13 furnace filters, a 20-inch box fan, and a cardboard shroud. Delivers extreme clean air volume at a fraction of commercial HEPA costs.',
        materials: [
          '1x 20-inch box fan ($20 - $25)',
          '4x MERV-13 furnace filters (20" x 20" x 1" or 2") (~$8 each)',
          '1x Cardboard bottom plate (20" x 20")',
          '1x Cardboard circular fan shroud (15" diameter hole cut in 20" square)',
          '1x Roll of heavy-duty duct tape or gaffer tape ($5)'
        ],
        stepByStepGuide: [
          '1. Base: Lay the 20"x20" cardboard flat on the floor to serve as the airtight bottom.',
          '2. Filter Cube: Stand 4 MERV-13 filters vertically around the base. Ensure filter airflow direction arrows point INWARD toward the center of the cube.',
          '3. Sealing Walls: Tape all 4 vertical corner seams and the bottom joints tightly with duct tape to prevent air bypass leaks.',
          '4. Mounting the Fan: Place the 20" box fan on top, blowing UPWARD into the room (drawing air from inside the cube out).',
          '5. Crucial Physics Hack - The Shroud: Cut a 15-inch circular hole in a piece of cardboard and tape it over the front grille of the box fan. Why? Box fan blade tips create high backdraft vortices; the shroud blocks recirculating air, increasing CADR by 40-50% while lowering motor noise!'
        ],
        maintenance: 'Vacuum outer filter pleats monthly. Replace filters after 6 months of winter smog use or when grey-black discoloration is uniform.',
        noiseLevel: '48 dB on medium (soothing white noise)'
      },
      {
        id: 'kitchen-negative-pressure',
        name: 'Kitchen Negative-Pressure Exhaust Isolation',
        category: 'Ventilation Hack',
        costUSD: 0,
        commercialEquivalentUSD: 600,
        cadrCFM: 300,
        efficacyRating: '★★★★★',
        peerReviewedSource: 'Lawrence Berkeley National Laboratory (LBNL) Indoor Air Studies',
        summary: 'Cooking (frying, searing, chapati making) is the #1 indoor PM2.5 spike in winter. This zero-cost physical hack stops 85% of cooking smoke from entering bedrooms.',
        materials: [
          'Existing kitchen exhaust fan / range hood',
          'Kitchen door (or tension rod with a thick drape/sheet)',
          'Kitchen exterior window'
        ],
        stepByStepGuide: [
          '1. Close all interior doors connecting the kitchen to hallways and living areas.',
          '2. Crack the kitchen exterior window open by exactly 1-2 inches.',
          '3. Turn on the kitchen exhaust hood on HIGH 60 seconds BEFORE lighting the stove.',
          '4. The exhaust fan expels air, pulling fresh replacement air strictly from the cracked exterior window, creating a negative pressure zone in the kitchen.',
          '5. This pressure gradient acts as an invisible barrier: zero cooking smoke or oil aerosols can drift backward into the bedrooms!'
        ],
        maintenance: 'Clean exhaust grease filters bi-weekly with baking soda and dish soap to maintain airflow velocity.',
        noiseLevel: 'Existing fan noise only'
      },
      {
        id: 'microfiber-wet-mopping',
        name: 'Capillary Microfiber Wet-Mopping vs Dry Brooming',
        category: 'Surface Hygiene',
        costUSD: 8,
        commercialEquivalentUSD: 250,
        cadrCFM: 'N/A (Prevents Resuspension)',
        efficacyRating: '★★★★☆',
        peerReviewedSource: 'Aerosol Science and Technology / Resuspension Factor Analysis',
        summary: 'Dry sweeping with a standard broom resuspends 70% of settled fine particles directly into children breathing zone. Damp micro-mopping traps them permanently.',
        materials: [
          '1x Microfiber flat mop with washable pads ($8)',
          'Bucket with lukewarm water and a drop of natural soap',
          'No harsh chemical cleaners (prevents synthetic VOC emissions)'
        ],
        stepByStepGuide: [
          '1. Never use a dry grass/plastic broom during smog season. Broom bristles flick PM2.5 and PM10 particles into suspension for up to 3 hours.',
          '2. Dampen the microfiber pad (wring out until damp, not dripping).',
          '3. Mop floor in a continuous "S-pattern", pulling trapped soot particles along without lifting the mop.',
          '4. Rinse pad in clean water bucket between rooms.',
          '5. Result: 82% reduction in resuspended floor particulates, particularly critical for crawling infants and pets!'
        ],
        maintenance: 'Machine wash microfiber pads weekly without fabric softener.',
        noiseLevel: 'Completely silent (0 dB)'
      },
      {
        id: 'door-sweep-draft-barrier',
        name: 'Anti-Infiltration Silicone Door Sweep & Keyhole Seal',
        category: 'Envelope Sealing',
        costUSD: 6,
        commercialEquivalentUSD: 120,
        cadrCFM: 'N/A (Stops Infiltration)',
        efficacyRating: '★★★★☆',
        peerReviewedSource: 'Building and Environment Journal / Infiltration Modeling in Multi-family Buildings',
        summary: 'In apartment buildings, the "stack effect" (warm air rising in elevators/stairwells) sucks heavy polluted street air under entrance doors into living rooms.',
        materials: [
          'Self-adhesive silicone door bottom strip ($5 - $7) or rolled damp towel',
          'Foam weatherstripping tape for door frame perimeter ($3)'
        ],
        stepByStepGuide: [
          '1. Clean the bottom edge of your front door with rubbing alcohol to remove grease.',
          '2. Measure door width and trim the flexible silicone sweep with scissors.',
          '3. Peel adhesive backing and press the sweep against the door bottom so the silicone fins gently touch the floor surface.',
          '4. Check door closing smoothly while ensuring an airtight seal against cold hallway drafts.',
          '5. Result: Cuts uncontrolled outdoor PM2.5 infiltration through doorway cracks by 65%.'
        ],
        maintenance: 'Wipe silicone fins monthly to clear accumulated corridor lint.',
        noiseLevel: 'Completely silent (0 dB)'
      },
      {
        id: 'nasa-phytoremediation-cluster',
        name: 'NASA Phytoremediation Clean-Air Botanical Cluster',
        category: 'Bio-Filtration & Humidity',
        costUSD: 18,
        commercialEquivalentUSD: 180,
        cadrCFM: 35,
        efficacyRating: '★★★☆☆ (Synergistic Booster)',
        peerReviewedSource: 'NASA Clean Air Study / Wolverton Environmental Services',
        summary: 'Strategic indoor botanical placement to absorb volatile organic compounds (VOCs), boost nocturnal oxygen, and maintain optimal 45% relative humidity.',
        materials: [
          '2x Snake Plant (Sansevieria Trifasciata / Mother-in-Law Tongue)',
          '1x Spider Plant (Chlorophytum Comosum)',
          '1x Areca Palm (Dypsis Lutescens)',
          'Terracotta pots with gravel base (prevents waterlogged soil mold)'
        ],
        stepByStepGuide: [
          '1. Bedroom Placement (Snake Plant): Unlike most plants, Sansevieria performs Crassulacean Acid Metabolism (CAM), absorbing CO₂ and releasing pure oxygen at night during sleep.',
          '2. Living Room / Kitchen (Spider Plant): Placed in bright indirect light; actively metabolizes formaldehyde, benzene, and carbon monoxide.',
          '3. Humidity Regulation (Areca Palm): Releases up to 1 liter of natural clean moisture vapor per day, keeping indoor air at 40-50% RH. This causes airborne PM2.5 particles to agglomerate (clump together) and settle out 3x faster.',
          '4. Crucial Mold Prevention Rule: Top soil with 1/2 inch of decorative gravel or expanded clay pebbles to prevent fungal spores from getting into indoor air.'
        ],
        maintenance: 'Wipe plant leaves with damp cloth bi-weekly so stomata remain unblocked by urban soot.',
        noiseLevel: 'Completely silent (0 dB)'
      }
    ];
  }

  getAllHacks() {
    return this.hacksCatalog;
  }

  getHackById(id) {
    return this.hacksCatalog.find(h => h.id === id) || null;
  }

  calculateCorsiRosenthalSavings(roomVolumeM3 = 45) {
    const diyCost = 55;
    const commercialCost = 380;
    const yearlyFilterCostDIY = 40; // 4 filters replaced twice = $80 or once = $40
    const yearlyFilterCostCommercial = 140; // Proprietary HEPA cartridge

    return {
      upfrontSavingsUSD: commercialCost - diyCost,
      annualMaintenanceSavingsUSD: yearlyFilterCostCommercial - yearlyFilterCostDIY,
      threeYearTotalSavingsUSD: (commercialCost + yearlyFilterCostCommercial * 3) - (diyCost + yearlyFilterCostDIY * 3),
      cadrComparison: {
        corsiRosenthalCFM: 520,
        commercialMediumHEPA: 220,
        cadrAdvantage: '2.36x more clean air delivery rate'
      }
    };
  }
}

module.exports = new HacksService();
