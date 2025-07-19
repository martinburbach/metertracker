import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Meter, Reading } from '../types';
import { calculateDifference } from '../utils/dataUtils';
import { X, Save, TrendingUp, AlertCircle } from 'lucide-react';

interface ReadingFormProps {
  meter: Meter;
  darkMode: boolean;
  onSave: (reading: Omit<Reading, 'id'>) => void;
  onCancel: () => void;
}

const ReadingForm: React.FC<ReadingFormProps> = ({
  meter,
  darkMode,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    value: '',
    remarks: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = t('reading.dateRequired');
    }
    
    if (!formData.value || isNaN(Number(formData.value))) {
      newErrors.value = t('reading.validValueRequired');
    }
    
    const numValue = Number(formData.value);
    const lastReading = meter.readings.length > 0 ? meter.readings[meter.readings.length - 1] : null;
    
    if (lastReading && numValue < lastReading.value) {
      newErrors.value = t('reading.cannotBeLess');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const numValue = Number(formData.value);
      const difference = calculateDifference(meter.readings, numValue);
      
      onSave({
        date: new Date(formData.date),
        value: numValue,
        remarks: formData.remarks,
        difference
      });
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
  }`;

  const errorClass = `text-sm text-red-500 mt-1`;

  const currentValue = Number(formData.value);
  const lastReading = meter.readings.length > 0 ? meter.readings[meter.readings.length - 1] : null;
  const difference = lastReading && !isNaN(currentValue) ? currentValue - lastReading.value : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('reading.addReading')}
              </h2>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {meter.number} - {meter.description}
              </p>
            </div>
            <button
              onClick={onCancel}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Previous Reading Info */}
          {lastReading && (
            <div className={`p-4 rounded-lg mb-4 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('reading.previousReading')}
                  </p>
                  <p className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {lastReading.value.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(lastReading.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('reading.date')} *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputClass}
              />
              {errors.date && <p className={errorClass}>{errors.date}</p>}
            </div>

            {/* Current Reading */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('reading.currentReading')} *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={t('reading.enterCurrentReading')}
                className={inputClass}
              />
              {errors.value && <p className={errorClass}>{errors.value}</p>}
            </div>

            {/* Difference Display */}
            {lastReading && !isNaN(currentValue) && currentValue > 0 && (
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`h-4 w-4 ${
                    darkMode ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    {t('reading.consumption')}: {difference > 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Remarks */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('reading.remarks')} ({t('reading.optional')})
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder={t('reading.addNotes')}
                rows={3}
                className={inputClass}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t('reading.cancel')}
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  darkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Save className="h-4 w-4" />
                <span>{t('reading.saveReading')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReadingForm;