import React from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-gray-900 dark:text-white" />
          ) : (
            <Moon className="w-6 h-6 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>
    </div>
  );
};
