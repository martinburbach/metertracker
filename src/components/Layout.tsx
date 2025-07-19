import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { Moon, Sun, Gauge, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
  currentUser?: { username: string };
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  darkMode, 
  onToggleDarkMode, 
  currentView, 
  onViewChange,
  onLogout,
  currentUser
}) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'dashboard', label: t('app.dashboard'), icon: BarChart3 },
    { id: 'meters', label: t('app.meters'), icon: Gauge },
    { id: 'settings', label: t('app.settings'), icon: Settings }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                <Gauge className="h-6 w-6 text-white" />
              </div>
              <h1 className={`text-lg sm:text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('app.title')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info */}
              {currentUser && (
                <div className={`hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <span className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {currentUser.username}
                  </span>
                </div>
              )}
              
              <nav className="hidden lg:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`flex items-center px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors duration-200 ${
                        currentView === item.id
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 lg:mr-2" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              <LanguageSelector darkMode={darkMode} />
              
              <button
                onClick={onToggleDarkMode}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    darkMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <span className="hidden sm:inline">{t('auth.logout')}</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className={`lg:hidden sticky top-16 z-40 border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  currentView === item.id
                    ? darkMode
                      ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                      : 'bg-blue-500 text-white border-b-2 border-blue-300'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 sm:mr-2 mb-1 sm:mb-0" />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;