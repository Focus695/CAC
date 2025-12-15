# API 参考文档

## 概述

CAC项目提供完整的RESTful API，包括用户端API和管理员API。所有API响应遵循统一的格式。

**基础信息**:
- **Base URL**: `http://localhost:3001` (开发环境)
- **API前缀**: 无（直接`/auth`, `/products`等）
- **Content-Type**: `application/json`
- **文档地址**: `http://localhost:3001/api/docs` (Swagger UI)

## 认证说明

### 用户端认证

**登录方式**: HttpOnly Cookie

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "user",
    "role": "CUSTOMER"
  }
}
```

Token自动存储在`access_token` Cookie中（HttpOnly）。

### 管理端认证

**登录方式**: HttpOnly Cookie

```bash
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin-password"
}
```

Token存储在`admin_access_token` Cookie中（HttpOnly）。

### 认证要求

- 🔓 **公开**: 无需认证
- 🔒 **用户**: 需要用户认证（JwtAuthGuard）
- 🛡️ **管理员**: 需要管理员认证（AdminJwtAuthGuard + AdminAuthGuard）

---

## 公开API（无需认证）

### 产品相关

#### GET /products
获取产品列表（仅显示已启用的产品）

**查询参数**:
- `page` (number): 页码，默认1
- `limit` (number): 每页数量，默认20
- `categoryId` (string): 分类ID筛选
- `search` (string): 搜索关键词（匹配产品名称）

**响应示例**:
```json
{
  "products": [
    {
      "id": "product-id",
      "name_zh": "香珠",
      "name_en": "Incense Beads",
      "price": "99.99",
      "stock": 100,
      "mainImage": "/uploads/image.png",
      "isActive": true,
      "isFeatured": true,
      "category": {
        "id": "category-id",
        "name": "香品"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

#### GET /products/:id
获取产品详情

**响应示例**:
```json
{
  "id": "product-id",
  "name_zh": "香珠",
  "name_en": "Incense Beads",
  "price": "99.99",
  "comparePrice": "129.99",
  "stock": 100,
  "sku": "IB-001",
  "mainImage": "/uploads/main.png",
  "detailImages": ["/uploads/detail1.png", "/uploads/detail2.png"],
  "elegantDesc_zh": "优雅描述",
  "elegantDesc_en": "Elegant description",
  "craftsmanship_zh": "工艺描述",
  "craftsmanship_en": "Craftsmanship description",
  "healthBenefits_zh": "健康益处",
  "healthBenefits_en": "Health benefits",
  "sections": [
    {
      "title_zh": "段落标题",
      "title_en": "Section Title",
      "content_zh": "内容",
      "content_en": "Content",
      "order": 1
    }
  ],
  "publishedAt": "2025-01-01T00:00:00.000Z",
  "category": { ... },
  "reviews": [ ... ]
}
```

### 分类相关

#### GET /categories
获取分类列表（仅显示已启用的分类）

**响应示例**:
```json
[
  {
    "id": "category-id",
    "name": "香品",
    "slug": "incense",
    "image": "/uploads/category.png",
    "description": "分类描述",
    "parentId": null,
    "children": [
      {
        "id": "child-id",
        "name": "香珠",
        "slug": "incense-beads",
        "parentId": "category-id"
      }
    ]
  }
]
```

### 评价相关

#### GET /reviews/product/:productId
获取产品评价

**响应示例**:
```json
[
  {
    "id": "review-id",
    "rating": 5,
    "title": "很好的产品",
    "comment": "质量很好，推荐购买",
    "isVerified": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "user": {
      "username": "用户名",
      "avatar": "/uploads/avatar.png"
    }
  }
]
```

---

## 用户API（需用户认证）🔒

### 认证相关

#### POST /auth/register
用户注册

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

#### POST /auth/login
用户登录

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/profile
获取当前用户信息

**响应示例**:
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "username": "username",
  "role": "CUSTOMER",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### POST /auth/logout
用户登出（清除Cookie）

### 购物车相关

#### GET /cart
获取当前用户购物车

**响应示例**:
```json
{
  "items": [
    {
      "id": "cart-item-id",
      "quantity": 2,
      "product": {
        "id": "product-id",
        "name_zh": "香珠",
        "price": "99.99",
        "mainImage": "/uploads/image.png"
      },
      "subtotal": "199.98"
    }
  ],
  "total": "199.98"
}
```

#### POST /cart
添加商品到购物车

**请求体**:
```json
{
  "productId": "product-id",
  "quantity": 2
}
```

#### PATCH /cart/items/:id
更新购物车商品数量

**请求体**:
```json
{
  "quantity": 3
}
```

#### DELETE /cart/items/:id
删除购物车商品

#### DELETE /cart
清空购物车

### 订单相关

#### GET /orders
获取当前用户订单列表

**查询参数**:
- `page` (number): 页码
- `limit` (number): 每页数量

**响应示例**:
```json
{
  "orders": [
    {
      "id": "order-id",
      "orderNumber": "ORD-20250101-001",
      "status": "SHIPPED",
      "paymentStatus": "PAID",
      "total": "299.98",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "items": [
        {
          "product": { "name_zh": "香珠" },
          "quantity": 2,
          "price": "99.99"
        }
      ]
    }
  ]
}
```

#### POST /orders
创建订单

**请求体**:
```json
{
  "shippingAddress": {
    "firstName": "张",
    "lastName": "三",
    "address1": "XX街道XX号",
    "city": "北京",
    "zipCode": "100000",
    "country": "中国",
    "phone": "13800138000"
  },
  "paymentMethod": "ALIPAY",
  "notes": "请尽快发货"
}
```

#### PATCH /orders/:id/status
更新订单状态（用户侧）

#### PATCH /orders/:id/payment-status
更新支付状态（用户侧）

---

## 管理员API（需管理员认证）🛡️

### 管理员认证

#### POST /auth/admin/login
管理员登录

**请求体**:
```json
{
  "email": "admin@example.com",
  "password": "admin-password"
}
```

#### GET /auth/admin/profile
获取管理员信息

#### POST /auth/admin/logout
管理员登出

### 用户管理

#### GET /admin/users
获取用户列表

**查询参数**:
- `page` (number): 页码，默认1
- `limit` (number): 每页数量，默认10
- `search` (string): 搜索（邮箱或用户名）
- `role` (enum): 角色筛选（CUSTOMER/ADMIN/MODERATOR）
- `isActive` (boolean): 状态筛选
- `sortField` (string): 排序字段（createdAt/username）
- `sortOrder` (enum): 排序方向（asc/desc）

**响应示例**:
```json
{
  "users": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

#### PUT /admin/users/:id
更新用户

**请求体**:
```json
{
  "username": "new-username",
  "role": "ADMIN",
  "isActive": true
}
```

#### DELETE /admin/users/:id
删除用户

### 产品管理

#### GET /admin/products
获取产品列表（包括已禁用）

**查询参数**:
- `page`, `limit`, `search`, `categoryId`, `isActive`, `isFeatured`

#### POST /admin/products
创建产品

**请求体**:
```json
{
  "name_zh": "香珠",
  "name_en": "Incense Beads",
  "price": 99.99,
  "comparePrice": 129.99,
  "sku": "IB-001",
  "stock": 100,
  "categoryId": "category-id",
  "mainImage": "/uploads/main.png",
  "detailImages": ["/uploads/d1.png"],
  "elegantDesc_zh": "优雅描述",
  "elegantDesc_en": "Elegant description",
  "sections": [
    {
      "title_zh": "标题",
      "title_en": "Title",
      "content_zh": "内容",
      "content_en": "Content",
      "order": 1
    }
  ],
  "isActive": true,
  "isFeatured": false
}
```

#### PUT /admin/products/:id
更新产品（同创建）

#### DELETE /admin/products/:id
删除产品

#### PATCH /admin/products/:id/status
切换产品启用/禁用状态

#### PATCH /admin/products/:id/publish
发布产品（设置publishedAt为当前时间）

#### PATCH /admin/products/:id/unpublish
取消发布（设置unpublishedAt为当前时间）

### 分类管理

#### GET /admin/categories
获取所有分类（包括已禁用）

#### POST /admin/categories
创建分类

**请求体**:
```json
{
  "name": "香品",
  "slug": "incense",
  "description": "分类描述",
  "image": "/uploads/category.png",
  "parentId": null,
  "isActive": true
}
```

#### PUT /admin/categories/:id
更新分类

#### DELETE /admin/categories/:id
删除分类

#### PATCH /admin/categories/:id/status
切换分类状态

### 订单管理

#### GET /admin/orders
获取所有订单

**查询参数**:
- `page`, `limit`
- `status` (enum): PENDING/CONFIRMED/PROCESSING/SHIPPED/DELIVERED/CANCELLED/REFUNDED
- `paymentStatus` (enum): PENDING/PAID/FAILED/REFUNDED
- `userId` (string): 按用户筛选
- `orderNumber` (string): 按订单号搜索

#### GET /admin/orders/:id
获取订单详情

**响应示例**:
```json
{
  "id": "order-id",
  "orderNumber": "ORD-20250101-001",
  "status": "SHIPPED",
  "paymentStatus": "PAID",
  "total": "299.98",
  "subtotal": "299.98",
  "tax": "0.00",
  "shipping": "0.00",
  "discount": "0.00",
  "trackingNumber": "SF123456789",
  "user": { "email": "user@example.com" },
  "items": [
    {
      "product": { "name_zh": "香珠" },
      "quantity": 2,
      "price": "99.99"
    }
  ],
  "shippingAddress": { ... },
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### PUT /admin/orders/:id/ship
标记为已发货

**请求体**:
```json
{
  "trackingNumber": "SF123456789"
}
```

#### PUT /admin/orders/:id/deliver
标记为已送达

#### PUT /admin/orders/:id/confirm
确认订单

#### PUT /admin/orders/:id/cancel
取消订单

#### PUT /admin/orders/:id/update-payment
更新支付状态

**请求体**:
```json
{
  "paymentStatus": "PAID"
}
```

### 文件上传

#### POST /admin/uploads/image
上传单张图片

**请求**:
```bash
POST /admin/uploads/image
Content-Type: multipart/form-data

file: [binary data]
```

**响应**:
```json
{
  "url": "http://localhost:3001/uploads/uuid.png",
  "filename": "uuid.png",
  "originalName": "product.png",
  "size": 123456,
  "mimeType": "image/png"
}
```

#### POST /admin/uploads/images
批量上传图片（最多9张）

**响应**:
```json
{
  "urls": [
    "http://localhost:3001/uploads/uuid1.png",
    "http://localhost:3001/uploads/uuid2.png"
  ]
}
```

---

## 错误响应格式

所有API错误遵循统一格式：

```json
{
  "statusCode": 400,
  "message": "错误消息",
  "error": "Bad Request"
}
```

### 常见错误码

| 状态码 | 说明 | 示例 |
|-------|------|------|
| 400 | 请求参数错误 | 缺少必填字段、类型错误 |
| 401 | 未认证 | Token缺失或无效 |
| 403 | 无权限 | 非管理员访问管理API |
| 404 | 资源不存在 | 产品ID不存在 |
| 409 | 冲突 | 邮箱已被注册 |
| 500 | 服务器错误 | 数据库连接失败 |

### 字段验证错误示例

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 速率限制

使用Throttler中间件进行速率限制（防止暴力攻击）：

- **默认限制**: 10个请求 / 1分钟
- **登录端点**: 5个请求 / 1分钟

超过限制时返回：
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## Swagger文档

访问 `http://localhost:3001/api/docs` 可查看完整的交互式API文档，包括：

- 所有端点列表
- 请求/响应示例
- 在线测试功能
- Schema定义

---

## 示例代码

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // 重要：允许Cookie
});

// 登录
await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// 获取产品列表
const { data } = await api.get('/products', {
  params: { page: 1, limit: 20 },
});

// 添加到购物车
await api.post('/cart', {
  productId: 'product-id',
  quantity: 2,
});
```

### cURL

```bash
# 登录
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"password123"}'

# 获取购物车（使用Cookie）
curl -X GET http://localhost:3001/cart \
  -b cookies.txt
```

---

**文档版本**: v1.0.0
**最后更新**: 2025-01-15
