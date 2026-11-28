const hacksService = require('../server/services/hacksService');

describe('DIY Hacks & Corsi-Rosenthal Economics', () => {
  test('catalog contains all peer-reviewed DIY air cleaning hacks', () => {
    const hacks = hacksService.getAllHacks();
    expect(hacks.length).toBeGreaterThanOrEqual(5);

    const crBox = hacksService.getHackById('corsi-rosenthal-box');
    expect(crBox).not.toBeNull();
    expect(crBox.cadrCFM).toBe(520);
  });

  test('Corsi-Rosenthal economics proves dramatic 3-year cost savings over commercial HEPA', () => {
    const savings = hacksService.calculateCorsiRosenthalSavings();
    expect(savings.upfrontSavingsUSD).toBeGreaterThan(200);
    expect(savings.threeYearTotalSavingsUSD).toBeGreaterThan(400);
  });
});
