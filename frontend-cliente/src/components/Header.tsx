// src/components/Header.tsx
import { useState, useEffect, useRef } from 'react';
import { Utensils, User, Sun, Moon } from 'lucide-react';
import { fetchRestaurantInfo } from '../services/api';
import type { Restaurante } from '../types';
import { SectionNavigation } from './cardapio/SectionNavigation';
import type { MenuSection } from '../types';

interface HeaderProps {
  restauranteId: string | undefined;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  menuSections?: MenuSection[];
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string;
}

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function Header({ 
  restauranteId, 
  isDarkMode, 
  onToggleDarkMode,
  menuSections,
  onSectionClick,
  activeSection
}: HeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<Restaurante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurantInfo = async () => {
      try {
        if (restauranteId) {
          const data = await fetchRestaurantInfo(restauranteId);
          setRestaurantInfo(data);
        } else {
          throw new Error('Restaurante ID não fornecido.');
        }
      } catch (error) {
        console.error('Erro ao carregar informações do restaurante:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantInfo();
  }, [restauranteId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className='dark:text-white'>{error}</div>;
  }

  if (!restaurantInfo) {
    return <div className='dark:text-white'>Nenhuma informação do restaurante encontrada.</div>;
  }

  return (
    <header ref={headerRef} className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Utensils className="h-8 w-8 text-primary-500" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              {restaurantInfo.nome}
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
              href="/restaurante"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <User className="h-5 w-5" />
              <span className="ml-1 text-sm">Perfil</span>
            </a>
          </div>
        </div>
        
        {/* Info section */}
        <div className="py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatTime(restaurantInfo.abertura)} - {formatTime(restaurantInfo.fechamento)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pedido mínimo: R$ {Number(restaurantInfo.pedido_minimo).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation section */}
        {menuSections && onSectionClick && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <SectionNavigation
              sections={menuSections}
              onSectionClick={onSectionClick}
              activeSection={activeSection}
            />
          </div>
        )}
      </div>
    </header>
  );
}