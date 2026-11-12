import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item)).filter((item) => item.qty > 0));
  };

  const clearCart = () => setCart([]);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, addToCart, updateQty, clearCart, totalQty, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
