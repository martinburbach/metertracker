import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserActivity, Reminder, AppSettings } from '../types';
import UserManagement from './UserManagement';
import ReminderManagement from './ReminderManagement';
import ActivityLog from './ActivityLog';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Users, 
  Activity,
  Volume2,
  VolumeX,
  Monitor
} from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  users: User[];
  currentUser: User;
  reminders: Reminder[];
  activities: UserActivity[];
  meters: any[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onUpdateReminder: (reminder: Reminder) => void;
  onDeleteReminder: (reminderId: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  users,
  currentUser,
  reminders,
  activities,
  meters,
  darkMode,
  onToggleDarkMode,
  onUpdateSettings,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder
}) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  const handleLanguageChange = (language: 'en' | 'de') => {
    i18n.changeLanguage(language);
    onUpdateSettings({ ...settings, language });
  };

  const handleNotificationSettingChange = (key: keyof typeof settings.notifications, value: boolean) => {
    onUpdateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  const tabs = [
    { id: 'general', label: t('common.general'), icon: SettingsIcon },
    { id: 'users', label: t('app.users'), icon: Users },
    { id: 'reminders', label: t('app.reminders'), icon: Bell },
    { id: 'activity', label: t('app.activity'), icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t('settings.title')}
        </h1>
      </div>

      {/* Tabs */}
      <div className={`border-b overflow-x-auto ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <nav className="flex space-x-4 sm:space-x-8 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'border-blue-400 text-blue-400'
                      : 'border-blue-500 text-blue-600'
                    : darkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        {activeTab === 'general' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Appearance */}
            <div className={`p-4 sm:p-6 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className={`text-base sm:text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('common.appearance')}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {darkMode ? (
                      <Moon className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className={`text-sm sm:text-base font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t('settings.darkMode')}
                    </span>
                  </div>
                  <button
                    onClick={onToggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <span className={`text-sm sm:text-base font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t('settings.language')}
                    </span>
                  </div>
                  <select
                    value={i18n.language}
                    onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'de')}
                    className={`px-2 sm:px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className={`p-4 sm:p-6 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className={`text-base sm:text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('settings.notifications')}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Bell className="h-5 w-5 text-green-500" />
                    <span className={`text-sm sm:text-base font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t('settings.enabled')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNotificationSettingChange('enabled', !settings.notifications.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      settings.notifications.enabled ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings.notifications.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {settings.notifications.sound ? (
                      <Volume2 className="h-5 w-5 text-blue-500" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                    <span className={`text-sm sm:text-base font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t('settings.sound')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNotificationSettingChange('sound', !settings.notifications.sound)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      settings.notifications.sound ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings.notifications.sound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Monitor className="h-5 w-5 text-purple-500" />
                    <span className={`text-sm sm:text-base font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t('settings.desktop')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNotificationSettingChange('desktop', !settings.notifications.desktop)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      settings.notifications.desktop ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings.notifications.desktop ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagement
            users={users}
            currentUser={currentUser}
            darkMode={darkMode}
            onAddUser={onAddUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderManagement
            reminders={reminders}
            meters={meters}
            currentUserId={currentUser.id}
            darkMode={darkMode}
            onAddReminder={onAddReminder}
            onUpdateReminder={onUpdateReminder}
            onDeleteReminder={onDeleteReminder}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityLog
            activities={activities}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;