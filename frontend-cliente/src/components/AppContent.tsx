// components/AppContent.tsx
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/useCart';
import { CardapioLayout } from './CardapioLayout';
import ItemDetails from './itens/ItemDetail';
import { Cart }from './carrinho/Cart';
import CustomerData from './cliente/CustomerData';
import OrderTracking from './pedidos/OrderTracking';
import type { CartItem } from '../types';

const AppContent: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const {
    cartItems,
    handleAddToCart,
    handleClearCart,
    handleRemoveItem,
    handleUpdateQuantity,
  } = useCart();
  const navigate = useNavigate();
  const restauranteId = localStorage.getItem('restauranteId');

  const handleEditItem = (item: CartItem) => {
    navigate(`/item/${item.id}`);
  };

  const handleAddMore = () => navigate(`/cardapio/${restauranteId}`);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Toaster />
      <Routes>
        <Route path="/cardapio/:restauranteId/*" element={<CardapioLayout />} />
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
      </Routes>
    </div>
  );
};

export default AppContent;