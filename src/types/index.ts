export interface Meter {
  id: string;
  number: string;
  description: string;
  assignment: string;
  category: string;
  createdAt: Date;
  readings: Reading[];
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedAt: Date;
}

export interface Reading {
  id: string;
  date: Date;
  value: number;
  remarks?: string;
  difference?: number;
  createdBy: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ConsumptionData {
  date: string;
  consumption: number;
  isForecasted: boolean;
  isCurrent?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isDefault: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Reminder {
  id: string;
  meterId: string;
  type: 'daily' | 'monthly' | 'yearly';
  enabled: boolean;
  lastNotified?: Date;
  nextNotification: Date;
  createdBy: string;
}

export interface AppSettings {
  darkMode: boolean;
  language: 'en' | 'de';
  defaultCategories: Category[];
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  username: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  entityType: 'meter' | 'reading' | 'user' | 'reminder';
  entityId?: string;
  description: string;
  timestamp: Date;
}