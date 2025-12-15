# 管理后台使用指南

## 概述

CAC管理后台是一个功能完整的后台管理系统，提供用户管理、产品管理、订单管理和分类管理等核心电商管理功能。

## 一、访问管理后台

### 访问地址
- **URL**: `http://localhost:3000/admin`（开发环境）
- **生产环境**: `https://yourdomain.com/admin`

### 默认管理员账号

运行数据库seed脚本后会自动创建管理员账户：

```bash
cd backend
npm run seed
```

**默认凭据**（首次运行时输出）:
- **Email**: `admin@example.com`
- **Password**: [seed脚本运行时显示的随机密码]
- **角色**: ADMIN

⚠️ **重要安全提示**: 首次登录后请立即修改密码！

### 登录流程

1. 访问 `http://localhost:3000/admin/login`
2. 输入管理员邮箱和密码
3. 点击登录
4. 系统自动设置HttpOnly Cookie (`admin_access_token`)
5. 重定向到管理后台Dashboard

## 二、功能模块

### 2.1 Dashboard（仪表板）

路径: `/admin/dashboard`

**功能概述**:
- 用户总数统计
- 产品总数统计
- 订单总数统计
- 订单状态分布
- 最近订单列表

**快速操作**:
- 查看待处理订单
- 查看低库存产品
- 系统状态概览

---

### 2.2 用户管理

路径: `/admin/users`

#### 功能列表

**1. 查看用户列表**
- 分页浏览所有用户
- 显示：头像、用户名、邮箱、角色、状态、注册时间
- 支持排序：按注册时间、用户名等

**2. 搜索和筛选**
- 按邮箱或用户名搜索
- 按角色筛选（CUSTOMER / ADMIN / MODERATOR）
- 按状态筛选（启用/禁用）
- 排序选项（注册时间升序/降序）

**3. 编辑用户**
- 更新用户信息（用户名、邮箱）
- 修改用户角色
- 启用/禁用用户账户
- ⚠️ 不能编辑密码（安全原因）

**4. 删除用户**
- 永久删除用户账户
- 删除前需确认
- ⚠️ 删除操作不可逆

#### 操作步骤示例

**编辑用户角色**:
1. 在用户列表找到目标用户
2. 点击"Edit"按钮
3. 在弹出的模态框中选择新角色
4. 点击"Update"保存

**禁用用户**:
1. 编辑用户
2. 取消勾选"Active"复选框
3. 保存更改

---

### 2.3 产品管理

路径: `/admin/products`

#### 功能列表

**1. 查看产品列表**
- 分页浏览所有产品（包括已禁用）
- 显示：图片、名称、价格、库存、SKU、状态
- 标记：Featured（推荐）、Active（启用）

**2. 搜索和筛选**
- 按产品名称或SKU搜索
- 按分类筛选
- 按状态筛选（启用/禁用）
- 按是否推荐筛选

**3. 创建产品**
- 多语言输入（中文/英文名称和描述）
- 价格和对比价格设置
- SKU和库存管理
- 分类选择
- 主图和详情图上传（支持多张）
- 动态内容sections（最多3个）
- 工艺描述、优雅描述、健康益处等详细信息

**4. 编辑产品**
- 更新产品所有信息
- 修改图片
- 调整库存
- 更改分类

**5. 产品状态管理**
- 启用/禁用产品
- 标记为Featured
- **发布产品**：设置publishedAt时间戳
- **取消发布**：设置unpublishedAt时间戳

**6. 删除产品**
- 永久删除产品
- 删除前需确认

#### 操作步骤示例

**创建新产品**:
1. 点击"Add Product"按钮
2. 填写产品信息：
   - 中文名称和英文名称
   - 价格（必填）、对比价格（可选）
   - SKU（可选，建议填写）
   - 库存数量
3. 选择分类
4. 上传主图（点击"Upload Main Image"）
5. 上传详情图（点击"Upload Detail Images"，可多张）
6. 填写优雅描述、工艺描述、健康益处等（支持中英文）
7. 添加动态Sections（可选）：
   - 点击"Add Section"
   - 填写标题和内容（中英文）
   - 最多添加3个
8. 勾选"Active"启用产品
9. 可选勾选"Featured"设为推荐
10. 点击"Create Product"

**发布产品**:
1. 在产品列表找到产品
2. 点击"Publish"按钮
3. 系统自动设置publishedAt为当前时间
4. 产品状态更新

