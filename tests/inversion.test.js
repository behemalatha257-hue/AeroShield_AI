const inversionService = require('../server/services/inversionService');

describe('Inversion & Boundary Layer Service', () => {
  test('PBL height is minimal at night and maximum at 13:00', () => {
    const night = inversionService.calculatePBLHeight(4);
    const day = inversionService.calculatePBLHeight(13);
    expect(night).toBeLessThan(120);
    expect(day).toBeGreaterThan(1000);
  });

  test('Inversion score gives critical severity score for shallow night boundary layer', () => {
    const score = inversionService.getInversionScore(90, 1.0);
    expect(score).toBeGreaterThanOrEqual(9);
  });

  test('Forecast includes golden window and 24 hours of data', () => {
    const forecast = inversionService.get24HourInversionForecast('Delhi-NCR');
    expect(forecast.forecast).toHaveLength(24);
    expect(forecast.summary.goldenWindow).toBeDefined();
  });
});
