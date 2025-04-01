// AppContent.tsx
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../contexts/CartContext'; // Usar o contexto
import { CardapioLayout } from './CardapioLayout';
import ItemDetails from './itens/ItemDetail';
import { Cart } from './carrinho/Cart';
import CustomerData from './cliente/CustomerData';
import OrderTracking from './pedidos/OrderTracking';
import type { CartItem } from '../types';
import RestauranteInfo from './restaurante/RestauranteInfo';

const AppContent: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const {
    cartItems,
    setCartItems,
    clearCart,
    editCartItem,
    itemToEdit,
    setItemToEdit
  } = useCart();
  const navigate = useNavigate();
  const restauranteId = localStorage.getItem('restauranteId');

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
    setItemToEdit(item); 
    navigate(`/item/${item.id.split('-')[0]}`);
  };

  const handleAddMore = () => navigate(`/cardapio/${restauranteId}`);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Toaster />
      <Routes>
        <Route path="/cardapio/:restauranteId/*" element={<CardapioLayout />} />
        <Route 
          path="/item/:itemId" 
          element={
            <ItemDetails 
              onAddToCart={handleAddToCart} 
              itemToEdit={itemToEdit} 
              onEditItem={editCartItem} 
            />
          } 
        />
        <Route
          path="/cart"
          element={
            <Cart
              items={cartItems}
              onBack={() => navigate(-1)}
              onClearCart={clearCart}
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
            <CustomerData
              cartItems={cartItems}
              onBack={() => navigate(-1)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="*" element={<Navigate to={`/cardapio/${restauranteId}`} />} />
        <Route
          path="/restaurante" 
          element={
            <RestauranteInfo 
              isDarkMode={isDarkMode}
              onBack={() => navigate(-1)}
              onToggleDarkMode={toggleDarkMode}
            />} 
        />
      </Routes>
    </div>
  );
};

export default AppContent;