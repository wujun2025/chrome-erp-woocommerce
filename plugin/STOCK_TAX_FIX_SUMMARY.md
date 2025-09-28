# 库存状态和税务状态修复总结

<!-- 注意：API服务器配置功能与backend项目相关，backend项目为后期开发内容 -->

## 问题描述
1. 管理库存中的库存状态(stockStatus)和税务状态(taxStatus)无法更改
2. 售价(salePrice)显示空白
3. 价格改动后无法正确同步修改

## 问题分析
1. **库存状态和税务状态无法更改**：虽然前端表单已经正确实现，但在保存时未将taxStatus字段包含在发送到API的数据中
2. **售价显示空白**：在API映射过程中，当salePrice为0时被设置为空字符串，导致前端无法正确显示
3. **价格同步问题**：API映射逻辑中sale_price字段处理不当，0值被转换为空字符串，WooCommerce API无法正确识别

## 修复方案

### 1. API数据映射修复
在`src/services/api.ts`中修改了`mapToWooCommerceFormat`和`mapVariationToWooCommerceFormat`方法：
- 修复sale_price字段映射：始终发送字符串值，即使是0也要发送"0"而不是空字符串
- 添加taxStatus字段映射：确保税务状态能正确发送到WooCommerce API

### 2. 表单数据处理优化
在`src/components/ProductForm.tsx`中：
- 在保存产品时添加taxStatus字段到发送数据中
- 确保加载产品数据时正确设置stockStatus和taxStatus的默认值

### 3. 数据初始化完善
- 确保从WooCommerce API获取数据时，salePrice字段即使为null也初始化为0

## 验证方法
1. 打开商品编辑表单
2. 更改库存状态（instock/outofstock/onbackorder）
3. 更改税务状态（taxable/shipping/none）
4. 设置售价为0或具体数值
5. 保存并重新打开表单验证数据是否正确保存和显示

## 影响范围
- 商品编辑功能
- 商品创建功能
- 商品变体编辑功能
- 所有涉及库存和税务状态的操作