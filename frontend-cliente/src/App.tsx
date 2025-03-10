import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MenuPage from './components/cardapio/MenuPage';
import ItemDetails from './components/itens/ItemDetail';
import { Cart } from './components/carrinho/Cart';
import type { CartItem } from './types';
import { Header } from './components/Header';
import { CartProvider } from './contexts/CartContext';
import CustomerData from './components/cliente/CustomerData';
import OrderTracking from './components/pedidos/OrderTracking';

const CART_STORAGE_KEY = 'cartItems'; // Chave para salvar os itens do carrinho no localStorage

const CardapioLayout: React.FC = () => {
  const { restauranteId } = useParams<{ restauranteId: string }>();
  const [isDarkMode, setIsDarkMode] = useState(true);

  if (restauranteId) {
    localStorage.setItem('restauranteId', restauranteId);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
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

const AppContent: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const restauranteId = localStorage.getItem('restauranteId');

  // Recuperar itens do carrinho do localStorage ao carregar o componente
  useEffect(() => {
    const savedCartItems = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  // Salvar itens do carrinho no localStorage sempre que houver uma mudança
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  // Função para adicionar item ao carrinho
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY); // Limpar o localStorage ao limpar o carrinho
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const handleEditItem = (item: CartItem) => {
    navigate(`/item/${item.id}`);
  };

  const handleAddMore = () => navigate(`/cardapio/${restauranteId}`);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Toaster />
      <Routes>
        <Route
          path="/cardapio/:restauranteId/*"
          element={<CardapioLayout />}
        />
        <Route
          path="/item/:itemId"
          element={<ItemDetails onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              items={cartItems}
              onBack={() => navigate(-1)}
              onClearCart={handleClearCart}
              onEditItem={handleEditItem}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onAddMore={handleAddMore}
            />
          }
        />
        <Route
          path="/dados"
          element={
            <CustomerData cartItems={cartItems}
              onBack={() => navigate(-1)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />}
        />
        <Route
          path="/order-tracking"
          element={<OrderTracking />}
        />
        <Route path="*" element={<Navigate to={`/cardapio/${restauranteId}`} />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
};

export default App;