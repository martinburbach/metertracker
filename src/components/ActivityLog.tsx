import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserActivity } from '../types';
import { Activity, User, Plus, Edit3, Trash2, LogIn, LogOut } from 'lucide-react';

interface ActivityLogProps {
  activities: UserActivity[];
  darkMode: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, darkMode }) => {
  const { t } = useTranslation();

  const getActionIcon = (action: UserActivity['action']) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit3 className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'login':
        return <LogIn className="h-4 w-4 text-purple-500" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: UserActivity['action']) => {
    switch (action) {
      case 'create':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'update':
        return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'delete':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'login':
        return darkMode ? 'text-purple-400' : 'text-purple-600';
      case 'logout':
        return darkMode ? 'text-orange-400' : 'text-orange-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Activity className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t('activity.title')}
        </h3>
      </div>

      {/* Activity List */}
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.username}
                    </span>
                    <span className={`text-sm ${getActionColor(activity.action)}`}>
                      {t(`activity.actions.${activity.action}`)}
                    </span>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t(`activity.entities.${activity.entityType}`)}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {activity.description}
                  </p>
                  <p className={`text-xs mt-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">{t('activity.noActivity')}</h3>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;