**修改库存**:
1. 点击产品的"Edit"按钮
2. 在"Stock"字段输入新库存数量
3. 保存更改

#### 图片上传说明

- **支持格式**: PNG, JPG, JPEG
- **最大大小**: 单文件10MB
- **主图**: 建议尺寸800x800px
- **详情图**: 支持多张，建议尺寸1200x1200px

---

### 2.4 分类管理

路径: `/admin/categories`

#### 功能列表

**1. 查看分类列表**
- 显示所有分类（包括禁用）
- 支持树形结构（父子关系）
- 显示：名称、Slug、父分类、状态

**2. 创建分类**
- 输入分类名称
- 输入Slug（URL友好标识）
- 选择父分类（可选，用于创建子分类）
- 上传分类图片（可选）
- 描述（可选）

**3. 编辑分类**
- 更新分类信息
- 修改父分类关系
- 更换图片

**4. 启用/禁用分类**
- 切换分类状态
- 禁用的分类不会显示在前端

**5. 删除分类**
- 删除分类
- ⚠️ 如果分类下有产品，需要先移除或重新分配产品

#### 操作步骤示例

**创建子分类**:
1. 点击"Add Category"
2. 输入分类名称（如："香珠"）
3. 输入Slug（如："incense-beads"）
4. 在"Parent Category"下拉框选择父分类
5. 可选上传分类图片
6. 点击"Create"

---

### 2.5 订单管理

路径: `/admin/orders`

#### 功能列表

**1. 查看订单列表**
- 分页浏览所有订单
- 显示：订单号、用户、总额、状态、支付状态、创建时间
- 状态标签带颜色区分

**2. 搜索和筛选**
- 按订单号搜索
- 按订单状态筛选
- 按支付状态筛选
- 按用户筛选

**3. 查看订单详情**
- 订单基本信息
- 订单商品列表（产品、数量、价格）
- 收货地址信息
- 支付信息
- 订单时间线

**4. 订单状态管理**

支持的状态流转：
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
    ↓
CANCELLED / REFUNDED
```

**状态说明**:
- **PENDING**: 待处理（新订单）
- **CONFIRMED**: 已确认
- **PROCESSING**: 处理中（备货/打包）
- **SHIPPED**: 已发货
- **DELIVERED**: 已送达
- **CANCELLED**: 已取消
- **REFUNDED**: 已退款

**5. 订单操作**

- **确认订单** (`Confirm`)
  - 将PENDING订单标记为CONFIRMED
  - 表示订单已被确认，准备处理

- **发货** (`Ship`)
  - 将订单标记为SHIPPED
  - 需要输入运单号（Tracking Number）
  - 系统自动记录发货时间

- **标记为已送达** (`Deliver`)
  - 将SHIPPED订单标记为DELIVERED
  - 表示客户已收到商品

- **取消订单** (`Cancel`)
  - 将订单标记为CANCELLED
  - 需要确认操作

**6. 支付状态管理**

- **PENDING**: 待支付
- **PAID**: 已支付
- **FAILED**: 支付失败
- **REFUNDED**: 已退款

可通过"Update Payment"按钮更新支付状态。

#### 操作步骤示例

**处理新订单**:
1. 在订单列表找到PENDING状态的订单
2. 点击订单查看详情
3. 确认订单信息无误
4. 点击"Confirm Order"确认订单
5. 订单状态变更为CONFIRMED
6. 准备商品并打包
7. 点击"Ship Order"
8. 输入运单号（如: "SF123456789"）
9. 提交，订单状态变为SHIPPED
10. 客户收货后，点击"Mark as Delivered"

**处理退款**:
1. 打开订单详情
2. 确认需要退款
3. 点击"Update Payment Status"
4. 选择"REFUNDED"
5. 保存
6. 将订单状态更改为"REFUNDED"

---

## 三、API使用示例

### 认证

所有管理员API都需要认证。登录后token自动存储在Cookie中。

**登录API**:
```bash
curl -X POST http://localhost:3001/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-admin-password"
  }'
```

### 用户管理API

**获取用户列表**:
```bash
curl -X GET "http://localhost:3001/admin/users?page=1&limit=10&role=CUSTOMER" \
  -H "Cookie: admin_access_token=<your-token>"
```

**更新用户**:
```bash
curl -X PUT http://localhost:3001/admin/users/user-id \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_access_token=<your-token>" \
  -d '{
    "role": "ADMIN",
    "isActive": true
  }'
