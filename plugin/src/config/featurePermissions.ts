/**
 * 功能权限配置
 * 定义不同认证级别的功能访问权限
 */

export interface FeaturePermission {
  id: string
  name: string
  description: string
  level: 'basic' | 'advanced'
  category: 'product' | 'media' | 'attribute' | 'variation' | 'order'
  requiredAuth: 'woocommerce' | 'wordpress'
}

export interface AuthLevel {
  id: 'basic' | 'advanced'
  name: string
  description: string
  authType: 'woocommerce' | 'wordpress'
  benefits: string[]
  limitations: string[]
}

// 认证级别定义
export const AUTH_LEVELS: Record<string, AuthLevel> = {
  basic: {
    id: 'basic',
    name: 'store.binding.level1',
    description: 'store.basicBinding',
    authType: 'woocommerce',
    benefits: [
      'store.binding.benefits.productView',
      'store.binding.benefits.simpleProduct',
      'store.binding.benefits.externalProduct',
      'store.binding.benefits.variableProductBasic',
      'store.binding.benefits.groupedProductBasic',
      'store.binding.benefits.orderView',
      'store.binding.benefits.categoryManagement',
      'store.binding.benefits.stockMonitoring'
    ],
    limitations: [
      'store.binding.limitations.noImageUpload',
      'store.binding.limitations.noAttributeManagement',
      'store.binding.limitations.noNewVariableProducts',
      'store.binding.limitations.noVariationManagement',
      'store.binding.limitations.noAdvancedConfig',
      'store.binding.limitations.apiLimitations'
    ]
  },
  advanced: {
    id: 'advanced',
    name: 'store.binding.level2',
    description: 'store.advancedBinding',
    authType: 'wordpress',
    benefits: [
      'store.binding.benefits.allBasicFeatures',
      'store.binding.benefits.imageUpload',
      'store.binding.benefits.variableProductFull',
      'store.binding.benefits.attributeManagement',
      'store.binding.benefits.variationConfig',
      'store.binding.benefits.groupedProductFull',
      'store.binding.benefits.advancedConfig',
      'store.binding.benefits.wordpressApiAccess',
      'store.binding.benefits.secureAuth',
      'store.binding.benefits.stableConnection'
    ],
    limitations: [
      'store.binding.limitations.wordpressPasswordRequired',
      'store.binding.limitations.higherServerPermissions'
    ]
  }
}

// 功能权限矩阵
export const FEATURE_PERMISSIONS: FeaturePermission[] = [
  // 商品管理 - 基础功能
  {
    id: 'product_view',
    name: 'store.binding.features.productView',
    description: 'store.binding.features.productViewDesc',
    level: 'basic',
    category: 'product',
    requiredAuth: 'woocommerce'
  },
  {
    id: 'product_basic_edit',
    name: 'store.binding.features.productBasicEdit',
    description: 'store.binding.features.productBasicEditDesc',
    level: 'basic',
    category: 'product',
    requiredAuth: 'woocommerce'
  },
  {
    id: 'simple_product_full',
    name: 'store.binding.features.simpleProductFull',
    description: 'store.binding.features.simpleProductFullDesc',
    level: 'basic',
    category: 'product',
    requiredAuth: 'woocommerce'
  },
  {
    id: 'external_product_full',
    name: 'store.binding.features.externalProductFull',
    description: 'store.binding.features.externalProductFullDesc',
    level: 'basic',
    category: 'product',
    requiredAuth: 'woocommerce'
  },
  
  // 商品管理 - 高级功能
  {
    id: 'variable_product_create',
    name: 'store.binding.features.variableProductCreate',
    description: 'store.binding.features.variableProductCreateDesc',
    level: 'advanced',
    category: 'product',
    requiredAuth: 'wordpress'
  },
  {
    id: 'grouped_product_full',
    name: 'store.binding.features.groupedProductFull',
    description: 'store.binding.features.groupedProductFullDesc',
    level: 'advanced',
    category: 'product',
    requiredAuth: 'wordpress'
  },
  
  // 媒体管理
  {
    id: 'image_upload',
    name: 'store.binding.features.imageUpload',
    description: 'store.binding.features.imageUploadDesc',
    level: 'advanced',
    category: 'media',
    requiredAuth: 'wordpress'
  },
  
  // 属性管理
  {
    id: 'attribute_management',
    name: 'store.binding.features.attributeManagement',
    description: 'store.binding.features.attributeManagementDesc',
    level: 'advanced',
    category: 'attribute',
    requiredAuth: 'wordpress'
  },
  
  // 变体管理
  {
    id: 'variation_management',
    name: 'store.binding.features.variationManagement',
    description: 'store.binding.features.variationManagementDesc',
    level: 'advanced',
    category: 'variation',
    requiredAuth: 'wordpress'
  }
]

/**
 * 检查用户是否有权限访问特定功能
 */
export function hasPermission(
  authType: 'woocommerce' | 'wordpress', 
  featureId: string
): boolean {
  const feature = FEATURE_PERMISSIONS.find(f => f.id === featureId)
  if (!feature) return false
  
  return authType === 'wordpress' || feature.requiredAuth === 'woocommerce'
}

/**
 * 获取用户可用的功能列表
 */
export function getAvailableFeatures(authType: 'woocommerce' | 'wordpress'): FeaturePermission[] {
  return FEATURE_PERMISSIONS.filter(feature => hasPermission(authType, feature.id))
}

/**
 * 获取升级后可获得的新功能
 */
export function getUpgradeFeatures(): FeaturePermission[] {
  return FEATURE_PERMISSIONS.filter(feature => feature.requiredAuth === 'wordpress')
}