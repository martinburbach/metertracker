import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Meter, Reading } from '../types';
import ConsumptionChart from './ConsumptionChart';
import ReadingForm from './ReadingForm';
import { 
  X, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Edit3, 
  Trash2,
  Activity
} from 'lucide-react';

interface MeterDetailsProps {
  meter: Meter;
  darkMode: boolean;
  onClose: () => void;
  onAddReading: (reading: Omit<Reading, 'id'>) => void;
  onDeleteReading: (readingId: string) => void;
}

const MeterDetails: React.FC<MeterDetailsProps> = ({
  meter,
  darkMode,
  onClose,
  onAddReading,
  onDeleteReading
}) => {
  const { t } = useTranslation();
  const [showReadingForm, setShowReadingForm] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const handleAddReading = (reading: Omit<Reading, 'id'>) => {
    onAddReading(reading);
    setShowReadingForm(false);
  };

  const sortedReadings = [...meter.readings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalConsumption = meter.readings.length > 1 
    ? meter.readings[meter.readings.length - 1].value - meter.readings[0].value
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {meter.number}
              </h2>
              <p className={`text-xs sm:text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {meter.description} • {meter.category}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <Activity className={`h-5 w-5 ${
                  darkMode ? 'text-blue-400' : 'text-blue-500'
                }`} />
                <span className={`text-xs sm:text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('details.totalReadings')}
                </span>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {meter.readings.length}
              </p>
            </div>
            
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <TrendingUp className={`h-5 w-5 ${
                  darkMode ? 'text-green-400' : 'text-green-500'
                }`} />
                <span className={`text-xs sm:text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('details.totalConsumption')}
                </span>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {totalConsumption.toFixed(2)}
              </p>
            </div>
            
            <div className={`p-4 rounded-xl sm:col-span-2 lg:col-span-1 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <Calendar className={`h-5 w-5 ${
                  darkMode ? 'text-purple-400' : 'text-purple-500'
                }`} />
                <span className={`text-xs sm:text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('details.lastReading')}
                </span>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {sortedReadings.length > 0 
                  ? new Date(sortedReadings[0].date).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div className={`p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
              <h3 className={`text-base sm:text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('chart.consumptionChart')}
              </h3>
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    chartType === 'bar'
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    chartType === 'line'
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ConsumptionChart meter={meter} darkMode={darkMode} chartType={chartType} />
          </div>

          {/* Readings History */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
            <h3 className={`text-base sm:text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('details.readingHistory')}
            </h3>
            <button
              onClick={() => setShowReadingForm(true)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{t('reading.addReading')}</span>
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
            {sortedReadings.length > 0 ? (
              sortedReadings.map((reading) => (
                <div
                  key={reading.id}
                  className={`p-3 sm:p-4 rounded-lg border transition-colors duration-200 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                        <div>
                          <p className={`text-sm sm:text-base font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {reading.value.toLocaleString()}
                          </p>
                          <p className={`text-xs sm:text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(reading.date).toLocaleDateString()}
                          </p>
                        </div>
                        {reading.difference !== undefined && reading.difference > 0 && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                            darkMode
                              ? 'bg-green-900 text-green-300'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            +{reading.difference.toFixed(2)}
                          </div>
                        )}
                      </div>
                      {reading.remarks && (
                        <p className={`text-xs sm:text-sm mt-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {reading.remarks}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteReading(reading.id)}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ml-2 ${
                        darkMode
                          ? 'hover:bg-gray-600 text-red-400'
                          : 'hover:bg-gray-100 text-red-500'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-6 sm:py-8 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">{t('details.noReadings')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reading Form Modal */}
      {showReadingForm && (
        <ReadingForm
          meter={meter}
          darkMode={darkMode}
          onSave={handleAddReading}
          onCancel={() => setShowReadingForm(false)}
        />
      )}
    </div>
  );
};

export default MeterDetails;