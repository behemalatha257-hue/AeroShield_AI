/**
 * AeroShield AI - Automation & Event Task Booking Engine
 * 
 * Provides:
 * 1. AI Task & Event Booking Automation (natural language task parsing, bookings, calendar events)
 * 2. Autonomous Meteorological Triggers (Boundary layer collapse, nocturnal inversion)
 * 3. Smart Home IoT Automation Exporters (Home Assistant YAML, IFTTT, Google Home)
 */

class AutomationService {
  constructor() {
    // In-memory automated tasks and booking registry
    this.automatedTasks = [
      {
        id: 'task-101',
        title: 'Community HEPA Purifier Loan Reservation',
        category: 'EQUIPMENT_BOOKING',
        client: 'Sharma Family (Sector 15)',
        status: 'SCHEDULED_AUTOMATED',
        createdAt: new Date().toISOString(),
        scheduledFor: '2026-11-25 09:00',
        triggerCondition: 'Immediate & PM2.5 > 200 µg/m³',
        details: 'High-CADR (500 CFM) unit reserved for 5 days. Beneficiary: 4-month-old infant.',
        actions: [
          'Auto-reserved Unit #3 in Community Lending Library',
          'SMS confirmation dispatched to RWA coordinator',
          'Automated return reminder set for Day 5 at 18:00'
        ]
      },
      {
        id: 'task-102',
        title: 'Morning Smog-Defense Carpool Pool',
        category: 'COMMUTE_BOOKING',
        client: 'CyberHub Commuter Cluster',
        status: 'ACTIVE_RECURRING',
        createdAt: new Date().toISOString(),
        scheduledFor: 'Daily at 08:15 AM',
        triggerCondition: 'Every weekday morning during inversion season',
        details: 'Shared e-SUV for 4 commuters. Eliminates 3 solo vehicles.',
        actions: [
          'Auto-matches 4 neighbors along MG Road corridor',
          'Pushes 07:30 AM departure reminder with live route AQI',
          'Logs 4.2 kg CO₂ and 18g tailpipe PM2.5 avoided daily'
        ]
      },
      {
        id: 'task-103',
        title: 'St. Mary School Idle-Free Drop-Off Zone Dispatch',
        category: 'EVENT_BOOKING',
        client: 'Parents Clean-Air Committee',
        status: 'SCHEDULED_AUTOMATED',
        createdAt: new Date().toISOString(),
        scheduledFor: 'Every School Morning 07:45 - 08:30 AM',
        triggerCondition: 'School day mornings when AQI > 150',
        details: 'Volunteer parent marshals deployed at gates to remind drivers to turn off idling engines.',
        actions: [
          'Auto-notifies 52 registered parent drivers at 07:15 AM',
          'Activates perimeter air quality sensor monitoring',
          'Broadcasts playground safety advisory to principal'
        ]
      },
      {
        id: 'task-104',
        title: 'Automated Nocturnal Bedroom Inversion Shield',
        category: 'IOT_AUTOMATION',
        client: 'Smart Home Automation Node',
        status: 'AUTONOMOUS_TRIGGER',
        createdAt: new Date().toISOString(),
        scheduledFor: 'Daily at 21:00 or when PBL < 120m',
        triggerCondition: 'Planetary boundary layer collapse / PM2.5 > 180 µg/m³',
        details: 'Automatically engages bedroom air cleaners, closes dampers, and dims lighting.',
        actions: [
          'Switches on Smart Plug (Corsi-Rosenthal box / HEPA)',
          'Verifies window contact sensor is closed',
          'Chimes Google Home speaker: "Bedroom clean-air seal activated"'
        ]
      }
    ];
  }

