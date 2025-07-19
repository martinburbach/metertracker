import { Reminder } from '../types';

export const calculateNextNotification = (type: Reminder['type'], lastNotified?: Date): Date => {
  const now = new Date();
  const baseDate = lastNotified || now;
  
  switch (type) {
    case 'daily':
      const nextDay = new Date(baseDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
      
    case 'monthly':
      const nextMonth = new Date(baseDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
      
    case 'yearly':
      const nextYear = new Date(baseDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      return nextYear;
      
    default:
      return now;
  }
};

export const checkDueReminders = (reminders: Reminder[]): Reminder[] => {
  const now = new Date();
  return reminders.filter(reminder => 
    reminder.enabled && 
    reminder.nextNotification <= now
  );
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title: string, body: string, icon?: string): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico'
    });
  }
};