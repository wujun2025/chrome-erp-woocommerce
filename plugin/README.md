# Chrome扩展ERP系统 - WooCommerce管理工具

[![Version](https://img.shields.io/badge/version-1.0.5-blue.svg)](https://github.com/your-repo/chrome-erp-woocommerce)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/chrome-web%20store-brightgreen.svg)](https://chrome.google.com/webstore)

一个专为WooCommerce电商平台设计的轻量级Chrome扩展ERP系统，功能纯粹，完全免费。提供高效的商品管理、店铺管理和订单管理功能，专为新手卖家和创业者打造。

## 📋 目录

- [功能特性](#功能特性)
- [项目架构](#项目架构)
- [安装使用](#安装使用)
- [开发指南](#开发指南)
- [API文档](#api文档)
- [贡献指南](#贡献指南)
- [支持我们](#支持我们)
- [开发者故事](#开发者故事)
- [许可证](#许可证)

## ✨ 功能特性

### 🏪 轻量级多店铺管理
- 支持同时连接和管理多个WooCommerce店铺
- 实时连接状态监测和诊断
- 双认证模式：WordPress应用密码 & WooCommerce REST API
- 界面简洁，操作便捷

### 📦 纯粹商品管理
- 完整的商品CRUD操作（创建、读取、更新、删除）
- 批量操作：批量上架、下架、删除、价格更新
- 高级筛选：价格区间、库存状态、分类标签筛选
- 商品图片管理和上传
- 商品变体和属性管理
- 专注核心功能，避免冗余复杂性

### 📊 高效订单管理
- 实时订单状态跟踪
- 订单详情查看和基础信息管理
- 客户信息和地址管理
- 订单状态批量更新

### 🌍 国际化支持
- 支持中文简体、繁体中文、英文三种语言
- 可扩展的多语言架构
- 用户界面本地化

### 🎨 现代化界面
- 基于Material-UI的美观界面
- 响应式设计，适配不同屏幕尺寸
- 浅色/深色主题切换
- 直观的用户交互体验

### 🌿 轻量纯粹
- **轻量级设计**：专注于核心功能，避免冗余复杂性
- **功能纯粹**：只保留最实用的商品管理功能
- **完全免费**：开源项目，无任何收费项目

## 🏗️ 项目架构

### 技术栈

**前端框架**
- React 18.2.0 - 主要UI框架
- TypeScript 5.3.3 - 类型安全的JavaScript超集
- Material-UI (MUI) 5.14.20 - 现代化UI组件库
- Zustand 4.4.7 - 轻量级状态管理

**构建工具**
- Vite 5.0.8 - 快速构建工具
- @crxjs/vite-plugin 2.0.0-beta.21 - Chrome扩展构建插件
- Chrome Extension Manifest V3 - 最新扩展规范

**核心依赖**
- Axios 1.6.2 - HTTP客户端
- date-fns 4.1.0 - 日期处理库
- @mui/x-data-grid 6.18.2 - 数据表格组件

### 目录结构

```
chrome-erp-woocommerce/
├── public/                 # 公共资源文件
├── src/
│   ├── components/         # React组件
│   │   ├── StoreManagement.tsx
│   │   ├── ProductManagement.tsx
│   │   └── OrderManagement.tsx
│   ├── services/          # API服务层
│   │   └── api.ts
│   ├── store/             # 状态管理
│   │   └── index.ts
│   ├── types/             # TypeScript类型定义
│   │   └── index.ts
│   ├── utils/             # 工具函数
│   ├── hooks/             # 自定义Hook
│   │   └── useTranslation.tsx
│   ├── locales/          # 国际化语言包
│   │   ├── zh-CN.ts
│   │   ├── zh-TW.ts
│   │   ├── en-US.ts
│   │   └── index.ts
│   ├── popup/            # 弹窗页面
│   │   ├── index.html
│   │   ├── index.tsx
│   │   └── PopupApp.tsx
│   ├── maximized/        # 最大化页面
│   └── background/       # 后台脚本
│       └── index.ts
├── manifest.json          # Chrome扩展配置
├── package.json          # 项目配置
├── vite.config.ts        # Vite配置
└── tsconfig.json         # TypeScript配置
```

### 架构设计

```
graph TB
    A[Chrome Extension] --> B[Popup页面]
    A --> C[最大化页面]
    A --> D[后台脚本]
    
    B --> F[React App]
    C --> G[React App]
    
    F --> H[Store Management]
    F --> I[Product Management] 
    F --> J[Order Management]
    
    H --> K[API Service]
    I --> K
    J --> K
    
    K --> L[WooCommerce REST API]
    K --> M[WordPress REST API]
    
    N[Zustand Store] --> H
    N --> I
    N --> J
```

## 🚀 安装使用

### 从源码安装

1. **克隆项目**
   ```bash
   git clone https://github.com/your-repo/chrome-erp-woocommerce.git
   cd chrome-erp-woocommerce
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建扩展**
   ```bash
   npm run build
   ```

4. **加载到Chrome**
   - 打开Chrome浏览器
   - 访问 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的 `dist` 文件夹

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# 运行测试
npm test
```

## 🔧 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Chrome浏览器 >= 88

### 添加新功能

1. **创建组件**
   ```typescript
   // src/components/NewFeature.tsx
   import React from 'react'
   import { useTranslation } from '@/hooks/useTranslation'
   
   export const NewFeature: React.FC = () => {
     const { t } = useTranslation()
     return <div>{t('newFeature.title')}</div>
   }
   ```

2. **添加类型定义**
   ```typescript
   // src/types/index.ts
   export interface NewFeatureType {
     id: string
     name: string
   }
   ```

3. **添加API服务**
   ```typescript
   // src/services/api.ts
   async getNewFeatureData(): Promise<ApiResponse<NewFeatureType[]>> {
     // API实现
   }
   ```

4. **添加翻译**
   ```typescript
   // src/locales/zh-CN.ts
   'newFeature.title': '新功能'
   ```

### 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 组件使用函数式组件 + Hooks
- 使用Zustand进行状态管理
- API调用统一通过services层

## 📚 API文档

### 认证方式

#### WordPress应用密码认证
``typescript
const storeConfig: StoreConfig = {
  authType: 'wordpress',
  credentials: {
    username: 'your-username',
    password: 'your-app-password'
  }
}
```

#### WooCommerce REST API认证
``typescript
const storeConfig: StoreConfig = {
  authType: 'woocommerce',
  credentials: {
    consumerKey: 'ck_xxxxx',
    consumerSecret: 'cs_xxxxx'
  }
}
```

<!-- 注意：API服务器配置功能与backend项目相关，backend项目为后期开发内容 -->

### 主要API接口

- `GET /wp-json/wc/v3/products` - 获取商品列表
- `POST /wp-json/wc/v3/products` - 创建商品
- `PUT /wp-json/wc/v3/products/{id}` - 更新商品
- `DELETE /wp-json/wc/v3/products/{id}` - 删除商品
- `GET /wp-json/wc/v3/orders` - 获取订单列表

详细API文档请参考 [WooCommerce REST API文档](https://woocommerce.github.io/woocommerce-rest-api-docs/)

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. **报告Bug**
   - 使用GitHub Issues报告问题
   - 提供详细的复现步骤
   - 包含浏览器版本和错误截图

2. **功能建议**
   - 通过Issues提交功能请求
   - 描述使用场景和预期效果
   - 欢迎提供设计草图

3. **代码贡献**
   ```bash
   # Fork项目并克隆
   git clone https://github.com/your-username/chrome-erp-woocommerce.git
   
   # 创建功能分支
   git checkout -b feature/new-feature
   
   # 提交更改
   git commit -m "Add new feature"
   
   # 推送到分支
   git push origin feature/new-feature
   
   # 创建Pull Request
   ```

### 开发规范

- 遵循现有代码风格
- 添加适当的类型定义
- 编写单元测试
- 更新文档和翻译
- 确保构建通过

## 💝 支持我们

如果这个项目对您有帮助，请考虑支持我们的持续发展：

### 捐赠方式

**国内支付**
- 微信支付：![赞赏码](public/images/donation-qrcode.jpg)
- 支付宝：[二维码]

**海外支付**
- PayPal: [链接]
- GitHub Sponsors: [链接]

### 其他支持方式

- ⭐ 给项目点个Star
- 🐛 报告Bug和提出建议
- 📢 推荐给其他开发者
- 💬 加入我们的交流群

## 🌟 开发者故事

这个插件的背后有一个真实的故事。开发者出生于1984年，网络通讯专业毕业，一直在浙江嘉兴一家餐饮企业从事信息化维护工作。今年7月底被裁员后，一度感到迷茫失落，但从未放弃对技术的热爱。

平时喜欢喝茶、研究AI编程、风水和中医等传统文化。一直有个梦想，就是创办自己的外贸公司或电商公司，做跨境电商事业。在尝试搭建WooCommerce独立站时，发现缺乏便捷实用的ERP系统来管理商品，这让很多新手卖家望而却步。

于是决定自己开发这套系统，最初只是为了自用，后来想到自己的经历，决定免费分享给同样有梦想的新手卖家和创业者，帮助大家降低产品上架的门槛，提升便捷性。我们的系统专注于解决WooCommerce商品管理的核心问题，功能简洁但实用，满足新手卖家前期产品上架的需求。在商品获得流量后，用户可以进一步优化产品。

这个项目从构想到实现，承载着开发者对技术的执着和对梦想的坚持。正如茶叶需要时间沉淀才能散发醇香，这款插件也经过精心打磨，希望能为每一位有梦想的跨境电商创业者提供助力。

[阅读完整的开发者故事](DEVELOPER_STORY.md)

## 📄 许可证

本项目基于 [MIT许可证](LICENSE) 开源。

```
MIT License

Copyright (c) 2024 Chrome ERP Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 联系我们

- 📧 邮箱: [your-email@example.com]
- 🐙 GitHub: [项目仓库地址]
- 💬 交流群: [待建立]

---

*"让跨境电商管理变得简单高效，为千万小卖家点亮成功之路。"*

## 🔄 更新日志

### v1.0.5 (2025-09-28)
- 🛠️ 完善版本号自动更新机制
- 🔧 修复版本更新脚本路径问题
- 📚 优化版本历史记录

### v1.0.4 (2025-09-28)
- 💝 添加赞赏码支持功能
- ℹ️ 完善关于页面内容
- 📚 更新项目文档

<!-- 注意：API服务器配置功能与backend项目相关，backend项目为后期开发内容 -->

### v1.0.3 (2025-09-21)
- ✨ 统一项目中所有位置的版本号显示
- 🐛 修复设置页面和最大化窗口中的版本号硬编码问题
- 🔧 完善版本号自动更新机制

### v1.0.2 (2025-09-23)
- 🐛 修复Chrome扩展版本号格式问题
- 🔧 将版本号从自定义格式 `1.0.0-20250923.2` 更改为标准格式 `1.0.2`
- ✅ 确保符合Chrome扩展manifest.json的版本号要求（1-4个点分隔的整数）

### v1.0.1 (2025-09-23)
- 🔧 完善版本号系统设计
- 📦 添加版本更新脚本和npm命令
- 📝 创建版本更新日志文件
- ⚙️ 实现自动版本号递增功能

### v1.0.0 (2025-08-15)
- ✨ 初始版本发布
- 🏪 多店铺管理功能
- 📦 基础商品管理
- 🌍 多语言支持
- 🎨 Material-UI界面

---

**感谢使用Chrome扩展ERP系统！** 🎉