```

### 产品管理API

**创建产品**:
```bash
curl -X POST http://localhost:3001/admin/products \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_access_token=<your-token>" \
  -d '{
    "name_zh": "香珠",
    "name_en": "Incense Beads",
    "price": 99.99,
    "stock": 100,
    "categoryId": "category-id",
    "isActive": true
  }'
```

**上传图片**:
```bash
curl -X POST http://localhost:3001/admin/uploads/image \
  -H "Cookie: admin_access_token=<your-token>" \
  -F "file=@/path/to/image.png"
```

### 订单管理API

**获取订单列表**:
```bash
curl -X GET "http://localhost:3001/admin/orders?page=1&limit=20&status=PENDING" \
  -H "Cookie: admin_access_token=<your-token>"
```

**发货订单**:
```bash
curl -X PUT http://localhost:3001/admin/orders/order-id/ship \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_access_token=<your-token>" \
  -d '{
    "trackingNumber": "SF123456789"
  }'
```

---

## 四、安全注意事项

### 1. 密码安全
- 首次登录后立即修改默认密码
- 使用强密码（至少12个字符，包含大小写字母、数字和特殊符号）
- 定期更换密码（建议每3个月）
- 不要与他人共享管理员账号

### 2. 访问控制
- 仅授予必要的人员管理员权限
- 使用MODERATOR角色分配有限权限
- 定期审查管理员账户列表
- 及时禁用离职员工账户

### 3. 操作审计
- 重要操作（删除用户、删除产品）会被记录
- 定期检查系统日志
- 注意可疑活动

### 4. 数据保护
- 定期备份数据库
- 谨慎执行删除操作
- 删除前务必确认

### 5. 会话安全
- 管理员Token有效期为7天
- 离开时主动登出
- 不在公共计算机上保持登录状态
- 使用HTTPS访问管理后台（生产环境）

### 6. 文件上传安全
- 仅上传可信图片
- 检查上传文件大小和格式
- 避免上传敏感信息截图

---

## 五、常见问题

### Q1: 忘记管理员密码怎么办？
**A**: 需要通过数据库重置：
```sql
-- 使用bcrypt生成新密码哈希
UPDATE "User" SET password = '$2a$10$...' WHERE email = 'admin@example.com';
```
或者重新运行seed脚本（会创建新的默认管理员）。

### Q2: 如何添加新的管理员？
**A**:
1. 在用户管理中找到目标用户
2. 编辑用户
3. 将角色改为"ADMIN"
4. 保存

或者通过注册新用户后修改角色。

### Q3: 产品图片上传失败？
**A**: 检查：
- 文件格式是否为PNG/JPG/JPEG
- 文件大小是否超过10MB
- 网络连接是否正常
- 后端uploads目录权限

### Q4: 订单状态无法更新？
**A**: 确保：
- 状态流转顺序正确（PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED）
- 不能将DELIVERED订单改回SHIPPED
- 发货时必须提供运单号

### Q5: 分类删除失败？
**A**: 检查该分类下是否还有产品。如有产品：
1. 先将产品移动到其他分类
2. 或删除相关产品
3. 然后再删除分类

### Q6: 如何批量操作？
**A**: 当前版本不支持批量操作。需要逐个处理。未来版本会添加批量功能。

---

## 六、最佳实践

### 产品管理
1. **使用规范的SKU编码**，便于库存管理
2. **上传高质量图片**，提升用户体验
3. **填写完整的产品信息**（中英文）
4. **合理使用Featured标记**，突出重点产品
5. **及时更新库存**，避免超卖

### 订单管理
1. **及时处理新订单**（建议24小时内确认）
2. **准确记录运单号**
3. **保持订单状态同步**
4. **妥善处理取消和退款**

### 用户管理
1. **谨慎授予管理员权限**
2. **定期审查用户账户**
3. **及时处理用户反馈**

### 安全习惯
1. **定期更换密码**
2. **使用完毕及时登出**
3. **不在不安全环境下访问后台**
4. **定期备份重要数据**

---

## 七、技术支持

如遇到问题，请查阅：
- [架构文档](./ARCHITECTURE.md) - 了解系统架构
- [API参考](./API_REFERENCE.md) - 完整API文档
- [安全指南](../SECURITY.md) - 安全最佳实践

或提交Issue: `https://github.com/your-username/CAC/issues`

---

**文档版本**: v1.0.0
**最后更新**: 2025-01-15
