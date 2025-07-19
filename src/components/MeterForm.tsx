import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Meter, Category } from '../types';
import { X, Plus, Save, AlertCircle } from 'lucide-react';

interface MeterFormProps {
  meter: Meter | null;
  categories: Category[];
  darkMode: boolean;
  onSave: (meter: Omit<Meter, 'id' | 'createdAt' | 'readings'>) => void;
  onCancel: () => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
}

const MeterForm: React.FC<MeterFormProps> = ({
  meter,
  categories,
  darkMode,
  onSave,
  onCancel,
  onAddCategory
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    number: '',
    description: '',
    assignment: '',
    category: ''
  });

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meter) {
      setFormData({
        number: meter.number,
        description: meter.description,
        assignment: meter.assignment,
        category: meter.category
      });
    }
  }, [meter]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.number.trim()) {
      newErrors.number = t('meter.required');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('meter.required');
    }
    
    if (!formData.assignment.trim()) {
      newErrors.assignment = t('meter.required');
    }
    
    if (!formData.category) {
      newErrors.category = t('meter.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory({
        name: newCategory.trim(),
        color: '#6B7280',
        icon: 'activity'
      });
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
  }`;

  const errorClass = `text-sm text-red-500 mt-1`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {meter ? t('meter.editMeter') : t('meter.addMeter')}
            </h2>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Meter Number */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('meter.number')} *
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder={t('meter.numberPlaceholder')}
                className={inputClass}
              />
              {errors.number && <p className={errorClass}>{errors.number}</p>}
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('meter.description')} *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('meter.descriptionPlaceholder')}
                className={inputClass}
              />
              {errors.description && <p className={errorClass}>{errors.description}</p>}
            </div>

            {/* Assignment */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('meter.assignment')} *
              </label>
              <input
                type="text"
                value={formData.assignment}
                onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
                placeholder={t('meter.assignmentPlaceholder')}
                className={inputClass}
              />
              {errors.assignment && <p className={errorClass}>{errors.assignment}</p>}
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('meter.category')} *
              </label>
              <div className="flex space-x-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`flex-1 ${inputClass}`}
                >
                  <option value="">{t('meter.selectCategory')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className={`px-4 py-3 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span>{t('meter.saveMeter')}</span>
                </button>
              </div>
              {errors.category && <p className={errorClass}>{errors.category}</p>}
            </div>

            {/* Add Category */}
            {showAddCategory && (
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder={t('meter.newCategoryPlaceholder')}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    {t('meter.add')}
                  </button>
                </div>
              </div>
            )}

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
                Cancel
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
                <span>Save Meter</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeterForm;