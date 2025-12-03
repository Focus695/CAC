# 配置文件详解

本文档详细说明项目中所有配置文件的用途和配置项。

## 📁 前端配置文件

### next.config.js

Next.js 应用的主配置文件。

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',              // PWA 文件输出目录
  register: true,              // 自动注册 Service Worker
  skipWaiting: true,           // 跳过等待，立即激活新版本
  disable: process.env.NODE_ENV === 'development', // 开发环境禁用
  runtimeCaching: [            // 运行时缓存策略
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',  // 网络优先策略
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,      // 最大缓存条目数
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,       // React 严格模式
  swcMinify: true,             // 使用 SWC 压缩
  images: {
    domains: ['localhost'],     // 允许的图片域名
    formats: ['image/avif', 'image/webp'], // 支持的图片格式
  },
  experimental: {
    appDir: true,               // 启用 App Router
  },
};

module.exports = withPWA(nextConfig);
```

**主要配置项说明**:
- `reactStrictMode`: 启用 React 严格模式，帮助发现潜在问题
- `swcMinify`: 使用 SWC 进行代码压缩，比 Terser 更快
- `images.domains`: 配置允许加载图片的外部域名
- `images.formats`: 配置 Next.js Image 组件支持的现代图片格式
- `experimental.appDir`: 启用 Next.js 13+ 的 App Router

### tailwind.config.ts

Tailwind CSS 配置文件，定义了设计系统的颜色、间距、字体等。

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],          // 基于 class 的暗色模式
  content: [                    // 指定 Tailwind 扫描的文件路径
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",                   // 类名前缀（可选）
  theme: {
    container: {                // 容器配置
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {                 // 扩展颜色系统（shadcn/ui）
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        // ... 更多颜色
      },
      borderRadius: {           // 圆角配置
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {              // 自定义动画关键帧
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        // ... 更多动画
      },
      animation: {              // 动画配置
        "accordion-down": "accordion-down 0.2s ease-out",
        // ... 更多动画
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // 动画插件
} satisfies Config

export default config
```

**主要配置项说明**:
- `darkMode`: 暗色模式实现方式（class 或 media）
- `content`: 指定 Tailwind 需要扫描的文件，用于 tree-shaking
- `theme.extend`: 扩展默认主题，不覆盖原有配置
- `plugins`: 添加 Tailwind 插件

### postcss.config.js

PostCSS 配置文件，用于处理 CSS。

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},      // Tailwind CSS 插件
    autoprefixer: {},     // 自动添加浏览器前缀
  },
}
```

**主要配置项说明**:
- `tailwindcss`: 处理 Tailwind CSS 指令
- `autoprefixer`: 自动添加 CSS 浏览器前缀

### components.json

shadcn/ui 组件库的配置文件。

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",                    // 样式风格
  "rsc": true,                           // 支持 React Server Components
  "tsx": true,                           // 使用 TypeScript
  "tailwind": {
    "config": "tailwind.config.ts",      // Tailwind 配置文件路径
    "css": "src/app/globals.css",        // 全局 CSS 文件路径
    "baseColor": "slate",                // 基础颜色
    "cssVariables": true,                // 使用 CSS 变量
    "prefix": ""                         // 类名前缀
  },
  "aliases": {
    "components": "@/components",         // 组件路径别名
    "utils": "@/lib/utils"               // 工具函数路径别名
  }
}
```

**主要配置项说明**:
- `style`: 组件样式风格（default, new-york）
- `rsc`: 是否支持 React Server Components
- `baseColor`: 基础颜色主题
- `cssVariables`: 使用 CSS 变量实现主题
- `aliases`: 路径别名配置

### tsconfig.json (前端)

TypeScript 编译器配置。

```json
{
  "compilerOptions": {
    "target": "ES2020",                  // 编译目标版本
    "lib": ["dom", "dom.iterable", "esnext"], // 包含的库文件
    "allowJs": true,                      // 允许 JavaScript 文件
    "skipLibCheck": true,                 // 跳过库文件类型检查
    "strict": true,                       // 严格模式
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致
    "noEmit": true,                       // 不输出文件（Next.js 处理）
    "esModuleInterop": true,              // ES 模块互操作
    "module": "esnext",                   // 模块系统
    "moduleResolution": "bundler",        // 模块解析策略
    "resolveJsonModule": true,            // 解析 JSON 模块
    "isolatedModules": true,              // 隔离模块
    "jsx": "preserve",                    // JSX 处理方式
    "incremental": true,                  // 增量编译
    "plugins": [
      {
        "name": "next"                    // Next.js TypeScript 插件
      }
    ],
    "paths": {                            // 路径别名
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**主要配置项说明**:
- `target`: 编译目标 JavaScript 版本
- `strict`: 启用所有严格类型检查
- `paths`: 路径别名，简化导入路径
- `jsx`: JSX 处理方式（preserve 表示由 Next.js 处理）

---

## 🔧 后端配置文件

### nest-cli.json

NestJS CLI 配置文件。

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",    // 代码生成器集合
  "sourceRoot": "src",                   // 源代码根目录
  "compilerOptions": {
    "deleteOutDir": true,                // 编译前删除输出目录
    "webpack": true,                     // 使用 Webpack 编译
    "tsConfigPath": "tsconfig.json"      // TypeScript 配置文件路径
  }
}
```

