// components/CardapioLayout.tsx
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import  { Header } from './Header';
import MenuPage from './cardapio/MenuPage';
import { useState, useEffect } from 'react';
import type { MenuSection } from '../types';

export const CardapioLayout: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>('popular');

  if (restauranteId) {
    localStorage.setItem('restauranteId', restauranteId);
  }

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      const headerHeight = header?.offsetHeight || 0;
      const scrollPosition = window.scrollY + headerHeight + 50; 

      for (const section of menuSections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuSections]);

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