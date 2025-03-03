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
import {Header} from './components/Header';
import { CartProvider } from './contexts/CartContext';
import ClienteDados from './components/cliente/CustomerData';

const CardapioLayout: React.FC = () => {
  // Agora o restauranteId é extraído dentro de uma rota que o define
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
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches;
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
  };  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches;
      setIsDarkMode(prefersDarkMode);
      document.documentElement.classList.toggle('dark', prefersDarkMode);
      localStorage.setItem('theme', prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

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
  const restauranteId = localStorage.getItem('restauranteId');

  // Função para adicionar item ao carrinho
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Se desejar consolidar itens iguais, adicione uma lógica para atualizar a quantidade
      return [...prev, item];
    });
  };

  const handleClearCart = () => setCartItems([]);
  const handleRemoveItem = (itemId: string) =>
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };
  const handleEditItem = (item: CartItem) => {
    // Exemplo: redireciona para a tela de detalhes para edição
    navigate(`/item/${item.id}`);
  };
  const handleAddMore = () => navigate(`/cardapio/${restauranteId}`);
  const handleCheckout = () => {
    alert('Checkout realizado com sucesso!');
    setCartItems([]);
    navigate(`/cardapio/${restauranteId}`);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Toaster />
      <Routes>
      <Route
        path="/cardapio/:restauranteId/*"
        element={
        <CardapioLayout />
        }
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
          onCheckout={handleCheckout}
        />
        }
      />
      <Route
        path="/dados"
        element={<ClienteDados />}
      />
      <Route path="*" element={<Navigate to="/cardapio/1" />} />
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
