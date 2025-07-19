import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserActivity } from '../types';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createDefaultUser = async (): Promise<User> => {
  const hashedPassword = await hashPassword('admin123');
  
  return {
    id: uuidv4(),
    username: 'admin',
    email: 'admin@metertracker.com',
    password: hashedPassword,
    role: 'admin',
    isDefault: true,
    createdAt: new Date()
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const logUserActivity = (
  activities: UserActivity[],
  userId: string,
  username: string,
  action: UserActivity['action'],
  entityType: UserActivity['entityType'],
  description: string,
  entityId?: string
): UserActivity[] => {
  const newActivity: UserActivity = {
    id: uuidv4(),
    userId,
    username,
    action,
    entityType,
    entityId,
    description,
    timestamp: new Date()
  };

  return [newActivity, ...activities].slice(0, 100); // Keep only last 100 activities
};