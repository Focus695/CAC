# 贡献指南

感谢您考虑为CAC项目做出贡献！本文档提供了贡献代码的指南和最佳实践。

## 目录
- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试要求](#测试要求)

---

## 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 尊重所有贡献者
- 接受建设性的批评
- 专注于对社区最有利的事情
- 对其他社区成员表示同理心

### 我们的标准

**积极行为示例**：
- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注社区的最佳利益
- 对其他社区成员表示同情

**不可接受行为示例**：
- 使用性化语言或图像
- 挑衅、侮辱性评论或人身攻击
- 公开或私下骚扰
- 未经明确许可发布他人的私人信息
- 其他在专业环境中可被视为不适当的行为

---

## 如何贡献

### 报告Bug

如果您发现Bug，请提交Issue并包含：

1. **清晰的标题**：简要描述问题
2. **重现步骤**：
   - 详细的操作步骤
   - 预期行为
   - 实际行为
3. **环境信息**：
   - 操作系统
   - Node.js版本
   - 浏览器版本（前端问题）
4. **截图/日志**：如果适用
5. **可能的解决方案**：如果您有想法

**Issue模板示例**：
```markdown
## Bug描述
简要描述遇到的问题

## 重现步骤
1. 访问 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 预期行为
应该发生什么

## 实际行为
实际发生了什么

## 环境
- OS: [e.g. macOS 13.0]
- Node.js: [e.g. 18.17.0]
- Browser: [e.g. Chrome 120]

## 截图
如果适用，添加截图

## 额外信息
其他相关信息
```

### 提出功能请求

提出新功能时，请：

1. **说明用例**：为什么需要此功能
2. **描述方案**：您期望的实现方式
3. **考虑影响**：对现有功能的影响
4. **提供示例**：其他项目的类似实现

**功能请求模板示例**：
```markdown
## 功能描述
清晰简洁地描述您想要的功能

## 问题背景
这个功能解决什么问题？

## 期望解决方案
您希望如何实现？

## 替代方案
您考虑过哪些其他方案？

## 额外信息
其他相关内容
```

### 提交Pull Request

**基本流程**：

1. **Fork 仓库**
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'feat: add amazing feature'`)
4. **推送到分支** (`git push origin feature/amazing-feature`)
5. **开启Pull Request**

**PR要求**：
- PR标题遵循[提交规范](#提交规范)
- 描述清楚改动内容和原因
- 关联相关Issue（如有）
- 确保所有测试通过
- 代码符合项目规范
- 添加必要的文档

**PR模板示例**：
```markdown
## 更改类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新
- [ ] 其他

## 更改描述
简要描述此PR的内容

## 关联Issue
Closes #issue_number

## 测试
- [ ] 添加了新测试
- [ ] 所有现有测试通过
- [ ] 手动测试通过

## 检查清单
- [ ] 代码符合项目规范
- [ ] 已更新相关文档
- [ ] 提交信息符合约定式提交
- [ ] 没有破坏性更改（或已在CHANGELOG中记录）
```

---

## 开发流程

### 1. 设置开发环境

```bash
# 克隆您的fork
git clone https://github.com/YOUR_USERNAME/CAC.git
cd CAC

# 添加上游remote
git remote add upstream https://github.com/original/CAC.git

# 安装依赖
npm install

# 配置环境变量
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# 编辑配置文件

# 运行数据库迁移
cd backend
npx prisma migrate dev
npx prisma generate
npm run seed

# 启动开发服务器
npm run dev  # 在项目根目录
```

### 2. 保持同步

```bash
# 获取上游更新
git fetch upstream

# 合并到您的main分支
git checkout main
git merge upstream/main

# 推送到您的fork
git push origin main
```

### 3. 创建功能分支

```bash
# 从最新的main分支创建
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### 4. 开发和测试

```bash
# 运行开发服务器
npm run dev

# 运行测试
npm run test

# 运行lint
npm run lint

# 运行类型检查
npm run type-check
```

### 5. 提交更改

```bash
# 添加更改
git add .

# 提交（遵循提交规范）
git commit -m "feat: add new feature"

# 推送到您的fork
git push origin feature/your-feature-name
```

### 6. 创建Pull Request

1. 访问您的fork在GitHub上的页面
2. 点击 "Compare & pull request"
3. 填写PR模板
4. 提交PR

---

## 代码规范

### TypeScript/JavaScript

**使用ESLint和Prettier**：

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

**编码约定**：

1. **命名规范**：
   - 文件名：kebab-case（如 `user-service.ts`）
   - 类名：PascalCase（如 `UserService`）
   - 变量/函数：camelCase（如 `getUserById`）
   - 常量：UPPER_SNAKE_CASE（如 `MAX_FILE_SIZE`）
   - 接口：PascalCase + "I"前缀可选（如 `User` 或 `IUser`）

2. **文件组织**：
   ```typescript
   // 1. 导入（按类型分组）
   import { Module } from '@nestjs/common';
   import { SomeService } from './services';
   import { SomeDto } from './dto';

   // 2. 类型定义
   interface Example {
     id: string;
   }

   // 3. 类/组件
   @Module({...})
   export class ExampleModule {}
   ```

3. **注释**：
   - 使用JSDoc注释公共API
   - 复杂逻辑添加内联注释
   - 不要注释显而易见的代码

   ```typescript
   /**
    * 获取用户订单列表
    * @param userId - 用户ID
    * @param options - 查询选项（分页、筛选）
    * @returns 订单列表和分页信息
    */
   async getUserOrders(userId: string, options: QueryOptions) {
     // 实现
   }
   ```

4. **错误处理**：
   ```typescript
   // 好的做法
   try {
     const user = await this.userService.findOne(id);
     if (!user) {
       throw new NotFoundException(`User #${id} not found`);
     }
     return user;
   } catch (error) {
     this.logger.error(`Failed to get user: ${error.message}`);
     throw error;
   }

   // 不好的做法
   try {
     return await this.userService.findOne(id);
   } catch (e) {
     // 空的catch块
   }
   ```

5. **异步处理**：
   ```typescript
   // 使用async/await而不是Promise链
   // 好
   async function example() {
     const user = await getUser();
     const orders = await getOrders(user.id);
     return orders;
   }

   // 不好
   function example() {
     return getUser().then(user =>
       getOrders(user.id).then(orders => orders)
     );
   }
   ```

### React/Next.js

1. **组件结构**：
   ```tsx
   // 1. Imports
   import { useState } from 'react';
   import { Button } from '@/components/ui';

   // 2. Types
   interface Props {
     title: string;
   }

   // 3. Component
   export function MyComponent({ title }: Props) {
     const [count, setCount] = useState(0);

     return (
       <div>
         <h1>{title}</h1>
         <Button onClick={() => setCount(c => c + 1)}>
           Count: {count}
         </Button>
       </div>
     );
   }
   ```

2. **Hooks规则**：
   - 仅在顶层调用Hook
   - 仅在React函数中调用Hook
   - 自定义Hook以"use"开头

3. **状态管理**：
   - 本地状态用useState
   - 跨组件状态用Context或Zustand
   - 服务端状态考虑SWR或React Query

### NestJS

1. **模块结构**：
   ```
   module-name/
   ├── dto/
   │   ├── create-entity.dto.ts
   │   └── update-entity.dto.ts
   ├── entities/
   │   └── entity.entity.ts
   ├── module-name.controller.ts
   ├── module-name.service.ts
   ├── module-name.module.ts
   └── module-name.service.spec.ts
   ```

2. **依赖注入**：
   ```typescript
   @Injectable()
   export class UserService {
     constructor(
       private readonly prisma: PrismaService,
       @Inject(forwardRef(() => OrderService))
       private readonly orderService: OrderService,
     ) {}
   }
   ```

3. **DTO验证**：
   ```typescript
   import { IsString, IsEmail, MinLength } from 'class-validator';

   export class CreateUserDto {
     @IsEmail()
     email: string;

     @IsString()
     @MinLength(6)
     password: string;
   }
   ```

---

## 提交规范

使用 **约定式提交（Conventional Commits）** 规范：

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（既不是新功能也不是Bug修复）
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建/工具更改
- `ci`: CI配置更改
- `revert`: 回退提交

### Scope（可选）

模块或功能范围：
- `auth`, `user`, `product`, `order`, `cart`, etc.
- `frontend`, `backend`
- `docs`, `deps`

### Subject

- 使用祈使句（如 "add" 而不是 "added"）
- 首字母小写
- 结尾不加句号
- 简洁明了（不超过50字符）

### 示例

```bash
# 新功能
git commit -m "feat(product): add product publish/unpublish functionality"

