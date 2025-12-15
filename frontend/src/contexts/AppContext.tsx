"use client";

/**
 * 应用上下文 - 管理全局状态
 * 包括购物车、产品筛选、模态框等核心功能
 */
import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../constants'; // Static data as fallback
import { apiService } from '../services/api'; // API service layer

function flattenCategoryNames(nodes: any[]): string[] {
  const out: string[] = [];
  const walk = (arr: any[]) => {
    for (const n of arr || []) {
      if (!n) continue;
      if (n.name) out.push(String(n.name));
      if (Array.isArray(n.children) && n.children.length > 0) walk(n.children);
    }
  };
  walk(nodes || []);
  return out;
}

function buildCategoryIdToName(nodes: any[]): Record<string, string> {
  const map: Record<string, string> = {};
  const walk = (arr: any[]) => {
    for (const n of arr || []) {
      if (!n) continue;
      if (n.id && n.name) map[String(n.id)] = String(n.name);
      if (Array.isArray(n.children) && n.children.length > 0) walk(n.children);
    }
  };
  walk(nodes || []);
  return map;
}

function toStorefrontProduct(p: any, categoryIdToName: Record<string, string>): Product {
  // If it's already the local/static shape, return as-is
  if (p && typeof p === 'object' && 'imageUrl' in p && 'category' in p) {
    return p as Product;
  }

  const priceNum = typeof p?.price === 'number' ? p.price : parseFloat(String(p?.price ?? '0'));
  const mainImage = p?.mainImage || p?.imageUrl || '';
  const sections = Array.isArray(p?.sections) ? p.sections : [];
  const firstSection = sections[0] || {};
  const description = String(firstSection?.content_en || firstSection?.content_zh || '').trim();

  const categoryName =
    (p?.categoryId && categoryIdToName[String(p.categoryId)]) ||
    (p?.category?.name ? String(p.category.name) : '') ||
    'Uncategorized';

  // Build product with extended properties
  const product: any = {
    id: String(p?.id ?? ''),
    name: String(p?.name_en || p?.name_zh || p?.name || '').trim(),
    price: Number.isFinite(priceNum) ? priceNum : 0,
    category: categoryName as any, // keep AppContext filtering based on string equality
    description: description || '',
    imageUrl: String(mainImage),
    benefits: '',
    stock: typeof p?.stock === 'number' ? p.stock : Number(p?.stock ?? 0),
  };

  // Preserve sections and detailImages for ProductDetailModal
  if (sections.length > 0) {
    product.sections = sections;
  }
  if (Array.isArray(p?.detailImages) && p.detailImages.length > 0) {
    product.detailImages = p.detailImages;
  }

  return product;
}

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
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('about');

  // Product data state
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS); // Default to static data
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

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

  // Fetch product data from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      setProductsError(null);

      try {
        const [categories, products] = await Promise.all([apiService.getCategories(), apiService.getProducts()]);
        const categoryIdToName = buildCategoryIdToName(Array.isArray(categories) ? categories : []);
        const categoryList = flattenCategoryNames(Array.isArray(categories) ? categories : []);
        setCategoryNames(categoryList);

        // Ensure products is always an array and map backend shape -> storefront shape
        const list = Array.isArray(products) ? products : [];
        setAllProducts(list.map((p) => toStorefrontProduct(p, categoryIdToName)));
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProductsError('Failed to fetch product data, using local data instead');
        // Keep static data as fallback
      } finally {
        setIsProductsLoading(false);
      }
    };

    // Delay API request to avoid blocking page load
    const timer = setTimeout(() => {
      fetchProducts();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Product filtering - Ensure always returns an array
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];
    if (activeCategory === 'All') return allProducts;
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
