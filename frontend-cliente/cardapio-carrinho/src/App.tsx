import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MenuSection as MenuSectionComponent } from './components/MenuSection';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TabBar } from './components/TabBar';
import { Cart } from './components/Cart';
import type { MenuItem, MenuSection, RestaurantInfo, CartItem } from './types';
import { Toaster } from 'react-hot-toast';
import MenuPage from './components/cardapio/MenuPage';

const restaurantInfo: RestaurantInfo = {
  name: "Sushi Express",
  openingHours: "Seg-Dom: 11:30 - 23:00",
  minimumOrder: 30,
  profileUrl: "#",
};

const AppContent: React.FC<{ menuSections: MenuSection[] }> = ({ menuSections }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Configura o modo escuro com base nas preferências do sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkMode);
      document.documentElement.classList.toggle('dark', prefersDarkMode);
      localStorage.setItem('theme', prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleItemClick = (item: MenuItem) => {
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
      <Toaster />
      <Header 
        restaurantInfo={restaurantInfo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <TabBar 
        sections={menuSections}
        activeSection={menuSections[0]?.id || ''}
        onSectionChange={(sectionId) => console.log('Section changed:', sectionId)}
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
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/cardapio/:restauranteId" element={<MenuPage />} />
        <Route path="*" element={<Navigate to="/cardapio/1" />} /> {/* Redireciona para um restaurante padrão */}
      </Routes>
    </Router>
  );
};

export default App;