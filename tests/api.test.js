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

  test('GET /api/inversion/forecast returns meteorological profile', async () => {
    const res = await request(app).get('/api/inversion/forecast?city=Delhi-NCR');
    expect(res.statusCode).toBe(200);
    expect(res.body.forecast).toBeInstanceOf(Array);
    expect(res.body.forecast.length).toBe(24);
  });

  test('POST /api/community/join validates and accepts syndicate membership', async () => {
    const res = await request(app)
      .post('/api/community/join')
      .send({ syndicateId: 'carpool-syndicate-north' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/community/pledge accepts valid pledge', async () => {
    const res = await request(app)
      .post('/api/community/pledge')
      .send({ pledgeId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/automation/tasks/create creates automated environmental task', async () => {
    const res = await request(app)
      .post('/api/automation/tasks/create')
      .send({ clientTaskPrompt: 'Schedule e-carpool for 4 commuters on Monday at 8 AM', clientName: 'Dev Client' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toBeDefined();
  });

  test('rejects invalid simulation payloads with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/iaq/simulate')
      .send({ roomVolumeM3: -50 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  test('rejects empty chat messages with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/assistant/chat')
      .send({ message: '   ' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});
