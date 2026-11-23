/**
 * AeroShield AI - Frontend Application & Interactive Engine
 * Light Theme Edition with Native Canvas Visualizers & AI Task Automation
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentCity: 'DELHI',
    currentAQI: 365,
    currentPM25: 295,
    goldenWindow: '13:00 - 15:30',
    selectedHousehold: ['adult', 'child_infant', 'elderly_asthma'],
    commuteMode: 'car_solo',
    heatingType: 'biomass_wood',
    cookingType: 'gas_lpg',
    activeAgent: 'health',
    fontSizeOffset: 0,
    inversionData: null,
    simulationData: null,
    signedPledges: new Set(JSON.parse(localStorage.getItem('aeroshield_signed_pledges') || '[]')),
    joinedSyndicates: new Set(JSON.parse(localStorage.getItem('aeroshield_joined_syndicates') || '[]')),
    chamber: {
      filterActive: true,
      windowSealed: true,
      cookingBurst: false,
      kitchenDraft: false,
      particles: [],
      cleanParticles: [],
      indoorPM25: 6.8
    }
  };

  // DOM Elements Cache
  const el = {
    body: document.getElementById('app-body'),
    srAnnounce: document.getElementById('sr-announcements'),
    citySelect: document.getElementById('city-select'),
    btnAudioBrief: document.getElementById('btn-audio-brief'),
    btnFontInc: document.getElementById('btn-font-inc'),
    btnFontDec: document.getElementById('btn-font-dec'),
    btnFontReset: document.getElementById('btn-font-reset'),
    alertBannerText: document.getElementById('alert-banner-text'),
    goldenWindowPill: document.getElementById('golden-window-pill'),
    goldenWindowTime: document.getElementById('golden-window-time'),
    navTabs: document.querySelectorAll('.nav-tab'),
    tabPanes: document.querySelectorAll('.tab-pane'),

    // Radar Elements
    aqiCategoryBadge: document.getElementById('aqi-category-badge'),
    aqiCircle: document.getElementById('aqi-circle'),
    aqiVal: document.getElementById('aqi-val'),
    pm25Val: document.getElementById('pm25-val'),
    pm25Fill: document.getElementById('pm25-fill'),
    pm25Ratio: document.getElementById('pm25-ratio'),
    pm10Val: document.getElementById('pm10-val'),
    pm10Fill: document.getElementById('pm10-fill'),
    no2Val: document.getElementById('no2-val'),
    no2Fill: document.getElementById('no2-fill'),
    smogCausesList: document.getElementById('smog-causes-list'),
    pblStatusBadge: document.getElementById('pbl-status-badge'),
    spotlightWindowTime: document.getElementById('spotlight-window-time'),
    spotlightWindowDesc: document.getElementById('spotlight-window-desc'),
    inversionCanvas: document.getElementById('inversionChart'),

    // Digital Twin Elements
    roomVolumeSlider: document.getElementById('room-volume'),
    roomVolumeDisplay: document.getElementById('room-volume-display'),
    filterSelect: document.getElementById('filter-select'),
    windowStatusSelect: document.getElementById('window-status'),
    checkCooking: document.getElementById('check-cooking'),
    checkMopping: document.getElementById('check-mopping'),
    checkHumidity: document.getElementById('check-humidity'),
    btnRunSimulation: document.getElementById('btn-run-simulation'),
    twinWhoBadge: document.getElementById('twin-who-badge'),
    simIndoorAvg: document.getElementById('sim-indoor-avg'),
    simBaselineAvg: document.getElementById('sim-baseline-avg'),
    simReductionPct: document.getElementById('sim-reduction-pct'),
    simTimeClean: document.getElementById('sim-time-clean'),
    twinCanvas: document.getElementById('twinChart'),

    // Routine Elements
    householdChips: document.querySelectorAll('#household-chips .chip'),
    commuteSelect: document.getElementById('commute-mode-select'),
    heatingSelect: document.getElementById('heating-type-select'),
    cookingSelect: document.getElementById('cooking-type-select'),
    btnGenerateRoutine: document.getElementById('btn-generate-routine'),
    scheduleTimeline: document.getElementById('schedule-timeline'),

    // Hacks Elements
    hacksList: document.getElementById('hacks-list'),

    // Community Grid Elements
    gridCo2Saved: document.getElementById('grid-co2-saved'),
    gridPm25Prevented: document.getElementById('grid-pm25-prevented'),
    gridCarsOff: document.getElementById('grid-cars-off'),
    gridResidents: document.getElementById('grid-residents'),
    syndicatesContainer: document.getElementById('syndicates-container'),
    pledgesContainer: document.getElementById('pledges-container'),

    // Direct Impact Elements
    impactTimeframe: document.getElementById('impact-timeframe'),
    impactCommuteKm: document.getElementById('impact-commute-km'),
    btnRecalcImpact: document.getElementById('btn-recalc-impact'),
    kpiLungDose: document.getElementById('kpi-lung-dose'),
    kpiCigsVal: document.getElementById('kpi-cigs-val'),
    kpiCo2Val: document.getElementById('kpi-co2-val'),
    kpiTreesVal: document.getElementById('kpi-trees-val'),
    kpiRiskVal: document.getElementById('kpi-risk-val'),

    // Copilot Elements
    agentRadios: document.querySelectorAll('input[name="agentPersona"]'),
    currentAgentName: document.getElementById('current-agent-name'),
    currentAgentTitle: document.getElementById('current-agent-title'),
    chatMessages: document.getElementById('chat-messages'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    quickBtns: document.querySelectorAll('.quick-btn'),

    // Task & Event Automation Elements
    taskAutomationForm: document.getElementById('task-automation-form'),
    clientTaskPrompt: document.getElementById('client-task-prompt'),
    clientName: document.getElementById('client-name'),
    tasksFeed: document.getElementById('tasks-feed'),
    activeTasksCount: document.getElementById('active-tasks-count'),
    taskTemplateBtns: document.querySelectorAll('.task-template-btn'),

    // IoT Automation Elements
    btnEvalAutomation: document.getElementById('btn-eval-automation'),
    automationResults: document.getElementById('automation-results'),
    btnDownloadHA: document.getElementById('btn-download-ha'),
    btnViewIFTTT: document.getElementById('btn-view-ifttt'),
    btnViewGoogle: document.getElementById('btn-view-google'),
    iotCodeSnippet: document.getElementById('iot-code-snippet'),

    // Chamber Simulator Elements
    chamberCanvas: document.getElementById('chamberCanvas'),
    hudOutdoorPM25: document.getElementById('hud-outdoor-pm25'),
    hudIndoorPM25: document.getElementById('hud-indoor-pm25'),
    hudEfficiency: document.getElementById('hud-efficiency'),
    hudFanRpm: document.getElementById('hud-fan-rpm'),
    hudFanRpmPill: document.getElementById('hud-fan-rpm-pill'),
    btnChamberToggleFilter: document.getElementById('btn-chamber-toggle-filter'),
    btnChamberToggleWindow: document.getElementById('btn-chamber-toggle-window'),
    btnChamberSpikeCooking: document.getElementById('btn-chamber-spike-cooking'),
    btnChamberKitchenDraft: document.getElementById('btn-chamber-kitchen-draft'),

    // CADR Calculator Elements
    calcRoomLength: document.getElementById('calc-room-length'),
    calcRoomWidth: document.getElementById('calc-room-width'),
    calcRoomHeight: document.getElementById('calc-room-height'),
    calcTargetACH: document.getElementById('calc-target-ach'),
    calcACHLabel: document.getElementById('calc-ach-label'),
    resRoomVol: document.getElementById('res-room-vol'),
    resRoomVolM3: document.getElementById('res-room-vol-m3'),
    resRequiredCADR: document.getElementById('res-required-cadr'),
    resRequiredM3h: document.getElementById('res-required-m3h'),
    resPulldownTime: document.getElementById('res-pulldown-time'),
    resCommercialUnits: document.getElementById('res-commercial-units'),
    resSavingsBadge: document.getElementById('res-savings-badge')
  };

  function announce(message) {
    if (el.srAnnounce) el.srAnnounce.textContent = message;
  }

  function showToast(message, type = 'success') {
    let toast = document.getElementById('aeroshield-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'aeroshield-toast';
      document.body.appendChild(toast);
    }
    toast.className = `cyber-toast ${type} show`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span> <span>${message}</span>`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  function setupNavigation() {
    el.navTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const paneId = tab.getAttribute('data-pane');
        activateTab(paneId);
      });

      window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === String(index + 1)) {
          e.preventDefault();
          tab.click();
        }
      });
    });
  }

  function activateTab(paneId) {
    el.navTabs.forEach(t => {
      const isTarget = t.getAttribute('data-pane') === paneId;
      t.classList.toggle('active', isTarget);
      t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    el.tabPanes.forEach(p => {
      const isTarget = p.id === paneId;
      p.classList.toggle('active', isTarget);
    });

    announce(`Switched to ${paneId.replace('pane-', '')} module.`);
  }

  function setupAccessibility() {
    el.btnFontInc.addEventListener('click', () => {
      if (state.fontSizeOffset < 4) {
        state.fontSizeOffset += 2;
        applyFontSize();
      }
    });

    el.btnFontDec.addEventListener('click', () => {
      if (state.fontSizeOffset > -2) {
        state.fontSizeOffset -= 2;
        applyFontSize();
      }
    });

    el.btnFontReset.addEventListener('click', () => {
      state.fontSizeOffset = 0;
      applyFontSize();
    });

    el.btnAudioBrief.addEventListener('click', () => {
      speakSmogBriefing();
    });
  }

  function applyFontSize() {
    document.documentElement.style.fontSize = `${16 + state.fontSizeOffset}px`;
    announce(`Font size adjusted to ${16 + state.fontSizeOffset}px`);
  }

  function speakSmogBriefing() {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      el.btnAudioBrief.classList.remove('speaking');
      announce('Stopped audio briefing.');
      return;
    }

    window.speechSynthesis.cancel();
    const briefText = `AeroShield clean-air advisory for ${state.currentCity}. Current atmospheric AQI is ${state.currentAQI}, in the hazardous category due to nocturnal thermal inversion. Ground-level pollutants are trapped near the surface. The safe convective ventilation golden window opens at ${state.goldenWindow}. Dr. Aero recommends activating your Corsi-Rosenthal box and setting vehicle air conditioning to internal recirculation.`;
    const utterance = new SpeechSynthesisUtterance(briefText);
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      el.btnAudioBrief.classList.add('speaking');
      announce('Playing voice smog briefing.');
    };
    utterance.onend = () => {
      el.btnAudioBrief.classList.remove('speaking');
    };
    utterance.onerror = () => {
      el.btnAudioBrief.classList.remove('speaking');
    };

    window.speechSynthesis.speak(utterance);
  }

  async function loadAQIData() {
    try {
      const res = await fetch(`/api/aqi/current?city=${state.currentCity}`);
      const data = await res.json();

      state.currentAQI = data.currentAQI;
      state.currentPM25 = data.pollutants.pm25.value;
      state.goldenWindow = data.optimalVentilationWindow;

      el.aqiVal.textContent = data.currentAQI;
      el.aqiCategoryBadge.textContent = data.category;

      el.pm25Val.textContent = `${data.pollutants.pm25.value} µg/m³`;
      el.pm25Fill.style.width = `${Math.min(100, (data.pollutants.pm25.value / 350) * 100)}%`;
      el.pm25Ratio.textContent = `${data.pollutants.pm25.whoLimitRatio}x WHO 24h limit (15 µg/m³)`;

      el.pm10Val.textContent = `${data.pollutants.pm10.value} µg/m³`;
      el.pm10Fill.style.width = `${Math.min(100, (data.pollutants.pm10.value / 450) * 100)}%`;

      el.no2Val.textContent = `${data.pollutants.no2.value} µg/m³`;
      el.no2Fill.style.width = `${Math.min(100, (data.pollutants.no2.value / 120) * 100)}%`;

      el.smogCausesList.innerHTML = data.primaryCauses.map(c => `<li>${c}</li>`).join('');

      el.alertBannerText.textContent = `Severe Winter Smog Alert in ${data.location}: AQI ${data.currentAQI} (${data.category}). Boundary layer trapping active.`;
      el.goldenWindowTime.textContent = `Golden Window: ${data.optimalVentilationWindow}`;
      el.spotlightWindowTime.textContent = data.optimalVentilationWindow;

    } catch (err) {
      console.error('Error fetching AQI data:', err);
    }
  }

  async function loadInversionData() {
    try {
      const res = await fetch(`/api/inversion/forecast?city=${state.currentCity}`);
      const data = await res.json();
      state.inversionData = data;

      el.spotlightWindowDesc.textContent = data.summary.goldenWindowExplanation;
      drawInversionChart(data.forecast);
    } catch (err) {
      console.error('Error fetching inversion data:', err);
    }
  }

  function drawInversionChart(forecast) {
    if (!el.inversionCanvas) return;
    const ctx = el.inversionCanvas.getContext('2d');
    const width = el.inversionCanvas.width;
    const height = el.inversionCanvas.height;

    ctx.clearRect(0, 0, width, height);

    const padX = 40;
    const padY = 25;
    const plotW = width - padX * 2;
    const plotH = height - padY * 2;

    const maxPBL = 1400;

    // Golden Window Highlight (13:00 to 16:00)
    const goldenStartX = padX + (13 / 23) * plotW;
    const goldenEndX = padX + (16 / 23) * plotW;
    ctx.fillStyle = 'rgba(0, 255, 136, 0.12)';
    ctx.fillRect(goldenStartX, padY, goldenEndX - goldenStartX, plotH);

    // Grid lines (Black & Neon Cyber Theme)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padY + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(width - padX, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '600 10px sans-serif';
      ctx.fillText(`${Math.round(maxPBL - (maxPBL / 4) * i)}m`, 6, y + 3);
    }

    // Draw curve (Electric Cyan)
    ctx.beginPath();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;

    forecast.forEach((f, idx) => {
      const x = padX + (idx / 23) * plotW;
      const y = padY + plotH - (f.pblHeightMeters / maxPBL) * plotH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient under curve
    const grad = ctx.createLinearGradient(0, padY, 0, height - padY);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
    ctx.lineTo(padX + plotW, padY + plotH);
    ctx.lineTo(padX, padY + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Golden Window Tag on Canvas (Neon Green)
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('☀️ Golden Convective Window', goldenStartX + 4, padY + 15);
  }

  async function runSimulation() {
    try {
      const payload = {
        roomVolumeM3: Number(el.roomVolumeSlider.value),
        filterType: el.filterSelect.value,
        windowStatus: el.windowStatusSelect.value,
        cookingEvent: el.checkCooking.checked,
        wetMopping: el.checkMopping.checked,
        humidityControl: el.checkHumidity.checked,
        baseOutdoorPM25: state.currentPM25
      };

      const res = await fetch('/api/iaq/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      state.simulationData = data;

      el.simIndoorAvg.textContent = `${data.averageIndoorPM25} µg/m³`;
      el.simBaselineAvg.textContent = data.baselineIndoorPM25;
      el.simReductionPct.textContent = `${data.pm25ReductionPercent}%`;
      el.simTimeClean.textContent = data.timeToWHOStandardMinutes !== null ? `${data.timeToWHOStandardMinutes} mins` : 'CADR Boost Needed';

      if (data.whoLimitComparison.isWithinWhoLimit) {
        el.twinWhoBadge.className = 'badge badge-success';
        el.twinWhoBadge.textContent = 'Within WHO Limit (≤15 µg/m³)';
      } else {
        el.twinWhoBadge.className = 'badge badge-gold';
        el.twinWhoBadge.textContent = `${data.whoLimitComparison.timesAboveWhoLimit}x WHO Limit`;
      }

      drawTwinChart(data.hourlyTimeline);
    } catch (err) {
      console.error('Error running simulation:', err);
    }
  }

  function drawTwinChart(timeline) {
    if (!el.twinCanvas) return;
    const ctx = el.twinCanvas.getContext('2d');
    const width = el.twinCanvas.width;
    const height = el.twinCanvas.height;

    ctx.clearRect(0, 0, width, height);

    const padX = 40;
    const padY = 25;
    const plotW = width - padX * 2;
    const plotH = height - padY * 2;

    const maxVal = 400;

    // Y Axis Grid (Black & Cyber Theme)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padY + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(width - padX, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '600 10px sans-serif';
      ctx.fillText(`${Math.round(maxVal - (maxVal / 4) * i)}`, 10, y + 3);
    }

    // WHO Limit Reference Line (15 µg/m³)
    const whoY = padY + plotH - (15 / maxVal) * plotH;
    ctx.strokeStyle = '#00ff88';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padX, whoY);
    ctx.lineTo(width - padX, whoY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('WHO Limit (15 µg/m³)', width - 130, whoY - 4);

    // 1. Outdoor PM2.5 Curve (Red)
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    timeline.forEach((item, i) => {
      const x = padX + (i / 23) * plotW;
      const y = padY + plotH - (item.outdoorPM25 / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Unshielded Indoor (Orange dash)
    ctx.beginPath();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    timeline.forEach((item, i) => {
      const x = padX + (i / 23) * plotW;
      const y = padY + plotH - (item.indoorPM25Unshielded / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Shielded Indoor PM2.5 (Neon Cyber Green Solid)
    ctx.beginPath();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3.5;
    timeline.forEach((item, i) => {
      const x = padX + (i / 23) * plotW;
      const y = padY + plotH - (item.indoorPM25WithShield / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Legend
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('■ Outdoor Smog', padX + 5, 14);
    ctx.fillStyle = '#f97316';
    ctx.fillText('■ Unshielded Indoor', padX + 115, 14);
    ctx.fillStyle = '#00ff88';
    ctx.fillText('■ AeroShield Shielded', padX + 245, 14);
  }

  async function loadRoutine() {
    try {
      const payload = {
        location: state.currentCity,
        household: state.selectedHousehold,
        commuteMode: el.commuteSelect.value,
        heatingType: el.heatingSelect.value,
        cookingType: el.cookingSelect.value,
        currentAQI: state.currentAQI
      };

      const res = await fetch('/api/routines/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      el.scheduleTimeline.innerHTML = data.dailySchedule.map(item => {
        const isGolden = item.phase === 'safe_ventilation';
        return `
          <div class="timeline-item ${isGolden ? 'golden-window' : ''}">
            <div class="timeline-time">${item.time}</div>
            <div class="timeline-body">
              <h4>${item.title}</h4>
              <p class="timeline-action">${item.action}</p>
              <ul class="timeline-tips">
                ${item.specificTips.map(t => `<li>${t}</li>`).join('')}
              </ul>
              <div class="timeline-impact">✨ Impact: ${item.emissionImpact}</div>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error('Error generating routine:', err);
    }
  }

  async function loadHacks() {
    try {
      const res = await fetch('/api/hacks/catalog');
      const data = await res.json();

      el.hacksList.innerHTML = data.hacks.map(hack => `
        <div class="hack-item" data-id="${hack.id}">
          <div class="hack-header">
            <h4 class="hack-title">${hack.name}</h4>
            <span class="badge badge-success">${hack.costUSD === 0 ? 'FREE' : `$${hack.costUSD}`}</span>
          </div>
          <div class="hack-meta">
            <span>Category: ${hack.category}</span> • 
            <span>Efficacy: ${hack.efficacyRating}</span>
          </div>
          <p class="text-secondary">${hack.summary}</p>
          <div class="hack-content">
            <strong>Key Materials:</strong>
            <ul style="margin: 0.35rem 0 0.5rem 1.25rem;">
              ${hack.materials.slice(0, 3).map(m => `<li>${m}</li>`).join('')}
            </ul>
            <strong>Physics / Mechanism:</strong>
            <p>${hack.stepByStepGuide[hack.stepByStepGuide.length - 1]}</p>
          </div>
        </div>
      `).join('');

    } catch (err) {
      console.error('Error loading hacks:', err);
    }
  }

  async function loadCommunityGrid() {
    try {
      const res = await fetch('/api/community/grid');
      const data = await res.json();

      el.gridCo2Saved.textContent = `${data.dailyCommunityImpact.totalCO2AvoidedKg} kg`;
      el.gridPm25Prevented.textContent = `${data.dailyCommunityImpact.totalPM25AvoidedGrams} g`;
      el.gridCarsOff.textContent = data.dailyCommunityImpact.carsEliminatedDaily;
      el.gridResidents.textContent = data.totalEngagedResidents;

      el.syndicatesContainer.innerHTML = data.syndicates.map(s => {
        const isJoined = state.joinedSyndicates.has(s.id);
        return `
        <div class="syndicate-card">
          <div class="syndicate-header">
            <h4 class="syndicate-name">${s.name}</h4>
            <span class="badge badge-primary">${s.type}</span>
          </div>
          <div class="syndicate-stats">
            <span>👥 <strong>${s.activeMembers}</strong> active neighbors participating</span>
            <span>🌱 Prevents <strong>${s.dailyCO2AvoidedKg} kg CO₂</strong> daily</span>
            <span>🫁 Avoids <strong>${s.dailyPM25AvoidedGrams}g</strong> toxic particulates</span>
            <span>📍 Organizer: <em>${s.organizer}</em></span>
          </div>
          <button type="button" class="btn ${isJoined ? 'btn-syndicate-joined' : 'btn-secondary'} btn-block btn-join-syndicate" data-id="${s.id}" ${isJoined ? 'disabled' : ''} style="margin-top: 0.75rem;">
            ${isJoined ? '✓ Member Active' : 'Join Syndicate'}
          </button>
        </div>
      `;
      }).join('');

      document.querySelectorAll('.btn-join-syndicate:not([disabled])').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (state.joinedSyndicates.has(id)) return;

          btn.textContent = 'Joining...';
          btn.disabled = true;

          try {
            const joinRes = await fetch('/api/community/join', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ syndicateId: id })
            });
            const joinData = await joinRes.json();
            if (joinData.success) {
              state.joinedSyndicates.add(id);
              try {
                localStorage.setItem('aeroshield_joined_syndicates', JSON.stringify([...state.joinedSyndicates]));
              } catch (_) {}
              showToast(`✓ Welcome! You have joined "${joinData.syndicate.name}"`);
              announce(`Joined syndicate: ${joinData.syndicate.name}`);
              await loadCommunityGrid();
            }
          } catch (err) {
            console.error('Error joining syndicate:', err);
            btn.disabled = false;
            btn.textContent = 'Join Syndicate';
          }
        });
      });

      el.pledgesContainer.innerHTML = data.pledges.map(p => {
        const isSigned = state.signedPledges.has(Number(p.id));
        return `
        <div class="pledge-row">
          <span class="pledge-text">“${p.text}” (<strong>${p.count}</strong> pledged)</span>
          <button type="button" class="btn ${isSigned ? 'btn-pledge-signed' : 'btn-secondary'} btn-sign-pledge" data-id="${p.id}" ${isSigned ? 'disabled' : ''}>
            ${isSigned ? '✓ Pledged' : 'Sign Pledge'}
          </button>
        </div>
      `;
      }).join('');

      document.querySelectorAll('.btn-sign-pledge:not([disabled])').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = Number(e.currentTarget.getAttribute('data-id'));
          if (state.signedPledges.has(id)) return;

          btn.textContent = 'Signing...';
          btn.disabled = true;

          try {
            const res = await fetch('/api/community/pledge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pledgeId: id })
            });
            const result = await res.json();
            if (result.success) {
              state.signedPledges.add(id);
              try {
                localStorage.setItem('aeroshield_signed_pledges', JSON.stringify([...state.signedPledges]));
              } catch (_) {}
              showToast(`✓ Thank you! You pledged: "${result.pledge.text}"`);
              announce(`Signed pledge: ${result.pledge.text}`);
              await loadCommunityGrid();
            }
          } catch (err) {
            console.error('Error signing pledge:', err);
            btn.disabled = false;
            btn.textContent = 'Sign Pledge';
          }
        });
      });

    } catch (err) {
      console.error('Error loading community grid:', err);
    }
  }

  async function loadImpact() {
    try {
      const payload = {
        householdMembers: state.selectedHousehold,
        timeframeDays: Number(el.impactTimeframe.value),
        dailyCommuteKm: Number(el.impactCommuteKm.value),
        currentOutdoorPM25: state.currentPM25,
        hasCorsiRosenthal: true,
        hasN95Commute: true,
        hasKitchenExhaust: true,
        hasCarpooled: true,
        hasSwitchedHeating: true
      };

      const res = await fetch('/api/impact/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      el.kpiLungDose.textContent = `${data.personalHealthImpact.totalAvoidedInhaledDoseMg} mg`;
      el.kpiCigsVal.textContent = data.personalHealthImpact.totalAvoidedCigarettes;
      el.kpiCo2Val.textContent = `${data.communityEmissionsImpact.totalCO2AvoidedKg} kg`;
      el.kpiTreesVal.textContent = data.communityEmissionsImpact.equivalentTreesPlanted;
      el.kpiRiskVal.textContent = `-${data.personalHealthImpact.acuteRespiratoryRiskReductionPercent}%`;

    } catch (err) {
      console.error('Error calculating impact:', err);
    }
  }

  // --- AI Task & Event Automation Engine ---
  async function loadTasksFeed() {
    try {
      const res = await fetch('/api/automation/tasks/list');
      const data = await res.json();

      el.activeTasksCount.textContent = `${data.count} Tasks Active`;

      el.tasksFeed.innerHTML = data.tasks.map(task => {
        const isDone = task.status === 'COMPLETED_SUCCESS';
        return `
          <div class="task-card" id="card-${task.id}">
            <div class="task-card-header">
              <span class="task-card-title">${task.title}</span>
              <span class="badge ${isDone ? 'badge-success' : 'badge-primary'}">${task.status}</span>
            </div>
            <div class="task-details">${task.details}</div>
            <ul class="task-actions-list">
              ${task.actions.map(act => `<li>${act}</li>`).join('')}
            </ul>
            <div class="task-card-footer">
              <span style="font-size: 0.78rem; color: var(--text-muted);">Client: <strong>${task.client}</strong></span>
              <div style="display: flex; gap: 0.4rem;">
                <a href="/api/automation/tasks/export-ics/${task.id}" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" title="Download Calendar Invite (.ics)">
                  📅 Calendar (.ics)
                </a>
                ${!isDone ? `
                  <button type="button" class="btn btn-primary btn-exec-task" data-id="${task.id}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                    ▶ Run Now
                  </button>
                ` : '<span style="font-size: 0.78rem; color: #059669; font-weight: bold;">✓ Executed</span>'}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Add execute button listeners
      document.querySelectorAll('.btn-exec-task').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          btn.textContent = 'Running...';
          btn.disabled = true;

          const res = await fetch('/api/automation/tasks/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: id })
          });
          const result = await res.json();
          if (result.success) {
            btn.textContent = '✓ Done';
            loadTasksFeed();
          }
        });
      });

    } catch (err) {
      console.error('Error loading tasks feed:', err);
    }
  }

  function setupTaskAutomation() {
    // Quick template buttons
    el.taskTemplateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.clientTaskPrompt.value = btn.getAttribute('data-template');
        el.clientTaskPrompt.focus();
      });
    });

    // Form submit
    el.taskAutomationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = el.clientTaskPrompt.value.trim();
      const client = el.clientName.value.trim();
      if (!prompt) return;

      const submitBtn = document.getElementById('btn-submit-task');
      submitBtn.textContent = 'AI Parsing & Automating...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/automation/tasks/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientTaskPrompt: prompt,
            clientName: client
          })
        });
        const data = await res.json();

        if (data.success) {
          el.clientTaskPrompt.value = '';
          submitBtn.textContent = '✓ Task Automated Successfully!';
          setTimeout(() => {
            submitBtn.textContent = '⚡ Automate & Dispatch Task';
            submitBtn.disabled = false;
          }, 1500);

          await loadTasksFeed();
          announce(`Automated task "${data.task.title}" created successfully.`);
        }
      } catch (err) {
        console.error('Error creating automated task:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = '⚡ Automate & Dispatch Task';
      }
    });
  }

  function setupChat() {
    el.agentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.activeAgent = e.target.value;
        document.querySelectorAll('.agent-label').forEach(lbl => lbl.classList.remove('active'));
        e.target.closest('.agent-label').classList.add('active');

        const names = {
          health: { name: 'Dr. Aero', title: 'Family Health & Vulnerability Specialist' },
          routine: { name: 'Aria Routine', title: 'Eco-Commute & Heating Architect' },
          iaq: { name: 'Engineer Jack', title: 'IAQ & DIY Filtration Physics' },
          community: { name: 'Maya Civic', title: 'Community Action Organizer' }
        };

        const chosen = names[state.activeAgent];
        el.currentAgentName.textContent = chosen.name;
        el.currentAgentTitle.textContent = chosen.title;
      });
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-btn');
      if (btn && btn.getAttribute('data-query')) {
        el.chatInput.value = btn.getAttribute('data-query');
        activateTab('pane-copilot');
        el.chatForm.dispatchEvent(new Event('submit'));
      }
    });

    el.chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = el.chatInput.value.trim();
      if (!message) return;

      appendChatMessage('user', message, 'You');
      el.chatInput.value = '';

      const typingId = appendChatMessage('ai', 'Thinking and consulting atmospheric models...', el.currentAgentName.textContent);

      try {
        const res = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            agentType: state.activeAgent,
            location: state.currentCity,
            household: state.selectedHousehold,
            currentAQI: state.currentAQI
          })
        });
        const data = await res.json();

        const typingEl = document.getElementById(typingId);
        if (typingEl) {
          const bodyEl = typingEl.querySelector('.msg-body p');
          if (bodyEl) {
            const reply = data.response || data.message || 'I processed your request, but could not retrieve text. Please ask another question.';
            bodyEl.innerHTML = formatMarkdown(reply);
          }
        }
      } catch (err) {
        console.error('Error in chat:', err);
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
          const bodyEl = typingEl.querySelector('.msg-body p');
          if (bodyEl) {
            bodyEl.innerHTML = '<span style="color: #f87171;">⚠️ Network connection latency. Please ask again or select one of the suggested prompts above!</span>';
          }
        }
      }
    });
  }

  function appendChatMessage(sender, text, name) {
    const id = `msg-${Date.now()}`;
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.className = `chat-msg msg-${sender}`;

    const avatar = sender === 'user' ? '👤' : (state.activeAgent === 'health' ? '🩺' : (state.activeAgent === 'routine' ? '🗺️' : (state.activeAgent === 'iaq' ? '🔧' : '📣')));

    msgDiv.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-body">
        <strong>${name}</strong>
        <p>${formatMarkdown(text)}</p>
      </div>
    `;

    el.chatMessages.appendChild(msgDiv);
    el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
    return id;
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)\n/g, '<h4 style="margin: 0.6rem 0 0.3rem 0; font-weight: bold; color: var(--green);">$1</h4>')
      .replace(/## (.*?)\n/g, '<h3 style="margin: 0.75rem 0 0.4rem 0; font-weight: bold; color: var(--blue);">$1</h3>')
      .replace(/\n/g, '<br>');
  }

  async function loadAutomations() {
    try {
      const res = await fetch('/api/automation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAQI: state.currentAQI,
          currentPM25: state.currentPM25,
          pblHeightMeters: 95,
          isGoldenWindow: false,
          hasInfant: true,
          hasAsthma: true
        })
      });
      const data = await res.json();

      el.automationResults.innerHTML = `
        <h4 style="margin-bottom: 0.6rem; font-weight: 800;">Autonomous Triggers Evaluated (${data.triggeredAlertsCount} active):</h4>
        ${data.alerts.map(a => `
          <div style="background: #fff1f2; border: 1px solid #fecdd3; border-left: 4px solid #dc2626; border-radius: 8px; padding: 0.85rem; margin-bottom: 0.5rem;">
            <strong style="color: #991b1b;">${a.headline}</strong>
            <p style="font-size: 0.84rem; margin: 0.25rem 0; color: #475569;">${a.message}</p>
            <div style="font-size: 0.8rem; color: #b45309; font-weight: bold;">Recommended: ${a.recommendedAction}</div>
          </div>
        `).join('')}
        ${data.automatedActions.map(act => `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #059669; border-radius: 8px; padding: 0.85rem; margin-top: 0.5rem;">
            <strong style="color: #065f46;">⚡ IoT Action: ${act.device}</strong>
            <p style="font-size: 0.84rem; margin: 0.25rem 0; color: #475569;">Action: <code>${act.action} (${act.targetSpeed || ''})</code></p>
            <div style="font-size: 0.8rem; color: #047857; font-weight: bold;">Trigger Reason: ${act.reason}</div>
          </div>
        `).join('')}
      `;

      const yamlRes = await fetch('/api/automation/home-assistant');
      const yamlText = await yamlRes.text();
      el.iotCodeSnippet.textContent = yamlText;

    } catch (err) {
      console.error('Error loading automations:', err);
    }
  }

  function setupAutomationExporters() {
    el.btnEvalAutomation.addEventListener('click', loadAutomations);

    el.btnDownloadHA.addEventListener('click', () => {
      window.open('/api/automation/home-assistant', '_blank');
    });

    el.btnViewIFTTT.addEventListener('click', async () => {
      const res = await fetch('/api/automation/ifttt');
      const data = await res.json();
      el.iotCodeSnippet.textContent = JSON.stringify(data, null, 2);
    });

    el.btnViewGoogle.addEventListener('click', async () => {
      const res = await fetch('/api/automation/google-home');
      const data = await res.json();
      el.iotCodeSnippet.textContent = JSON.stringify(data, null, 2);
    });
  }

  // --- Interactive CADR & Room Sizing Engineering Calculator ---
  function initCADRCalculator() {
    if (!el.calcRoomLength) return;

    function updateCADR() {
      const l = Number(el.calcRoomLength.value) || 16;
      const w = Number(el.calcRoomWidth.value) || 14;
      const h = Number(el.calcRoomHeight.value) || 9;
      const ach = Number(el.calcTargetACH.value) || 5.0;

      el.calcACHLabel.textContent = `${ach.toFixed(1)} ACH (${ach >= 5 ? 'Smog Defense' : 'Standard Comfort'})`;

      const volumeFt3 = Math.round(l * w * h);
      const volumeM3 = (volumeFt3 * 0.028317).toFixed(1);

      const requiredCFM = Math.round((volumeFt3 * ach) / 60);
      const requiredM3h = Math.round(requiredCFM * 1.699);

      // Pulldown time formula derived from mass balance
      const pulldownMins = Math.max(8, Math.round((60 / ach) * 1.1));

      // Commercial units needed (standard commercial HEPA is ~180-200 CFM CADR)
      const commercialUnits = Math.max(1, Math.ceil(requiredCFM / 180));
      const commercialCost = commercialUnits * 380;
      const savings = commercialCost - 55;

      el.resRoomVol.textContent = `${volumeFt3.toLocaleString()} ft³`;
      el.resRoomVolM3.textContent = `${volumeM3} m³`;
      el.resRequiredCADR.textContent = `${requiredCFM} CFM`;
      el.resRequiredM3h.textContent = `${requiredM3h} m³/h`;
      el.resPulldownTime.textContent = `${pulldownMins} mins`;
      el.resCommercialUnits.textContent = `${commercialUnits} Unit${commercialUnits > 1 ? 's' : ''} (~$${commercialCost})`;
      el.resSavingsBadge.textContent = `Saves ~$${savings} Upfront!`;
    }

    [el.calcRoomLength, el.calcRoomWidth, el.calcRoomHeight, el.calcTargetACH].forEach(input => {
      input.addEventListener('input', updateCADR);
      input.addEventListener('change', updateCADR);
    });

    updateCADR();
  }

  // --- AeroChamber™ Real-Time Aerosol Particle Dynamics Simulator ---
  function initAeroChamberSimulator() {
    if (!el.chamberCanvas) return;
    const canvas = el.chamberCanvas;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const wallX = 280;
    const windowTop = 110;
    const windowBottom = 210;

    const filterX = 740;
    const filterY = 260;
    const filterW = 90;
    const filterH = 80;
    let fanAngle = 0;

    // Mouse velocity and interactive fan speed controls
    let mouseX = -999;
    let mouseY = -999;
    let lastMouseX = -999;
    let lastMouseY = -999;
    let mouseSpeedImpulse = 0;
    let isMouseInCanvas = false;
    let baseFanSpeed = 1.2; // 0.8: Low, 1.2: Med, 2.2: Turbo
    let effectiveFanMultiplier = 1.2;

    let particles = [];
    let cleanParticles = [];
    let kitchenDraftActive = false;
    let kitchenDraftTimer = null;

    // Seed initial outdoor smog particles
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * (wallX - 20) + 10,
        y: Math.random() * (H - 40) + 20,
        vx: (Math.random() - 0.3) * 0.7,
        vy: (Math.random() - 0.2) * 0.6,
        radius: Math.random() * 2.5 + 1.5,
        color: '#ff4757',
        isIndoor: false,
        source: 'smog'
      });
    }

    // Seed a few initial indoor particles
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * (W - wallX - 100) + wallX + 30,
        y: Math.random() * (H - 60) + 30,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: '#ff6b81',
        isIndoor: true,
        source: 'smog'
      });
    }

    // Mouse Tracking Event Listeners
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const curX = (e.clientX - rect.left) * scaleX;
      const curY = (e.clientY - rect.top) * scaleY;

      if (lastMouseX !== -999 && lastMouseY !== -999) {
        const delta = Math.hypot(curX - lastMouseX, curY - lastMouseY);
        // Instant acceleration impulse directly proportional to mouse movement speed
        mouseSpeedImpulse = Math.min(3.8, mouseSpeedImpulse + delta * 0.06);
      }

      mouseX = curX;
      mouseY = curY;
      lastMouseX = curX;
      lastMouseY = curY;
      isMouseInCanvas = true;
    });

    canvas.addEventListener('mouseenter', () => {
      isMouseInCanvas = true;
    });

    canvas.addEventListener('mouseleave', () => {
      isMouseInCanvas = false;
      mouseX = -999;
      mouseY = -999;
      lastMouseX = -999;
      lastMouseY = -999;
    });

    // CADR Speed Stepper Buttons (Low / Med / Turbo)
    const speedBtns = document.querySelectorAll('.speed-step-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const spd = parseInt(btn.getAttribute('data-speed') || '2', 10);
        if (spd === 1) baseFanSpeed = 0.8;
        else if (spd === 2) baseFanSpeed = 1.2;
        else if (spd === 3) {
          baseFanSpeed = 2.2;
          mouseSpeedImpulse = Math.max(mouseSpeedImpulse, 1.5);
        }
      });
    });

    // Buttons wireup
    if (el.btnChamberToggleFilter) {
      el.btnChamberToggleFilter.addEventListener('click', () => {
        state.chamber.filterActive = !state.chamber.filterActive;
        el.btnChamberToggleFilter.classList.toggle('btn-primary', state.chamber.filterActive);
        el.btnChamberToggleFilter.classList.toggle('btn-secondary', !state.chamber.filterActive);
        el.btnChamberToggleFilter.innerHTML = `🌀 Corsi-Rosenthal Box: <strong>${state.chamber.filterActive ? 'ON' : 'OFF'}</strong>`;
      });
    }

    if (el.btnChamberToggleWindow) {
      el.btnChamberToggleWindow.addEventListener('click', () => {
        state.chamber.windowSealed = !state.chamber.windowSealed;
        el.btnChamberToggleWindow.classList.toggle('btn-secondary', state.chamber.windowSealed);
        el.btnChamberToggleWindow.classList.toggle('btn-primary', !state.chamber.windowSealed);
        el.btnChamberToggleWindow.innerHTML = `🚪 Window Gap Infiltration: <strong>${state.chamber.windowSealed ? 'SEALED' : 'CRACKED (INFILTRATING)'}</strong>`;
      });
    }

    if (el.btnChamberSpikeCooking) {
      el.btnChamberSpikeCooking.addEventListener('click', () => {
        // Spawn 40 cooking smoke particles from kitchen stove at (380, 280)
        for (let i = 0; i < 40; i++) {
          particles.push({
            x: 380 + (Math.random() - 0.5) * 20,
            y: 280 + (Math.random() - 0.5) * 15,
            vx: (Math.random() * 0.8 + 0.2),
            vy: -(Math.random() * 1.5 + 0.5),
            radius: Math.random() * 3 + 2,
            color: '#ffa502',
            isIndoor: true,
            source: 'cooking'
          });
        }
      });
    }

    if (el.btnChamberKitchenDraft) {
      el.btnChamberKitchenDraft.addEventListener('click', () => {
        kitchenDraftActive = true;
        el.btnChamberKitchenDraft.classList.add('btn-primary');
        el.btnChamberKitchenDraft.classList.remove('btn-secondary');
        el.btnChamberKitchenDraft.innerHTML = '💨 Kitchen Negative Draft: <strong>VENTING OUT</strong>';

        clearTimeout(kitchenDraftTimer);
        kitchenDraftTimer = setTimeout(() => {
          kitchenDraftActive = false;
          el.btnChamberKitchenDraft.classList.remove('btn-primary');
          el.btnChamberKitchenDraft.classList.add('btn-secondary');
          el.btnChamberKitchenDraft.innerHTML = '💨 Kitchen Negative Pressure';
        }, 5000);
      });
    }

    let lastSpawn = Date.now();
    let lastHudUpdate = Date.now();

    function animate() {
      ctx.clearRect(0, 0, W, H);

      // Smoothly decay mouse impulse
      mouseSpeedImpulse *= 0.94;
      if (mouseSpeedImpulse < 0.005) mouseSpeedImpulse = 0;

      // Calculate dynamic fan multiplier combining base speed + mouse velocity impulse
      effectiveFanMultiplier = state.chamber.filterActive 
        ? baseFanSpeed * (1 + mouseSpeedImpulse * 1.7)
        : 0;

      // 1. Backgrounds
      // Outdoor Atmosphere (Deep Smog Atmosphere)
      const outdoorGrad = ctx.createLinearGradient(0, 0, wallX, H);
      outdoorGrad.addColorStop(0, '#100808');
      outdoorGrad.addColorStop(1, '#060303');
      ctx.fillStyle = outdoorGrad;
      ctx.fillRect(0, 0, wallX, H);

      // Inversion Lid Visual in Outdoor Zone
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.fillRect(0, 0, wallX, 50);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('☁️ Nocturnal Inversion Cap (PBL 95m)', 14, 28);

      // Indoor Living Chamber
      const indoorGrad = ctx.createLinearGradient(wallX, 0, W, H);
      indoorGrad.addColorStop(0, '#04090e');
      indoorGrad.addColorStop(1, '#020508');
      ctx.fillStyle = indoorGrad;
      ctx.fillRect(wallX, 0, W - wallX, H);

      // 2. Building Envelope Wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(wallX, 0, 15, H);

      // Window Opening
      if (state.chamber.windowSealed) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(wallX, windowTop, 15, windowBottom - windowTop);
        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('SEALED', wallX - 35, windowTop + 55);
      } else {
        // Cracked window
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(wallX, windowTop, 15, windowBottom - windowTop);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(wallX, windowTop, 15, windowBottom - windowTop);
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('CRACKED', wallX - 42, windowTop + 55);
      }

      // Kitchen Zone Marker
      ctx.fillStyle = '#334155';
      ctx.fillRect(360, 290, 45, 40);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText('🍳 Stove', 362, 314);

      // Negative Draft Vector Arrow if active
      if (kitchenDraftActive) {
        ctx.beginPath();
        ctx.moveTo(370, 240);
        ctx.lineTo(wallX + 10, windowTop + 45);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('💨 Negative Pressure Exhaust Draft', 290, 160);
      }

      // 3. Corsi-Rosenthal Box Unit Visual
      const centerX = filterX + filterW / 2;
      const centerY = filterY + filterH / 2;

      ctx.save();
      // Cube base
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = state.chamber.filterActive ? '#00ff88' : '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(filterX, filterY, filterW, filterH);
      ctx.fillRect(filterX, filterY, filterW, filterH);

      // MERV-13 Filter Pleats Pattern
      ctx.strokeStyle = state.chamber.filterActive ? 'rgba(0, 255, 136, 0.4)' : 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1;
      for (let y = filterY + 10; y < filterY + filterH; y += 8) {
        ctx.beginPath();
        ctx.moveTo(filterX + 4, y);
        ctx.lineTo(filterX + filterW - 4, y);
        ctx.stroke();
      }

      // 15-inch Cardboard Shroud Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = state.chamber.filterActive ? '#00e5ff' : '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spinning Fan Blades - speed scales dynamically with effectiveFanMultiplier!
      if (state.chamber.filterActive) {
        fanAngle += 0.16 * effectiveFanMultiplier;
      }
      ctx.translate(centerX, centerY);
      ctx.rotate(fanAngle);

      // Motion blur trails when fan is spinning fast
      if (effectiveFanMultiplier > 2.0 && state.chamber.filterActive) {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.15)';
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = state.chamber.filterActive ? '#00ff88' : '#94a3b8';
      ctx.lineWidth = 3;
      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 22);
        ctx.stroke();
      }
      ctx.restore();

      // Dynamic Suction Vortex Radius & Glow
      const dynamicSuctionRadius = 240 + Math.min(180, mouseSpeedImpulse * 75 + (baseFanSpeed - 1) * 50);

      if (state.chamber.filterActive) {
        const radGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, dynamicSuctionRadius);
        const glowOpacity = Math.min(0.32, 0.14 + (effectiveFanMultiplier - 1) * 0.08);
        radGrad.addColorStop(0, `rgba(0, 255, 136, ${glowOpacity})`);
        radGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.08)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, dynamicSuctionRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing inward suction streamline rings when mouse speeds up fan
        if (mouseSpeedImpulse > 0.2) {
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
          ctx.setLineDash([4, 6]);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 120 + (Date.now() % 1000) * 0.08, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 11px sans-serif';
        const cadrText = effectiveFanMultiplier > 2.2 ? 'DIY Corsi-Rosenthal Box (⚡ Turbo 580+ CFM)' : 'DIY Corsi-Rosenthal Box (520 CFM CADR)';
        ctx.fillText(cadrText, filterX - 65, filterY - 12);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Corsi-Rosenthal Box (OFF)', filterX - 25, filterY - 12);
      }

      // Interactive mouse guidance sweep visual
      if (isMouseInCanvas && mouseX > wallX + 25) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 16 + mouseSpeedImpulse * 8, 0, Math.PI * 2);
        ctx.strokeStyle = mouseSpeedImpulse > 0.3 ? 'rgba(0, 255, 136, 0.6)' : 'rgba(0, 229, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (mouseSpeedImpulse > 0.2 && state.chamber.filterActive) {
          // Flow vector line towards filter
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(centerX, centerY);
          ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
          ctx.setLineDash([3, 5]);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 4. Particle Generation & Maintenance
      const spawnInterval = effectiveFanMultiplier > 2.0 ? 160 : 250;
      if (Date.now() - lastSpawn > spawnInterval) {
        lastSpawn = Date.now();
        // Keep outdoor particle density steady
        const outdoorCount = particles.filter(p => !p.isIndoor).length;
        if (outdoorCount < 75) {
          particles.push({
            x: Math.random() * (wallX - 20) + 10,
            y: 5 + Math.random() * 20,
            vx: (Math.random() - 0.2) * 0.8,
            vy: Math.random() * 0.9 + 0.3,
            radius: Math.random() * 2.5 + 1.2,
            color: '#ff4757',
            isIndoor: false,
            source: 'smog'
          });
        }

        // Spawn upward filtered clean particle if filter is active (rate scales with fan speed)
        if (state.chamber.filterActive) {
          cleanParticles.push({
            x: centerX + (Math.random() - 0.5) * 35,
            y: filterY - 5,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -(Math.random() * 1.8 + 1.0) * (0.8 + effectiveFanMultiplier * 0.3),
            radius: Math.random() * 2 + 1,
            alpha: 1.0
          });
        }
      }

      // 5. Update and Draw Particles
      let activeIndoorCount = 0;
      const absorptionRadius = 42 + Math.min(24, mouseSpeedImpulse * 9 + (baseFanSpeed - 1) * 8);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Kitchen negative draft effect
        if (kitchenDraftActive && p.isIndoor && p.source === 'cooking') {
          const tX = wallX + 5;
          const tY = (windowTop + windowBottom) / 2;
          p.vx += (tX - p.x) * 0.04;
          p.vy += (tY - p.y) * 0.04;
          if (p.x <= wallX + 15) {
            particles.splice(i, 1);
            continue;
          }
        }

        // Interactive mouse sweep: moving mouse pushes nearby particles towards Corsi-Rosenthal unit
        if (isMouseInCanvas && p.isIndoor && mouseX > wallX + 25) {
          const mdx = mouseX - p.x;
          const mdy = mouseY - p.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < 140 && mouseSpeedImpulse > 0.05) {
            const toFilterX = centerX - p.x;
            const toFilterY = centerY - p.y;
            const toFilterDist = Math.hypot(toFilterX, toFilterY) || 1;
            const sweepForce = (1 - mdist / 140) * (0.35 + mouseSpeedImpulse * 0.45);
            p.vx += (toFilterX / toFilterDist) * sweepForce;
            p.vy += (toFilterY / toFilterDist) * sweepForce;
          }
        }

        // Filter suction vortex effect on indoor particles - accelerated by effectiveFanMultiplier
        if (state.chamber.filterActive && p.isIndoor) {
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < dynamicSuctionRadius) {
            // Suction pull force strengthens significantly with mouse-driven fan speed
            const pull = Math.min(6.5, (38 / (dist + 6)) * effectiveFanMultiplier);
            p.vx += (dx / dist) * pull * 0.22;
            p.vy += (dy / dist) * pull * 0.22;
          }

          // Rapid absorption into MERV-13 media
          if (dist < absorptionRadius) {
            particles.splice(i, 1);
            continue;
          }
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wall & Window interaction
        if (!p.isIndoor) {
          // In outdoor zone
          if (p.x >= wallX - p.radius) {
            if (!state.chamber.windowSealed && p.y >= windowTop && p.y <= windowBottom) {
              // Infiltrates into room
              p.isIndoor = true;
              p.x = wallX + 16;
              p.vx = Math.abs(p.vx) * 0.7;
            } else {
              // Bounces off sealed wall
              p.x = wallX - p.radius;
              p.vx = -Math.abs(p.vx) * 0.7;
            }
          }
          if (p.x < p.radius) { p.x = p.radius; p.vx = Math.abs(p.vx); }
          if (p.y < p.radius) { p.y = p.radius; p.vy = Math.abs(p.vy); }
          if (p.y > H - p.radius) { p.y = H - p.radius; p.vy = -Math.abs(p.vy); }
        } else {
          // In indoor zone
          activeIndoorCount++;
          if (p.x < wallX + 18) { p.x = wallX + 18; p.vx = Math.abs(p.vx) * 0.7; }
          if (p.x > W - p.radius) { p.x = W - p.radius; p.vx = -Math.abs(p.vx) * 0.7; }
          if (p.y < p.radius) { p.y = p.radius; p.vy = Math.abs(p.vy) * 0.7; }
          if (p.y > H - p.radius) { p.y = H - p.radius; p.vy = -Math.abs(p.vy) * 0.5; }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Draw clean air particles
      for (let c = cleanParticles.length - 1; c >= 0; c--) {
        const cp = cleanParticles[c];
        cp.x += cp.vx;
        cp.y += cp.vy;
        cp.alpha -= 0.015;

        if (cp.alpha <= 0 || cp.y < 20) {
          cleanParticles.splice(c, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${cp.alpha.toFixed(2)})`;
        ctx.fill();
      }

      // 6. HUD updates (throttled every 250ms)
      if (Date.now() - lastHudUpdate > 250) {
        lastHudUpdate = Date.now();
        const outdoor = state.currentPM25 || 295;
        let estimatedIndoor = state.chamber.filterActive 
          ? Math.max(3.5, Math.min(32, Math.round(activeIndoorCount * 0.8)))
          : Math.max(45, Math.round(activeIndoorCount * 2.2));

        if (!state.chamber.windowSealed) estimatedIndoor += 25;

        const eff = Math.max(0, Math.min(99.2, ((1 - estimatedIndoor / outdoor) * 100))).toFixed(1);

        if (el.hudOutdoorPM25) el.hudOutdoorPM25.textContent = `${outdoor} µg/m³`;
        if (el.hudIndoorPM25) el.hudIndoorPM25.textContent = `${estimatedIndoor} µg/m³`;
        if (el.hudEfficiency) el.hudEfficiency.textContent = `${eff}%`;

        // Real-time Fan RPM HUD update
        if (el.hudFanRpm) {
          if (!state.chamber.filterActive) {
            el.hudFanRpm.textContent = '0 RPM (OFF)';
          } else {
            const calculatedRpm = Math.round(effectiveFanMultiplier * 1160);
            let speedTier = 'Med';
            if (effectiveFanMultiplier >= 2.8) speedTier = 'Turbo Vortex ⚡⚡';
            else if (effectiveFanMultiplier >= 2.0) speedTier = 'Turbo ⚡';
            else if (effectiveFanMultiplier >= 1.4) speedTier = 'High';
            else if (effectiveFanMultiplier < 0.95) speedTier = 'Low';
            el.hudFanRpm.textContent = `${calculatedRpm.toLocaleString()} RPM (${speedTier})`;
          }
        }

        if (el.hudFanRpmPill) {
          el.hudFanRpmPill.classList.toggle('turbo-active', effectiveFanMultiplier >= 2.0);
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  function setupListeners() {
    el.citySelect.addEventListener('change', (e) => {
      state.currentCity = e.target.value;
      loadAQIData();
      loadInversionData();
      runSimulation();
      loadRoutine();
      loadImpact();
      announce(`Updated location to ${state.currentCity}`);
    });

    el.roomVolumeSlider.addEventListener('input', (e) => {
      el.roomVolumeDisplay.textContent = `${e.target.value} m³ (~${Math.round(e.target.value * 4)} sq ft)`;
    });

    el.btnRunSimulation.addEventListener('click', runSimulation);

    el.householdChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-val');
        chip.classList.toggle('active');
        if (state.selectedHousehold.includes(val)) {
          state.selectedHousehold = state.selectedHousehold.filter(v => v !== val);
        } else {
          state.selectedHousehold.push(val);
        }
      });
    });

    el.btnGenerateRoutine.addEventListener('click', loadRoutine);
    el.btnRecalcImpact.addEventListener('click', loadImpact);
  }

  async function init() {
    setupNavigation();
    setupAccessibility();
    setupListeners();
    setupChat();
    setupTaskAutomation();
    setupAutomationExporters();
    initCADRCalculator();
    initAeroChamberSimulator();

    await loadAQIData();
    await loadInversionData();
    await runSimulation();
    await loadRoutine();
    await loadHacks();
    await loadCommunityGrid();
    await loadImpact();
    await loadTasksFeed();
    await loadAutomations();

    console.log('AeroShield AI 2.0 Cyber Black-Green-Blue Initialized.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
