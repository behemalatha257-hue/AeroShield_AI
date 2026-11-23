# 🏛️ AeroShield AI - System Architecture & Scientific Models

## Architectural Overview

AeroShield AI is architected as an autonomous, decoupled full-stack platform uniting environmental aerosol physics, meteorological boundary layer simulations, multi-agent generative AI, and smart home IoT automation.

```
+---------------------------------------------------------------------------------------+
|                                    AERODYNAMICS FRONTEND                              |
|   (Semantic HTML5 / Responsive CSS / Native HTML5 Canvas Charts / Web Speech TTS)    |
+-------------------------------------------+-------------------------------------------+
                                            │ REST / JSON (Sub-50ms)
                                            ▼
+---------------------------------------------------------------------------------------+
|                               AEROSHIELD BACKEND ENGINE                               |
|                     (Express.js / Node.js 20+ / Helmet / RateLimiter)                 |
+---------------------+---------------------+---------------------+---------------------+
|   IAQ PHYSICS       |  INVERSION DYNAMICS |    IMPACT & WHO     |  MULTI-AGENT GENAI  |
|   SERVICE           |  SERVICE            |    EXPLAINABILITY   |  COPILOT            |
|                     |                     |                     |                     |
| Mass Balance ODE    | Boundary Layer H(t) | Lung Dose (µg)      | Google Gemini 1.5   |
| CADR Dispersion     | Thermal Inversion   | Cigarette Equiv     | Autonomous Local    |
| Infiltration ACH    | Golden Air Window   | CO2e Offsets        | Generative Engine   |
+---------------------+---------------------+---------------------+---------------------+
                                            │
                                            ▼
+---------------------------------------------------------------------------------------+
|                                   INFRASTRUCTURE                                      |
|          In-Memory LRU/TTL Cache  •  Home Assistant YAML  •  Docker Container         |
+---------------------------------------------------------------------------------------+
```

---

## 1. Scientific Formulations & Physical Equations

### A. Non-Steady-State Aerosol Mass Balance Equation
Indoor particulate concentration over time is modeled using the classical mass-balance differential equation:

$$\frac{dC_{in}(t)}{dt} = P \cdot a \cdot C_{out}(t) + \frac{S(t)}{V} - \lambda \cdot C_{in}(t)$$

Where:
- $C_{in}(t)$ = Indoor PM2.5 concentration at time $t$ ($\mu g/m^3$).
- $C_{out}(t)$ = Outdoor PM2.5 concentration at time $t$ ($\mu g/m^3$).
- $P$ = Building envelope penetration efficiency factor ($0.50 - 0.80$).
- $a$ = Air exchange rate per hour ($\text{ACH}, h^{-1}$).
- $S(t)$ = Indoor source generation rate ($\mu g/h$), e.g., cooking or incense.
- $V$ = Room volume ($m^3$).
- $\lambda$ = Total particulate loss rate ($h^{-1}$), defined as:

$$\lambda = a + k + \frac{CADR}{V}$$

Where $k$ is the natural surface deposition rate ($\approx 0.25 h^{-1}$) and $CADR$ is the clean air delivery rate ($m^3/h$).

**Analytical Solution:**
For constant conditions over discrete time interval $\Delta t$:
$$C_{in}(t + \Delta t) = C_{in}(t) e^{-\lambda \Delta t} + C_{ss} \left(1 - e^{-\lambda \Delta t}\right)$$

Where steady-state concentration $C_{ss}$ is:
$$C_{ss} = \frac{P \cdot a \cdot C_{out} + \frac{S}{V}}{\lambda}$$

---

### B. Planetary Boundary Layer & Thermal Inversion Modeling
The Planetary Boundary Layer height $H_{pbl}(t)$ determines the volume of atmosphere available for diluting urban emissions. Under winter nocturnal clear skies, strong radiative cooling sets up a surface-based temperature inversion:

$$H_{pbl}(t) = H_{min} + \Delta H \cdot \sin^2\left(\frac{\pi (t - t_{sunrise})}{2 \cdot (t_{peak} - t_{sunrise})}\right) \quad \text{for } t_{sunrise} \le t \le t_{sunset}$$

- $H_{min} \approx 85 - 120\text{ m}$ (Nighttime cold pool).
- $H_{peak} \approx 1100 - 1400\text{ m}$ (Solar convective mixing peak at 13:00–15:00).
- **The Golden Window**: Identified algorithmically when $H_{pbl}(t) \ge 900\text{ m}$ and convective upward flux breaks the inversion cap.

---

### C. Personal Lung Dose Spared & Berkeley Earth Equivalence
The total particulate dose inhaled by household members across exposure intervals:

$$\text{Inhaled Dose } (\mu g) = \sum_{i} C_i \times V_E \times \Delta t_i \times (1 - \eta_{mask})$$

Where:
- $V_E$ = Respiration minute ventilation rate ($0.08 m^3/h$ infant, $0.35 m^3/h$ child, $0.45 m^3/h$ adult resting, $1.50 m^3/h$ commuter).
- $\eta_{mask}$ = Mask filtration efficiency ($0.92$ for fitted N95/FFP2, $0.15$ for cloth).

**Berkeley Earth Cigarette Equivalence Rule:**
$$\text{Cigarette Equivalents Avoided} = \frac{\Delta \bar{C}_{PM2.5} \times \text{Days}}{22 \mu g/m^3}$$

---

## 2. Multi-Agent GenAI Architecture

The conversational engine implements a **Domain-Specialized Multi-Agent Orchestrator**:

1. **Dr. Aero (Family Health Specialist)**:
   - Evaluates infant respiratory surface area ratios.
   - Prescribes mucosal soothing and N95 fit guidance.
2. **Aria Routine (Eco-Logistics Architect)**:
   - Schedules vehicle travel around diurnal traffic/inversion peaks.
   - Guides car AC internal recirculation settings.
3. **Engineer Jack (IAQ & DIY Filtration Physicist)**:
   - Explains fan blade backdraft vortices and cardboard fan shroud aerodynamics.
   - Optimizes kitchen exhaust negative-pressure drafts.
4. **Maya Civic (Community Action Coordinator)**:
   - Mobilizes school idle-free zones and neighborhood compost depots.

### Resilient Hybrid Inference:
- If a valid `GEMINI_API_KEY` is present, queries are routed to Google's Gemini 1.5 Flash model with specialized system prompt wrappers.
- If no key is set or the network is offline, the internal **Autonomous Generative Engine** synthesizes custom responses using embedded physical heuristics and epidemiological databases.

---

## 3. Autonomous IoT & Smart Home Integration

The automation engine translates atmospheric risk triggers into smart home protocols:
1. **Nocturnal Inversion Shield Trigger**: At 21:00 or when outdoor $PM_{2.5} > 200 \mu g/m^3$ with $H_{pbl} < 120\text{m}$, switches on bedroom air purifiers via smart plugs and closes smart dampers.
2. **Golden Window Notification**: At 13:00, triggers a smart speaker chime announcing safe cross-ventilation.
3. **Export Formats**: Home Assistant YAML automations, IFTTT JSON applets, and Google Home routine specifications.
