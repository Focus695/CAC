// API服务层 - 用于与后端交互
// 该文件可以进一步扩展，支持更多API端点和功能

// 如果没有配置环境变量，则在本地开发时默认指向 Nest 后端端口 3001
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * 处理API响应的辅助函数
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const json = await response.json();

  // 兼容后端使用全局 TransformInterceptor 包装返回值的情况：
  // { success: boolean; data: T; timestamp: string }
  if (json && typeof json === 'object' && 'data' in json) {
    return (json as { data: T }).data;
  }

  return json;
}

/**
 * API服务类
 */
export const apiService = {
  // 获取所有产品
  async getProducts(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const result = await handleApiResponse<any[]>(response);

      // 如果接口成功但返回为空，则使用本地静态数据兜底
      if (!result || result.length === 0) {
        const constants = await import('../constants');
        return constants.PRODUCTS;
      }

      return result;
    } catch (error) {
      console.error('获取产品失败:', error);
      // 如果API请求失败，直接返回本地静态数据作为降级方案
      const constants = await import('../constants');
      return constants.PRODUCTS;
    }
  },

  // 获取单个产品
  async getProductById(productId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      const result = await handleApiResponse<any>(response);

      // 如果接口成功但未返回具体产品，使用本地静态数据兜底
      if (!result) {
        const constants = await import('../constants');
        return constants.PRODUCTS.find(product => product.id === productId);
      }

      return result;
    } catch (error) {
      console.error('获取产品详情失败:', error);
      // 如果API请求失败，直接从本地静态数据中查找对应产品
      const constants = await import('../constants');
      return constants.PRODUCTS.find(product => product.id === productId);
    }
  },

  // 获取所有分类
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return handleApiResponse<any[]>(response);
    } catch (error) {
      console.error('获取分类失败:', error);
      // 如果API请求失败，返回静态数据作为降级方案
      const { Category } = await import('../types');
      return Object.values(Category);
    }
  },

  // 创建订单
  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('创建订单失败:', error);
      throw error;
    }
  },

  // 获取用户订单列表
  async getUserOrders(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any[]>(response);
    } catch (error) {
      console.error('获取用户订单失败:', error);
      throw error;
    }
  },

  // 购物车相关接口

  // 获取购物车
  async getCart(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('获取购物车失败:', error);
      // 返回空购物车作为降级
      return { items: [], subtotal: 0, totalItems: 0 };
    }
  },

  // 添加商品到购物车
  async addToCart(productId: string, quantity: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('添加商品到购物车失败:', error);
      throw error;
    }
  },

  // 更新购物车商品数量
  async updateCartItem(cartItemId: string, quantity: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity }),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('更新购物车商品数量失败:', error);
      throw error;
    }
  },

  // 删除购物车商品
  async removeCartItem(cartItemId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('删除购物车商品失败:', error);
      throw error;
    }
  },

  // 清空购物车
  async clearCart(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('清空购物车失败:', error);
      throw error;
    }
  },

  // 模拟支付成功
  async simulatePaymentSuccess(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay-success`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('模拟支付成功失败:', error);
      throw error;
    }
  },

  // 注册新用户
  async register(registerData: {
    email: string;
    password: string;
    username?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 用户登录
  async login(loginData: {
    email: string;
    password: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 获取用户信息
  async getProfile(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },
};
