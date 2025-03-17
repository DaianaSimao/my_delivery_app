// components/CardapioLayout.tsx
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import  { Header } from './Header';
import MenuPage from './cardapio/MenuPage';

export const CardapioLayout: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (restauranteId) {
    localStorage.setItem('restauranteId', restauranteId);
  }

  return (
    <>
      <Header
        restauranteId={restauranteId}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <MenuPage />
    </>
  );
};