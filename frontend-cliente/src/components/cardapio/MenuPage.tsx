import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { MenuSection as MenuSectionComponent } from '../../components/MenuSection';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TabBar } from '../../components/TabBar';
import { Cart } from '../../components/Cart';
import { fetchMenu } from '../../services/api';
import type { MenuItem, MenuSection, RestaurantInfo, CartItem } from '../../types';

const restaurantInfo: RestaurantInfo = {
  name: "Sushi Express",
  openingHours: "Seg-Dom: 11:30 - 23:00",
  minimumOrder: 30,
  profileUrl: "#"
};

function MenuPage() {
  const { restauranteId } = useParams<{ restauranteId: string }>(); // Obtém o ID do restaurante da URL
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
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

  // Configura o modo escuro com base nas preferências do sistema
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    const cartItem: CartItem = {
      ...item,
      quantity: 1
    };
    setCartItems([...cartItems, cartItem]);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
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
        onCheckout={() => console.log('Proceed to checkout')}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Header 
        restaurantInfo={restaurantInfo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <TabBar 
        sections={menuSections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {menuSections.map((section) => (
          <section key={section.id} data-section-id={section.id}>
            <MenuSectionComponent section={section} onItemClick={handleItemClick} />
          </section>
        ))}
      </main>

      <Footer onCartClick={() => setShowCart(true)} />
    </div>
  );
}

export default MenuPage;