# CAC - E-commerce PWA

<p align="center">
  <strong>现代化的电商独立站PWA解决方案</strong>
</p>

<p align="center">
  <a href="#特性">特性</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#文档">文档</a> •
  <a href="#部署">部署</a> •
  <a href="#贡献">贡献</a> •
  <a href="#许可证">许可证</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-%3E%3D14.0-blue" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue" alt="TypeScript">
</p>

---

## 📖 项目简介
本项目是AI混合编程的结果，并不完全是vibe coding，大致UI是自己画的，代码基础架构是自己设计的，然后自己写一些特殊的动态效果，还有一些Ai把我搞烦了的地方都自己写。
整体用Gemini3 pro给我丰富UI，数据库架构和数据结构等和整个代码基础是Claude code写的，具体功能点Claude code和Cursor 混合着写。
### 一句话简介：
CAC是一个功能完整的电商独立站PWA应用，采用现代化技术栈构建。项目包含完整的用户端购物体验和功能强大的管理后台，支持产品管理、订单处理、用户管理、分类管理等核心电商功能。

## 📺 展示视频
【和我的月薪140元的克劳德同事一起编写的前后端完整的电商独立站】

https://www.bilibili.com/video/BV1FhqsBfE36/?share_source=copy_web&vd_source=0d75fe8d064dd8f336713ab1577d66b3

### CAC在当下

- ✅ **开箱即用**：完整的前后端实现，可直接部署使用
- ✅ **现代技术栈**：Next.js 14 + NestJS + PostgreSQL，采用最新技术
- ✅ **PWA支持**：可安装到桌面，支持离线访问
- ✅ **管理后台**：功能完整的后台管理系统，CRUD操作齐全
- ✅ **类型安全**：全栈TypeScript，减少运行时错误
- ✅ **易于扩展**：模块化架构，便于二次开发
- ✅ **安全可靠**：JWT认证、HttpOnly Cookie、Bcrypt加密
- ✅ **多语言支持**：产品数据支持中英文
- ✅ **响应式设计**：完美适配桌面和移动端

---

## ✨ 特性

### 用户端功能

- 🛍️ **产品浏览**：分类筛选、搜索功能、产品详情展示
- 🛒 **购物车**：添加商品、数量调整、实时价格计算
- 📦 **订单管理**：创建订单、订单追踪、订单历史
- 👤 **用户系统**：注册、登录、个人资料管理
- ⭐ **评价系统**：产品评分和评论功能
- 📱 **PWA支持**：可安装到主屏幕、离线缓存、推送通知
- 🌐 **多语言**：产品信息支持中英文切换
- 🎨 **优雅UI**：基于shadcn/ui的现代化界面设计

### 管理后台功能

- 👥 **用户管理**：查看、编辑、删除用户，角色管理
- 📦 **产品管理**：
  - CRUD操作（创建、读取、更新、删除）
  - 图片上传（主图 + 多张详情图）
  - 库存管理
  - SKU管理
  - 发布控制（定时发布/下架）
  - 动态产品内容（sections）
  - 多语言字段支持
- 📋 **订单管理**：
  - 订单查看和筛选
  - 状态更新（确认、发货、送达）
  - 运单号管理
  - 支付状态管理
  - 订单取消和退款
- 🏷️ **分类管理**：树形分类、图片上传、启用/禁用
- 📊 **Dashboard**：数据统计、快速操作
- 🔐 **双认证系统**：用户端和管理端独立认证

### 技术特性

- 🔒 **安全性**：
  - JWT认证 + HttpOnly Cookie
  - Bcrypt密码哈希
  - Helmet安全头
  - CORS配置
  - 速率限制（防暴力攻击）
  - 输入验证和清理
- ⚡ **性能优化**：
  - Next.js SSR/SSG
  - 图片优化
  - 响应压缩
  - 数据库查询优化
- 🎨 **优秀UI**：
  - shadcn/ui组件库
  - Tailwind CSS
  - Framer Motion动画
  - 响应式设计
- 📝 **API文档**：Swagger自动生成完整API文档
- 🗄️ **数据库**：Prisma ORM，类型安全查询

---

## 🛠️ 技术栈

### 前端

| 技术                      | 版本     | 说明                        |
| ------------------------- | -------- | --------------------------- |
| **Next.js**         | 14.0.4   | React框架，支持SSR/SSG      |
| **React**           | 18.2.0   | UI库                        |
| **TypeScript**      | 5.3.3    | 类型安全                    |
| **Tailwind CSS**    | 3.4.0    | 实用优先CSS框架             |
| **shadcn/ui**       | -        | 高质量UI组件库              |
| **Radix UI**        | -        | 无头UI组件（shadcn/ui基础） |
| **Framer Motion**   | 10.16.16 | 动画库                      |
| **Zustand**         | 4.4.7    | 轻量级状态管理              |
| **Axios**           | 1.6.2    | HTTP客户端                  |
| **React Hook Form** | 7.49.2   | 表单处理                    |
| **Zod**             | 3.22.4   | 数据验证                    |
| **next-pwa**        | 5.6.0    | PWA支持                     |
| **lucide-react**    | 0.554.0  | 现代图标库                  |

### 后端

| 技术                      | 版本    | 说明              |
| ------------------------- | ------- | ----------------- |
| **NestJS**          | 10.3.0  | Node.js企业级框架 |
| **TypeScript**      | 5.3.3   | 类型安全          |
| **Prisma**          | 5.7.1   | 现代ORM           |
| **PostgreSQL**      | >= 14.0 | 关系型数据库      |
| **Passport**        | 0.7.0   | 认证中间件        |
| **JWT**             | 10.2.0  | Token认证         |
| **Bcrypt**          | 5.1.1   | 密码加密          |
| **Swagger**         | 7.1.17  | API文档自动生成   |
| **Helmet**          | 7.1.0   | 安全中间件        |
| **class-validator** | 0.14.0  | DTO验证           |
| **Multer**          | -       | 文件上传          |
| **Jest**            | 29.7.0  | 测试框架          |

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0（推荐18.x LTS）
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0

### 安装步骤

#### 1️⃣ 克隆项目

```bash
git clone https://github.com/Focus695/CAC.git
cd CAC
```

#### 2️⃣ 安装依赖

```bash
# 安装根依赖和所有子项目依赖
npm install
```

#### 3️⃣ 配置环境变量

```bash
# 后端环境变量
cp backend/.env.example backend/.env

# 前端环境变量
cp frontend/.env.example frontend/.env.local

# 生成安全密钥（重要！）
node scripts/generate-secrets.js
```

**编辑 `backend/.env`**：

```env
# 使用generate-secrets.js生成的JWT_SECRET
JWT_SECRET=your-generated-64-byte-hex-string

# 配置数据库连接
DATABASE_URL=postgresql://postgres:password@localhost:5432/cac_ecommerce?schema=public
```

**编辑 `frontend/.env.local`**：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 4️⃣ 设置数据库

```bash
# 创建PostgreSQL数据库
createdb cac_ecommerce

# 运行数据库迁移
cd backend
npx prisma migrate dev

# 生成Prisma客户端
npx prisma generate

# 填充初始数据（创建管理员账户和示例分类）
npm run seed
```

**记住seed输出的管理员密码！**

#### 5️⃣ 启动开发服务器

```bash
# 返回项目根目录
cd ..

# 同时启动前端和后端
npm run dev
```

### 访问应用

- **前端（用户界面）**：http://localhost:3000
- **后端API**：http://localhost:3001
- **API文档（Swagger）**：http://localhost:3001/api/docs
- **管理后台**：http://localhost:3000/admin

**管理员登录**：

- Email: `admin@example.com`
- Password: [seed脚本输出的密码]

---

## 📁 项目结构

```
CAC/
├── frontend/                 # Next.js前端应用
│   ├── src/
│   │   ├── app/             # App Router页面
│   │   │   ├── page.tsx     # 用户端首页
│   │   │   ├── admin/       # 管理后台页面
│   │   │   └── auth/        # 认证页面
│   │   ├── components/      # React组件
│   │   │   ├── ui/          # shadcn/ui组件
│   │   │   ├── admin/       # 管理后台组件
│   │   │   └── zenchill/    # 用户端组件
│   │   ├── services/        # API服务
│   │   ├── contexts/        # React Context
│   │   └── types/           # TypeScript类型
│   └── public/              # 静态资源
│
├── backend/                 # NestJS后端应用
│   ├── src/
│   │   ├── modules/         # 功能模块
│   │   │   ├── auth/        # 认证模块
│   │   │   ├── users/       # 用户模块
│   │   │   ├── products/    # 产品模块
│   │   │   ├── categories/  # 分类模块
│   │   │   ├── cart/        # 购物车模块
│   │   │   ├── orders/      # 订单模块
│   │   │   ├── admin/       # 管理模块
│   │   │   └── reviews/     # 评价模块
│   │   ├── common/          # 通用模块
│   │   ├── prisma/          # Prisma服务
│   │   └── main.ts          # 应用入口
│   ├── prisma/
│   │   ├── schema.prisma    # 数据库模型
│   │   └── seed.ts          # 种子数据
│   └── uploads/             # 文件上传目录
│
├── DOC/                     # 项目文档
│   ├── ARCHITECTURE.md      # 架构文档
│   ├── QUICK_START.md       # 快速开始
│   ├── ADMIN_GUIDE.md       # 管理后台指南
│   ├── API_REFERENCE.md     # API参考
│   ├── DEPENDENCIES.md      # 依赖清单
│   └── CONFIGURATION.md     # 配置说明
│
├── scripts/                 # 实用脚本
│   ├── generate-secrets.js  # 密钥生成工具
│   └── check-gitignore.sh   # 安全检查脚本
│
├── DEPLOYMENT.md            # 部署指南
├── CONTRIBUTING.md          # 贡献指南
├── SECURITY.md              # 安全指南
├── CHANGELOG.md             # 变更日志
├── LICENSE                  # MIT许可证
└── README.md                # 本文件
```

