export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MODERATOR';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface GamificationProfile {
  id: string;
  userId: string;
  points: number;
  level: number;
  experience: number;
  badges: string[];
  achievements: string[];
}

