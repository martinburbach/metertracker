import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  darkMode: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ darkMode }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
          darkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
        </span>
      </button>

      <div className={`absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
        darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
              i18n.language === language.code
                ? darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-base">{language.flag}</span>
            <span>{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;