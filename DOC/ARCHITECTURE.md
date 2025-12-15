# CAC 电商独立站 PWA 架构文档

## 📋 项目概述

这是一个基于现代技术栈构建的渐进式Web应用程序（PWA），主要功能包括：
- 电商独立站台（产品管理、购物车、订单处理）

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
│   │   │   └── reviews/     # 评价模块
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
   - 关联：订单、购物车、地址、评价

2. **Product** - 产品模型
   - 基本信息（名称、描述、价格、库存）
   - 多语言支持（name_en/name_zh, elegantDesc, craftsmanship, healthBenefits）
   - 图片管理（mainImage, detailImages数组）
   - SKU 管理
   - **发布控制**（新增）：
     - publishedAt: DateTime - 发布时间
     - unpublishedAt: DateTime - 取消发布时间
     - 支持定时发布/下架
   - **动态内容**（新增）：
     - sections: Json - 动态产品介绍（0-3个section）
     - 格式：[{title_zh, title_en, content_zh, content_en, order}]
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

## 🔐 认证架构

### 双认证系统

本项目实现了两套独立的认证系统，分别用于用户端和管理端：

#### 1. 用户端认证 (User Authentication)
- **Strategy**: `jwt` (JwtStrategy)
- **Guard**: `JwtAuthGuard`
- **Token存储**: HttpOnly Cookie (`access_token`)
- **用途**: 前端用户购物、订单管理、个人资料

**用户认证流程**：
1. 用户通过 `POST /auth/login` 登录（email + password）
2. 后端验证凭证并使用bcrypt校验密码
3. 生成JWT Token并设置HttpOnly Cookie
4. 前端自动携带Cookie进行后续请求
5. JwtStrategy从Cookie提取Token并验证

#### 2. 管理端认证 (Admin Authentication)
- **Strategy**: `admin-jwt` (AdminJwtStrategy)
- **Guards**: `AdminJwtAuthGuard` + `AdminAuthGuard`
- **Token存储**: HttpOnly Cookie (`admin_access_token`)
- **用途**: 后台管理功能（用户管理、产品管理、订单管理等）
- **角色验证**: 必须为ADMIN或MODERATOR角色

**管理员认证流程**：
1. 管理员通过 `POST /auth/admin/login` 登录
2. 后端验证凭证 + 检查 `user.role === 'ADMIN'`
3. 生成JWT Token并设置admin专用Cookie
4. 访问 `/admin/*` 端点需通过双重验证：
   - AdminJwtAuthGuard: 验证JWT有效性
   - AdminAuthGuard: 验证用户角色为ADMIN

### Cookie认证优势
- **自动携带**: 无需前端手动处理Token
- **HttpOnly标志**: 防止XSS攻击窃取Token
- **SameSite属性**: 防止CSRF攻击
- **安全性更高**: Token不暴露给JavaScript

### 策略配置
- **Local Strategy**: 用户名密码登录验证
- **JWT Strategy**: 用户端Token验证（从`access_token` Cookie提取）
- **Admin JWT Strategy**: 管理端Token验证（从`admin_access_token` Cookie提取）

### Guards层级
```
请求 → AdminJwtAuthGuard → AdminAuthGuard → Controller
      (验证Token)         (验证角色)
```

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

### 管理员API端点

所有管理员端点需要双重认证：`AdminJwtAuthGuard` + `AdminAuthGuard`

#### 管理员 - 用户管理 (`/admin/users`)
- `GET /admin/users` - 获取用户列表（分页、搜索、筛选、排序）
  - 查询参数：page, limit, search, role, isActive, sortField, sortOrder
- `PUT /admin/users/:id` - 更新用户信息（角色、状态等）
- `DELETE /admin/users/:id` - 删除用户

#### 管理员 - 产品管理 (`/admin/products`)
- `GET /admin/products` - 获取产品列表（分页、搜索、筛选）
  - 查询参数：page, limit, search, categoryId, isActive, isFeatured
- `POST /admin/products` - 创建产品
  - 支持多语言字段、动态sections、图片上传
- `PUT /admin/products/:id` - 更新产品
- `DELETE /admin/products/:id` - 删除产品
- `PATCH /admin/products/:id/status` - 切换产品启用/禁用状态
- `PATCH /admin/products/:id/publish` - 发布产品（设置publishedAt）
- `PATCH /admin/products/:id/unpublish` - 取消发布产品（设置unpublishedAt）

