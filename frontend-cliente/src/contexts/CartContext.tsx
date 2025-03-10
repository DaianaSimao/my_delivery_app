// CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  restauranteId: string | null;
  setRestauranteId: (id: string | null) => void;
  onCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [restauranteId, setRestauranteId] = useState<string | null>(null);

  useEffect(() => {
    if (restauranteId) {
      const savedRestauranteId = localStorage.getItem('restauranteId');
      if (savedRestauranteId !== restauranteId) {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        localStorage.setItem('restauranteId', restauranteId);
      }
    }
  }, [restauranteId]);
  
  const onCheckout = () => {
    console.log("Limpando carrinho e redirecionando...");
    setCartItems([]); // Limpa o carrinho
    localStorage.removeItem('cartItems'); // Remove os itens do localStorage
    console.log("Carrinho limpo e redirecionando para o checkout...");
    // Adicione aqui a lógica de redirecionamento, se necessário
  };

  // Salva o carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, restauranteId, setRestauranteId, onCheckout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};