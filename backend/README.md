# Chrome ERP WooCommerce 后台管理系统 (后期开发)

这是 Chrome ERP WooCommerce 项目的后台管理系统，用于管理插件的运营数据和用户信息。

> ⚠️ **注意**: 此项目为后期开发内容，当前版本仅包含基础框架和核心功能设计，完整功能将在后续版本中逐步实现。

## 功能特性 (规划中)

> ⚠️ 以下功能为规划功能，将在后续版本中逐步实现

- 用户数据管理
- 插件使用统计
- 站点绑定统计
- 数据分析和报告
- API配置管理
- 用户反馈收集与回复
- 广告位管理
- 消息推送管理

## 技术栈 (规划中)

> ⚠️ 以下技术栈为规划技术选型，将在后续开发中使用

- Node.js
- Express.js
- MongoDB (Mongoose)
- RESTful API

## 安装和运行 (规划中)

> ⚠️ 以下安装和运行说明为规划内容，将在后续开发中实现

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动生产服务器
npm start
```

## API 端点 (规划中)

> ⚠️ 以下API端点为规划内容，将在后续开发中实现

- `GET /api/users` - 获取用户列表
- `GET /api/stats` - 获取统计信息
- `GET /api/sites` - 获取站点绑定信息
- `GET /api/metrics/installation` - 获取安装率数据
- `GET /api/metrics/binding` - 获取绑定率数据
- `GET /api/metrics/activity` - 获取用户活跃度数据
- `GET /api/feedback` - 获取用户反馈列表
- `POST /api/feedback` - 提交用户反馈
- `GET /api/ads` - 获取广告列表
- `GET /api/messages` - 获取用户消息

## 数据库设计 (规划中)

> ⚠️ 以下数据库设计为规划内容，将在后续开发中实现

- Users: 用户信息
- Sites: 站点绑定信息
- Stats: 使用统计信息
- Feedback: 用户反馈信息
- Ads: 广告信息
- Messages: 消息推送信息

# 后台运营管理系统 (后期开发)

## 概述
这是一个轻量级的后台运营管理系统，专为Chrome ERP WooCommerce插件的运营者设计。该系统严格遵循奥卡姆剃刀原则和KISS原则，只保留最核心的运营功能，避免不必要的复杂性。

> ⚠️ **注意**: 此部分为后期开发内容，当前版本仅包含基础框架和核心功能设计，完整功能将在后续版本中逐步实现。

## 系统定位
本系统是Chrome ERP WooCommerce插件的配套后台管理系统，主要面向插件的运营者和管理员，专注于监控和提升插件的核心运营指标。

## 核心设计理念
- **简约至上**：只保留最核心的功能模块，去除冗余功能
- **易于维护**：简化系统架构，降低维护成本
- **高效运行**：轻量级设计，确保系统响应迅速
- **聚焦核心**：专注于插件运营的核心指标监控

## 核心功能模块

### 1. 插件运营监控
- **安装率追踪** - 监控插件的安装和卸载数据
- **绑定率分析** - 跟踪用户店铺绑定成功率和失败原因
- **活跃度统计** - 分析用户的日常活跃情况和使用频率

### 2. 用户反馈收集与管理
- **反馈收集系统** - 收集用户的意见和建议
- **反馈回复功能** - 支持向用户回复反馈
- **问题统计分析** - 分析用户反馈中的常见问题

### 3. 广告位管理
- **广告内容管理** - 添加、编辑、删除广告内容
- **广告状态控制** - 控制广告的激活状态
- **广告展示统计** - 统计广告展示情况

### 4. 消息推送管理
- **消息创建与推送** - 向所有用户推送文字和链接消息
- **消息状态管理** - 管理消息的激活状态
- **消息阅读统计** - 统计消息阅读情况

### 5. API配置管理
- **主备API服务器地址配置** - 支持配置主备API服务器地址
- **API配置工具** - 提供API配置工具函数供系统模块使用

## 技术架构
- 前端：React + TypeScript (轻量级)
- 后端：Node.js + Express (精简版)
- 数据库：MongoDB (基础配置)
- 部署：简化部署流程
- CI/CD：基础自动化流程

## 目录结构
```
backend/
├── src/
│   ├── controllers/     # 控制器
│   │   ├── MetricsController.ts # 运营指标控制器
│   │   ├── FeedbackController.ts # 用户反馈控制器
│   │   ├── AdController.js # 广告管理控制器
│   │   └── MessageController.js # 消息推送控制器
│   ├── middleware/      # 中间件
│   │   └── auth.ts     # 身份验证中间件
│   ├── models/         # 数据模型
│   │   ├── Metrics.ts  # 运营指标模型
│   │   ├── Feedback.ts # 用户反馈模型
│   │   ├── Ad.js # 广告模型
│   │   └── Message.js # 消息推送模型
│   ├── routes/         # 路由
│   │   ├── metricsRoutes.ts # 运营指标路由
│   │   ├── feedbackRoutes.ts # 用户反馈路由
│   │   ├── adRoutes.js # 广告管理路由
│   │   └── messageRoutes.js # 消息推送路由
│   ├── utils/          # 工具函数
│   │   ├── apiHelper.ts     # API工具函数
│   │   ├── metricsCollector.ts # 指标收集工具
│   │   └── apiConfig.ts     # API配置工具
│   └── index.js        # 入口文件
├── .env.example        # 环境变量示例
├── package.json        # 项目配置
└── tsconfig.json       # TypeScript配置
```

## API端点设计
```
运营指标:
GET    /api/metrics/installation   # 获取安装率数据
GET    /api/metrics/binding       # 获取绑定率数据
GET    /api/metrics/activity      # 获取用户活跃度数据

