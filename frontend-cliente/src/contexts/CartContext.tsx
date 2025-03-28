// CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  restauranteId: string | null;
  setRestauranteId: (id: string | null) => void;
  onCheckout: () => void;
  clearCart: () => void;
  editCartItem: (originalItemId: string, updatedItem: CartItem) => void;
  itemToEdit: CartItem | null;
  setItemToEdit: React.Dispatch<React.SetStateAction<CartItem | null>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [restauranteId, setRestauranteId] = useState<string | null>(() => localStorage.getItem('restauranteId'));
  const [itemToEdit, setItemToEdit] = useState<CartItem | null>(null);

  useEffect(() => {
    if (restauranteId) {
      const savedRestauranteId = localStorage.getItem('restauranteId');
      if (savedRestauranteId !== restauranteId) {
        clearCart();
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

  const editCartItem = (originalItemId: string, updatedItem: CartItem) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === originalItemId ? updatedItem : item
      )
    );
    setItemToEdit(null);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      restauranteId, 
      setRestauranteId, 
      onCheckout, 
      clearCart, 
      editCartItem,
      itemToEdit,
      setItemToEdit
    }}>
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