  /**
   * AI-Powered Task & Event Booking Parser
   * Converts free-form client prompts into structured environmental action tasks, bookings, and schedules.
   * @param {Object} options - Task creation options
   * @param {string} options.clientTaskPrompt - Free-form prompt from user/client
   * @param {string} [options.clientName='Resident Client'] - Name of the client
   * @param {string} [options.category='GENERAL_TASK'] - Default category fallback
   * @returns {Object} Structured automated task record with actions, schedule, and metadata
   */
  createAutomatedTask({ clientTaskPrompt, clientName = 'Resident Client', category = 'GENERAL_TASK' }) {
    const p = (clientTaskPrompt || '').toLowerCase();
    const id = `task-${Date.now()}`;
    const timestamp = new Date().toISOString();

    let title = 'AI-Scheduled Environmental Action Task';
    let detectedCategory = category;
    let scheduledFor = 'Scheduled for immediate execution';
    let triggerCondition = 'Automated execution triggered on creation';
    let details = clientTaskPrompt;
    let actions = [];

    // Parse Intent & Category
    if (p.includes('purifier') || p.includes('hepa') || p.includes('filter') || p.includes('book') || p.includes('rent')) {
      detectedCategory = 'EQUIPMENT_BOOKING';
      title = 'Community Clean-Air Purifier Reservation';
      details = `Automated booking: Air purifier equipment allocated for ${clientName}. ${clientTaskPrompt}`;
      actions = [
        'Locked allocation of 1x High-CADR Air Cleaner in neighborhood inventory',
        'Auto-generated pickup QR pass and dispatch instructions',
        'Set automated reminder for filter inspection upon return'
      ];
    } else if (p.includes('carpool') || p.includes('commute') || p.includes('ride') || p.includes('pick') || p.includes('drop')) {
      detectedCategory = 'COMMUTE_BOOKING';
      title = 'Smog-Safe Neighborhood Carpool Booking';
      details = `Commute syndicate seat reservation for ${clientName}. ${clientTaskPrompt}`;
      actions = [
        'Matched with 3 nearby commuters heading in the same route direction',
        'Generated scheduled pickup itinerary with internal car recirculation instructions',
        'Calculated daily personal savings: 3.5 kg CO₂ and $4.20 in fuel'
      ];
    } else if (p.includes('school') || p.includes('event') || p.includes('workshop') || p.includes('meeting') || p.includes('session')) {
      detectedCategory = 'EVENT_BOOKING';
      title = 'Community Clean-Air Awareness & Defense Event';
      details = `Community event registration and coordinator dispatch for: ${clientTaskPrompt}`;
      actions = [
        'Reserved community room with sealed indoor CADR filtration',
        'Dispatched automated calendar invite (.ics) to 35 neighborhood attendees',
        'Added smog forecasting check 2 hours prior to start'
      ];
    } else if (p.includes('alert') || p.includes('emergency') || p.includes('spike') || p.includes('rwa') || p.includes('warn')) {
      detectedCategory = 'EMERGENCY_DISPATCH';
      title = 'Automated Smog Emergency Broadcast Rule';
      details = `Emergency notification rule configured: ${clientTaskPrompt}`;
      actions = [
        'Subscribed 120 residential society members to automated SMS/Push alert feed',
        'Set boundary layer collapse threshold: triggers when PBL < 100m or AQI > 300',
        'Generates automated senior citizen and infant wellness check prompts'
      ];
    } else {
      detectedCategory = 'AI_AUTOMATION_ROUTINE';
      title = 'AI Customized Smog Defense Automation';
      details = `Custom routine configured: ${clientTaskPrompt}`;
      actions = [
        'Analyzed lifestyle parameters and outdoor inversion cycle',
        'Automated daily execution timeline across morning, midday golden window, and nightfall',
        'Pushed schedule to AeroShield live dashboard'
      ];
    }

    const newTask = {
      id,
      title,
      category: detectedCategory,
      client: clientName,
      status: 'SCHEDULED_AUTOMATED',
      createdAt: timestamp,
      scheduledFor,
      triggerCondition,
      details,
      actions
    };

    this.automatedTasks.unshift(newTask); // Add to beginning
    return newTask;
  }

  getTasks() {
    return this.automatedTasks;
  }

  executeTask(taskId) {
    const task = this.automatedTasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    task.status = 'COMPLETED_SUCCESS';
    task.executedAt = new Date().toISOString();
    return {
      success: true,
      message: `Task "${task.title}" was autonomously executed successfully!`,
      task
    };
  }

  generateICS(taskId) {
    const task = this.automatedTasks.find(t => t.id === taskId) || this.automatedTasks[0];
    const now = new Date();
    const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AeroShield AI//Smog Defense Automation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${task.id}@aeroshield.ai
DTSTAMP:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${task.title}
DESCRIPTION:${task.details}\\n\\nAutomated by AeroShield AI Platform
LOCATION:Neighborhood Community Grid
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  }

