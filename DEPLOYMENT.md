# 部署指南

本文档提供CAC项目的详细部署说明，包括多种部署方案和最佳实践。

## 目录
- [环境要求](#环境要求)
- [部署前准备](#部署前准备)
- [部署方案](#部署方案)
- [环境变量配置](#环境变量配置)
- [数据库迁移](#数据库迁移)
- [监控和日志](#监控和日志)
- [备份策略](#备份策略)

---

## 环境要求

### 最低要求
- **Node.js**: >= 18.0.0 (推荐18.x LTS)
- **npm**: >= 9.0.0
- **PostgreSQL**: >= 14.0
- **内存**: 最少2GB RAM
- **磁盘**: 最少10GB可用空间

### 推荐配置
- **Node.js**: 20.x LTS
- **PostgreSQL**: 15.x
- **内存**: 4GB+ RAM
- **磁盘**: 20GB+ SSD
- **CPU**: 2核心+

---

## 部署前准备

### 安全检查清单

在部署到生产环境前，**必须**完成以下检查：

- [ ] **环境变量安全**
  - [ ] `JWT_SECRET` 已生成强随机值（64字节）
  - [ ] `DATABASE_URL` 使用强密码
  - [ ] `NODE_ENV` 设置为 `production`
  - [ ] `FRONTEND_URL` 设置为实际域名
  - [ ] 所有`.env`文件已添加到`.gitignore`

- [ ] **数据库安全**
  - [ ] 数据库密码已更换为强密码
  - [ ] 数据库仅允许特定IP访问
  - [ ] 启用SSL/TLS连接
  - [ ] 配置自动备份

- [ ] **应用安全**
  - [ ] CORS配置为实际域名（不使用`*`）
  - [ ] Swagger文档已在生产环境禁用
  - [ ] Cookie设置了`secure: true`
  - [ ] 实现HTTPS/SSL证书
  - [ ] 配置安全头（Helmet）

- [ ] **代码质量**
  - [ ] 所有测试通过
  - [ ] 代码已通过lint检查
  - [ ] TypeScript编译无错误
  - [ ] 依赖项已更新到安全版本

### 生成安全密钥

```bash
# 生成JWT_SECRET和其他密钥
node scripts/generate-secrets.js

# 或手动生成
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 部署方案

### 方案 A：Vercel + Railway（推荐 - 最简单）

#### 适合场景
- 快速部署
- 小到中型项目
- 预算有限
- 希望零配置

#### 前端部署到 Vercel

**1. 安装Vercel CLI**
```bash
npm install -g vercel
```

**2. 部署前端**
```bash
cd frontend
vercel
```

**3. 配置环境变量**
在Vercel Dashboard中配置：
- `NEXT_PUBLIC_API_URL`: 后端API地址（Railway提供）

**4. 自动部署**
连接GitHub仓库，实现自动CI/CD。

#### 后端部署到 Railway

**1. 访问 Railway**
打开 [railway.app](https://railway.app/)

**2. 创建新项目**
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择CAC仓库
- 选择 `backend` 目录

**3. 添加PostgreSQL**
- 点击 "New" → "Database" → "PostgreSQL"
- Railway自动配置数据库连接

**4. 配置环境变量**
在Railway Dashboard添加：
```env
NODE_ENV=production
JWT_SECRET=<生成的强随机值>
FRONTEND_URL=https://your-frontend.vercel.app
PORT=3001
BCRYPT_ROUNDS=10
```

`DATABASE_URL` 由Railway自动提供。

**5. 部署**
- 点击 "Deploy"
- 等待构建完成
- 获取后端URL

**6. 运行数据库迁移**
在Railway控制台执行：
```bash
npx prisma migrate deploy
npm run seed
```

#### 优点
✅ 零配置自动扩展
✅ 自动HTTPS
✅ 全球CDN
✅ 自动CI/CD
✅ 免费额度（小项目够用）

#### 缺点
❌ 有限的自定义能力
❌ 冷启动延迟
❌ 超出免费额度后费用较高

#### 成本估算
- **Vercel**: 免费（Hobby Plan）
- **Railway**: $5-20/月（按使用量）

---

### 方案 B：Docker + VPS

#### 适合场景
- 需要完全控制
- 大型项目
- 复杂配置需求
- 已有服务器资源

#### 步骤1：准备Dockerfile

**后端Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

**前端Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

#### 步骤2：创建docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    restart: unless-stopped
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 步骤3：部署

```bash
# 1. 在服务器上克隆代码
git clone <your-repo-url>
cd CAC

# 2. 创建环境变量文件
cp .env.example .env
# 编辑.env文件，配置所有变量

# 3. 构建并启动
docker-compose up -d --build

# 4. 运行数据库迁移
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed

# 5. 查看日志
docker-compose logs -f
```

#### 步骤4：配置Nginx反向代理

```nginx
# /etc/nginx/sites-available/cac
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    location /uploads {
        proxy_pass http://localhost:3001/uploads;
    }
}
```

#### 步骤5：配置SSL

```bash
# 使用Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### 优点
✅ 完全控制
✅ 可自定义配置
✅ 成本可预测
✅ 高性能

#### 缺点
❌ 需要服务器管理知识
❌ 需要手动维护
❌ 需要自行配置扩展

---

### 方案 C：传统VPS手动部署

#### 适合场景
- 预算紧张
- 需要学习服务器管理
- 小型项目

#### 步骤1：准备服务器

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PostgreSQL
sudo apt install postgresql postgresql-contrib

# 安装Nginx
sudo apt install nginx

# 安装PM2（进程管理器）
sudo npm install -g pm2
```

#### 步骤2：配置PostgreSQL

```bash
# 切换到postgres用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE cac_ecommerce;
CREATE USER cac_user WITH ENCRYPTED PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE cac_ecommerce TO cac_user;
\q
```

#### 步骤3：部署应用

```bash
# 克隆代码
cd /var/www
sudo git clone <your-repo-url> cac
cd cac

# 安装依赖
npm install

# 后端
cd backend
npm install
cp .env.example .env
# 编辑.env文件配置数据库和密钥
npx prisma migrate deploy
npx prisma generate
npm run build

# 前端
cd ../frontend
npm install
cp .env.example .env.local
# 编辑.env.local配置API_URL
npm run build
```

#### 步骤4：使用PM2启动

```bash
# 启动后端
cd backend
pm2 start dist/main.js --name cac-backend

# 启动前端
cd ../frontend
pm2 start npm --name cac-frontend -- start

# 保存PM2配置
pm2 save
pm2 startup
```

#### 步骤5：配置Nginx（同方案B）

---

## 环境变量配置

### 后端环境变量（backend/.env）

```env
# 应用配置
NODE_ENV=production
PORT=3001

# 数据库
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public

# JWT认证
JWT_SECRET=<64字节随机值>
JWT_EXPIRES_IN=7d

# 密码加密
BCRYPT_ROUNDS=10

# 前端URL（CORS）
FRONTEND_URL=https://yourdomain.com

# 文件上传
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# 可选：邮件服务
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=noreply@example.com
# SMTP_PASS=password
```

### 前端环境变量（frontend/.env.local）

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 数据库迁移

### 生产环境迁移

```bash
# 1. 备份数据库（重要！）
pg_dump -U username -d database_name > backup.sql

# 2. 运行迁移
npx prisma migrate deploy

# 3. 验证迁移
npx prisma migrate status

# 4. 创建管理员用户
npm run seed
```

### 回滚迁移

```bash
# Prisma不支持自动回滚，需要手动：
# 1. 恢复备份
psql -U username -d database_name < backup.sql

# 2. 或编写反向迁移SQL
```

---

## 监控和日志

### 推荐工具

**1. 错误追踪**
- [Sentry](https://sentry.io/)（免费额度）
  ```bash
  npm install @sentry/node @sentry/nextjs
  ```

**2. 性能监控**
- Vercel Analytics（Vercel部署自带）
- [New Relic](https://newrelic.com/)
- [Datadog](https://www.datadoghq.com/)

**3. 日志管理**
- [LogRocket](https://logrocket.com/)
- [Better Stack](https://betterstack.com/)
- PM2 Logs（VPS部署）

### PM2日志管理

```bash
# 查看日志
pm2 logs cac-backend
pm2 logs cac-frontend

# 日志轮转配置
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 备份策略

### 数据库备份

**自动备份脚本** (`scripts/backup-db.sh`):
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgres"
DB_NAME="cac_ecommerce"

mkdir -p $BACKUP_DIR

pg_dump -U postgres $DB_NAME | gzip > $BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz

# 保留最近30天的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${DB_NAME}_${DATE}.sql.gz"
```

**配置Cron定时任务**:
```bash
# 每天凌晨2点备份
crontab -e
0 2 * * * /path/to/scripts/backup-db.sh
```

### 文件备份

备份上传的文件：
```bash
# 同步到远程存储
rsync -avz /path/to/backend/uploads/ user@remote:/backups/uploads/

# 或使用云存储（推荐）
# 迁移到AWS S3/Cloudinary/Aliyun OSS
```

---

## 性能优化

### 1. 启用压缩

后端已配置Compression中间件，确保生产环境启用。

### 2. 数据库连接池

Prisma默认管理连接池，无需额外配置。

### 3. CDN加速

- 使用Vercel自带CDN（方案A）
- 或配置CloudFlare CDN（方案B/C）

### 4. 缓存策略

添加Redis缓存（可选）：
```bash
npm install @nestjs/cache-manager cache-manager-redis-store
```

---

## 故障排查

### 常见问题

**1. 数据库连接失败**
- 检查DATABASE_URL是否正确
- 确认数据库服务运行中
- 检查防火墙规则

**2. CORS错误**
- 确认FRONTEND_URL配置正确
- 检查后端CORS配置
- 验证Cookie设置（SameSite、Secure）

**3. 文件上传失败**
- 检查uploads目录权限
- 确认MAX_FILE_SIZE配置
- 验证MIME类型限制

**4. JWT认证失败**
- 确认JWT_SECRET在前后端一致
- 检查Token过期时间
- 验证Cookie配置（HttpOnly、Secure）

---

## 安全最佳实践

1. **定期更新依赖**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

2. **启用HTTPS**（生产环境必须）

3. **配置防火墙**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

4. **限制数据库访问**
   仅允许应用服务器IP访问

5. **定期备份**

6. **监控异常活动**

---

## 扩展建议

当流量增长时，考虑：

1. **水平扩展**
   - 负载均衡（Nginx）
   - 多实例部署

2. **数据库优化**
   - 读写分离
   - 添加索引
   - 查询优化

3. **缓存层**
   - Redis缓存
   - CDN缓存

4. **微服务化**
   - 拆分服务
   - 消息队列

---

## 技术支持

遇到问题？
- 查看 [SECURITY.md](./SECURITY.md) - 安全配置
- 查看 [ARCHITECTURE.md](./DOC/ARCHITECTURE.md) - 系统架构
- 提交Issue: https://github.com/your-username/CAC/issues

---

**文档版本**: v1.0.0
**最后更新**: 2025-01-15
