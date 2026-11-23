/**
 * AeroShield AI - Automated Comprehensive Test Suite & Runner
 * Validates Physics Engines, Inversion Algorithms, Impact Formulations, Security & APIs
 */

const assert = require('assert');
const http = require('http');

// Load services & middleware
const iaqPhysicsService = require('./server/services/iaqPhysicsService');
const inversionService = require('./server/services/inversionService');
const impactService = require('./server/services/impactService');
const routineService = require('./server/services/routineService');
const hacksService = require('./server/services/hacksService');
const communityService = require('./server/services/communityService');
const geminiService = require('./server/services/geminiService');
const automationService = require('./server/services/automationService');
const cacheService = require('./server/services/cacheService');
const { sanitizeInput } = require('./server/middleware/security');
const { AQI_STANDARDS, IAQ_PHYSICS, CLEANER_CADR } = require('./server/config/constants');
const app = require('./server');

const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

function runTest(name, fn) {
  testResults.total++;
  try {
    fn();
    testResults.passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    testResults.failed++;
    testResults.errors.push({ name, error: err.message });
    console.error(`  ✗ ${name}`);
    console.error(`    -> ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  testResults.total++;
  try {
    await fn();
    testResults.passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    testResults.failed++;
    testResults.errors.push({ name, error: err.message });
    console.error(`  ✗ ${name}`);
    console.error(`    -> ${err.message}`);
  }
}

async function main() {
  console.log('\n================================================================');
  console.log(' 🛡️  AeroShield AI - Automated Test Suite Execution');
  console.log('================================================================\n');

  // --- 1. IAQ Physics & Mass Balance Equation Tests ---
  console.log('📦 Suite 1: Indoor Air Quality (IAQ) Physics Engine');
  
  runTest('Loss rate λ calculation includes ACH, natural deposition, and CADR/V', () => {
    const ach = 0.5;
    const vol = 50;
    const cadr = 850;
    const k = 0.25;
    const lambda = iaqPhysicsService.calculateLossRate(ach, vol, cadr, k);
    // lambda = 0.5 + 0.25 + (850 / 50) = 0.75 + 17 = 17.75 h⁻¹
    assert.strictEqual(lambda, 17.75);
  });

  runTest('Steady state concentration approaches zero with high CADR and zero indoor emission', () => {
    const cout = 300;
    const ach = 0.35;
    const vol = 45;
    const cadr = 850;
    const ss = iaqPhysicsService.calculateSteadyState(cout, ach, vol, cadr, 0);
    // Steady state should be dramatically lower than outdoor
    assert(ss < 15, `Expected steady state < 15 µg/m³, got ${ss}`);
  });

  runTest('Time to target returns correct clean air pull-down minutes', () => {
    const cin0 = 200;
    const target = 15;
    const cout = 100;
    const ach = 0.35;
    const vol = 45;
    const cadr = 850;
    const mins = iaqPhysicsService.calculateTimeToTarget(cin0, target, cout, ach, vol, cadr);
    assert(mins !== null, 'Expected finite time to reach WHO clean air');
    assert(mins > 0 && mins < 60, `Expected pull down time between 1 and 60 minutes, got ${mins}`);
  });

  runTest('24-Hour simulation generates 24 timeline slots with significant reduction', () => {
    const sim = iaqPhysicsService.simulateDay({
      baseOutdoorPM25: 250,
      filterType: 'CORSI_ROSENTHAL_20INCH'
    });
    assert.strictEqual(sim.hourlyTimeline.length, 24);
    assert(sim.pm25ReductionPercent >= 75, `Expected >= 75% PM2.5 reduction, got ${sim.pm25ReductionPercent}%`);
    assert(sim.averageIndoorPM25 < sim.baselineIndoorPM25);
  });

  // --- 2. Inversion & Boundary Layer Service Tests ---
  console.log('\n🌌 Suite 2: Winter Thermal Inversion & Boundary Layer Service');

  runTest('Planetary boundary layer height is lower at night and peaks at midday', () => {
    const nightPbl = inversionService.calculatePBLHeight(4); // 04:00
    const middayPbl = inversionService.calculatePBLHeight(13); // 13:00
    assert(nightPbl < 150, `Expected night PBL < 150m, got ${nightPbl}m`);
    assert(middayPbl > 900, `Expected midday PBL > 900m, got ${middayPbl}m`);
  });

  runTest('Inversion score reaches critical severity (>=9) for shallow nocturnal layers', () => {
    const score = inversionService.getInversionScore(90, 1.0);
    assert(score >= 9, `Expected score >= 9, got ${score}`);
  });

  runTest('Forecast identifies safe golden ventilation window in early afternoon', () => {
    const forecast = inversionService.get24HourInversionForecast('Delhi-NCR');
    assert(forecast.summary.goldenWindow.includes('13:00'));
    assert.strictEqual(forecast.forecast.length, 24);
    const goldenHour = forecast.forecast.find(h => h.hour === '13:00');
    assert.strictEqual(goldenHour.safeAiringWindow, true);
  });

  // --- 3. Personal & Community Impact Calculation Tests ---
  console.log('\n📊 Suite 3: Direct Impact & Scientific Explainability');

  runTest('Calculates personal lung PM2.5 avoidance and Berkeley Earth cigarette equivalence', () => {
    const impact = impactService.calculateImpact({
      householdMembers: ['adult', 'child_infant'],
      timeframeDays: 30,
      currentOutdoorPM25: 250
    });
    assert(impact.personalHealthImpact.dailyAvoidedInhaledDoseUg > 0);
    assert(impact.personalHealthImpact.totalAvoidedInhaledDoseMg > 0);
    assert(impact.personalHealthImpact.totalAvoidedCigarettes > 10);
    assert(impact.personalHealthImpact.acuteRespiratoryRiskReductionPercent > 30);
  });

  runTest('Calculates community CO2 and tailpipe PM2.5 avoidance from carpooling and heating shift', () => {
    const impact = impactService.calculateImpact({
      hasCarpooled: true,
      hasSwitchedHeating: true,
      dailyCommuteKm: 30,
      timeframeDays: 30
    });
    assert(impact.communityEmissionsImpact.totalCO2AvoidedKg > 50);
    assert(impact.communityEmissionsImpact.totalPM25AvoidedKg > 0.5);
    assert(impact.communityEmissionsImpact.equivalentTreesPlanted > 0);
  });

  // --- 4. Family Routine & Sustainable Alternatives Tests ---
  console.log('\n📅 Suite 4: Family Routine & Sustainable Alternatives');

  runTest('Generates customized daily routine with 7 synchronized phases', () => {
    const routine = routineService.generateFamilyRoutine({
      household: ['adult', 'child_infant', 'elderly_asthma'],
      commuteMode: 'car_solo',
      heatingType: 'biomass_wood'
    });
    assert.strictEqual(routine.dailySchedule.length, 7);
    assert.strictEqual(routine.vulnerabilitySummary.infantProtectionActive, true);
    assert.strictEqual(routine.vulnerabilitySummary.asthmaAlertActive, true);
    assert(routine.sustainableAlternatives.length >= 3);
  });

  // --- 5. DIY Hacks & Blueprint Tests ---
  console.log('\n💡 Suite 5: DIY Hacks & Corsi-Rosenthal Economics');

  runTest('Catalog contains all peer-reviewed DIY hacks', () => {
    const hacks = hacksService.getAllHacks();
    assert(hacks.length >= 5);
    const crBox = hacksService.getHackById('corsi-rosenthal-box');
    assert(crBox !== null);
    assert.strictEqual(crBox.cadrCFM, 520);
  });

  runTest('Corsi-Rosenthal economics proves dramatic 3-year cost savings over commercial HEPA', () => {
    const savings = hacksService.calculateCorsiRosenthalSavings();
    assert(savings.upfrontSavingsUSD > 200);
    assert(savings.threeYearTotalSavingsUSD > 400);
  });

  // --- 6. Security Sanitization & Validation Tests ---
  console.log('\n🔒 Suite 6: Security Sanitization & XSS Neutralization');

  runTest('Sanitize input neutralizes malicious script tags and javascript: URIs', () => {
    const malicious = '<script>alert("xss")</script>Hello Clean Air! javascript:void(0)';
    const clean = sanitizeInput(malicious);
    assert(!clean.includes('<script>'));
    assert(!clean.includes('</script>'));
    assert(!clean.includes('javascript:'));
    assert(clean.includes('Hello Clean Air!'));
  });

  runTest('Sanitize input recursively processes deeply nested objects and arrays', () => {
    const payload = {
      message: '  Clean text  ',
      nested: {
        attack: '<script>evil()</script>Valid',
        arr: ['<script>x</script>item1', 'item2']
      }
    };
    const cleaned = sanitizeInput(payload);
    assert.strictEqual(cleaned.message, 'Clean text');
    assert.strictEqual(cleaned.nested.attack, 'Valid');
    assert.strictEqual(cleaned.nested.arr[0], 'item1');
  });

  // --- 7. In-Memory TTL Cache Tests ---
  console.log('\n⚡ Suite 7: In-Memory TTL Cache Performance & Eviction');

  runTest('Cache stores, retrieves, and tracks hit/miss statistics', () => {
    cacheService.clear();
    cacheService.set('test-key', { value: 123 }, 10);
    assert.strictEqual(cacheService.get('test-key').value, 123);
    assert.strictEqual(cacheService.get('non-existent'), null);
    const stats = cacheService.getStats();
    assert.strictEqual(stats.hits, 1);
    assert.strictEqual(stats.misses, 1);
  });

  // --- 8. Multi-Agent GenAI Service Tests ---
  console.log('\n🤖 Suite 8: Multi-Agent GenAI Copilot & Autonomous Fallback');

  await runAsyncTest('Generates structured health responses for infant and asthma inquiries', async () => {
    const response = await geminiService.chat({
      message: 'How do I protect my newborn infant from severe winter smog?',
      agentType: 'health',
      location: 'Delhi-NCR',
      household: ['adult', 'child_infant']
    });
    assert(response.response.length > 50);
    assert(response.agent.name.includes('Dr. Aero'));
    assert(response.response.toLowerCase().includes('infant'));
  });

  await runAsyncTest('Generates IAQ engineering advice for Corsi-Rosenthal fan shroud', async () => {
    const response = await geminiService.chat({
      message: 'Explain the box fan shroud hack',
      agentType: 'iaq'
    });
    assert(response.agent.name.includes('Engineer Jack'));
    assert(response.response.toLowerCase().includes('shroud'));
  });

  await runAsyncTest('Generates accurate scientific answers on houseplants and NASA clean air study', async () => {
    const response = await geminiService.chat({
      message: 'Can spider plants or snake plants clean indoor air during severe smog?',
      agentType: 'iaq'
    });
    const txt = response.response.toLowerCase();
    assert(txt.includes('plant') || txt.includes('nasa') || txt.includes('filtration'));
  });

  await runAsyncTest('Generates CADR formula and room sizing calculations correctly', async () => {
    const response = await geminiService.chat({
      message: 'How do I calculate CADR and room size for my house?',
      agentType: 'iaq'
    });
    const txt = response.response.toLowerCase();
    assert(txt.includes('cadr') || txt.includes('cfm') || txt.includes('ach'));
  });

  await runAsyncTest('Generates maternal and pregnancy health protection guidelines', async () => {
    const response = await geminiService.chat({
      message: 'What should a pregnant woman do during this winter smog?',
      agentType: 'health'
    });
    const txt = response.response.toLowerCase();
    assert(txt.includes('pregnant') || txt.includes('maternal') || txt.includes('fetal') || txt.includes('particulate'));
  });

  // --- 9. Community Defense Grid & Syndicates Tests ---
  console.log('\n🤝 Suite 9: Community Clean-Air Defense Grid');

  runTest('Community grid reports active syndicates and accepts new members and pledges', () => {
    const grid = communityService.getGridStatus();
    assert(grid.activeSyndicatesCount >= 3);
    assert(grid.dailyCommunityImpact.totalCO2AvoidedKg > 0);

    const joinResult = communityService.joinSyndicate(grid.syndicates[0].id, { name: 'Test User' });
    assert.strictEqual(joinResult.success, true);

    const pledgeResult = communityService.signPledge(1);
    assert.strictEqual(pledgeResult.success, true);
  });

  // --- 10. Automation Engine & IoT YAML Exporter Tests ---
  console.log('\n⚡ Suite 10: Automation Engine & IoT Smart Home Exporter');

  runTest('Automation evaluator triggers severe inversion red alert when boundary layer collapses', () => {
    const evalResult = automationService.evaluateAutonomousTriggers({
      currentAQI: 320,
      pblHeightMeters: 90,
      isGoldenWindow: false
    });
    assert(evalResult.triggeredAlertsCount >= 1);
    assert(evalResult.alerts.some(a => a.type === 'INVERSION_TRAP_ACTIVE'));
    assert(evalResult.automatedActions.some(act => act.action === 'TURN_ON'));
  });

  runTest('Generates valid Home Assistant YAML with trigger and notification actions', () => {
    const yaml = automationService.generateHomeAssistantYAML({});
    assert(yaml.includes('- id:'));
    assert(yaml.includes('AeroShield'));
    assert(yaml.includes('platform: numeric_state'));
  });

  runTest('AI Task Automation Engine creates automated tasks and parses natural language', () => {
    const task = automationService.createAutomatedTask({
      clientTaskPrompt: 'Book a shared community HEPA purifier for 5 days for infant nursery',
      clientName: 'Hemalatha Family'
    });
    assert(task.id.startsWith('task-'));
    assert.strictEqual(task.category, 'EQUIPMENT_BOOKING');
    assert(task.actions.length >= 2);

    const execResult = automationService.executeTask(task.id);
    assert.strictEqual(execResult.success, true);
    assert.strictEqual(execResult.task.status, 'COMPLETED_SUCCESS');

    const ics = automationService.generateICS(task.id);
    assert(ics.includes('BEGIN:VCALENDAR'));
    assert(ics.includes('END:VCALENDAR'));
  });

  // --- 11. End-to-End HTTP API Integration Tests ---
  console.log('\n🌐 Suite 11: End-to-End HTTP API Endpoints Integration');

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const serverPort = server.address().port;

  async function apiGet(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${serverPort}${path}`, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, text: raw });
          }
        });
      }).on('error', reject);
    });
  }

  async function apiPost(path, body) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(body);
      const req = http.request(`http://localhost:${serverPort}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, text: raw });
          }
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }

  await runAsyncTest('GET /api/aqi/current returns live pollutant concentrations', async () => {
    const res = await apiGet('/api/aqi/current?city=DELHI');
    assert.strictEqual(res.statusCode, 200);
    assert(res.data.currentAQI > 0);
    assert(res.data.pollutants.pm25.value > 0);
  });

  await runAsyncTest('GET /api/inversion/forecast returns 24-hour meteorological profile', async () => {
    const res = await apiGet('/api/inversion/forecast?city=Delhi-NCR');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.forecast.length, 24);
  });

  await runAsyncTest('POST /api/iaq/simulate calculates mass balance timeline', async () => {
    const res = await apiPost('/api/iaq/simulate', {
      roomVolumeM3: 45,
      filterType: 'CORSI_ROSENTHAL_20INCH'
    });
    assert.strictEqual(res.statusCode, 200);
    assert(res.data.pm25ReductionPercent >= 70);
  });

  await runAsyncTest('POST /api/routines/generate creates tailored family schedule', async () => {
    const res = await apiPost('/api/routines/generate', {
      household: ['adult', 'child_infant']
    });
    assert.strictEqual(res.statusCode, 200);
    assert(res.data.dailySchedule.length > 0);
  });

  await runAsyncTest('POST /api/impact/calculate calculates lung dose avoided', async () => {
    const res = await apiPost('/api/impact/calculate', {
      householdMembers: ['adult', 'child_infant'],
      timeframeDays: 30
    });
    assert.strictEqual(res.statusCode, 200);
    assert(res.data.personalHealthImpact.totalAvoidedCigarettes > 0);
  });

  await runAsyncTest('POST /api/assistant/chat delivers GenAI copilot responses', async () => {
    const res = await apiPost('/api/assistant/chat', {
      message: 'What indoor plants reduce VOCs in winter?',
      agentType: 'iaq'
    });
    assert.strictEqual(res.statusCode, 200);
    assert(res.data.response.length > 30);
  });

  await runAsyncTest('POST /api/automation/tasks/create creates and parses automated tasks', async () => {
    const res = await apiPost('/api/automation/tasks/create', {
      clientTaskPrompt: 'Schedule morning carpool for 4 people along MG Road corridor',
      clientName: 'Alice'
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.task.category, 'COMMUTE_BOOKING');
  });

  await runAsyncTest('GET /api/automation/tasks/list returns active tasks', async () => {
    const res = await apiGet('/api/automation/tasks/list');
    assert.strictEqual(res.statusCode, 200);
    assert(res.data.tasks.length >= 4);
  });

  await runAsyncTest('GET /api/health returns system telemetry and memory', async () => {
    const res = await apiGet('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.status, 'HEALTHY');
    assert(res.data.memoryUsageMB.rss > 0);
  });

  // Close server
  server.close();

  // --- Summary ---
  console.log('\n================================================================');
  console.log(` 🏁  Test Execution Completed:`);
  console.log(`     Total:  ${testResults.total}`);
  console.log(`     Passed: ${testResults.passed}`);
  console.log(`     Failed: ${testResults.failed}`);
  console.log('================================================================\n');

  if (testResults.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
