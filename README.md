# CAC E-commerce PWA

渐进式Web应用（PWA）电商独立站台，带有游戏化功能。

## 技术栈

### 前端
- **Next.js 14** - React框架，支持App Router
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先的CSS框架
- **shadcn/ui** - 高质量UI组件库
- **Framer Motion** - 动画库
- **Zustand** - 状态管理
- **React Hook Form** - 表单处理
- **Axios** - HTTP客户端
- **next-pwa** - PWA支持

### 后端
- **NestJS** - Node.js框架
- **TypeScript** - 类型安全
- **Prisma** - 现代化ORM
- **PostgreSQL** - 关系型数据库
- **JWT** - 身份验证
- **Passport** - 认证策略
- **Swagger** - API文档
- **Helmet** - 安全中间件
- **Throttler** - 速率限制

## 项目结构

```
CAC/
├── frontend/                 # Next.js前端应用
│   ├── src/
│   │   ├── app/             # App Router页面
│   │   ├── components/      # React组件
│   │   ├── lib/             # 工具函数
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── store/           # 状态管理
│   │   ├── types/           # TypeScript类型
│   │   └── utils/           # 工具函数
│   ├── public/              # 静态资源
│   │   └── manifest.json    # PWA清单文件
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── backend/                  # NestJS后端应用
│   ├── src/
│   │   ├── modules/         # 功能模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── users/      # 用户模块
│   │   │   ├── products/   # 产品模块
│   │   │   ├── categories/ # 分类模块
│   │   │   ├── cart/       # 购物车模块
│   │   │   ├── orders/     # 订单模块
│   │   │   ├── reviews/    # 评价模块
│   │   │   └── gamification/ # 游戏化模块
│   │   ├── prisma/         # Prisma服务
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma   # 数据库模式
│   ├── package.json
│   └── tsconfig.json
│
├── package.json              # 根package.json（monorepo）
├── tsconfig.json
├── .env.example
└── README.md
```

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0

### 安装步骤

1. **克隆项目并安装依赖**

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd ../backend && npm install
```

2. **配置环境变量**

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑.env文件，配置数据库连接和其他环境变量
```

3. **设置数据库**

```bash
# 创建PostgreSQL数据库
createdb cac_ecommerce

# 运行Prisma迁移
cd backend
npm run prisma:migrate

# 生成Prisma客户端
npm run prisma:generate
```

4. **启动开发服务器**

```bash
# 在根目录运行（同时启动前端和后端）
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端: http://localhost:3000
npm run dev:backend   # 后端: http://localhost:3001
```

5. **访问应用**

- 前端: http://localhost:3000
- 后端API: http://localhost:3001/api
- API文档: http://localhost:3001/api/docs

## 数据库模型

### 核心模型

- **User** - 用户
- **Product** - 产品
- **Category** - 分类
- **CartItem** - 购物车项
- **Order** - 订单
- **OrderItem** - 订单项
- **Address** - 地址
- **Review** - 评价
- **GamificationProfile** - 游戏化档案

## API端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `POST /api/auth/profile` - 获取用户信息

### 产品
- `GET /api/products` - 获取所有产品
- `GET /api/products/:id` - 获取产品详情

### 分类
- `GET /api/categories` - 获取所有分类

### 购物车
- `GET /api/cart` - 获取购物车（需要认证）

### 订单
- `GET /api/orders` - 获取用户订单（需要认证）

### 评价
- `GET /api/reviews/product/:productId` - 获取产品评价

### 游戏化
- `GET /api/gamification/profile` - 获取游戏化档案（需要认证）

## 开发命令

### 根目录
- `npm run dev` - 同时启动前后端开发服务器
- `npm run build` - 构建前后端
- `npm run lint` - 代码检查

### 前端
- `npm run dev` - 开发服务器
- `npm run build` - 生产构建
- `npm run start` - 启动生产服务器
- `npm run lint` - ESLint检查

### 后端
- `npm run start:dev` - 开发模式（热重载）
- `npm run build` - 构建
- `npm run start:prod` - 生产模式
- `npm run prisma:migrate` - 数据库迁移
- `npm run prisma:studio` - 打开Prisma Studio
- `npm run prisma:generate` - 生成Prisma客户端

## PWA功能

- ✅ Service Worker自动注册
- ✅ 离线缓存支持
- ✅ Web App Manifest
- ✅ 可安装到主屏幕
- ✅ 响应式设计

## 游戏化功能

- 积分系统
- 等级系统
- 经验值
- 徽章系统
- 成就系统

## 安全特性

- JWT身份验证
- 密码加密（bcrypt）
- Helmet安全头
- CORS配置
- 速率限制（Throttler）
- 输入验证（class-validator）

## 📚 文档

- [快速开始指南](./QUICK_START.md) - 快速启动和开发指南
- [架构文档](./ARCHITECTURE.md) - 完整的项目架构说明
- [依赖清单](./DEPENDENCIES.md) - 所有依赖包详细说明
- [配置说明](./CONFIGURATION.md) - 配置文件详解

## 下一步开发

1. 实现完整的CRUD操作
2. 添加支付集成（Stripe/PayPal）
3. 实现文件上传功能
4. 添加邮件服务
5. 实现实时通知
6. 添加搜索功能
7. 实现推荐系统
8. 完善游戏化机制

## 许可证

MIT

