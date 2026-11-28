const communityService = require('../server/services/communityService');

describe('Community Clean-Air Defense Grid', () => {
  test('grid reports active syndicates and metrics', () => {
    const grid = communityService.getGridStatus();
    expect(grid.activeSyndicatesCount).toBeGreaterThanOrEqual(3);
    expect(grid.dailyCommunityImpact.totalCO2AvoidedKg).toBeGreaterThan(0);
  });

  test('allows joining an existing syndicate and updates member count', () => {
    const initialGrid = communityService.getGridStatus();
    const syndicateId = initialGrid.syndicates[0].id;
    const initialCount = initialGrid.syndicates[0].activeMembers;

    const result = communityService.joinSyndicate(syndicateId, { name: 'Test User' });
    expect(result.success).toBe(true);
    expect(result.syndicate.activeMembers).toBe(initialCount + 1);
  });

  test('allows signing a community pledge and increments pledged count', () => {
    const result = communityService.signPledge(1);
    expect(result.success).toBe(true);
    expect(result.pledge).toBeDefined();
    expect(result.pledge.count).toBeGreaterThan(0);
  });
});