---

## 📚 文档

详细文档请查看 `/DOC` 目录：

| 文档                              | 说明                                        |
| --------------------------------- | ------------------------------------------- |
| [架构文档](./DOC/ARCHITECTURE.md)    | 完整的系统架构、技术栈、数据库模型说明      |
| [快速开始](./DOC/QUICK_START.md)     | 详细的开发指南和工作流程                    |
| [管理后台指南](./DOC/ADMIN_GUIDE.md) | 后台功能使用说明、操作示例、API使用         |
| [API参考](./DOC/API_REFERENCE.md)    | 完整的API接口文档、请求/响应示例            |
| [依赖清单](./DOC/DEPENDENCIES.md)    | 所有84个依赖包的详细说明                    |
| [配置说明](./DOC/CONFIGURATION.md)   | 配置文件详解（Next.js、Tailwind、Prisma等） |
| [部署指南](./DEPLOYMENT.md)          | 生产环境部署教程（Vercel、Docker、VPS）     |
| [安全指南](./SECURITY.md)            | 安全最佳实践、漏洞报告流程                  |
| [贡献指南](./CONTRIBUTING.md)        | 如何为项目做贡献                            |

---

## 🚢 部署

### 推荐方案：Vercel + Railway（最简单）

#### 前端部署到Vercel

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署前端
cd frontend
vercel
```

配置环境变量：`NEXT_PUBLIC_API_URL`

#### 后端部署到Railway

1. 访问 [Railway](https://railway.app/)
2. 连接GitHub仓库
3. 选择 `backend`目录
4. 添加PostgreSQL数据库
5. 配置环境变量（JWT_SECRET、FRONTEND_URL等）
6. 运行迁移：`npx prisma migrate deploy`
7. 运行seed：`npm run seed`

#### 优点

✅ 自动HTTPS
✅ 全球CDN
✅ 自动CI/CD
✅ 零配置扩展
✅ 免费额度够用（小项目）

### 其他方案

- **Docker部署**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md#方案-b-docker--vps)
- **VPS部署**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md#方案-c-传统vps手动部署)

### 部署前检查清单

- [ ] 已生成强随机JWT_SECRET
- [ ] 数据库密码已更新
- [ ] 已配置CORS和FRONTEND_URL
- [ ] NODE_ENV设置为production
- [ ] 已关闭生产环境的Swagger文档
- [ ] 已配置HTTPS/SSL
- [ ] 已运行数据库迁移
- [ ] 已创建管理员账户

详见：[DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🗄️ 数据库模型

### 核心模型

- **User** - 用户（支持CUSTOMER、ADMIN、MODERATOR角色）
- **Product** - 产品（多语言支持、动态sections、发布控制）
- **Category** - 分类（树形结构）
- **CartItem** - 购物车项
- **Order** - 订单（多状态管理：PENDING/CONFIRMED/PROCESSING/SHIPPED/DELIVERED）
- **OrderItem** - 订单项
- **Address** - 地址（支持收货/账单地址）
- **Review** - 评价
- **ProductAttribute** - 产品属性

### 订单状态流程

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
    ↓
CANCELLED / REFUNDED
```

### 支付状态

```
PENDING → PAID
    ↓
FAILED / REFUNDED
```

详细模型定义：[backend/prisma/schema.prisma](./backend/prisma/schema.prisma)

---

## 🔐 安全性

本项目实现了多层安全措施：

### 已实现

- ✅ **认证**：JWT Token + HttpOnly Cookie（双认证系统）
- ✅ **密码**：Bcrypt加密存储（10轮）
- ✅ **请求验证**：class-validator数据验证
- ✅ **安全头**：Helmet中间件（XSS、CSP、HSTS等）
- ✅ **CORS**：配置白名单
- ✅ **速率限制**：Throttler防暴力攻击
- ✅ **文件上传**：类型和大小限制、UUID文件名
- ✅ **SQL注入防护**：Prisma ORM参数化查询
- ✅ **环境变量**：敏感信息分离

### 安全最佳实践

**生成强密钥**：

```bash
node scripts/generate-secrets.js
```

**定期安全审计**：

```bash
npm audit
npm audit fix
```

⚠️ **重要**：请务必阅读 [SECURITY.md](./SECURITY.md) 了解完整的安全最佳实践。

---


## 📄 许可证

本项目采用 **MIT许可证**。详见 [LICENSE](./LICENSE) 文件。

---

## 📞 联系方式

- **项目主页**：https://github.com/Focus695/CAC
- **问题反馈**：https://github.com/Focus695/CAC/issues
- **讨论区**：https://github.com/Focus695/CAC/discussions

---

<p align="center">
  Made with ❤️ by Focus695
</p>

<p align="center">
  如果这个项目对您有帮助，请给个⭐Star支持一下！
</p>

<p align="center">
  <a href="#top">回到顶部</a>
</p>
