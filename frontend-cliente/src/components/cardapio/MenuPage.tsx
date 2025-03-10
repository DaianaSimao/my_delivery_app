import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMenu } from '../../services/api';
import { MenuSection } from './MenuSection';
import type { MenuItem, MenuSection as MenuSectionType } from '../../types';
import { Footer } from '../Footer';
import { Cart } from '../carrinho/Cart';
import type { CartItem } from '../../types';

const MenuPage: React.FC = () => {
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
        const data = await fetchMenu(restauranteId);
        if (Array.isArray(data)) {
          const sections: MenuSectionType[] = [
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
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {menuSections.map((section) => (
          <MenuSection 
            key={section.id} 
            section={section} 
            onItemClick={handleItemClick} 
          />
        ))}
      </div>
      <Footer onCartClick={() => navigate('/cart')} />
    </>
  );
};

export default MenuPage;