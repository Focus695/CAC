# 项目设置指南

## 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **PostgreSQL**: >= 14.0
- **Git**: 最新版本

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd CAC
```

### 2. 安装依赖

#### 根目录依赖
```bash
npm install
```

#### 前端依赖
```bash
cd frontend
npm install
cd ..
```

#### 后端依赖
```bash
cd backend
npm install
cd ..
```

### 3. 数据库设置

#### 创建PostgreSQL数据库

```bash
# 使用psql命令行
psql -U postgres
CREATE DATABASE cac_ecommerce;
\q

# 或使用createdb命令
createdb cac_ecommerce
```

#### 配置环境变量

复制环境变量示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/cac_ecommerce?schema=public"

# 后端配置
NESTJS_PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 前端配置
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**重要**: 
- 将 `username` 和 `password` 替换为你的PostgreSQL凭据
- 生成一个强随机字符串作为 `JWT_SECRET`

### 4. 数据库迁移

```bash
cd backend

# 生成Prisma客户端
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# （可选）打开Prisma Studio查看数据库
npm run prisma:studio
```

### 5. 启动开发服务器

#### 方式一：同时启动前后端（推荐）

在根目录运行：
```bash
npm run dev
```

#### 方式二：分别启动

**终端1 - 前端**:
```bash
cd frontend
npm run dev
```
前端将在 http://localhost:3000 运行

**终端2 - 后端**:
```bash
cd backend
npm run start:dev
```
后端将在 http://localhost:3001 运行

### 6. 验证安装

1. **前端**: 访问 http://localhost:3000
2. **后端API**: 访问 http://localhost:3001/api
3. **API文档**: 访问 http://localhost:3001/api/docs

## 开发工作流

### 创建数据库迁移

```bash
cd backend
npm run prisma:migrate
# 输入迁移名称
```

### 查看数据库

```bash
cd backend
npm run prisma:studio
```

### 代码格式化

```bash
# 格式化所有代码
npm run format
```

### 代码检查

```bash
# 检查所有代码
npm run lint
```

## 常见问题

### 问题1: 数据库连接失败

**解决方案**:
1. 确认PostgreSQL服务正在运行
2. 检查 `.env` 文件中的 `DATABASE_URL`
3. 确认数据库已创建
4. 检查PostgreSQL用户权限

### 问题2: 端口已被占用

**解决方案**:
- 修改 `.env` 文件中的端口号
- 或停止占用端口的进程

### 问题3: Prisma客户端未生成

**解决方案**:
```bash
cd backend
npm run prisma:generate
```

### 问题4: 模块未找到错误

**解决方案**:
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 生产环境部署

### 构建项目

```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd ../backend
npm run build
```

### 环境变量

确保在生产环境中设置所有必要的环境变量：
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

### 数据库迁移（生产环境）

```bash
cd backend
npm run prisma:migrate deploy
```

## 下一步

1. 阅读 [README.md](./README.md) 了解项目概述
2. 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解架构详情
3. 开始开发你的功能！

