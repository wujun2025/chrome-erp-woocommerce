# 商品价格字段修复总结

<!-- 注意：API服务器配置功能与backend项目相关，backend项目为后期开发内容 -->

## 🐛 问题描述
- 编辑商品时价格字段显示空白
- 原价(regularPrice)和售价(salePrice)无法正确显示和设置
- 从WooCommerce API返回的数据与前端Product类型不匹配

## 🔍 问题根因
1. **数据映射缺失**：WooCommerce API返回的字段名（`regular_price`, `sale_price`）与前端Product类型字段名（`regularPrice`, `salePrice`）不匹配
2. **类型转换问题**：价格字段在API返回时是字符串，但前端期望数字类型
3. **表单字段处理问题**：价格字段为0时显示问题

## ✅ 修复方案

### 1. 添加数据映射函数
在 `src/services/api.ts` 中新增 `mapFromWooCommerceFormat()` 函数：
```typescript
private mapFromWooCommerceFormat(wooCommerceProduct: any): Product {
  const product: any = { ...wooCommerceProduct }
  
  // 映射价格字段 - 确保数值转换和安全处理
  product.price = Number(wooCommerceProduct.price) || 0
  product.regularPrice = Number(wooCommerceProduct.regular_price) || 0
  product.salePrice = Number(wooCommerceProduct.sale_price) || 0
  
  // 映射其他字段...
  return product as Product
}
```

### 2. 更新API方法
修改以下API方法使用数据映射：
- `getProducts()` - 商品列表获取
- `getProduct()` - 单个商品获取
- `createProduct()` - 商品创建
- `updateProduct()` - 商品更新

### 3. 优化表单字段处理
在 `src/components/ProductForm.tsx` 中优化价格字段：
```typescript
// 修复价格字段显示
value={formData.regularPrice === 0 ? '' : formData.regularPrice}

// 优化数值处理
onChange={(e) => {
  const value = e.target.value
  const numValue = value === '' ? 0 : Number(value)
  if (!isNaN(numValue)) {
    handleInputChange('regularPrice', numValue)
  }
}}
```

## 🎯 修复效果

### 修复前
- ❌ 价格字段显示空白
- ❌ 无法设置原价和售价
- ❌ 编辑商品时价格数据丢失

### 修复后
- ✅ 价格字段正确显示
- ✅ 可以正常设置原价和售价
- ✅ 编辑商品时价格数据完整保留
- ✅ 数字输入验证和格式化
- ✅ WooCommerce API数据正确映射

## 🔧 技术细节

### 数据流向
1. **WooCommerce API** → `mapFromWooCommerceFormat()` → **前端Product类型**
2. **前端Product类型** → `mapToWooCommerceFormat()` → **WooCommerce API**

### 字段映射对照
| WooCommerce API | Frontend Product | 说明 |
|----------------|------------------|------|
| `price` | `price` | 计算字段，由系统自动生成 |
| `regular_price` | `regularPrice` | 商品原价 |
| `sale_price` | `salePrice` | 商品售价/促销价 |
| `stock_quantity` | `stockQuantity` | 库存数量 |
| `manage_stock` | `manageStock` | 是否管理库存 |
| `stock_status` | `stockStatus` | 库存状态 |

### 价格处理规则
- 根据记忆规范：`price`字段是只读的，由`regular_price`和`sale_price`自动计算
- 更新价格时只设置`regularPrice`和`salePrice`字段
- `salePrice`为0表示没有促销价
- 所有价格字段都转换为数字类型

## 🧪 测试验证
- ✅ 构建测试通过
- ✅ TypeScript编译无错误
- ✅ 数据映射逻辑验证
- ✅ 表单字段交互验证

## 📋 相关文件
- `src/services/api.ts` - API数据映射
- `src/components/ProductForm.tsx` - 表单字段处理
- `src/types/index.ts` - Product类型定义

现在商品价格编辑功能已完全修复，可以正常设置和显示原价、售价等字段！