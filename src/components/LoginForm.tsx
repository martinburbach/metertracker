import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { verifyPassword } from '../utils/authUtils';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  users: User[];
  darkMode: boolean;
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ users, darkMode, onLogin }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = users.find(u => u.username === formData.username);
      
      if (!user) {
        setError(t('auth.loginError'));
        return;
      }

      const isValidPassword = await verifyPassword(formData.password, user.password);
      
      if (!isValidPassword) {
        setError(t('auth.loginError'));
        return;
      }

      onLogin(user);
    } catch (err) {
      setError(t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex p-4 rounded-full mb-4 ${
            darkMode ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('auth.welcome')}
          </h1>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {t('auth.pleaseLogin')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'
          }`}>
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('auth.username')}
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={inputClass}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClass}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>{t('auth.loginButton')}</span>
              </>
            )}
          </button>
        </form>

        {/* Default User Info */}
        <div className={`mt-6 p-3 rounded-lg text-xs ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
        }`}>
          <p className="font-medium mb-1">Default Login:</p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;