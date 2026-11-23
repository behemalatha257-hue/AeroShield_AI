const impactService = require('../server/services/impactService');

describe('Direct Impact & Scientific Explainability', () => {
  test('calculateImpact computes personal lung dose avoided and cigarette equivalents', () => {
    const res = impactService.calculateImpact({
      householdMembers: ['adult', 'child_infant'],
      timeframeDays: 30,
      currentOutdoorPM25: 250
    });
    expect(res.personalHealthImpact.totalAvoidedInhaledDoseMg).toBeGreaterThan(0);
    expect(res.personalHealthImpact.totalAvoidedCigarettes).toBeGreaterThan(5);
    expect(res.personalHealthImpact.acuteRespiratoryRiskReductionPercent).toBeGreaterThan(20);
  });

  test('calculateImpact calculates community CO2 and tailpipe PM2.5 avoidance', () => {
    const res = impactService.calculateImpact({
      hasCarpooled: true,
      hasSwitchedHeating: true,
      timeframeDays: 30
    });
    expect(res.communityEmissionsImpact.totalCO2AvoidedKg).toBeGreaterThan(50);
    expect(res.communityEmissionsImpact.equivalentTreesPlanted).toBeGreaterThan(0);
  });
});
