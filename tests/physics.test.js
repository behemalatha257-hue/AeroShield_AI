const iaqPhysicsService = require('../server/services/iaqPhysicsService');
const { IAQ_PHYSICS, CLEANER_CADR } = require('../server/config/constants');

describe('IAQ Physics Engine', () => {
  test('calculateLossRate combines ACH, deposition k, and CADR/V', () => {
    const lambda = iaqPhysicsService.calculateLossRate(0.5, 50, 850, 0.25);
    expect(lambda).toBeCloseTo(17.75, 2);
  });

  test('calculateSteadyState drops concentration with high CADR', () => {
    const ss = iaqPhysicsService.calculateSteadyState(250, 0.35, 45, CLEANER_CADR.CORSI_ROSENTHAL_20INCH, 0);
    expect(ss).toBeLessThan(12.0);
  });

  test('simulateDay produces 24 hours of data with PM2.5 reduction > 70%', () => {
    const result = iaqPhysicsService.simulateDay({
      baseOutdoorPM25: 280,
      filterType: 'CORSI_ROSENTHAL_20INCH',
      windowStatus: 'scheduled'
    });
    expect(result.hourlyTimeline).toHaveLength(24);
    expect(result.pm25ReductionPercent).toBeGreaterThanOrEqual(70);
  });
});
