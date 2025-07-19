import { Meter, Reading } from '../types';

// API-Schnittstelle für externe Zugriffe (z.B. Alexa Skills)
export class MeterAPI {
  private static getStoredData<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  // Alle Zähler abrufen
  static getAllMeters(): Meter[] {
    const meters = this.getStoredData<Meter[]>('meters') || [];
    return meters.map(meter => ({
      ...meter,
      createdAt: new Date(meter.createdAt),
      lastModifiedAt: new Date(meter.lastModifiedAt),
      readings: meter.readings.map(reading => ({
        ...reading,
        date: new Date(reading.date),
        createdAt: new Date(reading.createdAt)
      }))
    }));
  }

  // Zähler nach ID abrufen
  static getMeterById(id: string): Meter | null {
    const meters = this.getAllMeters();
    return meters.find(meter => meter.id === id) || null;
  }

  // Zähler nach Nummer abrufen
  static getMeterByNumber(number: string): Meter | null {
    const meters = this.getAllMeters();
    return meters.find(meter => meter.number === number) || null;
  }

  // Aktuelle Ablesung eines Zählers abrufen
  static getCurrentReading(meterId: string): Reading | null {
    const meter = this.getMeterById(meterId);
    if (!meter || meter.readings.length === 0) return null;
    
    const sortedReadings = meter.readings.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedReadings[0];
  }

  // Verbrauch zwischen zwei Daten berechnen
  static getConsumptionBetweenDates(meterId: string, startDate: Date, endDate: Date): number {
    const meter = this.getMeterById(meterId);
    if (!meter) return 0;

    const readings = meter.readings
      .filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate >= startDate && readingDate <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (readings.length < 2) return 0;
    
    return readings[readings.length - 1].value - readings[0].value;
  }

  // Monatlicher Verbrauch
  static getMonthlyConsumption(meterId: string, year: number, month: number): number {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return this.getConsumptionBetweenDates(meterId, startDate, endDate);
  }

  // Jährlicher Verbrauch
  static getYearlyConsumption(meterId: string, year: number): number {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    return this.getConsumptionBetweenDates(meterId, startDate, endDate);
  }

  // Durchschnittlicher täglicher Verbrauch
  static getAverageDailyConsumption(meterId: string, days: number = 30): number {
    const meter = this.getMeterById(meterId);
    if (!meter || meter.readings.length < 2) return 0;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const consumption = this.getConsumptionBetweenDates(meterId, startDate, endDate);
    return consumption / days;
  }

  // Zähler nach Kategorie filtern
  static getMetersByCategory(category: string): Meter[] {
    const meters = this.getAllMeters();
    return meters.filter(meter => meter.category.toLowerCase() === category.toLowerCase());
  }

  // Zusammenfassung aller Zähler für Alexa
  static getMeterSummary(): {
    totalMeters: number;
    activeMeters: number;
    totalReadings: number;
    categories: string[];
    meters: Array<{
      id: string;
      number: string;
      description: string;
      category: string;
      currentValue: number | null;
      lastReadingDate: string | null;
    }>;
  } {
    const meters = this.getAllMeters();
    
    return {
      totalMeters: meters.length,
      activeMeters: meters.filter(m => m.readings.length > 0).length,
      totalReadings: meters.reduce((sum, m) => sum + m.readings.length, 0),
      categories: [...new Set(meters.map(m => m.category))],
      meters: meters.map(meter => {
        const currentReading = this.getCurrentReading(meter.id);
        return {
          id: meter.id,
          number: meter.number,
          description: meter.description,
          category: meter.category,
          currentValue: currentReading?.value || null,
          lastReadingDate: currentReading?.date.toISOString() || null
        };
      })
    };
  }

  // Sprachfreundliche Antworten für Alexa
  static getVoiceResponse(query: string): string {
    const meters = this.getAllMeters();
    const summary = this.getMeterSummary();

    // Einfache Spracherkennung für häufige Anfragen
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('wie viele zähler') || lowerQuery.includes('anzahl zähler')) {
      return `Sie haben ${summary.totalMeters} Zähler registriert, davon sind ${summary.activeMeters} aktiv.`;
    }

    if (lowerQuery.includes('strom') || lowerQuery.includes('electricity')) {
      const electricityMeters = this.getMetersByCategory('electricity');
      if (electricityMeters.length === 0) {
        return 'Sie haben keine Stromzähler registriert.';
      }
      const currentReading = this.getCurrentReading(electricityMeters[0].id);
      return `Ihr Stromzähler ${electricityMeters[0].number} zeigt aktuell ${currentReading?.value || 'keine Ablesung'} an.`;
    }

    if (lowerQuery.includes('wasser') || lowerQuery.includes('water')) {
      const waterMeters = this.getMetersByCategory('water');
      if (waterMeters.length === 0) {
        return 'Sie haben keine Wasserzähler registriert.';
      }
      const currentReading = this.getCurrentReading(waterMeters[0].id);
      return `Ihr Wasserzähler ${waterMeters[0].number} zeigt aktuell ${currentReading?.value || 'keine Ablesung'} an.`;
    }

    if (lowerQuery.includes('gas')) {
      const gasMeters = this.getMetersByCategory('gas');
      if (gasMeters.length === 0) {
        return 'Sie haben keine Gaszähler registriert.';
      }
      const currentReading = this.getCurrentReading(gasMeters[0].id);
      return `Ihr Gaszähler ${gasMeters[0].number} zeigt aktuell ${currentReading?.value || 'keine Ablesung'} an.`;
    }

