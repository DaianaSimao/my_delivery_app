// src/components/cardapio/MenuPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMenu } from '../../services/api';
import { MenuSection as MenuSectionComponent } from './MenuSection';
import { TabBar } from '../../components/TabBar';
import type { MenuSection} from '../../types';

interface MenuPageProps {
  onCartClick: () => void;
}

const MenuPage: React.FC<MenuPageProps> = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        if (!restauranteId) {
          console.error('restauranteId is undefined');
          return;
        }
        const data = await fetchMenu(restauranteId);
        console.log('Data:', data);
        if (Array.isArray(data)) {
          const sections: MenuSection[] = [
            {
              id: 'popular',
              title: 'Os Mais Pedidos',
              items: data.slice(0, 2), // Pega os dois primeiros itens
            },
            {
              id: 'regular',
              title: 'Cardápio Completo',
              items: data, // Todos os itens
            },
          ];
          setMenuSections(sections);
        } else {
          console.error('Formato de dados inválido: esperado um array, mas recebido', data);
        }
      } catch (error) {
        console.error('Erro ao carregar o cardápio:', error);
      }
    };

    if (restauranteId) {
      loadMenu();
    }
  }, [restauranteId]);

  return (
    <>
      <TabBar 
        sections={menuSections}
        activeSection={menuSections[0]?.id || ''}
        onSectionChange={(sectionId) => console.log('Section changed:', sectionId)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {menuSections.map((section) => (
          <section key={section.id} data-section-id={section.id}>
            <MenuSectionComponent section={section} />
          </section>
        ))}
      </main>
    </>
  );
};

export default MenuPage;