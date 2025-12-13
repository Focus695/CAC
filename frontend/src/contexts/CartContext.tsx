'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { apiService } from '../services/api';

// Define more comprehensive cart context types that match backend response
interface CartItemWithId extends CartItem {
  id: string; // Cart item ID from backend
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItemWithId[];
  subtotal: number;
  totalItems: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

// Create context with default values
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemWithId[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiService.getCart();

      // Format cart items to match expected structure
      const formattedItems = Array.isArray(cartData.items) ? cartData.items : [];

      setCartItems(formattedItems as CartItemWithId[]);
      setSubtotal(cartData.subtotal || 0);
      setTotalItems(cartData.totalItems || 0);
    } catch (error) {
      // Handle unauthorized errors gracefully (for admin users who don't have a cart)
      console.error('Failed to fetch cart:', error);
      // Don't show an error message to the user, just clear the cart
      setCartItems([]);
      setSubtotal(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      await apiService.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (cartItemId: string, quantity: number) => {
    try {
      setLoading(true);
      await apiService.updateCartItem(cartItemId, quantity);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove cart item
  const removeCartItem = async (cartItemId: string) => {
    try {
      setLoading(true);
      await apiService.removeCartItem(cartItemId);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      await apiService.clearCart();
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  const contextValue: CartContextType = {
    cartItems,
    subtotal,
    totalItems,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
