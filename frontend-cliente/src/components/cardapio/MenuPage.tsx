import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMaisPedidos, fetchSecoes, fetchPromocoesAtivas } from '../../services/api';
import { MenuSection } from './MenuSection';
import type { MenuItem, MenuSection as MenuSectionType } from '../../types';
import { Footer } from '../Footer';
import { Cart } from '../carrinho/Cart';
import type { CartItem } from '../../types';

interface MenuPageProps {
  onSectionsLoad: (sections: MenuSectionType[]) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ onSectionsLoad }) => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const [menuSections, setMenuSections] = useState<MenuSectionType[]>([]);
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        if (!restauranteId) {
          console.error('restauranteId is undefined');
          return;
        }

        const [maisPedidos, secoes, promocoes] = await Promise.all([
          fetchMaisPedidos(restauranteId),
          fetchSecoes(restauranteId),
          fetchPromocoesAtivas(restauranteId)
        ]);

        const sections: MenuSectionType[] = [
          {
            id: 'popular',
            title: 'Os Mais Pedidos',
            items: maisPedidos,
          },
        ];

        if (promocoes && promocoes.length > 0) {
          sections.push({
            id: 'promocoes',
            title: 'Promoções',
            items: promocoes,
          });
        }
        
        secoes.forEach((secao: { id: number; nome: string; produtos: MenuItem[] }) => {
          if (secao.produtos && secao.produtos.length > 0) {
            sections.push({
              id: secao.id.toString(),
              title: secao.nome,
              items: secao.produtos
            });
          }
        });

        setMenuSections(sections);
        onSectionsLoad(sections);
        
      } catch (error) {
        console.error('Erro ao carregar o cardápio:', error);
      }
    };

    if (restauranteId) {
      loadMenu();
    }
  }, [restauranteId, onSectionsLoad]);
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map(item => 
        item.id.toString() === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id.toString() !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleItemClick = (item: MenuItem) => {
    navigate(`/item/${item.id}`);
  };

  if (showCart) {
    return (
      <Cart
        items={cartItems}
        onBack={() => setShowCart(false)}
        onClearCart={handleClearCart}
        onEditItem={(item) => console.log('Edit item:', item)}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onAddMore={() => setShowCart(false)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {menuSections.map((section) => (
            <MenuSection 
              key={section.id}
              section={section}
              onItemClick={handleItemClick}
              id={section.id}
            />
          ))}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900">
        <Footer onCartClick={() => navigate('/cart')} />
      </footer>
    </div>
  );
};

export default MenuPage;