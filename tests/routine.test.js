const routineService = require('../server/services/routineService');

describe('Family Routine & Vulnerability Optimization', () => {
  test('generates customized daily routine with 7 synchronized phases', () => {
    const routine = routineService.generateFamilyRoutine({
      household: ['adult', 'child_infant', 'elderly_asthma'],
      commuteMode: 'car_solo',
      heatingType: 'biomass_wood'
    });

    expect(routine).toBeDefined();
    expect(routine.dailySchedule).toBeInstanceOf(Array);
    expect(routine.dailySchedule.length).toBe(7);
    expect(routine.vulnerabilitySummary.infantProtectionActive).toBe(true);
    expect(routine.vulnerabilitySummary.asthmaAlertActive).toBe(true);
    expect(routine.sustainableAlternatives.length).toBeGreaterThanOrEqual(3);
  });

  test('flags severe warnings for infant protection during high AQI', () => {
    const routine = routineService.generateFamilyRoutine({
      household: ['child_infant'],
      currentAQI: 400
    });

    expect(routine.vulnerabilitySummary.infantProtectionActive).toBe(true);
  });
});
