"use client";

/**
 * 应用上下文 - 管理全局状态
 * 包括购物车、产品筛选、模态框等核心功能
 */
import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { Product, CartItem, Category } from '../types';
import { PRODUCTS } from '../constants'; // 静态数据作为降级方案
import { apiService } from '../services/api'; // API服务层

/**
 * 上下文类型定义
 */
interface AppContextType {
  // Products
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  // Order and Settings drawers
  isOrderDrawerOpen: boolean;
  isSettingsDrawerOpen: boolean;
  activeCategory: string;
  activeTab: string;

  // Product filtering
  filteredProducts: Product[];

  // Loading states
  isProductsLoading: boolean;
  productsError: string | null;

  // Cart operations
  handleAddToCart: (product: Product) => void;
  handleCheckoutStart: () => void;
  handlePaymentSuccess: () => void;

  // Modal operations
  handleProductClick: (product: Product) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  setIsProductModalOpen: (isOpen: boolean) => void;
  // Order and Settings drawers operations
  setIsOrderDrawerOpen: (isOpen: boolean) => void;
  setIsSettingsDrawerOpen: (isOpen: boolean) => void;

  // Tab operations
  setActiveCategory: (category: string) => void;
  setActiveTab: (tab: string) => void;

  // Cart summary
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  // Order and Settings drawers states
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [activeTab, setActiveTab] = useState('about');

  // 产品数据状态
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS); // 默认使用静态数据
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Cart Logic
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open drawer on add
  };


  const handleCheckoutStart = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = () => {
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
    setIsProductModalOpen(false); // Also close the product modal if open
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // 从API获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      setProductsError(null);

      try {
        const products = await apiService.getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProductsError('获取产品数据失败，正在使用本地数据');
        // 保持静态数据作为降级方案
      } finally {
        setIsProductsLoading(false);
      }
    };

    // 延迟执行API请求，避免阻塞页面加载
    const timer = setTimeout(() => {
      fetchProducts();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 产品过滤
  const filteredProducts = useMemo(() => {
    if (activeCategory === '全部') return allProducts;
    return allProducts.filter(p => p.category === activeCategory);
  }, [activeCategory, allProducts]);

  const value: AppContextType = {
    // Products
    cart,
    isCartOpen,
    isCheckoutOpen,
    selectedProduct,
    isProductModalOpen,
    // Order and Settings drawers
    isOrderDrawerOpen,
    isSettingsDrawerOpen,
    activeCategory,
    activeTab,

    // Product filtering
    filteredProducts,

    // Loading states
    isProductsLoading,
    productsError,

    // Cart operations
    handleAddToCart,
    handleCheckoutStart,
    handlePaymentSuccess,

    // Modal operations
    handleProductClick,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsProductModalOpen,
    setIsOrderDrawerOpen,
    setIsSettingsDrawerOpen,

    // Tab operations
    setActiveCategory,
    setActiveTab,

    // Cart summary
    cartTotal,
    cartCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
