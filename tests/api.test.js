const request = require('supertest');
const app = require('../server');

describe('HTTP API Endpoints Integration', () => {
  test('GET /api/aqi/current returns 200 and pollutant data', async () => {
    const res = await request(app).get('/api/aqi/current?city=DELHI');
    expect(res.statusCode).toBe(200);
    expect(res.body.currentAQI).toBeGreaterThan(0);
    expect(res.body.pollutants.pm25.value).toBeGreaterThan(0);
  });

  test('POST /api/iaq/simulate simulates indoor PM2.5 levels', async () => {
    const res = await request(app)
      .post('/api/iaq/simulate')
      .send({ roomVolumeM3: 45, filterType: 'CORSI_ROSENTHAL_20INCH' });
    expect(res.statusCode).toBe(200);
    expect(res.body.pm25ReductionPercent).toBeGreaterThanOrEqual(70);
  });

  test('GET /api/health returns 200 HEALTHY', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
  });

  test('POST /api/assistant/chat delivers structured response', async () => {
    const res = await request(app)
      .post('/api/assistant/chat')
      .send({ message: 'How do I protect my asthmatic parent?', agentType: 'health' });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBeDefined();
  });
});
