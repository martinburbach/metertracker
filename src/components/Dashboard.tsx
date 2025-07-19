import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Meter, Reading } from '../types';
import MeterCard from './MeterCard';
import MeterDetails from './MeterDetails';
import ReadingForm from './ReadingForm';
import { Plus, Search, Filter, TrendingUp, Activity, Zap } from 'lucide-react';

interface DashboardProps {
  meters: Meter[];
  darkMode: boolean;
  onEditMeter: (meter: Meter) => void;
  onAddReading: (meterId: string, reading: Omit<Reading, 'id'>) => void;
  onDeleteReading: (meterId: string, readingId: string) => void;
  onAddMeter: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  meters,
  darkMode,
  onEditMeter,
  onAddReading,
  onDeleteReading,
  onAddMeter
}) => {
  const { t } = useTranslation();
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [showReadingForm, setShowReadingForm] = useState<Meter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredMeters = meters.filter(meter => {
    const matchesSearch = meter.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meter.assignment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || meter.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(meters.map(m => m.category)));

  const totalMeters = meters.length;
  const activeMeters = meters.filter(m => m.readings.length > 0).length;
  const totalReadings = meters.reduce((sum, m) => sum + m.readings.length, 0);

  const handleAddReading = (reading: Omit<Reading, 'id'>) => {
    if (showReadingForm) {
      onAddReading(showReadingForm.id, reading);
      setShowReadingForm(null);
    }
  };

  const handleDeleteReading = (readingId: string) => {
    if (selectedMeter) {
      onDeleteReading(selectedMeter.id, readingId);
      // Update the selected meter to reflect the change
      const updatedMeter = meters.find(m => m.id === selectedMeter.id);
      if (updatedMeter) {
        setSelectedMeter(updatedMeter);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('dashboard.title')}
          </h1>
          <p className={`text-xs sm:text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {t('dashboard.subtitle')}
          </p>
        </div>
        <button
          onClick={onAddMeter}
          className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>{t('dashboard.addMeter')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className={`p-6 rounded-xl transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-xs sm:text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('dashboard.totalMeters')}
              </p>
              <p className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {totalMeters}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-green-600' : 'bg-green-500'
            }`}>
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-xs sm:text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('dashboard.activeMeters')}
              </p>
              <p className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {activeMeters}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-colors duration-300 sm:col-span-2 lg:col-span-1 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-purple-600' : 'bg-purple-500'
            }`}>
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-xs sm:text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('dashboard.totalReadings')}
              </p>
              <p className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {totalReadings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder={t('dashboard.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <div className="relative sm:w-auto">
          <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`w-full sm:w-auto pl-10 pr-8 py-2 text-sm rounded-lg border transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">{t('dashboard.allCategories')}</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Meters Grid */}
      {filteredMeters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredMeters.map((meter) => (
            <MeterCard
              key={meter.id}
              meter={meter}
              darkMode={darkMode}
              onEdit={onEditMeter}
              onAddReading={() => setShowReadingForm(meter)}
              onViewDetails={() => setSelectedMeter(meter)}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 sm:py-12 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Zap className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            {meters.length === 0 ? t('dashboard.noMeters') : t('dashboard.noMatchingMeters')}
          </h3>
          <p className="mb-4 text-sm sm:text-base">
            {meters.length === 0 
              ? t('dashboard.noMetersDescription')
              : t('dashboard.adjustFilters')
            }
          </p>
          {meters.length === 0 && (
            <button
              onClick={onAddMeter}
              className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{t('dashboard.addFirstMeter')}</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedMeter && (
        <MeterDetails
          meter={selectedMeter}
          darkMode={darkMode}
          onClose={() => setSelectedMeter(null)}
          onAddReading={(reading) => onAddReading(selectedMeter.id, reading)}
          onDeleteReading={handleDeleteReading}
        />
      )}

      {showReadingForm && (
        <ReadingForm
          meter={showReadingForm}
          darkMode={darkMode}
          onSave={handleAddReading}
          onCancel={() => setShowReadingForm(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;