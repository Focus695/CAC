# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### 🎉 首次开源发布

这是CAC电商PWA项目的首次公开发布版本，包含完整的电商功能和管理后台。

### ✨ 新增功能

#### 用户端
- 产品浏览和搜索功能
- 购物车系统（添加、删除、数量调整）
- 用户注册和登录
- 订单创建和管理
- 产品评价系统
- PWA支持（可安装、离线缓存）
- 响应式设计（移动端和桌面端）

#### 管理后台
- **用户管理**：
  - 查看用户列表（分页、搜索、筛选）
  - 编辑用户信息和角色
  - 禁用/启用用户账户
  - 删除用户

- **产品管理**：
  - 创建和编辑产品（多语言支持）
  - 图片上传（主图和详情图）
  - 库存和SKU管理
  - 动态产品内容（sections）
  - 产品发布/取消发布控制
  - 产品启用/禁用

- **订单管理**：
  - 查看所有订单（分页、筛选）
  - 订单状态管理（确认、发货、送达）
  - 运单号管理
  - 支付状态更新
  - 订单取消和退款

- **分类管理**：
  - 创建和编辑分类
  - 树形分类结构
  - 分类图片上传
  - 分类启用/禁用

- **文件上传**：
  - 单张图片上传
  - 批量图片上传（最多9张）
  - 图片类型和大小验证

#### 技术特性
- **认证系统**：
  - 用户端JWT认证（HttpOnly Cookie）
  - 管理端独立认证（双认证系统）
  - Bcrypt密码加密
  - Passport.js策略

- **数据库**：
  - PostgreSQL数据库
  - Prisma ORM
  - 完整的数据模型（User, Product, Order, Category等）
  - 数据库迁移和seed脚本

- **API**：
  - RESTful API设计
  - Swagger自动文档生成
  - 输入验证（class-validator）
  - 错误处理和转换
  - CORS配置

- **安全性**：
  - Helmet安全头
  - 速率限制（防暴力攻击）
  - SQL注入防护
  - XSS防护
  - CSRF防护（SameSite cookies）

### 📝 文档

- ✅ 完整的README.md
- ✅ 架构文档（ARCHITECTURE.md）
- ✅ 快速开始指南（QUICK_START.md）
- ✅ 管理后台使用指南（ADMIN_GUIDE.md）
- ✅ API参考文档（API_REFERENCE.md）
- ✅ 部署指南（DEPLOYMENT.md）
- ✅ 安全指南（SECURITY.md）
- ✅ 贡献指南（CONTRIBUTING.md）
- ✅ 依赖清单（DEPENDENCIES.md）
- ✅ 配置说明（CONFIGURATION.md）

### 🔧 开发工具

- ✅ 密钥生成脚本（scripts/generate-secrets.js）
- ✅ 安全检查脚本（scripts/check-gitignore.sh）
- ✅ 数据库seed脚本
- ✅ ESLint和Prettier配置
- ✅ TypeScript严格模式

### 🌐 技术栈

#### 前端
- Next.js 14.0.4
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.0
- shadcn/ui + Radix UI
- Framer Motion 10.16.16
- Zustand 4.4.7
- Axios 1.6.2
- React Hook Form 7.49.2
- next-pwa 5.6.0

#### 后端
- NestJS 10.3.0
- PostgreSQL >= 14.0
- Prisma 5.7.1
- Passport.js 0.7.0
- JWT 10.2.0
- Bcrypt 5.1.1
- Swagger 7.1.17
- Helmet 7.1.0
- Jest 29.7.0

### 📦 部署支持

- ✅ Vercel部署配置（前端）
- ✅ Railway部署指南（后端）
- ✅ Docker配置和示例
- ✅ VPS手动部署指南
- ✅ 环境变量配置示例

### 🔒 安全更新

- 从Git历史中移除了敏感文件（.env、uploads等）
- 更新了.gitignore以防止敏感文件泄露
- seed脚本不再硬编码密码
- 增强了环境变量安全说明
- 添加了安全检查脚本

### 📊 统计数据

- 总代码行数：约25,000行
- 依赖包数量：84个
- 数据库模型：8个核心模型
- API端点：50+个
- 文档页数：约100页（Markdown）

---

## [Unreleased]

### 计划中的功能

- 邮件通知系统
- 支付网关集成（Stripe/Alipay）
- 二维码生成（订单、产品）
- 导出功能（订单、用户CSV）
- 数据统计和图表
- 多语言前端界面切换
- 产品库存预警
- 批量操作功能
- 评价审核系统
- 云存储集成（AWS S3/Cloudinary）
- Redis缓存层
- Elasticsearch搜索引擎

---

## 版本规范

本项目遵循[语义化版本](https://semver.org/spec/v2.0.0.html)规范：

- **主版本号**（MAJOR）：不兼容的API更改
- **次版本号**（MINOR）：向下兼容的功能新增
- **修订号**（PATCH）：向下兼容的问题修复

### 标签说明

- `✨ 新增功能` - Added
- `🔧 修改` - Changed
- `⚠️ 废弃` - Deprecated
- `🗑️ 移除` - Removed
- `🐛 修复` - Fixed
- `🔒 安全` - Security

---

**注**: 有关每个版本的详细更改，请参阅项目的[发布页面](https://github.com/your-username/CAC/releases)。
