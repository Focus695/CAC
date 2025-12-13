import axios from 'axios';

// 自动检测后端端口的函数 (3000-3010)
async function findBackendPort(): Promise<number> {
  const baseUrl = 'http://localhost';
  const minPort = 3000;
  const maxPort = 3010;

  for (let port = minPort; port <= maxPort; port++) {
    try {
      // 关键：不要用 "/" 或 HEAD 探测（Next.js 前端 3000 也会返回 200，容易误判为后端）
      // 使用“后端特征响应”探测：/products 在后端会返回 JSON，而前端通常是 HTML
      try {
        const resp = await axios.get(`${baseUrl}:${port}/products`, {
          timeout: 200,
          // axios 默认会跟随并解析；这里用头判断即可
          validateStatus: () => true,
        });
        const contentType = String(resp.headers?.['content-type'] || '');
        if (resp.status >= 200 && resp.status < 300 && contentType.includes('application/json')) {
          return port;
        }
      } catch {
        // ignore
      }

      // 兜底：Swagger 文档
      try {
        const resp = await axios.get(`${baseUrl}:${port}/docs`, {
          timeout: 200,
          validateStatus: () => true,
        });
        if (resp.status >= 200 && resp.status < 300) {
          return port;
        }
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

// 创建API实例，先使用默认端口
// 注意：后端未设置全局 /api 前缀
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      const newBaseURL = `http://localhost:${port}`;
      api.defaults.baseURL = newBaseURL;
      console.log(`已自动检测到后端端口: ${port}`);
    } catch (error) {
      console.error('自动检测后端端口失败，将使用默认端口:', error);
    }
  }
})();

// Request interceptor to add auth token (已改为使用httpOnly cookie)
api.interceptors.request.use((config) => {
  // 不再从localStorage获取token，token将通过cookie自动传递
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        // 不再从localStorage删除token，token将通过cookie自动过期
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

