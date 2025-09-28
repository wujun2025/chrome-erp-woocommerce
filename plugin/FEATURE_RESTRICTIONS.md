# 功能限制系统 (Feature Restrictions System)

本系统实现了基于认证方式的功能限制，类似图片上传功能的限制模式。

<!-- 注意：API服务器配置功能与backend项目相关，backend项目为后期开发内容 -->

## 概述

根据用户要求，我们实现了以下功能限制：

### WooCommerce API 认证
- ✅ **支持**: 简单商品 (Simple Products) 
- ✅ **支持**: 外部商品 (External Products)
- ❌ **限制**: 变体商品 (Variable Products)
- ❌ **限制**: 组合商品 (Grouped Products)
- ❌ **限制**: 图片上传功能
- ❌ **限制**: 商品属性管理
- ❌ **限制**: 商品变体管理

### WordPress 应用密码认证
- ✅ **完整支持**: 所有商品类型
- ✅ **完整支持**: 图片上传功能
- ✅ **完整支持**: 商品属性和变体管理
- ✅ **完整支持**: 高级商品功能

## 实现详情

### 1. 国际化支持

#### 新增提示信息 (中文)
```typescript
'messages.productTypeRestricted': '当前认证方式只支持简单商品和外部商品的管理',
'messages.variableProductRequireWordPress': '变体商品功能需要WordPress应用密码认证方式',
'messages.groupedProductRequireWordPress': '组合商品功能需要WordPress应用密码认证方式',
'messages.advancedFeaturesRestricted': 'WooCommerce API认证方式仅支持基础商品管理功能',
'messages.upgradeToWordPressAuth': '要使用完整的商品管理功能，请使用WordPress应用密码认证方式'
```

#### 英文翻译
```typescript
'messages.productTypeRestricted': 'Current authentication method only supports simple and external product management',
'messages.variableProductRequireWordPress': 'Variable product feature requires WordPress Application Password authentication',
'messages.groupedProductRequireWordPress': 'Grouped product feature requires WordPress Application Password authentication',
'messages.advancedFeaturesRestricted': 'WooCommerce API authentication only supports basic product management features',
'messages.upgradeToWordPressAuth': 'To use complete product management features, please use WordPress Application Password authentication'
```

### 2. ProductForm 组件限制

#### 权限检查逻辑
```typescript
const currentStore = stores.find(s => s.id === activeStore)
const isWordPressAuth = currentStore?.authType === 'wordpress'
const canUploadImages = isWordPressAuth
const canManageAdvancedProducts = isWordPressAuth
```

#### 商品类型限制
```typescript
const productTypes = [
  { value: 'simple', label: t('product.simple') },
  { 
    value: 'grouped', 
    label: t('product.grouped'),
    disabled: !canManageAdvancedProducts,
    tooltip: !canManageAdvancedProducts ? t('messages.groupedProductRequireWordPress') : undefined
  },
  { 
    value: 'external', 
    label: t('product.external')
  },
  { 
    value: 'variable', 
    label: t('product.variable'),
    disabled: !canManageAdvancedProducts,
    tooltip: !canManageAdvancedProducts ? t('messages.variableProductRequireWordPress') : undefined
  }
]
```

#### UI 交互限制
- 禁用受限商品类型选项
- 显示锁定图标 🔒
- 提供详细的权限提示
- 阻止不当的类型切换

### 3. ProductVariations 组件限制

#### 整体功能警告
```typescript
{!canManageVariations && (
  <Alert severity="warning" sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" gap={1}>
      <LockIcon fontSize="small" />
      <Typography variant="body2">
        <strong>功能限制：</strong>变体商品管理需要WordPress应用密码认证
      </Typography>
    </Box>
    <Typography variant="body2" sx={{ mt: 1 }}>
      当前使用WooCommerce API认证，只能管理简单商品和外部商品。要使用变体商品功能，请切换到WordPress应用密码认证方式。
    </Typography>
  </Alert>
)}
```

#### 按钮状态控制
```typescript
<Button
  variant="outlined"
  startIcon={canManageVariations ? <AddIcon /> : <LockIcon />}
  onClick={handleCreateAttribute}
  size="small"
  disabled={!currentStore || !canManageVariations}
  title={!canManageVariations ? '变体商品功能需要WordPress应用密码认证' : ''}
>
  {canManageVariations ? '添加属性' : '功能限制'}
</Button>
```

### 4. API 服务层限制

#### 属性管理权限检查
```typescript
async createProductAttribute(attribute: Omit<ProductAttribute, 'id'>): Promise<ApiResponse<ProductAttribute>> {
  // 检查变体商品权限
  if (this.storeConfig.authType !== 'wordpress') {
    return {
      success: false,
      error: 'Product attribute management requires WordPress authentication'
    }
  }
  // ... 其余实现
}
```

#### 变体管理权限检查
```typescript
async getProductVariations(productId: number): Promise<ApiResponse<ProductVariation[]>> {
  // 变体功能权限检查
  if (this.storeConfig?.authType !== 'wordpress') {
    return {
      success: false,
      error: 'Product variations management requires WordPress authentication'
    }
  }
  // ... 其余实现
}
```

### 5. 用户体验优化

#### 视觉提示
- 🔒 **锁定图标**: 表示受限功能
- ⚠️ **警告消息**: 详细说明限制原因
- 💡 **升级提示**: 指导用户如何获得完整功能

#### 交互反馈
- 按钮禁用状态
- 鼠标悬停提示
- 错误消息显示
- 功能限制说明

#### 引导机制
- 清晰的权限说明
- 认证方式切换建议
- 功能对比展示

## 技术架构

### 权限控制流程
1. **店铺配置检查** → 确认当前活跃店铺
2. **认证类型判断** → 检查是否为 WordPress 认证
3. **功能权限映射** → 确定可用功能范围
4. **UI 状态控制** → 调整界面元素状态
5. **API 调用拦截** → 在服务层进行权限验证

### 一致性保证
- 统一的权限检查逻辑
- 相同的错误消息格式
- 一致的UI禁用样式
- 统一的图标使用规范

## 效果展示

### WooCommerce API 认证状态
- 商品类型选择器中变体和组合商品选项被禁用
- 显示锁定图标和权限提示
- 变体管理界面显示功能限制警告
- 所有高级功能按钮被禁用

### WordPress 认证状态
- 所有商品类型可选
- 完整的变体管理功能
- 图片上传功能可用
- 所有高级功能正常工作

## 维护说明

### 扩展新功能限制
1. 在国际化文件中添加新的提示信息
2. 在相关组件中添加权限检查逻辑
3. 在API服务层添加相应的权限验证
4. 更新UI以反映新的限制状态

### 调整权限规则
1. 修改权限检查条件 (`canManageAdvancedProducts`)
2. 更新相关的错误消息和提示
3. 调整UI禁用逻辑
4. 测试所有受影响的功能

这个功能限制系统为用户提供了清晰的权限边界，确保他们了解当前认证方式的功能范围，并引导他们在需要时升级到更高权限的认证方式。