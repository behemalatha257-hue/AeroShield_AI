/**
 * AeroShield AI - Comprehensive REST API Routes
 * Endpoints for AQI, Inversion Dynamics, IAQ Physics, Routines, Hacks, Community, Impact & AI
 */

const express = require('express');
const router = express.Router();

const { HOTSPOT_PROFILES, AQI_STANDARDS } = require('../config/constants');
const iaqPhysicsService = require('../services/iaqPhysicsService');
const inversionService = require('../services/inversionService');
const routineService = require('../services/routineService');
const hacksService = require('../services/hacksService');
const communityService = require('../services/communityService');
const impactService = require('../services/impactService');
const geminiService = require('../services/geminiService');
const automationService = require('../services/automationService');
const cacheService = require('../services/cacheService');

const { apiLimiter, aiLimiter } = require('../middleware/rateLimiter');
const {
  validateIAQSimulation,
  validateRoutineRequest,
  validateImpactRequest,
  validateChatRequest
} = require('../middleware/validator');

/**
 * GET /api/aqi/current
 * Fetch current AQI, pollutants, and advisory for hotspots or default
 */
router.get('/aqi/current', apiLimiter, (req, res) => {
  const cityKey = (req.query.city || 'DELHI').toUpperCase();
  const profile = HOTSPOT_PROFILES[cityKey] || HOTSPOT_PROFILES.DELHI;

  // Add slight realistic diurnal variance
  const currentHour = new Date().getHours();
  const diurnalMultiplier = (currentHour >= 12 && currentHour <= 15) ? 0.72 : ((currentHour >= 21 || currentHour <= 7) ? 1.25 : 1.0);

  const pm25 = Math.round(profile.basePM25 * diurnalMultiplier);
  const aqi = Math.round(profile.baseAQI * diurnalMultiplier);
  const pm10 = Math.round(profile.basePM10 * diurnalMultiplier);

  let category = AQI_STANDARDS.EPA.HAZARDOUS;
  if (aqi <= 50) category = AQI_STANDARDS.EPA.GOOD;
  else if (aqi <= 100) category = AQI_STANDARDS.EPA.MODERATE;
  else if (aqi <= 150) category = AQI_STANDARDS.EPA.UNHEALTHY_SENSITIVE;
  else if (aqi <= 200) category = AQI_STANDARDS.EPA.UNHEALTHY;
  else if (aqi <= 300) category = AQI_STANDARDS.EPA.VERY_UNHEALTHY;

  res.json({
    location: profile.city,
    country: profile.country,
    region: profile.region,
    currentAQI: aqi,
    category: category.label,
    color: category.color,
    textColor: category.textColor,
    pollutants: {
      pm25: { value: pm25, unit: 'µg/m³', whoLimitRatio: Number((pm25 / AQI_STANDARDS.WHO.PM25_24H_LIMIT).toFixed(1)) },
      pm10: { value: pm10, unit: 'µg/m³', whoLimitRatio: Number((pm10 / AQI_STANDARDS.WHO.PM10_24H_LIMIT).toFixed(1)) },
      no2: { value: Math.round(pm25 * 0.35), unit: 'µg/m³' },
      so2: { value: Math.round(pm25 * 0.18), unit: 'µg/m³' },
      co: { value: Number((pm25 * 0.012).toFixed(2)), unit: 'mg/m³' }
    },
    primaryCauses: profile.primaryCauses,
    optimalVentilationWindow: profile.optimalVentilationWindow,
    availableHotspots: Object.keys(HOTSPOT_PROFILES).map(k => ({
      key: k,
      name: HOTSPOT_PROFILES[k].city,
      country: HOTSPOT_PROFILES[k].country
    })),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/inversion/forecast
 * Planetary boundary layer and thermal inversion forecast
 */
router.get('/inversion/forecast', apiLimiter, (req, res) => {
  const city = req.query.city || 'Delhi-NCR';
  const forecast = inversionService.get24HourInversionForecast(city);
  res.json(forecast);
});

/**
 * POST /api/iaq/simulate
 * Run mass balance differential indoor aerosol simulation
 */
router.post('/iaq/simulate', apiLimiter, validateIAQSimulation, (req, res) => {
  const simulationResult = iaqPhysicsService.simulateDay(req.body || {});
  res.json(simulationResult);
});

/**
 * POST /api/routines/generate
 * Tailored low-emission routine and sustainable alternatives
 */
router.post('/routines/generate', apiLimiter, validateRoutineRequest, (req, res) => {
  const routine = routineService.generateFamilyRoutine(req.body || {});
  res.json(routine);
});

/**
 * GET /api/hacks/catalog
 * Curated DIY IAQ blueprints and materials list
 */
router.get('/hacks/catalog', apiLimiter, (req, res) => {
  const hacks = hacksService.getAllHacks();
  const savings = hacksService.calculateCorsiRosenthalSavings();
  res.json({
    hacks,
    corsiRosenthalEconomics: savings
  });
});

/**
 * GET /api/community/grid
 * Active neighborhood syndicates and impact metrics
 */
router.get('/community/grid', apiLimiter, (req, res) => {
  const grid = communityService.getGridStatus();
  res.json(grid);
});

/**
 * POST /api/community/join
 * Join an active neighborhood syndicate
 */
router.post('/community/join', apiLimiter, (req, res) => {
  const { syndicateId, userDetails } = req.body || {};
  if (!syndicateId) {
    return res.status(400).json({ error: 'Validation Error', message: 'syndicateId is required.' });
  }
  const result = communityService.joinSyndicate(syndicateId, userDetails);
  res.json(result);
});

/**
 * POST /api/community/pledge
 * Sign a community clean air pledge
 */
router.post('/community/pledge', apiLimiter, (req, res) => {
  const { pledgeId } = req.body || {};
  if (!pledgeId) {
    return res.status(400).json({ error: 'Validation Error', message: 'pledgeId is required.' });
  }
  const result = communityService.signPledge(Number(pledgeId));
  res.json(result);
});

/**
 * POST /api/impact/calculate
 * Calculate personal lung dose spared and community emissions avoided
 */
router.post('/impact/calculate', apiLimiter, validateImpactRequest, (req, res) => {
  const impact = impactService.calculateImpact(req.body || {});
  res.json(impact);
});

/**
 * POST /api/assistant/chat
 * GenAI Multi-Agent Copilot
 */
router.post('/assistant/chat', aiLimiter, validateChatRequest, async (req, res, next) => {
  try {
    const result = await geminiService.chat(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/automation/evaluate
 * Evaluate autonomous triggers and smart home actions
 */
router.post('/automation/evaluate', apiLimiter, (req, res) => {
  const evaluation = automationService.evaluateAutonomousTriggers(req.body || {});
  res.json(evaluation);
});

/**
 * POST /api/automation/tasks/create
 * AI-powered automated task and booking creation
 */
router.post('/automation/tasks/create', apiLimiter, (req, res) => {
  const { clientTaskPrompt, clientName, category } = req.body || {};
  if (!clientTaskPrompt || typeof clientTaskPrompt !== 'string' || clientTaskPrompt.trim().length === 0) {
    return res.status(400).json({ error: 'Validation Error', message: 'clientTaskPrompt is required.' });
  }
  const task = automationService.createAutomatedTask({ clientTaskPrompt, clientName, category });
  res.json({ success: true, task });
});

/**
 * GET /api/automation/tasks/list
 * Retrieve all active automated tasks, bookings, and schedules
 */
router.get('/automation/tasks/list', apiLimiter, (req, res) => {
  const tasks = automationService.getTasks();
  res.json({ tasks, count: tasks.length });
});

/**
 * POST /api/automation/tasks/execute
 * Manually trigger or execute an automated task
 */
router.post('/automation/tasks/execute', apiLimiter, (req, res) => {
  const { taskId } = req.body || {};
  if (!taskId) {
    return res.status(400).json({ error: 'Validation Error', message: 'taskId is required.' });
  }
  const result = automationService.executeTask(taskId);
  res.json(result);
});

/**
 * GET /api/automation/tasks/export-ics/:taskId
 * Download calendar event invite (.ics)
 */
router.get('/automation/tasks/export-ics/:taskId', apiLimiter, (req, res) => {
  const ics = automationService.generateICS(req.params.taskId);
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.taskId}.ics"`);
  res.send(ics);
});

/**
 * GET /api/automation/home-assistant
 * Export Home Assistant YAML rules
 */
router.get('/automation/home-assistant', apiLimiter, (req, res) => {
  const yaml = automationService.generateHomeAssistantYAML(req.query);
  res.type('text/yaml').send(yaml);
});

/**
 * GET /api/automation/ifttt
 * Export IFTTT Recipe JSON
 */
router.get('/automation/ifttt', apiLimiter, (req, res) => {
  res.json(automationService.generateIFTTTRecipe());
});

/**
 * GET /api/automation/google-home
 * Export Google Home Routine JSON
 */
router.get('/automation/google-home', apiLimiter, (req, res) => {
  res.json(automationService.generateGoogleHomeRoutine());
});

/**
 * GET /api/health
 * System health, memory telemetry, cache metrics
 */
router.get('/health', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'HEALTHY',
    service: 'AeroShield AI',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: {
      rss: Number((mem.rss / 1024 / 1024).toFixed(2)),
      heapUsed: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
      heapTotal: Number((mem.heapTotal / 1024 / 1024).toFixed(2))
    },
    cache: cacheService.getStats(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
