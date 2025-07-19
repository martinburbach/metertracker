import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Reminder, Meter } from '../types';
import { calculateNextNotification } from '../utils/reminderUtils';
import { v4 as uuidv4 } from 'uuid';
import { 
  Bell, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  Calendar,
  X,
  Save
} from 'lucide-react';

interface ReminderManagementProps {
  reminders: Reminder[];
  meters: Meter[];
  currentUserId: string;
  darkMode: boolean;
  onAddReminder: (reminder: Reminder) => void;
  onUpdateReminder: (reminder: Reminder) => void;
  onDeleteReminder: (reminderId: string) => void;
}

const ReminderManagement: React.FC<ReminderManagementProps> = ({
  reminders,
  meters,
  currentUserId,
  darkMode,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder
}) => {
  const { t } = useTranslation();
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    meterId: '',
    type: 'monthly' as Reminder['type'],
    enabled: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      meterId: '',
      type: 'monthly',
      enabled: true
    });
    setErrors({});
    setEditingReminder(null);
  };

  const handleAddReminder = () => {
    resetForm();
    setShowReminderForm(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setFormData({
      meterId: reminder.meterId,
      type: reminder.type,
      enabled: reminder.enabled
    });
    setEditingReminder(reminder);
    setShowReminderForm(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.meterId) {
      newErrors.meterId = t('reminders.meterRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const nextNotification = calculateNextNotification(formData.type);

    if (editingReminder) {
      const updatedReminder: Reminder = {
        ...editingReminder,
        meterId: formData.meterId,
        type: formData.type,
        enabled: formData.enabled,
        nextNotification
      };
      onUpdateReminder(updatedReminder);
    } else {
      const newReminder: Reminder = {
        id: uuidv4(),
        meterId: formData.meterId,
        type: formData.type,
        enabled: formData.enabled,
        nextNotification,
        createdBy: currentUserId
      };
      onAddReminder(newReminder);
    }

    setShowReminderForm(false);
    resetForm();
  };

  const handleDeleteReminder = (reminder: Reminder) => {
    if (window.confirm(t('reminders.deleteReminder') + '?')) {
      onDeleteReminder(reminder.id);
    }
  };

  const getMeterName = (meterId: string) => {
    const meter = meters.find(m => m.id === meterId);
    return meter ? `${meter.number} - ${meter.description}` : 'Unknown Meter';
  };

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'daily':
        return <Clock className="h-4 w-4" />;
      case 'monthly':
        return <Calendar className="h-4 w-4" />;
      case 'yearly':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
  }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h3 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('reminders.title')}
          </h3>
        </div>
        <button
          onClick={handleAddReminder}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            darkMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>{t('reminders.addReminder')}</span>
        </button>
      </div>

      {/* Reminders List */}
      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-lg border transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    reminder.enabled
                      ? darkMode ? 'bg-green-600' : 'bg-green-500'
                      : darkMode ? 'bg-gray-600' : 'bg-gray-400'
                  }`}>
                    {getTypeIcon(reminder.type)}
                    <span className="sr-only">{reminder.enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div>
                    <p className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {getMeterName(reminder.meterId)}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {t(`reminders.${reminder.type}`)}
                      </span>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {t('reminders.nextNotification')}: {reminder.nextNotification.toLocaleDateString()}
                      </span>
                      {reminder.lastNotified && (
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t('reminders.lastNotified')}: {reminder.lastNotified.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reminder.enabled
                      ? darkMode
                        ? 'bg-green-900 text-green-300'
                        : 'bg-green-100 text-green-700'
                      : darkMode
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {reminder.enabled ? t('reminders.enabled') : 'Disabled'}
                  </div>
                  <button
                    onClick={() => handleEditReminder(reminder)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      darkMode
                        ? 'hover:bg-gray-600 text-blue-400'
                        : 'hover:bg-gray-100 text-blue-500'
                    }`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(reminder)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      darkMode
                        ? 'hover:bg-gray-600 text-red-400'
                        : 'hover:bg-gray-100 text-red-500'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">{t('reminders.noReminders')}</h3>
          <p className="mb-4">{t('reminders.addFirstReminder')}</p>
          <button
            onClick={handleAddReminder}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{t('reminders.addReminder')}</span>
          </button>
        </div>
      )}

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingReminder ? t('reminders.editReminder') : t('reminders.addReminder')}
                </h2>
                <button
                  onClick={() => {
                    setShowReminderForm(false);
                    resetForm();
                  }}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('reminders.reminderFor')} *
                  </label>
                  <select
                    value={formData.meterId}
                    onChange={(e) => setFormData({ ...formData, meterId: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t('reminders.selectMeter')}</option>
                    {meters.map((meter) => (
                      <option key={meter.id} value={meter.id}>
                        {meter.number} - {meter.description}
                      </option>
                    ))}
                  </select>
                  {errors.meterId && (
                    <p className="text-sm text-red-500 mt-1">{errors.meterId}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('reminders.type')} *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Reminder['type'] })}
                    className={inputClass}
                  >
                    <option value="daily">{t('reminders.daily')}</option>
                    <option value="monthly">{t('reminders.monthly')}</option>
                    <option value="yearly">{t('reminders.yearly')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('reminders.enabled')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      formData.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        formData.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReminderForm(false);
                      resetForm();
                    }}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Save className="h-4 w-4" />
                    <span>{t('reminders.saveReminder')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderManagement;