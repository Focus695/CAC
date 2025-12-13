// API服务层 - 用于与后端交互
// 该文件可以进一步扩展，支持更多API端点和功能

// 自动检测后端端口的函数 (3000-3010)
async function findBackendPort(): Promise<number> {
  const baseUrl = 'http://localhost';
  const minPort = 3000;
  const maxPort = 3010;

  for (let port = minPort; port <= maxPort; port++) {
    try {
      // 使用Promise.race实现超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 100); // 100ms超时

      // 尝试HEAD请求到根路径，如果失败可以尝试其他已知路径
      try {
        const response = await fetch(`${baseUrl}:${port}/`, {
          method: 'HEAD',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return port; // 如果成功，返回该端口
      } catch {
        // 如果根路径HEAD请求失败，尝试其他常见路径
      }

      // 尝试GET请求到健康检查或API路径
      const apiPaths = ['/api', '/health', '/status', '/docs'];
      for (const path of apiPaths) {
        try {
          const response = await fetch(`${baseUrl}:${port}${path}`, {
            method: 'GET',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          return port; // 如果成功，返回该端口
        } catch {
          // 如果失败，尝试下一个路径
        }
      }

      // 所有尝试都失败了，继续下一个端口
    } catch (error) {
      // 端口不可用，继续尝试
    }
  }

  // 如果没有找到可用端口，返回默认端口
  return 3001;
}

// 自动检测并设置API基础URL
let API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 在应用初始化时检测端口
(async () => {
  // 只有当没有配置环境变量时才自动检测端口
  if (!process.env.NEXT_PUBLIC_API_URL) {
    try {
      const port = await findBackendPort();
      API_BASE_URL = `http://localhost:${port}`;
      console.log(`已自动检测到后端端口: ${port}`);
    } catch (error) {
      console.error('自动检测后端端口失败，将使用默认端口:', error);
    }
  }
})();

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

  // Admin endpoints
  async getUsers(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any[]>(response);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  },

  async getAdminProducts(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any[]>(response);
    } catch (error) {
      console.error('获取产品列表失败:', error);
      throw error;
    }
  },

  async createProduct(productData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('创建产品失败:', error);
      throw error;
    }
  },

  async updateProduct(productId: string, productData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('更新产品失败:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('删除产品失败:', error);
      throw error;
    }
  },

  async toggleProductStatus(productId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('切换产品状态失败:', error);
      throw error;
    }
  },

  async getOrders(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any[]>(response);
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('获取订单详情失败:', error);
      throw error;
    }
  },

  async shipOrder(orderId: string, trackingNumber: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/ship`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ trackingNumber }),
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('标记订单为已发货失败:', error);
      throw error;
    }
  },

  async deliverOrder(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('标记订单为已收货失败:', error);
      throw error;
    }
  },
};
