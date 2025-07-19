import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserActivity } from '../types';
import { hashPassword, validateEmail } from '../utils/authUtils';
import { v4 as uuidv4 } from 'uuid';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield, 
  User as UserIcon,
  X,
  Save,
  AlertCircle
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  darkMode: boolean;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  darkMode,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const { t } = useTranslation();
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setErrors({});
    setEditingUser(null);
  };

  const handleAddUser = () => {
    resetForm();
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = t('settings.usernameRequired');
    } else if (users.some(u => u.username === formData.username && u.id !== editingUser?.id)) {
      newErrors.username = t('validation.usernameExists');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('settings.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('settings.validEmailRequired');
    } else if (users.some(u => u.email === formData.email && u.id !== editingUser?.id)) {
      newErrors.email = t('validation.emailExists');
    }

    if (!editingUser && !formData.password) {
      newErrors.password = t('settings.passwordRequired');
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = t('validation.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        const updatedUser: User = {
          ...editingUser,
          username: formData.username,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: await hashPassword(formData.password) })
        };
        onUpdateUser(updatedUser);
      } else {
        // Add new user
        const newUser: User = {
          id: uuidv4(),
          username: formData.username,
          email: formData.email,
          password: await hashPassword(formData.password),
          role: formData.role,
          isDefault: false,
          createdAt: new Date()
        };
        onAddUser(newUser);
      }

      setShowUserForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    if (user.isDefault) return;
    
    if (window.confirm(t('settings.deleteConfirm'))) {
      onDeleteUser(user.id);
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
          <Users className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h3 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('settings.userManagement')}
          </h3>
        </div>
        {currentUser.role === 'admin' && (
          <button
            onClick={handleAddUser}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{t('settings.addUser')}</span>
          </button>
        )}
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 rounded-lg border transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  user.role === 'admin'
                    ? darkMode ? 'bg-purple-600' : 'bg-purple-500'
                    : darkMode ? 'bg-gray-600' : 'bg-gray-400'
                }`}>
                  {user.role === 'admin' ? (
                    <Shield className="h-4 w-4 text-white" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.username}
                    </p>
                    {user.isDefault && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        darkMode
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        Default
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t('settings.role')}: {t(`settings.${user.role}`)}
                    </span>
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t('settings.createdAt')}: {user.createdAt.toLocaleDateString()}
                    </span>
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t('settings.lastLogin')}: {user.lastLogin?.toLocaleDateString() || t('settings.never')}
                    </span>
                  </div>
                </div>
              </div>

              {currentUser.role === 'admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      darkMode
                        ? 'hover:bg-gray-600 text-blue-400'
                        : 'hover:bg-gray-100 text-blue-500'
                    }`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {!user.isDefault && (
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? 'hover:bg-gray-600 text-red-400'
                          : 'hover:bg-gray-100 text-red-500'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingUser ? t('settings.editUser') : t('settings.addUser')}
                </h2>
                <button
                  onClick={() => {
                    setShowUserForm(false);
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
                    {t('auth.username')} *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={inputClass}
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('auth.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('auth.password')} {editingUser ? '' : '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? 'Leave empty to keep current password' : ''}
                    className={inputClass}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('settings.role')} *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                    className={inputClass}
                    disabled={isLoading}
                  >
                    <option value="user">{t('settings.user')}</option>
                    <option value="admin">{t('settings.admin')}</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      resetForm();
                    }}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{t('settings.saveUser')}</span>
                      </>
                    )}
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

export default UserManagement;