    if (lowerQuery.includes('verbrauch heute') || lowerQuery.includes('heutiger verbrauch')) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let response = 'Heutiger Verbrauch: ';
      const categories = ['electricity', 'water', 'gas'];
      
      categories.forEach(category => {
        const categoryMeters = this.getMetersByCategory(category);
        if (categoryMeters.length > 0) {
          const consumption = this.getConsumptionBetweenDates(categoryMeters[0].id, yesterday, today);
          response += `${category === 'electricity' ? 'Strom' : category === 'water' ? 'Wasser' : 'Gas'}: ${consumption.toFixed(2)}, `;
        }
      });
      
      return response.slice(0, -2) + '.';
    }

    return 'Entschuldigung, ich konnte Ihre Anfrage nicht verstehen. Sie können nach Zählerständen, Verbrauch oder der Anzahl Ihrer Zähler fragen.';
  }
}

// REST-API Endpunkte für externe Anwendungen
export const createMeterAPIEndpoints = () => {
  // Simulierte REST-API Endpunkte
  const endpoints = {
    // GET /api/meters
    getAllMeters: () => ({
      status: 200,
      data: MeterAPI.getAllMeters()
    }),

    // GET /api/meters/:id
    getMeter: (id: string) => {
      const meter = MeterAPI.getMeterById(id);
      return meter 
        ? { status: 200, data: meter }
        : { status: 404, error: 'Meter not found' };
    },

    // GET /api/meters/number/:number
    getMeterByNumber: (number: string) => {
      const meter = MeterAPI.getMeterByNumber(number);
      return meter 
        ? { status: 200, data: meter }
        : { status: 404, error: 'Meter not found' };
    },

    // GET /api/meters/:id/current-reading
    getCurrentReading: (id: string) => {
      const reading = MeterAPI.getCurrentReading(id);
      return reading 
        ? { status: 200, data: reading }
        : { status: 404, error: 'No readings found' };
    },

    // GET /api/meters/:id/consumption?start=YYYY-MM-DD&end=YYYY-MM-DD
    getConsumption: (id: string, startDate: string, endDate: string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const consumption = MeterAPI.getConsumptionBetweenDates(id, start, end);
      return { status: 200, data: { consumption, startDate, endDate } };
    },

    // GET /api/summary
    getSummary: () => ({
      status: 200,
      data: MeterAPI.getMeterSummary()
    }),

    // POST /api/voice-query
    voiceQuery: (query: string) => ({
      status: 200,
      data: {
        query,
        response: MeterAPI.getVoiceResponse(query)
      }
    })
  };

  return endpoints;
};

// Alexa Skill Integration Helper
export const AlexaSkillHelper = {
  // Intent Handler für Alexa Skills
  handleIntent: (intentName: string, slots: Record<string, any> = {}) => {
    switch (intentName) {
      case 'GetMeterCountIntent':
        const summary = MeterAPI.getMeterSummary();
        return {
          speechText: `Sie haben ${summary.totalMeters} Zähler registriert, davon sind ${summary.activeMeters} aktiv.`,
          repromptText: 'Möchten Sie Details zu einem bestimmten Zähler erfahren?'
        };

      case 'GetCurrentReadingIntent':
        const meterType = slots.MeterType?.value?.toLowerCase();
        if (meterType) {
          const meters = MeterAPI.getMetersByCategory(meterType);
          if (meters.length > 0) {
            const reading = MeterAPI.getCurrentReading(meters[0].id);
            return {
              speechText: `Ihr ${meterType}zähler ${meters[0].number} zeigt aktuell ${reading?.value || 'keine Ablesung'} an.`,
              repromptText: 'Möchten Sie den Verbrauch eines anderen Zählers erfahren?'
            };
          }
        }
        return {
          speechText: 'Ich konnte keinen passenden Zähler finden.',
          repromptText: 'Welchen Zähler möchten Sie abfragen?'
        };

      case 'GetConsumptionIntent':
        const period = slots.Period?.value?.toLowerCase();
        const category = slots.Category?.value?.toLowerCase();
        
        if (category && period) {
          const meters = MeterAPI.getMetersByCategory(category);
          if (meters.length > 0) {
            let consumption = 0;
            const today = new Date();
            
            if (period === 'heute' || period === 'today') {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              consumption = MeterAPI.getConsumptionBetweenDates(meters[0].id, yesterday, today);
            } else if (period === 'monat' || period === 'month') {
              consumption = MeterAPI.getMonthlyConsumption(meters[0].id, today.getFullYear(), today.getMonth() + 1);
            }
            
            return {
              speechText: `Ihr ${category}verbrauch ${period === 'heute' ? 'heute' : 'diesen Monat'} beträgt ${consumption.toFixed(2)} Einheiten.`,
              repromptText: 'Möchten Sie den Verbrauch eines anderen Zeitraums erfahren?'
            };
          }
        }
        return {
          speechText: 'Ich konnte den Verbrauch nicht ermitteln.',
          repromptText: 'Für welchen Zähler und Zeitraum möchten Sie den Verbrauch erfahren?'
        };

      default:
        return {
          speechText: 'Entschuldigung, ich habe das nicht verstanden.',
          repromptText: 'Sie können nach Zählerständen, Verbrauch oder der Anzahl Ihrer Zähler fragen.'
        };
    }
  },

  // Webhook für Alexa Skills Kit
  createWebhookResponse: (intentName: string, slots: Record<string, any> = {}) => {
    const response = AlexaSkillHelper.handleIntent(intentName, slots);
    
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: response.speechText
        },
        reprompt: {
          outputSpeech: {
            type: 'PlainText',
            text: response.repromptText
          }
        },
        shouldEndSession: false
      }
    };
  }
};