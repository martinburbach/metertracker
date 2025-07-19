# MeterTracker - Intelligente Zählerverwaltung

Eine moderne, responsive Webanwendung zur Verwaltung von Zählerständen mit API-Schnittstelle für externe Integrationen wie Alexa Skills.

## Features

### 📱 Responsive Design
- **Mobile-First Ansatz**: Optimiert für Smartphones, Tablets und Desktop
- **Adaptive Navigation**: Automatische Anpassung der Navigation an die Bildschirmgröße
- **Touch-freundlich**: Große Buttons und optimierte Bedienelemente für Touch-Geräte
- **Flexible Layouts**: Grid-Systeme passen sich automatisch an verfügbaren Platz an

### 🔌 API-Schnittstelle
- **Globale JavaScript API**: Zugriff über `window.MeterTrackerAPI`
- **Einfache Query-Funktion**: `window.getMeterData(query)` für schnelle Abfragen
- **Alexa Skill Integration**: Vorgefertigte Intent-Handler für Amazon Alexa
- **REST-ähnliche Endpunkte**: Strukturierte Datenabfrage für externe Anwendungen

### 📊 Zählerverwaltung
- **Multi-Kategorie Support**: Strom, Wasser, Gas, Heizung, etc.
- **Verbrauchsanalyse**: Automatische Berechnung von Tages-, Monats- und Jahresverbrauch
- **Interaktive Charts**: Bar- und Liniendiagramme mit Chart.js
- **Erinnerungssystem**: Automatische Benachrichtigungen für Ablesetermine

### 🌐 Mehrsprachigkeit
- **Deutsch & Englisch**: Vollständige Übersetzung aller Texte
- **Dynamischer Sprachwechsel**: Sofortige Umstellung ohne Neuladen
- **Lokalisierte Datumsformate**: Angepasst an jeweilige Sprache

## API-Nutzung

### JavaScript API (Browser)

```javascript
// Alle Zähler abrufen
const meters = window.MeterTrackerAPI.getAllMeters();

// Zähler nach Nummer finden
const meter = window.MeterTrackerAPI.getMeterByNumber('12345');

// Aktuelle Ablesung abrufen
const reading = window.MeterTrackerAPI.getCurrentReading(meterId);

// Verbrauch berechnen
const consumption = window.MeterTrackerAPI.getMonthlyConsumption(meterId, 2024, 12);

// Übersicht für Dashboards
const summary = window.MeterTrackerAPI.getMeterSummary();
```

### Einfache Query-Funktion

```javascript
// Natürliche Sprache Abfragen
window.getMeterData('alle zähler');
window.getMeterData('summary');
window.getMeterData('12345'); // Zählernummer
window.getMeterData('voice wie viele zähler habe ich?');
```

### Alexa Skill Integration

```javascript
// Intent Handler für Alexa Skills
import { AlexaSkillHelper } from './src/api/meterApi';

// Zähleranzahl abfragen
const response = AlexaSkillHelper.handleIntent('GetMeterCountIntent');

// Aktuellen Stand abfragen
const response = AlexaSkillHelper.handleIntent('GetCurrentReadingIntent', {
  MeterType: { value: 'electricity' }
});

// Verbrauch abfragen
const response = AlexaSkillHelper.handleIntent('GetConsumptionIntent', {
  Category: { value: 'water' },
  Period: { value: 'month' }
});
```

## Responsive Breakpoints

```css
/* Mobile First */
xs: 475px   /* Extra kleine Geräte */
sm: 640px   /* Kleine Geräte (Smartphones) */
md: 768px   /* Mittlere Geräte (Tablets) */
lg: 1024px  /* Große Geräte (Laptops) */
xl: 1280px  /* Extra große Geräte (Desktops) */
```

## Alexa Skill Beispiele

### Intent Schema (für Amazon Developer Console)

```json
{
  "intents": [
    {
      "name": "GetMeterCountIntent",
      "samples": [
        "wie viele zähler habe ich",
        "anzahl meiner zähler",
        "how many meters do I have"
      ]
    },
    {
      "name": "GetCurrentReadingIntent",
      "slots": [
        {
          "name": "MeterType",
          "type": "METER_TYPES"
        }
      ],
      "samples": [
        "wie ist der aktuelle {MeterType} stand",
        "zeige mir den {MeterType} zähler",
        "what is my current {MeterType} reading"
      ]
    },
    {
      "name": "GetConsumptionIntent",
      "slots": [
        {
          "name": "Category",
          "type": "METER_TYPES"
        },
        {
          "name": "Period",
          "type": "TIME_PERIODS"
        }
      ],
      "samples": [
        "wie viel {Category} habe ich {Period} verbraucht",
        "mein {Category} verbrauch {Period}",
        "how much {Category} did I use {Period}"
      ]
    }
  ]
}
```

### Slot Types

```json
{
  "METER_TYPES": [
    "strom", "electricity", "wasser", "water", "gas", "heizung", "heating"
  ],
  "TIME_PERIODS": [
    "heute", "today", "monat", "month", "jahr", "year"
  ]
}
```

## Installation & Setup

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Für Produktion bauen
npm run build
```

## Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS (Responsive Design)
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Internationalisierung**: react-i18next
- **Build Tool**: Vite
- **Datenbank**: LocalStorage (Client-side)

## Browser-Kompatibilität

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

## Externe Integration Beispiele

### Webhook für Smart Home Systeme

```javascript
// Daten für Home Assistant, OpenHAB, etc.
fetch('http://localhost:3000/api/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'get_meter_data',
    meter_id: '12345'
  })
});
```

### IFTTT Integration

```javascript
// Trigger für IFTTT Webhooks
const triggerIFTTT = (meterData) => {
  fetch('https://maker.ifttt.com/trigger/meter_reading/with/key/YOUR_KEY', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      value1: meterData.currentValue,
      value2: meterData.consumption,
      value3: meterData.meterNumber
    })
  });
};
```

## Lizenz

MIT License - Siehe LICENSE Datei für Details.