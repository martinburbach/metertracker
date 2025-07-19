import { Meter, Reading, ConsumptionData } from '../types';
import { format, subMonths, eachMonthOfInterval, startOfMonth, endOfMonth, parseISO, isThisMonth } from 'date-fns';

export const calculateDifference = (readings: Reading[], newValue: number): number => {
  if (readings.length === 0) return 0;
  const lastReading = readings[readings.length - 1];
  return newValue - lastReading.value;
};

export const generateMonthlyConsumption = (meter: Meter): ConsumptionData[] => {
  const readings = meter.readings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (readings.length < 2) {
    return generateForecastedData(readings);
  }

  const monthlyData: ConsumptionData[] = [];
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end: new Date()
  });

  months.forEach(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const isCurrentMonth = isThisMonth(month);
    
    const monthReadings = readings.filter(r => {
      const readingDate = new Date(r.date);
      return readingDate >= monthStart && readingDate <= monthEnd;
    });

    if (monthReadings.length >= 2) {
      const consumption = monthReadings[monthReadings.length - 1].value - monthReadings[0].value;
      monthlyData.push({
        date: format(month, 'MMM yyyy'),
        consumption,
        isForecasted: false,
        isCurrent: isCurrentMonth
      });
    } else {
      // Generate forecasted data based on average
      const avgConsumption = calculateAverageConsumption(readings);
      monthlyData.push({
        date: format(month, 'MMM yyyy'),
        consumption: avgConsumption,
        isForecasted: true,
        isCurrent: isCurrentMonth
      });
    }
  });

  return monthlyData;
};

const calculateAverageConsumption = (readings: Reading[]): number => {
  if (readings.length < 2) return 0;
  
  const totalConsumption = readings.reduce((sum, reading, index) => {
    if (index === 0) return sum;
    return sum + (reading.value - readings[index - 1].value);
  }, 0);
  
  return totalConsumption / (readings.length - 1);
};

const generateForecastedData = (readings: Reading[]): ConsumptionData[] => {
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end: new Date()
  });

  const avgConsumption = readings.length > 0 ? 50 : 0; // Default estimated consumption

  return months.map(month => ({
    date: format(month, 'MMM yyyy'),
    consumption: avgConsumption,
    isForecasted: true,
    isCurrent: isThisMonth(month)
  }));
};

export const getDailyConsumption = (meter: Meter): number => {
  const readings = meter.readings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (readings.length < 2) return 0;
  
  const latest = readings[0];
  const previous = readings[1];
  
  const daysDiff = Math.max(1, Math.ceil(
    (new Date(latest.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24)
  ));
  
  return (latest.value - previous.value) / daysDiff;
};