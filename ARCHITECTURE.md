# CAC 电商独立站 PWA 架构文档

## 📋 项目概述

这是一个基于现代技术栈构建的渐进式Web应用程序（PWA），主要功能包括：
- 电商独立站台（产品管理、购物车、订单处理）
- 游戏化功能（积分、等级、徽章、成就系统）

## 🏗️ 技术栈

### 前端技术栈
- **框架**: Next.js 14 (React 18)
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: Framer Motion
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod
- **HTTP客户端**: Axios
- **PWA支持**: next-pwa

### 后端技术栈
- **框架**: NestJS
- **语言**: TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: Passport.js (JWT + Local Strategy)
- **API文档**: Swagger/OpenAPI
- **安全**: Helmet, Compression, Cookie Parser

## 📦 项目结构

```
CAC/
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── layout.tsx   # 根布局
│   │   │   ├── page.tsx     # 首页
│   │   │   └── globals.css  # 全局样式
│   │   ├── components/      # React 组件
│   │   │   ├── ui/          # shadcn/ui 组件
│   │   │   └── providers.tsx # 上下文提供者
│   │   ├── lib/             # 工具函数
│   │   │   ├── api.ts       # API 客户端
│   │   │   └── utils.ts     # 通用工具
│   │   └── types/           # TypeScript 类型定义
│   ├── public/              # 静态资源
│   │   ├── manifest.json    # PWA 清单文件
│   │   └── icons/           # PWA 图标
│   ├── next.config.js       # Next.js 配置
│   ├── tailwind.config.ts   # Tailwind CSS 配置
│   ├── postcss.config.js    # PostCSS 配置
│   ├── components.json      # shadcn/ui 配置
│   └── package.json         # 前端依赖
│
├── backend/                 # NestJS 后端应用
│   ├── src/
│   │   ├── modules/         # 功能模块
│   │   │   ├── auth/        # 认证模块
│   │   │   ├── users/       # 用户模块
│   │   │   ├── products/    # 产品模块
│   │   │   ├── categories/  # 分类模块
│   │   │   ├── cart/        # 购物车模块
│   │   │   ├── orders/      # 订单模块
│   │   │   ├── reviews/     # 评价模块
│   │   │   └── gamification/# 游戏化模块
│   │   ├── common/          # 通用模块
│   │   │   ├── decorators/  # 装饰器
│   │   │   ├── filters/     # 异常过滤器
│   │   │   └── interceptors/# 拦截器
│   │   ├── prisma/          # Prisma 服务
│   │   ├── app.module.ts    # 根模块
│   │   └── main.ts          # 应用入口
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma 数据模型
│   │   └── seed.ts          # 数据库种子文件
│   ├── nest-cli.json        # NestJS CLI 配置
│   ├── tsconfig.json        # TypeScript 配置
│   └── package.json         # 后端依赖
│
├── package.json             # 根 package.json (Monorepo)
├── tsconfig.json            # 根 TypeScript 配置
├── README.md                # 项目说明
└── ARCHITECTURE.md          # 本架构文档
```

## 📚 依赖包详解

### 前端依赖 (frontend/package.json)

#### 核心框架
- **next** (^14.0.4): Next.js 框架，提供 SSR、SSG、路由等功能
- **react** (^18.2.0): React 库
- **react-dom** (^18.2.0): React DOM 渲染器

#### UI 组件库 (shadcn/ui + Radix UI)
- **@radix-ui/react-accordion**: 手风琴组件
- **@radix-ui/react-alert-dialog**: 警告对话框
- **@radix-ui/react-avatar**: 头像组件
- **@radix-ui/react-checkbox**: 复选框
- **@radix-ui/react-dialog**: 对话框
- **@radix-ui/react-dropdown-menu**: 下拉菜单
- **@radix-ui/react-label**: 标签组件
- **@radix-ui/react-popover**: 弹出框
- **@radix-ui/react-progress**: 进度条
- **@radix-ui/react-radio-group**: 单选按钮组
- **@radix-ui/react-select**: 选择器
- **@radix-ui/react-separator**: 分隔线
- **@radix-ui/react-slider**: 滑块
- **@radix-ui/react-slot**: 插槽组件
- **@radix-ui/react-switch**: 开关
- **@radix-ui/react-tabs**: 标签页
- **@radix-ui/react-toast**: 提示消息

#### 样式和工具
- **tailwindcss** (^3.4.0): 实用优先的 CSS 框架
- **tailwindcss-animate** (^1.0.7): Tailwind 动画插件
- **class-variance-authority** (^0.7.0): 类名变体管理
- **clsx** (^2.0.0): 条件类名工具
- **tailwind-merge** (^2.2.0): 合并 Tailwind 类名
- **lucide-react** (^0.303.0): 图标库

