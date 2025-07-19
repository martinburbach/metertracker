import React from 'react';
import { useTranslation } from 'react-i18next';
import { Meter } from '../types';
import { getDailyConsumption } from '../utils/dataUtils';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Thermometer, 
  Plus, 
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

interface MeterCardProps {
  meter: Meter;
  darkMode: boolean;
  onEdit: (meter: Meter) => void;
  onAddReading: (meter: Meter) => void;
  onViewDetails: (meter: Meter) => void;
}

const MeterCard: React.FC<MeterCardProps> = ({
  meter,
  darkMode,
  onEdit,
  onAddReading,
  onViewDetails
}) => {
  const { t } = useTranslation();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electricity':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'water':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'gas':
        return <Flame className="h-5 w-5 text-orange-500" />;
      case 'heating':
        return <Thermometer className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electricity':
        return 'from-yellow-400 to-yellow-600';
      case 'water':
        return 'from-blue-400 to-blue-600';
      case 'gas':
        return 'from-orange-400 to-orange-600';
      case 'heating':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const lastReading = meter.readings.length > 0 
    ? meter.readings[meter.readings.length - 1] 
    : null;

  const dailyConsumption = getDailyConsumption(meter);
  const totalReadings = meter.readings.length;

  return (
    <div className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
      darkMode 
        ? 'bg-gray-800 shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30' 
        : 'bg-white shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20'
    }`}>
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${getCategoryColor(meter.category)}`} />
      
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="h-4 w-4 sm:h-5 sm:w-5">
                {getCategoryIcon(meter.category)}
              </div>
            </div>
            <div>
              <h3 className={`font-semibold text-base sm:text-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {meter.number}
              </h3>
              <p className={`text-xs sm:text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {meter.category}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => onAddReading(meter)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {meter.description}
        </p>

        {/* Assignment */}
        <div className={`px-2 sm:px-3 py-2 rounded-lg mb-3 sm:mb-4 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`text-xs sm:text-sm font-medium line-clamp-1 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {meter.assignment}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <TrendingUp className={`h-4 w-4 ${
                darkMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('meter.currentValue')}
              </span>
            </div>
            <p className={`text-sm sm:text-lg font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {lastReading ? lastReading.value.toLocaleString() : 'N/A'}
            </p>
          </div>
          
          <div className={`p-2 sm:p-3 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <Activity className={`h-4 w-4 ${
                darkMode ? 'text-green-400' : 'text-green-500'
              }`} />
              <span className={`text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('meter.dailyAvg')}
              </span>
            </div>
            <p className={`text-sm sm:text-lg font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {dailyConsumption > 0 ? dailyConsumption.toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Last Reading Info */}
        {lastReading && (
          <div className={`flex items-center space-x-2 text-xs sm:text-sm mb-3 sm:mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Calendar className="h-4 w-4" />
            <span>
              {t('meter.lastReading')}: {new Date(lastReading.date).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => onViewDetails(meter)}
            className={`flex-1 py-2 px-3 sm:px-4 text-sm rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {t('meter.viewDetails')}
          </button>
          <button
            onClick={() => onEdit(meter)}
            className={`sm:flex-shrink-0 px-3 sm:px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {t('meter.edit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeterCard;