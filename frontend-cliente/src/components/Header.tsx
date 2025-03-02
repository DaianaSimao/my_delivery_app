import React from 'react';
import { Utensils, User, Sun, Moon } from 'lucide-react';
import type { RestaurantInfo } from '../types';

interface HeaderProps {
  restaurantInfo: RestaurantInfo;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ restaurantInfo, isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Utensils className="h-8 w-8 text-primary-500" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              {restaurantInfo.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <a
              href={restaurantInfo.profileUrl}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <User className="h-5 w-5" />
              <span className="ml-1 text-sm">Perfil</span>
            </a>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {restaurantInfo.openingHours}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Pedido mínimo: R$ {restaurantInfo.minimumOrder.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}