#### 动画
- **framer-motion** (^10.16.16): 强大的动画库

#### 状态管理和数据获取
- **zustand** (^4.4.7): 轻量级状态管理库
- **axios** (^1.6.2): HTTP 客户端

#### 表单处理
- **react-hook-form** (^7.49.2): 高性能表单库
- **@hookform/resolvers** (^3.3.2): 表单验证解析器
- **zod** (^3.22.4): TypeScript 优先的验证库

#### PWA 支持
- **next-pwa** (^5.6.0): Next.js PWA 插件

#### 工具库
- **date-fns** (^3.0.6): 日期处理库

#### 开发依赖
- **typescript** (^5.3.3): TypeScript 编译器
- **@types/node**, **@types/react**, **@types/react-dom**: TypeScript 类型定义
- **postcss** (^8.4.33): CSS 后处理器
- **autoprefixer** (^10.4.16): 自动添加 CSS 前缀
- **eslint** (^8.56.0): 代码检查工具
- **eslint-config-next** (^14.0.4): Next.js ESLint 配置

### 后端依赖 (backend/package.json)

#### 核心框架
- **@nestjs/common** (^10.3.0): NestJS 核心模块
- **@nestjs/core** (^10.3.0): NestJS 核心
- **@nestjs/platform-express** (^10.3.0): Express 平台适配器
- **reflect-metadata** (^0.1.13): 元数据反射支持
- **rxjs** (^7.8.1): 响应式编程库

#### 配置管理
- **@nestjs/config** (^3.1.1): 配置管理模块

#### 认证和授权
- **@nestjs/jwt** (^10.2.0): JWT 模块
- **@nestjs/passport** (^10.0.3): Passport 集成
- **passport** (^0.7.0): 认证中间件
- **passport-jwt** (^4.0.1): JWT 策略
- **passport-local** (^1.0.0): 本地策略
- **bcrypt** (^5.1.1): 密码加密

#### 数据库
- **@prisma/client** (^5.7.1): Prisma 客户端
- **prisma** (^5.7.1): Prisma CLI

#### API 文档
- **@nestjs/swagger** (^7.1.17): Swagger/OpenAPI 集成

#### 安全和性能
- **helmet** (^7.1.0): 安全头设置
- **compression** (^1.7.4): 响应压缩
- **cookie-parser** (^1.4.6): Cookie 解析
- **@nestjs/throttler** (^5.0.1): 速率限制

#### 验证和转换
- **class-validator** (^0.14.0): 类验证装饰器
- **class-transformer** (^0.5.1): 类转换工具

