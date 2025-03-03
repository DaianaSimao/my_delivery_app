// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { Toaster } from 'react-hot-toast';
import MenuPage from './components/cardapio/MenuPage';
import type { MenuItem, CartItem } from './types';
import ItemDetails from './components/itens/ItemDetail';

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const handleAddToCartClick = (item: MenuItem) => {
    const cartItem: CartItem = {
      ...item,
      quantity: 1
    };
    setCartItems([...cartItems, cartItem]);
  };

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
          restauranteId="1" // Passe o ID do restaurante dinamicamente, se necessário
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <Routes>
          <Route
            path="/cardapio/:restauranteId"
            element={
              <MenuPage
                onCartClick={() => setShowCart(true)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/cardapio/1" />} />
          <Route path="/item/:itemId" element={<ItemDetails />} />
        </Routes>
        <Footer onCartClick={() => setShowCart(true)} />
      </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;