用户反馈:
GET    /api/feedback/admin        # 获取用户反馈列表（管理）
POST   /api/feedback              # 提交用户反馈
POST   /api/feedback/admin/:id/reply # 回复用户反馈

广告管理:
GET    /api/ads                   # 获取激活的广告列表
GET    /api/ads/admin             # 获取所有广告列表（管理）
POST   /api/ads/admin             # 创建新广告
PUT    /api/ads/admin/:id         # 更新广告
DELETE /api/ads/admin/:id         # 删除广告

消息推送:
GET    /api/messages              # 获取用户未读消息
POST   /api/messages/:id/read     # 标记消息为已读
GET    /api/messages/admin        # 获取所有消息列表（管理）
POST   /api/messages/admin        # 创建新消息
PUT    /api/messages/admin/:id    # 更新消息
DELETE /api/messages/admin/:id    # 删除消息

API配置:
GET    /api/config/api           # 获取API配置
POST   /api/config/api           # 更新API配置
```

## 与插件的关系
- 本系统独立于Chrome扩展插件运行
- 通过API与插件进行数据交互
- 为插件运营者提供核心指标监控界面
- 收集和分析插件使用数据，为产品优化提供依据

## 核心指标定义

### 安装率
- 总安装次数 / 目前用户数
- 日/周/月安装趋势

### 绑定率
- 成功绑定店铺的用户数 / 活跃用户数
- 不同认证方式的绑定成功率

### 用户活跃度
- 日活跃用户数（DAU）
- 周活跃用户数（WAU）
- 月活跃用户数（MAU）

## 更新日志

### v1.0.4 (2025-09-28)
- 自动版本更新
- 📰 新增广告位管理功能
  - 支持广告内容的增删改查
  - 支持广告状态控制
- 💬 新增用户反馈回复功能
  - 支持向用户回复反馈
  - 支持反馈状态管理
- 📢 新增消息推送功能
  - 支持向所有用户推送文字和链接消息
  - 支持消息已读状态跟踪

### v1.0.0 (2025-08-15)
- ✨ 初始版本发布
- 📊 插件运营监控功能
- 💬 用户反馈收集功能

## 💝 支持我们

如果这个项目对您有帮助，请考虑支持我们的持续发展：

### 捐赠方式

**国内支付**
- 微信支付：![微信赞赏码](../plugin/public/images/donation-qrcode.jpg)
- 支付宝：[二维码]

**海外支付**
- PayPal: [链接]
- GitHub Sponsors: [链接]

### 其他支持方式

- ⭐ 给项目点个Star
- 🐛 报告Bug和提出建议
- 📢 推荐给其他开发者
- 💬 加入我们的交流群