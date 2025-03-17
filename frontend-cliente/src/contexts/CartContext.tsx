// CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  restauranteId: string | null;
  setRestauranteId: (id: string | null) => void;
  onCheckout: () => void;
  clearCart: () => void; // Adicionando explicitamente
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [restauranteId, setRestauranteId] = useState<string | null>(() => localStorage.getItem('restauranteId'));

  useEffect(() => {
    if (restauranteId) {
      const savedRestauranteId = localStorage.getItem('restauranteId');
      if (savedRestauranteId !== restauranteId) {
        clearCart(); // Limpa ao trocar de restaurante
        localStorage.setItem('restauranteId', restauranteId);
      }
    }
  }, [restauranteId]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const onCheckout = () => {
    clearCart();
    console.log("Carrinho limpo após checkout");
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, restauranteId, setRestauranteId, onCheckout, clearCart }}>
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