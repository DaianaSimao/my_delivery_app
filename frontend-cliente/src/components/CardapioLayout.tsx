// components/CardapioLayout.tsx
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import  { Header } from './Header';
import MenuPage from './cardapio/MenuPage';
import { useState } from 'react';
import type { MenuSection } from '../types';

export const CardapioLayout: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>('popular');

  if (restauranteId) {
    localStorage.setItem('restauranteId', restauranteId);
  }

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      const header = document.querySelector('header');
      const headerHeight = header?.offsetHeight || 0;
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: sectionTop - headerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        restauranteId={restauranteId}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        menuSections={menuSections}
        onSectionClick={handleSectionClick}
        activeSection={activeSection}
      />
      <main className="pt-4">
        <MenuPage onSectionsLoad={setMenuSections} />
      </main>
    </div>
  );
};