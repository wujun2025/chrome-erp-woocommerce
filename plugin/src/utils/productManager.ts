import { apiService } from '@/services/api'
import type { 
  Product, 
  ProductAttribute,
  ApiResponse 
} from '@/types'

/**
 * 变体商品创建助手
 * 基于WooCommerce官方文档的最佳实践
 */
export class VariableProductHelper {
  /**
   * 创建变体商品的完整流程
   */
  static async createCompleteVariableProduct(data: {
    name: string
    description?: string
    attributes: Array<{
      name: string
      options: string[]
    }>
    variations: Array<{
      attributes: Array<{
        name: string
        option: string
      }>
      regularPrice: number
      salePrice?: number
      stockQuantity?: number
      sku?: string
    }>
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🚀 开始创建变体商品:', data.name)
      
      // 步骤1: 创建或获取全局属性
      const processedAttributes: ProductAttribute[] = []
      
      for (const attr of data.attributes) {
        console.log(`📋 处理属性: ${attr.name}`)
        
        // 尝试创建属性
        const attrResult = await apiService.createProductAttribute({
          name: attr.name,
          slug: attr.name.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          type: 'select',
          orderBy: 'menu_order',
          hasArchives: false,
          visible: true,
          variation: true,
          options: attr.options
        })
        
        if (attrResult.success && attrResult.data) {
          processedAttributes.push(attrResult.data)
          
          // 创建属性术语
          console.log(`🏷️ 创建术语: ${attr.options.join(', ')}`)
          for (const option of attr.options) {
            await apiService.createProductAttributeTerm(attrResult.data.id!, {
              name: option,
              slug: option.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            })
          }
        } else {
          console.warn(`警告: 属性 ${attr.name} 创建失败:`, attrResult.error)
        }
      }
      
      // 步骤2: 创建可变商品
      console.log('📦 创建可变商品')
      const productResult = await apiService.createProduct({
        name: data.name,
        type: 'variable',
        description: data.description || '',
        shortDescription: '',
        price: 0,
        regularPrice: 0,
        salePrice: 0,
        sku: '',
        stockQuantity: 0,
        manageStock: false,
        stockStatus: 'instock',
        status: 'draft',
        categories: [],
        tags: [],
        images: [],
        reviewsAllowed: true,
        taxStatus: 'taxable',
        attributes: processedAttributes.map(attr => ({
          id: attr.id!,
          name: attr.name,
          slug: attr.slug,
          visible: true,
          variation: true,
          options: data.attributes.find(a => a.name === attr.name)?.options || []
        }))
      })
      
      if (!productResult.success || !productResult.data) {
        throw new Error(`创建商品失败: ${productResult.error}`)
      }
      
      const product = productResult.data
      console.log(`✅ 商品创建成功: ${product.name} (ID: ${product.id})`)
      
      // 步骤3: 创建商品变体
      console.log('🎨 创建商品变体')
      const createdVariations = []
      
      for (const [index, variationData] of data.variations.entries()) {
        console.log(`创建变体 ${index + 1}/${data.variations.length}`)
        
        const variationResult = await apiService.createProductVariation(product.id!, {
          price: variationData.regularPrice,
          regularPrice: variationData.regularPrice,
          salePrice: variationData.salePrice || 0,
          stockQuantity: variationData.stockQuantity || 0,
          manageStock: true,
          stockStatus: 'instock',
          sku: variationData.sku || '',
          attributes: variationData.attributes.map(attr => {
            const globalAttr = processedAttributes.find(a => a.name === attr.name)
            return {
              id: globalAttr?.id || 0,
              name: attr.name,
              option: attr.option
            }
          })
        })
        
        if (variationResult.success) {
          createdVariations.push(variationResult.data)
          console.log(`✅ 变体 ${index + 1} 创建成功`)
        } else {
          console.error(`❌ 变体 ${index + 1} 创建失败:`, variationResult.error)
        }
      }
      
      return {
        success: true,
        data: {
          product,
          variations: createdVariations,
          attributes: processedAttributes
        },
        message: `变体商品创建成功: ${product.name} (${createdVariations.length}个变体)`
      }
      
    } catch (error) {
      console.error('❌ 创建变体商品失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建失败'
      }
    }
  }
  
  /**
   * 生成变体组合
   * 根据属性自动生成所有可能的变体组合
   */
  static generateVariationCombinations(
    attributes: Array<{ name: string; options: string[] }>,
    basePrice: number = 0
  ) {
    if (attributes.length === 0) return []
    
    // 生成笛卡尔积
    const combinations: Array<Array<{ name: string, option: string }>> = [[]]
    
    for (const attr of attributes) {
      const newCombinations: Array<Array<{ name: string, option: string }>> = []
      
      for (const combination of combinations) {
        for (const option of attr.options) {
          newCombinations.push([
            ...combination,
            { name: attr.name, option }
          ])
        }
      }
      
      combinations.splice(0, combinations.length, ...newCombinations)
    }
    
    // 转换为变体格式
    return combinations.map((combination, index) => ({
      attributes: combination,
      regularPrice: basePrice,
      salePrice: 0,
      stockQuantity: 0,
      sku: `var-${index + 1}`
    }))
  }
}

/**
 * 组合商品助手
 */
export class GroupedProductHelper {
  /**
   * 创建组合商品
   */
  static async createGroupedProduct(data: {
    name: string
    description?: string
    childProductIds: number[]
  }): Promise<ApiResponse<Product>> {
    try {
      console.log('🔗 创建组合商品:', data.name)
      
      const result = await apiService.createProduct({
        name: data.name,
        type: 'grouped',
        description: data.description || '',
        shortDescription: '',
        price: 0,
        regularPrice: 0,
        salePrice: 0,
        sku: '',
        stockQuantity: 0,
        manageStock: false,
        stockStatus: 'instock',
        status: 'draft',
        categories: [],
        tags: [],
        images: [],
        reviewsAllowed: true,
        taxStatus: 'taxable',
        attributes: []
        // 注意: groupedProducts 字段需要在API层面处理
      })
      
      if (result.success) {
        console.log(`✅ 组合商品创建成功: ${result.data?.name}`)
      }
      
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建组合商品失败'
      }
    }
  }
}