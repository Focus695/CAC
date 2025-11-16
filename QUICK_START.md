# 快速开始指南

本文档提供项目的快速启动和开发指南。

## 🚀 快速启动

### 前置要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **PostgreSQL**: >= 14.0
- **Git**: 最新版本

### 安装步骤

1. **克隆项目**（如果从远程仓库）
```bash
git clone <repository-url>
cd CAC
```

2. **安装依赖**
```bash
# 安装根依赖和所有工作区依赖
npm install
```

3. **配置环境变量**

创建后端环境变量文件：
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

创建前端环境变量文件：
```bash
cd frontend
cp .env.example .env.local
# 编辑 .env.local 文件，配置 API 地址等信息
```

4. **设置数据库**

确保 PostgreSQL 正在运行，然后：
```bash
# 从项目根目录运行
npm run prisma:migrate
npm run prisma:generate
```

5. **启动开发服务器**
```bash
# 从项目根目录运行（同时启动前后端）
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端: http://localhost:3000
npm run dev:backend   # 后端: http://localhost:3001
```

## 📁 项目结构速览

```
CAC/
├── frontend/          # Next.js 前端应用
│   └── src/
│       ├── app/       # 页面和路由
│       ├── components/# React 组件
│       ├── lib/       # 工具函数和 API 客户端
│       └── types/     # TypeScript 类型
│
├── backend/           # NestJS 后端应用
│   └── src/
│       ├── modules/   # 功能模块
│       ├── common/    # 通用模块
│       └── prisma/   # Prisma 服务
│
└── package.json       # 根配置文件
```

## 🔑 关键命令

### 开发命令

```bash
# 启动开发服务器（前后端）
npm run dev

# 仅启动前端
npm run dev:frontend

# 仅启动后端
npm run dev:backend
```

### 构建命令

```bash
# 构建生产版本（前后端）
npm run build

# 仅构建前端
npm run build:frontend

# 仅构建后端
npm run build:backend
```

### 数据库命令

```bash
# 创建数据库迁移
npm run prisma:migrate

# 生成 Prisma 客户端
npm run prisma:generate

# 打开 Prisma Studio（数据库 GUI）
npm run prisma:studio
```

### 代码质量

```bash
# 运行 ESLint
npm run lint

# 类型检查（前端）
cd frontend && npm run type-check
```

## 🌐 访问地址

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:3001/api
- **API 文档**: http://localhost:3001/api/docs
- **Prisma Studio**: http://localhost:5555 (运行 `npm run prisma:studio` 后)

## 📝 环境变量配置

### 后端 (.env)

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/cac_ecommerce?schema=public
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

### 前端 (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=CAC E-commerce
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ 数据库设置

### 创建数据库

```sql
-- 在 PostgreSQL 中执行
CREATE DATABASE cac_ecommerce;
```

### 运行迁移

```bash
npm run prisma:migrate
```

这将：
1. 创建所有数据表
2. 建立关系
3. 设置索引

### 查看数据库

```bash
npm run prisma:studio
```

## 🎨 开发工作流

### 添加新功能模块（后端）

1. 使用 NestJS CLI 生成模块：
```bash
cd backend
nest generate module modules/feature-name
nest generate controller modules/feature-name
nest generate service modules/feature-name
```

2. 在 `app.module.ts` 中注册模块

3. 更新 Prisma schema（如需要）

4. 运行迁移：
```bash
npm run prisma:migrate
npm run prisma:generate
```

### 添加新页面（前端）

1. 在 `src/app` 目录下创建新路由文件夹

2. 创建 `page.tsx` 文件

3. 使用 App Router 的路由约定

### 添加 UI 组件（shadcn/ui）

```bash
cd frontend
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
# ... 更多组件
```

## 🔐 认证流程

### 用户注册/登录

1. 前端发送 POST 请求到 `/api/auth/register` 或 `/api/auth/login`
2. 后端验证并返回 JWT Token
3. 前端存储 Token（Cookie 或 LocalStorage）
4. 后续请求在 Header 中携带 Token: `Authorization: Bearer <token>`

### 保护路由

使用 `@UseGuards(JwtAuthGuard)` 装饰器保护需要认证的路由。

## 📦 常用包说明

### 前端核心包
- **next**: Next.js 框架
- **react**: React 库
- **tailwindcss**: CSS 框架
- **framer-motion**: 动画库
- **zustand**: 状态管理
- **axios**: HTTP 客户端
- **react-hook-form**: 表单处理
- **zod**: 数据验证

### 后端核心包
- **@nestjs/core**: NestJS 核心
- **@prisma/client**: Prisma 客户端
- **@nestjs/jwt**: JWT 认证
- **passport**: 认证中间件
- **bcrypt**: 密码加密
- **class-validator**: 数据验证

## 🐛 常见问题

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :3001

# 杀死进程
kill -9 <PID>
```

### 数据库连接失败

1. 检查 PostgreSQL 是否运行
2. 验证 `DATABASE_URL` 配置
3. 检查数据库用户权限

### Prisma 客户端未生成

```bash
npm run prisma:generate
```

### 依赖安装失败

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
npm install
```

## 📚 相关文档

- [架构文档](./ARCHITECTURE.md) - 完整的架构说明
- [依赖清单](./DEPENDENCIES.md) - 所有依赖包详解
- [配置说明](./CONFIGURATION.md) - 配置文件详解
- [Next.js 文档](https://nextjs.org/docs)
- [NestJS 文档](https://docs.nestjs.com)
- [Prisma 文档](https://www.prisma.io/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

## 🎯 下一步

1. 阅读 [架构文档](./ARCHITECTURE.md) 了解项目结构
2. 查看 [API 文档](http://localhost:3001/api/docs) 了解后端接口
3. 探索前端代码，了解页面结构
4. 开始开发你的功能！

---

**需要帮助？** 查看项目文档或提交 Issue。

