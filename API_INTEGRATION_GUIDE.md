# 📡 AeroShield AI - REST API Integration Guide

## Base URL
```
http://localhost:3000/api
```

---

## Endpoint Catalog

| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/aqi/current?city=DELHI` | Returns live AQI, pollutant concentrations, and smog causes | 150 / 15m |
| `GET` | `/inversion/forecast?city=Delhi-NCR` | 24-hour planetary boundary layer & inversion forecast | 150 / 15m |
| `POST` | `/iaq/simulate` | Solves aerosol mass balance differential equation | 150 / 15m |
| `POST` | `/routines/generate` | Generates tailored family schedule & clean transitions | 150 / 15m |
| `GET` | `/hacks/catalog` | Peer-reviewed DIY blueprints & Corsi-Rosenthal economics | 150 / 15m |
| `GET` | `/community/grid` | Community defense syndicates & collective offsets | 150 / 15m |
| `POST` | `/community/join` | Join an active neighborhood commute/defense syndicate | 150 / 15m |
| `POST` | `/community/pledge` | Sign a community clean-air action pledge | 150 / 15m |
| `POST` | `/impact/calculate` | Transparent personal lung dose & community $CO_2$ offsets | 150 / 15m |
| `POST` | `/assistant/chat` | Multi-agent GenAI conversational copilot | 45 / 15m |
| `POST` | `/automation/evaluate` | Evaluates autonomous triggers & smart home commands | 150 / 15m |
| `GET` | `/automation/home-assistant` | Exports ready-to-import Home Assistant YAML | 150 / 15m |
| `GET` | `/health` | Server uptime, memory telemetry & cache statistics | Unlimited |

---

## Detailed Endpoint Examples

### 1. GET `/aqi/current`
**cURL:**
```bash
curl -X GET "http://localhost:3000/api/aqi/current?city=DELHI"
```
**Response (200 OK):**
```json
{
  "location": "Delhi-NCR",
  "country": "India",
  "region": "Indo-Gangetic Plain",
  "currentAQI": 365,
  "category": "Hazardous (Severe Smog)",
  "color": "#7E22CE",
  "pollutants": {
    "pm25": { "value": 295, "unit": "µg/m³", "whoLimitRatio": 19.7 },
    "pm10": { "value": 420, "unit": "µg/m³", "whoLimitRatio": 9.3 },
    "no2": { "value": 103, "unit": "µg/m³" },
    "so2": { "value": 53, "unit": "µg/m³" },
    "co": { "value": 3.54, "unit": "mg/m³" }
  },
  "primaryCauses": [
    "Thermal Inversion",
    "Vehicular Congestion",
    "Stubble Smoke Trapping",
    "Biomass Domestic Heating"
  ],
  "optimalVentilationWindow": "13:00 - 15:30"
}
```

---

### 2. POST `/iaq/simulate`
**cURL:**
```bash
curl -X POST "http://localhost:3000/api/iaq/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "roomVolumeM3": 45,
    "filterType": "CORSI_ROSENTHAL_20INCH",
    "windowStatus": "scheduled",
    "cookingEvent": true,
    "wetMopping": true,
    "humidityControl": true
  }'
```
**Response (200 OK):**
```json
{
  "roomVolumeM3": 45,
  "filterType": "CORSI_ROSENTHAL_20INCH",
  "cadrM3h": 850,
  "averageIndoorPM25": 18,
  "baselineIndoorPM25": 168,
  "pm25ReductionPercent": 89,
  "whoLimitComparison": {
    "who24hLimit": 15,
    "isWithinWhoLimit": false,
    "timesAboveWhoLimit": 1.2
  },
  "timeToWHOStandardMinutes": 28,
  "hourlyTimeline": [
    { "hour": "00:00", "outdoorPM25": 275, "indoorPM25WithShield": 19, "indoorPM25Unshielded": 172 },
    { "hour": "01:00", "outdoorPM25": 282, "indoorPM25WithShield": 18, "indoorPM25Unshielded": 178 }
  ]
}
```

---

### 3. POST `/assistant/chat`
**cURL:**
```bash
curl -X POST "http://localhost:3000/api/assistant/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I build a Corsi-Rosenthal box and why does the fan shroud matter?",
    "agentType": "iaq",
    "location": "Delhi-NCR"
  }'
```
**Response (200 OK):**
```json
{
  "agent": {
    "type": "iaq",
    "name": "Engineer Jack",
    "title": "IAQ & DIY Filtration Physics Specialist"
  },
  "message": "How do I build a Corsi-Rosenthal box and why does the fan shroud matter?",
  "response": "**Hello from Engineer Jack...** The shroud blocks recirculating blade vortexes, increasing CADR by 40-50% to over 520 CFM...",
  "provider": "autonomous-generative-engine",
  "timestamp": "2026-11-22T22:30:00.000Z"
}
```

---

### 4. GET `/health`
**cURL:**
```bash
curl -X GET "http://localhost:3000/api/health"
```
**Response (200 OK):**
```json
{
  "status": "HEALTHY",
  "service": "AeroShield AI",
  "version": "1.0.0",
  "uptimeSeconds": 145,
  "memoryUsageMB": {
    "rss": 31.85,
    "heapUsed": 14.50,
    "heapTotal": 22.50
  },
  "cache": {
    "size": 12,
    "hits": 45,
    "misses": 6,
    "hitRate": "88.2%"
  }
}
```
