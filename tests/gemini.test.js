const geminiService = require('../server/services/geminiService');

describe('Multi-Agent GenAI Copilot & Autonomous Knowledge Engine', () => {
  test('delivers specialized medical and pediatric guidance for infant queries', async () => {
    const res = await geminiService.chat({
      message: 'What special care is needed for an infant during severe winter smog episodes?',
      agentType: 'health'
    });

    expect(res).toBeDefined();
    expect(res.response).toBeDefined();
    expect(typeof res.response).toBe('string');
    expect(res.response.toLowerCase()).toContain('infant');
    expect(res.agent.name).toBe('Dr. Aero');
  });

  test('delivers engineering precision on Corsi-Rosenthal fan shrouds and CADR', async () => {
    const res = await geminiService.chat({
      message: 'Why is a circular cardboard shroud essential on a 20-inch box fan in a Corsi-Rosenthal box?',
      agentType: 'iaq'
    });

    expect(res).toBeDefined();
    expect(res.response.toLowerCase()).toContain('shroud');
    expect(res.agent.name).toBe('Engineer Jack');
  });

  test('provides scientifically rigorous answers debunking houseplant air cleaning myths', async () => {
    const res = await geminiService.chat({
      message: 'Can houseplants replace HEPA air purifiers for PM2.5 in a home?',
      agentType: 'iaq'
    });

    expect(res).toBeDefined();
    expect(res.response.toLowerCase()).toContain('nasa');
  });
});
