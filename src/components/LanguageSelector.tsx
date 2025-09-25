import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => void;
  disabled?: boolean;
}

const languages = {
  ja: '日本語',
  en: 'English'
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onChange,
  disabled = false
}) => {
  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value as Language)}
      disabled={disabled}
      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {Object.entries(languages).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};
