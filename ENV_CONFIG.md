# 环境变量配置说明

本项目使用环境变量来管理不同环境下的配置。由于这是一个Vite项目，所有环境变量都需要以 `VITE_` 前缀开头才能在客户端代码中访问。

## 环境变量列表

### 应用基础配置

| 变量名 | 描述 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | 应用标题 | `Antdx Demo` | `我的AI助手` |
| `VITE_APP_VERSION` | 应用版本 | `1.0.0` | `1.2.3` |
| `VITE_APP_DESCRIPTION` | 应用描述 | `基于凯哥人工智能的演示应用` | `智能对话助手` |

### API配置

| 变量名 | 描述 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | API基础URL | `http://localhost:3000/api` | `https://api.example.com` |
| `VITE_API_TIMEOUT` | API请求超时时间(毫秒) | `10000` | `5000` |

### 功能开关

| 变量名 | 描述 | 默认值 | 可选值 |
|--------|------|--------|--------|
| `VITE_ENABLE_DEBUG` | 启用调试模式 | `true` | `true`, `false`, `1`, `0` |
| `VITE_ENABLE_MOCK` | 启用模拟数据 | `false` | `true`, `false`, `1`, `0` |

### AI服务配置

| 变量名 | 描述 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_DASHSCOPE_API_KEY` | 阿里云DashScope API密钥 | 无 | `sk-xxx...` |
| `VITE_DASHSCOPE_BASE_URL` | DashScope API基础URL | `https://dashscope.aliyuncs.com/api/v1` | 自定义URL |

### 第三方服务配置

| 变量名 | 描述 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_ANALYTICS_ID` | 分析服务ID | 无 | `GA_MEASUREMENT_ID` |
| `VITE_SENTRY_DSN` | Sentry错误监控DSN | 无 | `https://xxx@sentry.io/xxx` |

## 配置文件

### 开发环境 (.env.development)

```bash
# 开发环境配置
VITE_APP_TITLE=Antdx Demo (开发版)
VITE_APP_VERSION=1.0.0-dev
VITE_APP_DESCRIPTION=基于凯哥人工智能的演示应用 - 开发环境

# API配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# 功能开关
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK=true

# AI服务配置
VITE_DASHSCOPE_API_KEY=your-dashscope-api-key-here
VITE_DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1

# 第三方服务配置
VITE_ANALYTICS_ID=dev-analytics-id
VITE_SENTRY_DSN=
```

### 生产环境 (.env.production)

```bash
# 生产环境配置
VITE_APP_TITLE=Antdx Demo
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=基于凯哥人工智能的演示应用

# API配置
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=5000

# 功能开关
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK=false

# AI服务配置
VITE_DASHSCOPE_API_KEY=your-production-dashscope-api-key
VITE_DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1

# 第三方服务配置
VITE_ANALYTICS_ID=your-production-analytics-id
VITE_SENTRY_DSN=your-production-sentry-dsn
```

## 如何获取DashScope API密钥

1. 访问 [阿里云控制台](https://dashscope.console.aliyun.com/)
2. 登录您的阿里云账号
3. 开通DashScope服务
4. 在API密钥管理页面创建新的API密钥
5. 将API密钥设置到环境变量 `VITE_DASHSCOPE_API_KEY` 中

## 使用方法

### 1. 创建环境变量文件

在项目根目录创建相应的环境变量文件：

```bash
# 开发环境

# 生产环境  
touch .env.production

# 本地环境（可选，会被git忽略）
touch .env.local
```

### 2. 在代码中使用

```typescript
import { appConfig } from './config/env';

// 使用配置
console.log(appConfig.title);
console.log(appConfig.dashscopeApiKey);

// 使用DashScope API
import { dashscope } from './utils/dashscope';

const response = await dashscope.chat('你好，请介绍一下自己');
```

### 3. 类型安全

项目已经配置了TypeScript类型定义，您可以获得完整的类型提示和检查。

## 安全注意事项

1. **不要将敏感信息提交到版本控制系统**
   - 将 `.env.local` 添加到 `.gitignore`
   - 敏感的API密钥应该通过CI/CD系统或部署平台的环境变量设置

2. **生产环境配置**
   - 在生产环境中关闭调试模式 (`VITE_ENABLE_DEBUG=false`)
   - 使用生产环境的API端点
   - 确保API密钥的安全性

3. **环境变量优先级**
   ```
   .env.local (最高优先级，被git忽略)
   .env.[mode] (如 .env.development)
   .env
   ```

## 故障排除

### 环境变量不生效

1. 确保变量名以 `VITE_` 开头
2. 重启开发服务器
3. 检查变量名拼写是否正确

### DashScope API调用失败

1. 检查API密钥是否正确设置
2. 确认账户余额充足
3. 检查网络连接
4. 查看控制台错误信息

### 调试信息

在开发模式下，应用会在控制台输出配置信息，帮助您调试环境变量设置。 