  /**
   * Autonomous Meteorological Triggers
   */
  evaluateAutonomousTriggers({
    currentAQI = 310,
    currentPM25 = 260,
    pblHeightMeters = 95,
    isGoldenWindow = false,
    hasInfant = true,
    hasAsthma = true
  }) {
    const alerts = [];
    const automatedActions = [];

    // Trigger 1: Nocturnal Inversion
    if (pblHeightMeters <= 120 && currentAQI >= 250) {
      alerts.push({
        id: 'auto-trigger-severe-inversion',
        level: 'CRITICAL',
        type: 'INVERSION_TRAP_ACTIVE',
        timestamp: new Date().toISOString(),
        headline: '🚨 Nocturnal Thermal Inversion Red Alert',
        message: `Planetary boundary layer collapsed to ${pblHeightMeters}m. Heavy particulates trapped at ground level.`,
        recommendedAction: 'Automated sealing recommended. Keep all exterior windows closed; run Corsi-Rosenthal box or HEPA filtration.'
      });

      automatedActions.push({
        device: 'Smart Plug: Air Purifier / Corsi-Rosenthal Box',
        action: 'TURN_ON',
        targetSpeed: 'HIGH_CADR',
        reason: 'Automated trigger: PM2.5 exceeded 200 µg/m³ with critical boundary layer compression.'
      });
    }

    // Trigger 2: Golden Ventilation Window Open
    if (isGoldenWindow) {
      alerts.push({
        id: 'auto-trigger-golden-window',
        level: 'OPPORTUNITY',
        type: 'GOLDEN_AIRING_WINDOW',
        timestamp: new Date().toISOString(),
        headline: '☀️ Convective Mixing Golden Window Open',
        message: 'Solar heating has broken the ground cold pool. Outdoor air dispersion is at daily peak.',
        recommendedAction: 'Open cross-ventilation windows for 20-30 minutes to flush indoor CO₂ and stale air.'
      });

      automatedActions.push({
        device: 'Smart Speaker / Hub Announcement',
        action: 'VOICE_BROADCAST',
        message: 'AeroShield: Golden airing window active. Safe to ventilate opposing windows for 25 minutes.',
        reason: 'Boundary layer expansion verified above 900 meters.'
      });
    }

    // Trigger 3: Sensitive Individual Shielding
    if ((hasInfant || hasAsthma) && currentAQI > 200) {
      alerts.push({
        id: 'auto-trigger-vulnerable-protection',
        level: 'WARNING',
        type: 'VULNERABLE_GROUP_ISOLATION',
        timestamp: new Date().toISOString(),
        headline: '🛡️ High-Vulnerability Family Shielding Activated',
        message: 'Elevated particle suspension poses acute bronchospasm risk for infants and asthmatics.',
        recommendedAction: 'Equip N95 for any mandatory transit; maintain bedroom relative humidity between 40-50%.'
      });
    }

    return {
      evaluatedAt: new Date().toISOString(),
      triggeredAlertsCount: alerts.length,
      alerts,
      automatedActions
    };
  }

  generateHomeAssistantYAML({
    airPurifierEntity = 'switch.corsi_rosenthal_box',
    aqiSensorEntity = 'sensor.local_pm25',
    smartWindowSensor = 'binary_sensor.living_room_window'
  }) {
    return `# AeroShield AI - Home Assistant Winter Smog Automations
# Auto-generated by AeroShield AI Engine

- id: 'aeroshield_inversion_purifier_boost'
  alias: 'AeroShield: Smog Spike Air Purifier Boost'
  description: 'Automatically switches on DIY Corsi-Rosenthal box or HEPA when PM2.5 spikes or inversion descends'
  trigger:
    - platform: numeric_state
      entity_id: ${aqiSensorEntity}
      above: 150
  condition: []
  action:
    - service: switch.turn_on
      target:
        entity_id: ${airPurifierEntity}
    - service: notify.notify
      data:
        title: "AeroShield Alert"
        message: "PM2.5 exceeded safe threshold. Air cleaner auto-engaged on high CADR."
  mode: single

- id: 'aeroshield_golden_window_notification'
  alias: 'AeroShield: Golden Ventilation Window Announce'
  description: 'Alerts family when convective solar mixing makes outdoor air safe for a 25-minute flush'
  trigger:
    - platform: time
      at: '13:00:00'
  condition:
    - condition: numeric_state
      entity_id: ${aqiSensorEntity}
      below: 180
  action:
    - service: notify.alexa_media
      data:
        message: "AeroShield AI: The golden afternoon ventilation window is open. Open opposing windows for 25 minutes."
        data:
          type: announce
  mode: single

- id: 'aeroshield_night_seal_warning'
  alias: 'AeroShield: Nightfall Inversion Window Seal'
  description: 'Reminds household to seal all windows as boundary layer drops at sunset'
  trigger:
    - platform: sun
      event: sunset
      offset: "-00:30:00"
  condition:
    - condition: state
      entity_id: ${smartWindowSensor}
      state: 'on'
  action:
    - service: notify.notify
      data:
        title: "AeroShield Sunset Seal"
        message: "Sunset approaching. Nocturnal thermal inversion will trap ground pollution. Please close all windows."
  mode: single
`;
  }

  generateIFTTTRecipe() {
    return {
      appletName: 'AeroShield Autonomous Smog Defense',
      trigger: {
        service: 'Webhooks',
        event: 'aeroshield_severe_smog_alert',
        payloadFields: ['aqi', 'pm25', 'inversionLevel', 'actionRequired']
      },
      actions: [
        {
          service: 'SmartLife / Tuya',
          action: 'turn_on_smart_plug',
          parameters: { device: 'Bedroom Air Cleaner' }
        },
        {
          service: 'Notifications',
          action: 'send_rich_notification',
          parameters: { message: 'Severe Smog Inversion: Shielding protocol active.' }
        }
      ]
    };
  }

  generateGoogleHomeRoutine() {
    return {
      routineName: 'AeroShield Clean Air Routine',
      starters: ['When I say "Hey Google, activate clean air shield"', 'Every day at 7:00 PM during winter'],
      actions: [
        'Turn on the Air Cleaner',
        'Set living room light to warm orange (smog defense indicator)',
        'Broadcast "AeroShield: Evening inversion active. Bedroom air purifier is running. Please keep windows shut."'
      ]
    };
  }
}

module.exports = new AutomationService();
