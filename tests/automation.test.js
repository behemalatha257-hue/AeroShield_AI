const automationService = require('../server/services/automationService');

describe('Automation Engine & IoT Smart Home Exporter', () => {
  test('evaluates autonomous triggers and boundary layer collapse alerts', () => {
    const evalResult = automationService.evaluateAutonomousTriggers({
      currentAQI: 320,
      pblHeightMeters: 90,
      isGoldenWindow: false
    });

    expect(evalResult).toBeDefined();
    expect(evalResult.triggeredAlertsCount).toBeGreaterThanOrEqual(1);
    expect(evalResult.alerts.some(a => a.type === 'INVERSION_TRAP_ACTIVE')).toBe(true);
    expect(evalResult.automatedActions.some(act => act.action === 'TURN_ON')).toBe(true);
  });

  test('creates automated tasks via natural language parser', () => {
    const res = automationService.createAutomatedTask({
      clientTaskPrompt: 'Need to reserve 2 Corsi-Rosenthal purifiers for an infant on MG Road tomorrow morning',
      clientName: 'Sarah Jenkins',
      category: 'EQUIPMENT_LOAN'
    });

    expect(res).toBeDefined();
    expect(res.id).toBeDefined();
    expect(res.title).toBeDefined();
    expect(res.status).toBe('SCHEDULED_AUTOMATED');
    expect(res.actions).toBeInstanceOf(Array);
  });

  test('generates valid Home Assistant YAML and Google Home routines', () => {
    const yaml = automationService.generateHomeAssistantYAML({});
    expect(typeof yaml).toBe('string');
    expect(yaml).toContain('alias:');
    expect(yaml).toContain('trigger:');

    const gh = automationService.generateGoogleHomeRoutine();
    expect(gh).toBeDefined();
    expect(gh.starters).toBeInstanceOf(Array);
  });
});
