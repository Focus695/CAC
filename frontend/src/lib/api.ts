import axios from 'axios';

// 自动检测后端端口的函数 (3000-3010)
async function findBackendPort(): Promise<number> {
  const baseUrl = 'http://localhost';
  const minPort = 3000;
  const maxPort = 3010;

  for (let port = minPort; port <= maxPort; port++) {
    try {
      // 尝试HEAD请求到根路径
      try {
        await axios.head(`${baseUrl}:${port}/`, {
          timeout: 100 // 100ms超时
        });
        return port;
      } catch {
        // 如果根路径HEAD请求失败，尝试其他常见路径
      }

      // 尝试GET请求到健康检查或API路径
      const apiPaths = ['/api', '/health', '/status', '/docs'];
      for (const path of apiPaths) {
        try {
          await axios.get(`${baseUrl}:${port}${path}`, {
            timeout: 100 // 100ms超时
          });
          return port;
        } catch {
          // 如果失败，尝试下一个路径
        }
      }
    } catch (error) {
      // 端口不可用，继续尝试
    }
  }

  // 如果没有找到可用端口，返回默认端口
  return 3001;
}

// 创建API实例，先使用默认端口
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 在应用初始化时检测端口
(async () => {
  // 只有当没有配置环境变量时才自动检测端口
  if (!process.env.NEXT_PUBLIC_API_URL) {
    try {
      const port = await findBackendPort();
      const newBaseURL = `http://localhost:${port}/api`;
      api.defaults.baseURL = newBaseURL;
      console.log(`已自动检测到后端端口: ${port}`);
    } catch (error) {
      console.error('自动检测后端端口失败，将使用默认端口:', error);
    }
  }
})();

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