**主要配置项说明**:
- `sourceRoot`: 源代码目录
- `deleteOutDir`: 编译前清理输出目录
- `webpack`: 使用 Webpack 进行编译和热重载

### tsconfig.json (后端)

TypeScript 编译器配置。

```json
{
  "compilerOptions": {
    "module": "commonjs",                // 模块系统
    "declaration": true,                 // 生成声明文件
    "removeComments": true,               // 移除注释
    "emitDecoratorMetadata": true,       // 发出装饰器元数据
    "experimentalDecorators": true,      // 启用装饰器
    "allowSyntheticDefaultImports": true, // 允许合成默认导入
    "target": "ES2021",                  // 编译目标版本
    "sourceMap": true,                   // 生成源映射
    "outDir": "./dist",                  // 输出目录
    "baseUrl": "./",                     // 基础路径
    "incremental": true,                  // 增量编译
    "skipLibCheck": true,                 // 跳过库文件类型检查
    "strictNullChecks": false,           // 严格空值检查
    "noImplicitAny": false,              // 禁止隐式 any
    "strictBindCallApply": false,        // 严格绑定调用应用
    "forceConsistentCasingInFileNames": false, // 强制文件名大小写一致
    "noFallthroughCasesInSwitch": false, // Switch 语句中的 fallthrough 检查
    "paths": {                           // 路径别名
      "@/*": ["src/*"]
    }
  }
}
```

**主要配置项说明**:
- `experimentalDecorators`: 启用装饰器（NestJS 必需）
- `emitDecoratorMetadata`: 发出装饰器元数据（依赖注入必需）
- `module`: 使用 CommonJS（Node.js 标准）

### prisma/schema.prisma

Prisma 数据模型和数据库配置。

```prisma
generator client {
  provider = "prisma-client-js"  // 生成 Prisma 客户端
}

datasource db {
  provider = "postgresql"        // 数据库类型
  url      = env("DATABASE_URL") // 数据库连接 URL（从环境变量读取）
}

// 数据模型定义
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  // ... 更多字段
}
```

**主要配置项说明**:
- `generator`: 指定生成器类型
- `datasource`: 数据库连接配置
- `model`: 数据模型定义

---

## 🌍 环境变量配置

### 前端环境变量 (.env.local)

```env
# API 后端地址
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 应用配置
NEXT_PUBLIC_APP_NAME=CAC E-commerce
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 其他公共环境变量
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
# NEXT_PUBLIC_ANALYTICS_ID=...
```

**注意事项**:
- 前端环境变量必须以 `NEXT_PUBLIC_` 开头才能在前端代码中访问
- `.env.local` 文件不应提交到版本控制

### 后端环境变量 (.env)

```env
# 应用配置
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/cac_ecommerce?schema=public

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# 密码加密配置
BCRYPT_ROUNDS=10

# API 速率限制
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Swagger 配置
SWAGGER_ENABLED=true
```

**环境变量说明**:
- `PORT`: 后端服务端口
- `NODE_ENV`: 运行环境（development, production, test）
- `FRONTEND_URL`: 前端地址，用于 CORS 配置
- `DATABASE_URL`: PostgreSQL 数据库连接字符串
- `JWT_SECRET`: JWT 签名密钥（生产环境必须使用强随机字符串）
- `JWT_EXPIRES_IN`: JWT Token 过期时间
- `BCRYPT_ROUNDS`: bcrypt 加密轮数（越高越安全但越慢）

---

## 📦 根配置文件

### package.json (根)

Monorepo 根配置文件，管理整个项目。

```json
{
  "name": "cac-ecommerce-pwa",
  "version": "1.0.0",
  "private": true,
  "workspaces": [              // npm workspaces 配置
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "build": "npm run build:frontend && npm run build:backend",
    // ... 更多脚本
  },
  "devDependencies": {
    "concurrently": "^8.2.2"   // 并发运行脚本
  },
  "engines": {
    "node": ">=18.0.0",         // Node.js 版本要求
    "npm": ">=9.0.0"            // npm 版本要求
  }
}
```

**主要配置项说明**:
- `workspaces`: npm workspaces，管理多个包
- `scripts`: 项目脚本命令
- `engines`: 指定 Node.js 和 npm 版本要求

### tsconfig.json (根)

根 TypeScript 配置，用于 IDE 支持。

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist", "build", ".next"]
}
```

---

## 🔒 安全配置建议

### 生产环境配置

1. **环境变量安全**:
   - 使用强随机字符串作为 `JWT_SECRET`
   - 不要在代码中硬编码敏感信息
   - 使用环境变量管理工具（如 AWS Secrets Manager）

2. **CORS 配置**:
   - 生产环境限制 `FRONTEND_URL` 为实际域名
   - 不要使用通配符 `*`

3. **数据库连接**:
   - 使用连接池
   - 启用 SSL 连接（生产环境）

4. **速率限制**:
   - 根据实际需求调整 `THROTTLE_TTL` 和 `THROTTLE_LIMIT`
   - 为不同端点设置不同的限制

---

## 📝 配置最佳实践

1. **环境分离**: 为开发、测试、生产环境使用不同的配置文件
2. **版本控制**: 不要提交包含敏感信息的配置文件
3. **类型安全**: 使用 TypeScript 类型定义环境变量
4. **文档化**: 保持配置文件注释清晰
5. **验证**: 在应用启动时验证必需的配置项

---

**最后更新**: 2024年