#### 开发依赖
- **@nestjs/cli** (^10.2.1): NestJS CLI
- **@nestjs/schematics** (^10.0.3): NestJS 代码生成器
- **@nestjs/testing** (^10.3.0): 测试工具
- **typescript** (^5.3.3): TypeScript 编译器
- **@types/***: 各种类型定义
- **jest** (^29.7.0): 测试框架
- **ts-jest** (^29.1.1): TypeScript Jest 转换器
- **supertest** (^6.3.3): HTTP 断言库
- **eslint**, **prettier**: 代码质量和格式化工具

### 根依赖 (package.json)
- **concurrently** (^8.2.2): 并发运行多个命令

## ⚙️ 配置文件详解

### 前端配置

#### next.config.js
```javascript
- PWA 配置 (next-pwa)
- 图片优化配置
- React Strict Mode
- SWC 压缩
```

#### tailwind.config.ts
```typescript
- 暗色模式支持
- shadcn/ui 主题配置
- 自定义颜色系统
- 响应式断点
- 动画配置
```

#### postcss.config.js
```javascript
- Tailwind CSS 插件
- Autoprefixer 插件
```

#### components.json (shadcn/ui)
```json
- UI 组件配置
- 样式变量配置
- 组件路径配置
```

#### tsconfig.json
```json
- TypeScript 编译选项
- 路径别名配置
- 严格模式设置
```

### 后端配置

#### nest-cli.json
```json
- 源代码根目录
- 编译输出目录
- 资源文件配置
```

#### tsconfig.json
```json
- TypeScript 编译选项
- 装饰器支持
- 路径映射
```

#### prisma/schema.prisma
```prisma
- 数据库连接配置
- 数据模型定义
- 关系映射
```

## 🗄️ 数据库架构

### 核心模型

1. **User** - 用户模型
   - 基本信息（邮箱、用户名、密码）
   - 角色管理（CUSTOMER, ADMIN, MODERATOR）
   - 关联：订单、购物车、地址、评价、游戏化档案

2. **Product** - 产品模型
   - 基本信息（名称、描述、价格、库存）
   - 图片数组
   - SKU 管理
   - 关联：分类、购物车、订单项、评价、属性

3. **Category** - 分类模型
   - 树形结构（父子关系）
   - 关联：产品

4. **CartItem** - 购物车项
   - 用户-产品关联
   - 数量管理

5. **Order** - 订单模型
   - 订单状态（PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED）
   - 支付状态（PENDING, PAID, FAILED, REFUNDED）
   - 金额计算（总额、小计、税费、运费、折扣）
   - 关联：用户、订单项、地址

6. **OrderItem** - 订单项
   - 产品快照（价格、数量）

7. **Address** - 地址模型
   - 类型（SHIPPING, BILLING, BOTH）
   - 完整地址信息

8. **Review** - 评价模型
   - 评分（1-5）
   - 评论内容
   - 验证状态

9. **GamificationProfile** - 游戏化档案
   - 积分系统
   - 等级系统
   - 经验值
   - 徽章和成就

## 🔐 认证架构

### JWT 认证流程
1. 用户登录（用户名/密码）
2. 后端验证并生成 JWT Token
3. Token 存储在 HttpOnly Cookie 或 LocalStorage
4. 后续请求携带 Token
5. 后端验证 Token 并授权

### 策略
- **Local Strategy**: 用户名密码登录
- **JWT Strategy**: Token 验证

### Guards
- **JwtAuthGuard**: JWT 认证守卫
- **LocalAuthGuard**: 本地认证守卫

## 🎮 游戏化系统

### 功能模块
- **积分系统**: 用户通过购买、评价等行为获得积分
- **等级系统**: 基于经验值自动升级
- **徽章系统**: 完成特定任务获得徽章
- **成就系统**: 解锁各种成就

### 数据模型
- `GamificationProfile`: 存储用户游戏化数据
- 与 `User` 一对一关系

## 📡 API 架构

### RESTful API 设计
- 基础路径: `/api`
- 版本控制: 通过路径或头部
- 认证: Bearer Token (JWT)

### 模块端点

#### 认证模块 (`/api/auth`)
- `POST /login` - 用户登录
- `POST /register` - 用户注册
- `POST /logout` - 用户登出
- `GET /profile` - 获取当前用户信息

#### 用户模块 (`/api/users`)
- `GET /` - 获取用户列表（管理员）
- `GET /:id` - 获取用户详情
- `PUT /:id` - 更新用户信息
- `DELETE /:id` - 删除用户

#### 产品模块 (`/api/products`)
- `GET /` - 获取产品列表（支持分页、筛选、排序）
- `GET /:id` - 获取产品详情
- `POST /` - 创建产品（管理员）
- `PUT /:id` - 更新产品（管理员）
- `DELETE /:id` - 删除产品（管理员）

#### 分类模块 (`/api/categories`)
- `GET /` - 获取分类树
- `GET /:id` - 获取分类详情
- `POST /` - 创建分类（管理员）
- `PUT /:id` - 更新分类（管理员）
- `DELETE /:id` - 删除分类（管理员）

#### 购物车模块 (`/api/cart`)
- `GET /` - 获取当前用户购物车
- `POST /` - 添加商品到购物车
- `PUT /:id` - 更新购物车项数量
- `DELETE /:id` - 删除购物车项
- `DELETE /` - 清空购物车

#### 订单模块 (`/api/orders`)
- `GET /` - 获取订单列表
- `GET /:id` - 获取订单详情
- `POST /` - 创建订单
- `PUT /:id/status` - 更新订单状态
- `DELETE /:id` - 取消订单

#### 评价模块 (`/api/reviews`)
- `GET /product/:productId` - 获取产品评价
- `POST /` - 创建评价
- `PUT /:id` - 更新评价
- `DELETE /:id` - 删除评价

#### 游戏化模块 (`/api/gamification`)
- `GET /profile` - 获取用户游戏化档案
- `POST /points` - 添加积分
- `GET /leaderboard` - 获取排行榜
- `POST /badges` - 授予徽章

### API 文档
- Swagger UI: `http://localhost:3001/api/docs`

## 🎨 前端架构

### 目录结构
```
src/
├── app/              # Next.js App Router
│   ├── (auth)/      # 认证相关页面
│   ├── (shop)/      # 商城相关页面
│   ├── (dashboard)/ # 仪表板页面
│   └── api/         # API 路由（如需要）
├── components/       # React 组件
│   ├── ui/          # shadcn/ui 基础组件
│   ├── layout/      # 布局组件
│   ├── features/    # 功能组件
│   └── common/      # 通用组件
├── lib/             # 工具库
│   ├── api.ts       # API 客户端
│   ├── utils.ts     # 工具函数
│   └── constants.ts # 常量定义
├── hooks/           # 自定义 Hooks
├── store/           # Zustand 状态管理
└── types/           # TypeScript 类型
```

### 状态管理
- **Zustand**: 全局状态管理
  - 用户状态
  - 购物车状态
  - UI 状态（主题、侧边栏等）

### 路由结构
- `/` - 首页
- `/products` - 产品列表
- `/products/[slug]` - 产品详情
- `/cart` - 购物车
- `/checkout` - 结账
- `/orders` - 订单列表
- `/orders/[id]` - 订单详情
- `/profile` - 用户资料
- `/gamification` - 游戏化中心
- `/login` - 登录
- `/register` - 注册

## 🔧 环境变量配置

### 前端环境变量 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=CAC E-commerce
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 后端环境变量 (.env)
```env
# 应用配置
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/cac_ecommerce?schema=public

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# 其他配置
BCRYPT_ROUNDS=10
```

## 🚀 开发工作流

### 启动开发环境
```bash
# 安装依赖
npm install

# 启动数据库（需要 PostgreSQL 运行）
# 运行数据库迁移
npm run prisma:migrate

# 生成 Prisma 客户端
npm run prisma:generate

# 启动开发服务器（前端 + 后端）
npm run dev
```

### 构建生产版本
```bash
# 构建前端
npm run build:frontend

# 构建后端
npm run build:backend

# 或同时构建
npm run build
```

### 数据库操作
```bash
# 创建迁移
npm run prisma:migrate

# 打开 Prisma Studio
npm run prisma:studio

# 生成 Prisma 客户端
npm run prisma:generate
```

## 📱 PWA 配置

### Manifest 配置
- 应用名称和描述
- 图标配置（192x192, 512x512）
- 主题颜色
- 显示模式（standalone）
- 快捷方式

### Service Worker
- 自动注册（通过 next-pwa）
- 缓存策略（NetworkFirst）
- 离线支持

### 图标要求
- `/public/icon-192x192.png`
- `/public/icon-512x512.png`
- 支持 maskable 图标

## 🔒 安全措施

### 后端安全
- Helmet: 设置安全 HTTP 头
- CORS: 跨域资源共享配置
- Rate Limiting: 防止暴力攻击
- JWT: 安全的认证机制
- Password Hashing: bcrypt 加密
- Input Validation: class-validator 验证

### 前端安全
- HTTPS: 生产环境强制 HTTPS
- XSS 防护: React 自动转义
- CSRF 防护: SameSite Cookie
- 敏感信息: 不存储在客户端

## 📊 性能优化

### 前端优化
- Next.js 自动代码分割
- 图片优化（next/image）
- 静态生成（SSG）
- 服务端渲染（SSR）
- PWA 缓存策略
- Framer Motion 动画优化

### 后端优化
- 响应压缩（compression）
- 数据库查询优化（Prisma）
- 缓存策略
- 连接池管理

## 🧪 测试策略

### 后端测试
- 单元测试（Jest）
- 集成测试
- E2E 测试

### 前端测试
- 组件测试
- 集成测试
- E2E 测试（可选）

## 📝 代码规范

### TypeScript
- 严格模式
- 类型检查
- 路径别名

### ESLint
- Next.js 推荐配置
- 自定义规则

### Prettier
- 代码格式化
- 统一风格

## 🔄 部署架构

### 推荐部署方案
- **前端**: Vercel / Netlify
- **后端**: Railway / Render / AWS / DigitalOcean
- **数据库**: PostgreSQL (Supabase / Neon / Railway)

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

## 📚 扩展建议

### 未来功能
- 支付集成（Stripe, PayPal）
- 邮件服务（SendGrid, Resend）
- 文件上传（AWS S3, Cloudinary）
- 搜索功能（Algolia, Meilisearch）
- 实时通知（WebSocket, Pusher）
- 分析工具（Google Analytics, Mixpanel）

### 性能监控
- Sentry（错误追踪）
- LogRocket（会话重放）
- Vercel Analytics（性能分析）

## 🎯 最佳实践

1. **代码组织**: 模块化、可复用
2. **类型安全**: 充分利用 TypeScript
3. **错误处理**: 统一的错误处理机制
4. **日志记录**: 结构化日志
5. **API 设计**: RESTful 原则
6. **数据库设计**: 规范化、索引优化
7. **安全性**: 多层安全防护
8. **性能**: 持续优化和监控

---

**最后更新**: 2024年
**维护者**: CAC 开发团队