#### 管理员 - 分类管理 (`/admin/categories`)
- `GET /admin/categories` - 获取所有分类（包含禁用的）
- `POST /admin/categories` - 创建分类
- `PUT /admin/categories/:id` - 更新分类
- `DELETE /admin/categories/:id` - 删除分类
- `PATCH /admin/categories/:id/status` - 切换分类启用/禁用状态

#### 管理员 - 订单管理 (`/admin/orders`)
- `GET /admin/orders` - 获取所有订单（分页、筛选）
  - 查询参数：page, limit, status, paymentStatus, userId, orderNumber
- `GET /admin/orders/:id` - 获取订单详情（含订单项）
- `PUT /admin/orders/:id/ship` - 标记订单为已发货
  - 需提供：trackingNumber（运单号）
- `PUT /admin/orders/:id/deliver` - 标记订单为已送达
- `PUT /admin/orders/:id/confirm` - 确认订单
- `PUT /admin/orders/:id/cancel` - 取消订单
- `PUT /admin/orders/:id/update-payment` - 更新支付状态

#### 管理员 - 文件上传 (`/admin/uploads`)
- `POST /admin/uploads/image` - 上传单张图片
  - 支持格式：PNG, JPG, JPEG
  - 最大文件大小：10MB
  - 返回：图片URL和元数据
- `POST /admin/uploads/images` - 批量上传图片（最多9张）
  - 返回：图片URL数组

#### 静态文件服务
- `GET /uploads/:filename` - 获取上传的图片
  - 公开访问，无需认证
  - CORS已配置

### API 文档
- Swagger UI: `http://localhost:3001/api/docs`
- 自动生成API文档，包含所有端点、参数、响应示例

## 📤 文件上传架构

### 实现方案
- **库**: multer + @nestjs/platform-express
- **存储策略**: 本地磁盘存储 (diskStorage)
- **存储路径**: `/Users/jinglw/Projects/CAC/backend/uploads/`
- **URL前缀**: `/uploads/` (通过Express静态文件服务)

### 配置详情

#### 文件验证
```typescript
// 文件类型白名单
acceptedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']

// 文件大小限制
maxFileSize: 10MB (10485760 bytes)

// 文件命名策略
filename: UUID + original extension
// 例如: 5f6c652e-2721-4132-a4da-28693ae7ef4c.png
```

#### 安全措施
1. **文件类型验证**: 仅允许PNG、JPG、JPEG图片
2. **MIME类型检查**: 双重验证（MIME + 扩展名）
3. **文件大小限制**: 单文件最大10MB
4. **UUID文件名**: 防止文件名冲突和路径遍历攻击
5. **访问控制**: 仅管理员可上传（AdminJwtAuthGuard保护）

### 环境变量配置
```env
UPLOAD_DIR=./uploads          # 上传目录
MAX_FILE_SIZE=10485760        # 最大文件大小（字节）
```

### API使用示例

#### 单文件上传
```typescript
POST /admin/uploads/image
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

Body:
- file: [binary data]

Response:
{
  url: "http://localhost:3001/uploads/uuid.png",
  filename: "uuid.png",
  originalName: "product.png",
  size: 123456,
  mimeType: "image/png"
}
```

#### 批量上传（最多9张）
```typescript
POST /admin/uploads/images
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

Body:
- files: [binary data array]

Response:
{
  urls: [
    "http://localhost:3001/uploads/uuid1.png",
    "http://localhost:3001/uploads/uuid2.png",
    ...
  ]
}
```

### 生产环境建议

当前使用本地磁盘存储，适合开发和小规模部署。生产环境建议：

1. **迁移到云存储**
   - AWS S3
   - Cloudinary
   - Aliyun OSS
   - Google Cloud Storage

2. **实现CDN加速**
   - CloudFlare
   - AWS CloudFront
   - Aliyun CDN

3. **图片处理**
   - 自动压缩和优化
   - 多尺寸缩略图生成
   - WebP格式转换
   - 图片水印

4. **存储管理**
   - 文件定期清理策略
   - 存储空间监控
   - 备份机制

5. **安全增强**
   - 病毒扫描
   - 图片内容审核
   - 访问日志记录

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
