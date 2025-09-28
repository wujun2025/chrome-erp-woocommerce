# 技术架构文档

## 概述

本项目是一个轻量级的Chrome扩展ERP系统，专为WooCommerce电商平台设计。系统采用现代化的前端技术栈，专注于提供简洁、高效的商品管理功能。

## 技术栈

### 前端框架
- **React 18.2.0**: 用于构建用户界面的核心框架
- **TypeScript 5.3.3**: 提供类型安全的JavaScript开发体验
- **Material-UI (MUI) 5.14.20**: 现代化的UI组件库，提供美观的界面设计
- **Zustand 4.4.7**: 轻量级的状态管理解决方案

### 构建工具
- **Vite 5.0.8**: 快速的构建工具，提供优秀的开发体验
- **@crxjs/vite-plugin 2.0.0-beta.21**: 专门用于Chrome扩展开发的Vite插件
- **Chrome Extension Manifest V3**: 遵循最新的Chrome扩展规范

### 核心依赖
- **Axios 1.6.2**: 用于HTTP请求的Promise-based客户端
- **date-fns 4.1.0**: 现代化的JavaScript日期处理库
- **@mui/x-data-grid 6.18.2**: 功能丰富的数据表格组件

## 架构设计

### 目录结构
```
src/
├── components/         # React组件
│   ├── StoreManagement.tsx
│   ├── ProductManagement.tsx
│   └── OrderManagement.tsx
├── services/          # API服务层
│   └── api.ts
├── store/             # 状态管理
│   └── index.ts
├── types/             # TypeScript类型定义
│   └── index.ts
├── utils/             # 工具函数
├── hooks/             # 自定义Hook
│   └── useTranslation.tsx
├── locales/          # 国际化语言包
│   ├── zh-CN.ts
│   ├── zh-TW.ts
│   ├── en-US.ts
│   └── index.ts
├── popup/            # 弹窗页面
│   ├── index.html
│   ├── index.tsx
│   └── PopupApp.tsx
├── maximized/        # 最大化页面
└── background/       # 后台脚本
    └── index.ts
```

### 数据流向
```
graph TB
    A[Chrome Extension] --> B[Popup页面]
    A --> C[最大化页面]
    A --> D[后台脚本]
    
    B --> E[React App]
    C --> F[React App]
    
    E --> G[Store Management]
    E --> H[Product Management] 
    E --> I[Order Management]
    
    G --> J[API Service]
    H --> J
    I --> J
    
    J --> K[WooCommerce REST API]
    
    L[Zustand Store] --> G
    L --> H
    L --> I
```

## 核心设计理念

### 轻量级设计
- 专注于核心功能，避免冗余复杂性
- 精简的依赖库，减少插件体积
- 高效的状态管理，提升运行性能

### 功能纯粹
- 只保留最实用的商品管理功能
- 简洁直观的用户界面
- 清晰明确的操作流程

### 完全免费
- 开源项目，无任何收费项目
- 社区驱动的开发模式
- 透明的开发过程

## 状态管理

使用Zustand作为状态管理方案，具有以下优势：
- 轻量级，无额外依赖
- 简单易用的API
- 支持中间件扩展
- 良好的TypeScript支持

## 国际化支持

通过自定义的useTranslation Hook实现多语言支持：
- 支持中文简体、繁体中文、英文三种语言
- 可扩展的语言包架构
- 运行时语言切换功能

## 构建与部署

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

### 运行测试
```bash
npm test
```

## 性能优化

- 使用Vite提供快速的热重载开发体验
- 代码分割优化加载性能
- 图片资源压缩减少体积
- 懒加载非关键组件

## 安全性考虑

- 严格的内容安全策略(CSP)
- 敏感信息不硬编码在前端
- 权限最小化原则
- 数据传输加密

## 未来发展方向

1. **功能扩展**
   - 更丰富的商品管理功能
   - 高级订单处理能力
   - 数据分析和报告功能

2. **性能优化**
   - 进一步减少插件体积
   - 提升大数据量处理性能
   - 优化网络请求效率

3. **用户体验**
   - 更加个性化的界面定制
   - 智能化的操作建议
   - 更完善的帮助文档

---

*"让跨境电商管理变得简单高效，为千万小卖家点亮成功之路。"*