/**
 * Language Selector Component
 *
 * Dropdown for selecting syntax highlighting language in Monaco Editor
 */

'use client';

import { SUPPORTED_LANGUAGES } from './MonacoEditor';

export interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  className?: string;
}

export function LanguageSelector({
  value,
  onChange,
  className = '',
}: LanguageSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="language-select" className="text-sm font-medium">
        Language:
      </label>
      <select
        id="language-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
