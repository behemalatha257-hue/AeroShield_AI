/**
 * AeroShield AI - Scientific Constants & Configuration
 * References: WHO Air Quality Guidelines (2021), US EPA NAAQS, CPCB India
 */

const AQI_STANDARDS = {
  WHO: {
    PM25_24H_LIMIT: 15, // µg/m³
    PM25_ANNUAL_LIMIT: 5, // µg/m³
    PM10_24H_LIMIT: 45, // µg/m³
    NO2_24H_LIMIT: 25 // µg/m³
  },
  EPA: {
    GOOD: { min: 0, max: 50, pm25_max: 12.0, label: 'Good', color: '#10B981', textColor: '#064E3B' },
    MODERATE: { min: 51, max: 100, pm25_max: 35.4, label: 'Moderate', color: '#F59E0B', textColor: '#78350F' },
    UNHEALTHY_SENSITIVE: { min: 101, max: 150, pm25_max: 55.4, label: 'Unhealthy for Sensitive Groups', color: '#F97316', textColor: '#7C2D12' },
    UNHEALTHY: { min: 151, max: 200, pm25_max: 150.4, label: 'Unhealthy', color: '#EF4444', textColor: '#7F1D1D' },
    VERY_UNHEALTHY: { min: 201, max: 300, pm25_max: 250.4, label: 'Very Unhealthy', color: '#8B5CF6', textColor: '#4C1D95' },
    HAZARDOUS: { min: 301, max: 500, pm25_max: 500.4, label: 'Hazardous (Severe Smog)', color: '#7E22CE', textColor: '#3B0764' }
  }
};

// Physiological human respiration rates (m³/h)
const RESPIRATION_RATES = {
  INFANT: 0.08, // 0-1 years (rapid shallow breathing)
  CHILD: 0.35,  // 2-10 years (high relative lung surface area)
  TEEN: 0.50,   // 11-17 years
  ADULT_RESTING: 0.45, // Adult at rest / light indoor activity
  ADULT_ACTIVE: 1.50,  // Adult during commute / brisk walking
  ADULT_EXERCISE: 2.50,// Heavy exertion outdoors
  ELDERLY: 0.42        // Elderly resting
};

// Physics parameters for Indoor Air Quality (IAQ)
const IAQ_PHYSICS = {
  DEFAULT_ROOM_VOLUME_M3: 45, // Typical 15ft x 12ft room (~180 sq ft with 9ft ceiling = 45.8 m³)
  DEPOSITION_RATE_K: 0.25,     // Natural settling rate per hour (h⁻¹) for PM2.5
  PENETRATION_FACTOR_P: 0.70,  // Penetration factor through windows/walls
  AIR_EXCHANGE_CLOSED: 0.35,   // Air changes per hour (ACH) with sealed doors/windows
  AIR_EXCHANGE_OPEN: 2.20,     // ACH with open windows (cross-ventilation)
  AIR_EXCHANGE_CRACKED: 0.85   // ACH with slightly open window
};

// CADR (Clean Air Delivery Rate) in m³/h for various air cleaners
const CLEANER_CADR = {
  NONE: 0,
  COMMERCIAL_HEPA_SMALL: 170,  // ~100 CFM
  COMMERCIAL_HEPA_MEDIUM: 340, // ~200 CFM
  COMMERCIAL_HEPA_LARGE: 510,  // ~300 CFM
  CORSI_ROSENTHAL_20INCH: 850, // 4-filter MERV 13 + 20" Box Fan (~500 CFM)
  CORSI_ROSENTHAL_MINI: 425    // Mini PC Fan / 12" DIY box (~250 CFM)
};

// Known winter smog global hotspot profiles with realistic diurnal curves
const HOTSPOT_PROFILES = {
  DELHI: {
    city: 'Delhi-NCR',
    country: 'India',
    region: 'Indo-Gangetic Plain',
    baseAQI: 365,
    basePM25: 295,
    basePM10: 420,
    primaryCauses: ['Thermal Inversion', 'Vehicular Congestion', 'Stubble Smoke Trapping', 'Biomass Domestic Heating'],
    optimalVentilationWindow: '13:00 - 15:30'
  },
  BEIJING: {
    city: 'Beijing',
    country: 'China',
    region: 'North China Plain',
    baseAQI: 215,
    basePM25: 165,
    basePM10: 240,
    primaryCauses: ['Siberian Cold High Pressure', 'Industrial Heating', 'Coal/Gas Boilers', 'Nocturnal Stagnation'],
    optimalVentilationWindow: '13:30 - 15:00'
  },
  LAHORE: {
    city: 'Lahore',
    country: 'Pakistan',
    region: 'Punjab Valley',
    baseAQI: 395,
    basePM25: 320,
    basePM10: 450,
    primaryCauses: ['Low Wind Speed Valley Effect', 'Unrefined Diesel Fuel Exhaust', 'Solid Waste Burning', 'Severe Nocturnal Inversion'],
    optimalVentilationWindow: '13:00 - 15:00'
  },
  MILAN: {
    city: 'Milan',
    country: 'Italy',
    region: 'Po Valley',
    baseAQI: 160,
    basePM25: 85,
    basePM10: 110,
    primaryCauses: ['Alpine Basin Inversion', 'Pellet Stoves Heating', 'Diesel Commuter Traffic', 'Low Air Dispersion'],
    optimalVentilationWindow: '14:00 - 16:00'
  },
  SALT_LAKE_CITY: {
    city: 'Salt Lake City',
    country: 'USA',
    region: 'Wasatch Front Basin',
    baseAQI: 145,
    basePM25: 68,
    basePM10: 92,
    primaryCauses: ['Valley Cold-Pool Inversion', 'Wood-burning Stoves', 'Vehicle Exhaust in Trapped Air Layer'],
    optimalVentilationWindow: '12:30 - 15:30'
  },
  LONDON: {
    city: 'London',
    country: 'UK',
    region: 'Greater London',
    baseAQI: 95,
    basePM25: 38,
    basePM10: 52,
    primaryCauses: ['Winter High-Pressure Stagnation', 'Domestic Wood Fireplaces', 'Urban Diesel Fleets'],
    optimalVentilationWindow: '11:00 - 14:00'
  }
};

module.exports = {
  AQI_STANDARDS,
  RESPIRATION_RATES,
  IAQ_PHYSICS,
  CLEANER_CADR,
  HOTSPOT_PROFILES
};