# Bug修复
git commit -m "fix(auth): resolve JWT token expiration issue"

# 文档
git commit -m "docs: update API reference for admin endpoints"

# 重构
git commit -m "refactor(cart): simplify cart calculation logic"

# 破坏性更改
git commit -m "feat(api)!: change user authentication to cookie-based

BREAKING CHANGE: Authentication now uses HttpOnly cookies instead of Bearer tokens.
Users need to update their API clients to support cookies."
```

---

## 测试要求

### 单元测试

**使用Jest编写单元测试**：

```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const dto = { email: 'test@example.com', password: 'password' };
    const result = await service.create(dto);
    expect(result.email).toBe(dto.email);
  });
});
```

**运行测试**：
```bash
# 运行所有测试
npm test

# 运行特定文件
npm test -- user.service.spec.ts

# 生成覆盖率报告
npm test -- --coverage
```

### E2E测试

**NestJS E2E测试示例**：

```typescript
// auth.e2e-spec.ts
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);
  });
});
```

### 测试覆盖率

目标覆盖率：
- **语句覆盖率**: >= 80%
- **分支覆盖率**: >= 70%
- **函数覆盖率**: >= 80%
- **行覆盖率**: >= 80%

---

## 文档要求

### 代码文档

- 为所有公共API添加JSDoc注释
- 复杂逻辑添加说明性注释
- 更新相关的README和指南

### 文档更新

当添加/修改功能时，请更新：
- `README.md` - 如果影响项目概述
- `DOC/ARCHITECTURE.md` - 如果影响架构
- `DOC/API_REFERENCE.md` - 如果添加/修改API
- `DOC/ADMIN_GUIDE.md` - 如果影响管理后台
- `CHANGELOG.md` - 记录重要更改

---

## Pull Request流程

1. **提交前检查**：
   - [ ] 代码符合规范
   - [ ] 所有测试通过
   - [ ] Lint检查通过
   - [ ] TypeScript编译无错误
   - [ ] 已添加必要的测试
   - [ ] 已更新相关文档

2. **提交PR**：
   - 填写完整的PR模板
   - 关联相关Issue
   - 添加适当的标签

3. **代码审查**：
   - 等待维护者审查
   - 根据反馈修改代码
   - 保持讨论专业和友好

4. **合并**：
   - PR获得批准后
   - 维护者会合并您的更改
   - 您的贡献将出现在下一个发布版本中

---

## 发布流程（维护者）

1. 更新版本号（遵循语义化版本）
2. 更新CHANGELOG.md
3. 创建Git tag
4. 推送tag触发发布流程
5. 发布GitHub Release

---

## 获得帮助

如有疑问：
- 查看[文档](./DOC/)
- 提交Issue询问
- 加入讨论区
- 联系维护者

---

## 许可证

贡献的代码将遵循项目的[MIT许可证](./LICENSE)。

---

**感谢您的贡献！** 🎉

每一个贡献，无论大小，都让这个项目变得更好。

---

**文档版本**: v1.0.0
**最后更新**: 2025-01-15
