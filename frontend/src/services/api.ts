// API服务层 - 用于与后端交互
// 该文件可以进一步扩展，支持更多API端点和功能

// 自动检测后端端口的函数 (3000-3010)
async function findBackendPort(): Promise<number> {
  const baseUrl = 'http://localhost';
  const minPort = 3000;
  const maxPort = 3010;

  for (let port = minPort; port <= maxPort; port++) {
    try {
      // 关键：不要用 "/" 或 HEAD 探测（Next.js 前端 3000 也会返回 200，容易误判为后端）
      // 使用“后端特征响应”探测：例如 /products 在后端会返回 application/json
      try {
        const resp = await fetchWithTimeout(
          `${baseUrl}:${port}/products`,
          { method: 'GET' },
          200
        );
        const contentType = resp.headers.get('content-type') || '';
        if (resp.ok && contentType.includes('application/json')) {
          return port;
        }
      } catch {
        // ignore
      }

      // 兜底：Swagger 文档（通常是 text/html）
      try {
        const resp = await fetchWithTimeout(
          `${baseUrl}:${port}/docs`,
          { method: 'GET' },
          200
        );
        if (resp.ok) return port;
      } catch {
        // ignore
      }
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
 * 设置请求超时的辅助函数
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('API请求超时，请稍后重试');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 将后端分页结构解包为数组
 * 后端常见返回：
 * - { products, pagination }
 * - { users, pagination }
 * - { orders, pagination }
 */
function unwrapList<T>(result: any, key: string): T[] {
  if (Array.isArray(result)) return result as T[];
  const maybe = result?.[key];
  return Array.isArray(maybe) ? (maybe as T[]) : [];
}

type PaginationInfo = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

function toQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    searchParams.set(key, String(value));
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * 处理API响应的辅助函数
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // 克隆响应以避免body stream already read错误
    const clonedResponse = response.clone();

    try {
      const errorJson = await response.json();
      // Extract the error message from the JSON response
      const errorMessage = errorJson.message || `API请求失败: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    } catch {
      // If JSON parsing fails, fall back to text from the cloned response
      const errorText = await clonedResponse.text();
      throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
    }
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/products`);
      const result = await handleApiResponse<any>(response);

      // 兼容后端分页返回结构：{ products, pagination }
      const products = unwrapList<any>(result, 'products');

      // 如果接口成功但没有返回产品列表，则使用本地静态数据兜底
      if (!products || products.length === 0) {
        const constants = await import('../constants');
        return constants.PRODUCTS;
      }

      return products;
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/products/${productId}`);
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

  // Admin use: fetch product details without falling back to local constants
  async getProductDetails(productId: string): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/products/${productId}`, {
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  // 获取所有分类
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/categories`);
      return handleApiResponse<any[]>(response);
    } catch (error) {
      console.error('获取分类失败:', error);
      // If API fails, return empty list to avoid mismatched shapes (enum vs DB categories)
      return [];
    }
  },

  // 创建订单
  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        credentials: 'include', // 使用httpOnly cookie认证
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders`, {
        credentials: 'include'
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/cart`, {
        credentials: 'include'
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include'
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
        credentials: 'include'
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include'
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        credentials: 'include'
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders/${orderId}/pay-success`, {
        method: 'POST',
        credentials: 'include'
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
        credentials: 'include', // 关键：允许浏览器保存后端设置的httpOnly cookie
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include', // 关键：允许浏览器保存后端设置的httpOnly cookie
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 管理员登录（使用独立的 admin cookie）
  async adminLogin(loginData: { email: string; password: string }): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  // 获取用户信息
  async getProfile(): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
        credentials: 'include' // 包含cookie以验证身份
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  // 获取管理员信息（仅检查 admin cookie）
  async getAdminProfile(): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/admin/profile`, {
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  // Admin endpoints
  async getUsers(): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users`, {
        credentials: 'include'
      });
      const result = await handleApiResponse<any>(response);
      return unwrapList<any>(result, 'users');
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  async getUsersPaged(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: any[]; pagination: PaginationInfo }> {
    try {
      const query = toQueryString({
        page: params.page,
        limit: params.limit,
        search: params.search,
        role: params.role,
        isActive: params.isActive,
        sortField: params.sortField,
        sortOrder: params.sortOrder,
      });
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users${query}`, {
        credentials: 'include',
      });
      const result = await handleApiResponse<any>(response);
      return {
        users: unwrapList<any>(result, 'users'),
        pagination: result?.pagination,
      };
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  },

  async getAdminProducts(): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products`, {
        credentials: 'include'
      });
      const result = await handleApiResponse<any>(response);
      return unwrapList<any>(result, 'products');
    } catch (error) {
      console.error('获取产品列表失败:', error);
      throw error;
    }
  },

  async getAdminProductsPaged(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: any[]; pagination: PaginationInfo }> {
    try {
      const query = toQueryString({
        page: params.page,
        limit: params.limit,
        search: params.search,
        categoryId: params.categoryId,
        isActive: params.isActive,
        sortField: params.sortField,
        sortOrder: params.sortOrder,
      });
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products${query}`, {
        credentials: 'include',
      });
      const result = await handleApiResponse<any>(response);
      return {
        products: unwrapList<any>(result, 'products'),
        pagination: result?.pagination,
      };
    } catch (error) {
      console.error('获取产品列表失败:', error);
      throw error;
    }
  },

  // Admin category management
  async getAdminCategories(): Promise<any[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/categories`, {
      credentials: 'include',
    });
    return handleApiResponse<any[]>(response);
  },

  async createCategory(categoryData: any): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  async updateCategory(categoryId: string, categoryData: any): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  async deleteCategory(categoryId: string): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  async toggleCategoryStatus(categoryId: string): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/categories/${categoryId}/status`, {
      method: 'PATCH',
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  async createProduct(productData: any): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('创建产品失败:', error);
      throw error;
    }
  },

  async updateProduct(productId: string, productData: any): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('更新产品失败:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('删除产品失败:', error);
      throw error;
    }
  },

  async toggleProductStatus(productId: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products/${productId}/status`, {
        method: 'PATCH',
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('切换产品状态失败:', error);
      throw error;
    }
  },

  async publishProduct(productId: string): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products/${productId}/publish`, {
      method: 'PATCH',
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  async unpublishProduct(productId: string): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/products/${productId}/unpublish`, {
      method: 'PATCH',
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  // Admin uploads
  async uploadImage(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/uploads/image`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  async uploadImages(files: File[]): Promise<{ images: { url: string }[] }> {
    const form = new FormData();
    for (const f of files) form.append('files', f);
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/uploads/images`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },

  async getOrders(): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/orders`, {
        credentials: 'include'
      });
      const result = await handleApiResponse<any>(response);
      return unwrapList<any>(result, 'orders');
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  },

  async getOrdersPaged(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    userId?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ orders: any[]; pagination: PaginationInfo }> {
    try {
      const query = toQueryString({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
        paymentStatus: params.paymentStatus,
        paymentMethod: params.paymentMethod,
        userId: params.userId,
        sortField: params.sortField,
        sortOrder: params.sortOrder,
      });
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/orders${query}`, {
        credentials: 'include',
      });
      const result = await handleApiResponse<any>(response);
      return {
        orders: unwrapList<any>(result, 'orders'),
        pagination: result?.pagination,
      };
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/orders/${orderId}`, {
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('获取订单详情失败:', error);
      throw error;
    }
  },

  async shipOrder(orderId: string, trackingNumber: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/orders/${orderId}/ship`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber }),
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('标记订单为已发货失败:', error);
      throw error;
    }
  },

  async deliverOrder(orderId: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        credentials: 'include'
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('标记订单为已收货失败:', error);
      throw error;
    }
  },

  // 退出登录（清理后端cookie）
  async logout(): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleApiResponse<any>(response);
    } catch (error) {
      console.error('退出登录失败:', error);
      throw error;
    }
  },

  // 管理员退出登录（只清理 admin cookie）
  async adminLogout(): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleApiResponse<any>(response);
  },
};
