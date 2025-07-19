import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Meter, Reading, Category, AppSettings, User, UserActivity, Reminder } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createDefaultUser, logUserActivity } from './utils/authUtils';
import { checkDueReminders, requestNotificationPermission, showNotification, calculateNextNotification } from './utils/reminderUtils';
import { MeterAPI } from './api/meterApi';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import MeterForm from './components/MeterForm';

const defaultCategories: Category[] = [
  { id: '1', name: 'Electricity', color: '#F59E0B', icon: 'zap' },
  { id: '2', name: 'Water', color: '#3B82F6', icon: 'droplets' },
  { id: '3', name: 'Gas', color: '#EF4444', icon: 'flame' },
  { id: '4', name: 'Heating', color: '#DC2626', icon: 'thermometer' },
  { id: '5', name: 'District Heating', color: '#7C3AED', icon: 'thermometer' },
  { id: '6', name: 'Heat Pump', color: '#059669', icon: 'thermometer' }
];

const defaultSettings: AppSettings = {
  darkMode: false,
  language: 'en',
  defaultCategories,
  notifications: {
    enabled: true,
    sound: true,
    desktop: true
  }
};

function App() {
  const { i18n } = useTranslation();
  const [meters, setMeters] = useLocalStorage<Meter[]>('meters', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);
  const [rawSettings, setRawSettings] = useLocalStorage<Partial<AppSettings>>('settings', defaultSettings);
  const [storedUsers, setStoredUsers] = useLocalStorage<User[]>('users', []);
  const [rawReminders, setRawReminders] = useLocalStorage<Reminder[]>('reminders', []);
  const [activities, setActivities] = useLocalStorage<UserActivity[]>('activities', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null);
  const [showMeterForm, setShowMeterForm] = useState(false);

  // Convert stored users to proper User objects with Date instances
  const users = useMemo(() => {
    return storedUsers.map(user => ({
      ...user,
      createdAt: typeof user.createdAt === 'string' ? new Date(user.createdAt) : user.createdAt,
      lastLogin: user.lastLogin ? (typeof user.lastLogin === 'string' ? new Date(user.lastLogin) : user.lastLogin) : undefined
    }));
  }, [storedUsers]);

  // Convert stored reminders to proper Reminder objects with Date instances
  const reminders = useMemo(() => {
    return rawReminders.map(reminder => ({
      ...reminder,
      nextNotification: typeof reminder.nextNotification === 'string' ? new Date(reminder.nextNotification) : reminder.nextNotification,
      lastNotified: reminder.lastNotified ? (typeof reminder.lastNotified === 'string' ? new Date(reminder.lastNotified) : reminder.lastNotified) : undefined
    }));
  }, [rawReminders]);

  // Merge raw settings with defaults to ensure all properties exist
  const settings = useMemo(() => ({
    ...defaultSettings,
    ...rawSettings,
    notifications: {
      ...defaultSettings.notifications,
      ...(rawSettings.notifications || {})
    }
  }), [rawSettings]);

  const setSettings = useCallback((newSettings: AppSettings | ((prev: AppSettings) => AppSettings)) => {
    if (typeof newSettings === 'function') {
      setRawSettings(prev => {
        const currentSettings = {
          ...defaultSettings,
          ...prev,
          notifications: {
            ...defaultSettings.notifications,
            ...(prev.notifications || {})
          }
        };
        return newSettings(currentSettings);
      });
    } else {
      setRawSettings(newSettings);
    }
  }, [setRawSettings]);

  // Initialize default user and check reminders
  useEffect(() => {
    const initializeApp = async () => {
      // Create default user if no users exist
      if (users.length === 0) {
        const defaultUser = await createDefaultUser();
        setStoredUsers([defaultUser]);
      }

      // Request notification permission
      if (settings.notifications.enabled && settings.notifications.desktop) {
        await requestNotificationPermission();
      }

      // Check for due reminders every minute
      const reminderInterval = setInterval(() => {
        if (currentUser && settings.notifications.enabled) {
          const dueReminders = checkDueReminders(reminders);
          dueReminders.forEach(reminder => {
            const meter = meters.find(m => m.id === reminder.meterId);
            if (meter) {
              if (settings.notifications.desktop) {
                showNotification(
                  'Meter Reading Reminder',
                  `Time to read meter: ${meter.number} - ${meter.description}`
                );
              }
              
              // Update reminder's next notification time
              const updatedReminder = {
                ...reminder,
                lastNotified: new Date(),
                nextNotification: calculateNextNotification(reminder.type, new Date())
              };
              
              setRawReminders(prev => prev.map(r => r.id === reminder.id ? updatedReminder : r));
            }
          });
        }
      }, 60000); // Check every minute

      // Expose API for external access (e.g., Alexa Skills)
      if (typeof window !== 'undefined') {
        (window as any).MeterTrackerAPI = MeterAPI;
        
        // Create a simple REST-like interface
        (window as any).getMeterData = (query: string) => {
          try {
            const lowerQuery = query.toLowerCase();
            
            if (lowerQuery.includes('all meters') || lowerQuery.includes('alle zähler')) {
              return MeterAPI.getAllMeters();
            }
            
            if (lowerQuery.includes('summary') || lowerQuery.includes('übersicht')) {
              return MeterAPI.getMeterSummary();
            }
            
            if (lowerQuery.includes('voice') || lowerQuery.includes('sprache')) {
              return MeterAPI.getVoiceResponse(query);
            }
            
            // Try to extract meter number from query
            const meterNumberMatch = query.match(/\d+/);
            if (meterNumberMatch) {
              const meter = MeterAPI.getMeterByNumber(meterNumberMatch[0]);
              if (meter) {
                const currentReading = MeterAPI.getCurrentReading(meter.id);
                return {
                  meter,
                  currentReading,
                  dailyConsumption: MeterAPI.getAverageDailyConsumption(meter.id)
                };
              }
            }
            
            return { error: 'Query not understood', availableCommands: ['all meters', 'summary', 'voice <question>', '<meter number>'] };
          } catch (error) {
            return { error: 'API Error', message: error.message };
          }
        };
        
        console.log('MeterTracker API exposed globally. Use window.MeterTrackerAPI or window.getMeterData(query)');
      }
      return () => clearInterval(reminderInterval);
    };

    initializeApp();
  }, [users.length, currentUser, settings.notifications, reminders, meters]);

  // Update body class and language for settings changes
  useEffect(() => {
    document.body.className = settings.darkMode ? 'dark' : '';
    i18n.changeLanguage(settings.language);
  }, [settings.darkMode, settings.language, i18n]);

  const handleLogin = (user: User) => {
    const updatedUser = { ...user, lastLogin: new Date() };
    setStoredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    
    // Log login activity
    setActivities(prev => logUserActivity(
      prev,
      user.id,
      user.username,
      'login',
      'user',
      `User ${user.username} logged in`
    ));
  };

  const handleLogout = () => {
    if (currentUser) {
      // Log logout activity
      setActivities(prev => logUserActivity(
        prev,
        currentUser.id,
        currentUser.username,
        'logout',
        'user',
        `User ${currentUser.username} logged out`
      ));
    }
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleToggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleAddMeter = () => {
    setEditingMeter(null);
    setShowMeterForm(true);
  };

  const handleEditMeter = (meter: Meter) => {
    setEditingMeter(meter);
    setShowMeterForm(true);
  };

  const handleSaveMeter = (meterData: Omit<Meter, 'id' | 'createdAt' | 'readings'>) => {
    if (!currentUser) return;

    if (editingMeter) {
      // Update existing meter
      const updatedMeter = {
        ...editingMeter,
        ...meterData,
        lastModifiedBy: currentUser.id,
        lastModifiedAt: new Date()
      };
      setMeters(prev => prev.map(m => m.id === editingMeter.id ? updatedMeter : m));
      
      // Log activity
      setActivities(prev => logUserActivity(
        prev,
        currentUser.id,
        currentUser.username,
        'update',
        'meter',
        `Updated meter ${meterData.number}`,
        editingMeter.id
      ));
    } else {
      // Add new meter
      const newMeter: Meter = {
        id: Date.now().toString(),
        ...meterData,
        createdAt: new Date(),
        readings: [],
        createdBy: currentUser.id,
        lastModifiedBy: currentUser.id,
        lastModifiedAt: new Date()
      };
      setMeters(prev => [...prev, newMeter]);
      
      // Log activity
      setActivities(prev => logUserActivity(
        prev,
        currentUser.id,
        currentUser.username,
        'create',
        'meter',
        `Created meter ${meterData.number}`,
        newMeter.id
      ));
    }
    setShowMeterForm(false);
    setEditingMeter(null);
  };

  const handleAddReading = (meterId: string, reading: Omit<Reading, 'id'>) => {
    if (!currentUser) return;

    const newReading: Reading = {
      id: Date.now().toString(),
      ...reading,
      createdBy: currentUser.id,
      createdAt: new Date()
    };

    setMeters(prev => prev.map(meter => 
      meter.id === meterId 
        ? { 
            ...meter, 
            readings: [...meter.readings, newReading],
            lastModifiedBy: currentUser.id,
            lastModifiedAt: new Date()
          }
        : meter
    ));

    // Log activity
    const meter = meters.find(m => m.id === meterId);
    if (meter) {
      setActivities(prev => logUserActivity(
        prev,
        currentUser.id,
        currentUser.username,
        'create',
        'reading',
        `Added reading ${reading.value} for meter ${meter.number}`,
        newReading.id
      ));
    }
  };

  const handleDeleteReading = (meterId: string, readingId: string) => {
    if (!currentUser) return;

    const meter = meters.find(m => m.id === meterId);
    const reading = meter?.readings.find(r => r.id === readingId);

    setMeters(prev => prev.map(meter => 
      meter.id === meterId 
        ? { 
            ...meter, 
            readings: meter.readings.filter(r => r.id !== readingId),
            lastModifiedBy: currentUser.id,
            lastModifiedAt: new Date()
          }
        : meter
    ));

    // Log activity
    if (meter && reading) {
      setActivities(prev => logUserActivity(
        prev,
        currentUser.id,
        currentUser.username,
        'delete',
        'reading',
        `Deleted reading ${reading.value} from meter ${meter.number}`,
        readingId
      ));
    }
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryData
    };
    setCategories(prev => [...prev, newCategory]);
  };

  // User management functions
  const handleAddUser = (user: User) => {
    if (!currentUser) return;
    
    setStoredUsers(prev => [...prev, user]);
    
    // Log activity
    setActivities(prev => logUserActivity(
      prev,
      currentUser.id,
      currentUser.username,
      'create',
      'user',
      `Created user ${user.username}`,
      user.id
    ));
  };

  const handleUpdateUser = (user: User) => {
    if (!currentUser) return;
    
    setStoredUsers(prev => prev.map(u => u.id === user.id ? user : u));
    
    // Log activity
    setActivities(prev => logUserActivity(
      prev,
      currentUser.id,
      currentUser.username,
      'update',
      'user',
      `Updated user ${user.username}`,
      user.id
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (!currentUser) return;
    
    const user = users.find(u => u.id === userId);
    if (!user || user.isDefault) return;
    
    setStoredUsers(prev => prev.filter(u => u.id !== userId));
    
    // Log activity
    setActivities(prev => logUserActivity(
      prev,
      currentUser.id,
      currentUser.username,
      'delete',
      'user',
      `Deleted user ${user.username}`,
      userId
    ));
  };

  // Reminder management functions
  const handleAddReminder = (reminder: Reminder) => {
    if (!currentUser) return;
    
    setRawReminders(prev => [...prev, reminder]);
    
    // Log activity
    const meter = meters.find(m => m.id === reminder.meterId);
    setActivities(prev => logUserActivity(
      prev,
      currentUser.id,
      currentUser.username,
      'create',
      'reminder',
      `Created ${reminder.type} reminder for meter ${meter?.number || 'Unknown'}`,
      reminder.id
    ));
  };

  const handleUpdateReminder = (reminder: Reminder) => {
    if (!currentUser) return;
    
    setRawReminders(prev => prev.map(r => r.id === reminder.id ? reminder : r));
    
    // Log activity
    const meter = meters.find(m => m.id === reminder.meterId);
    setActivities(prev => logUserActivity(
      prev,
      currentUser.id,
      currentUser.username,
      'update',
      'reminder',
      `Updated ${reminder.type} reminder for meter ${meter?.number || 'Unknown'}`,
      reminder.id
    ));
  };

  const handleDeleteReminder = (reminderId: string) => {
    if (!currentUser) return;
    
    const reminder = reminders.find(r => r.id === reminderId);
    if (!reminder) return;
    
    setRawReminders(prev => prev.filter(r => r.id !== reminderId));
    
    // Log activity
    const meter = meters.find(m => m.id === reminder.meterId);
    setActivities(prev => logUserActivity(
      prev,
      currentUser.id,
      currentUser.username,
      'delete',
      'reminder',
      `Deleted ${reminder.type} reminder for meter ${meter?.number || 'Unknown'}`,
      reminderId
    ));
  };

  const renderCurrentView = () => {
    if (!currentUser) return null;

    switch (currentView) {
      case 'dashboard':
      case 'meters':
        return (
          <Dashboard
            meters={meters}
            darkMode={settings.darkMode}
            onEditMeter={handleEditMeter}
            onAddReading={handleAddReading}
            onDeleteReading={handleDeleteReading}
            onAddMeter={handleAddMeter}
          />
        );
      case 'settings':
        return (
          <Settings
            settings={settings}
            users={users}
            currentUser={currentUser}
            reminders={reminders}
            activities={activities}
            meters={meters}
            darkMode={settings.darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onUpdateSettings={handleUpdateSettings}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onAddReminder={handleAddReminder}
            onUpdateReminder={handleUpdateReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        );
      default:
        return null;
    }
  };

  // Show login form if no user is logged in
  if (!currentUser) {
    return (
      <LoginForm
        users={users}
        darkMode={settings.darkMode}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Layout
        darkMode={settings.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        currentUser={currentUser}
      >
        {renderCurrentView()}
      </Layout>

      {/* Meter Form Modal */}
      {showMeterForm && (
        <MeterForm
          meter={editingMeter}
          categories={categories}
          darkMode={settings.darkMode}
          onSave={handleSaveMeter}
          onCancel={() => {
            setShowMeterForm(false);
            setEditingMeter(null);
          }}
          onAddCategory={handleAddCategory}
        />
      )}
    </div>
  );
}

export default App;