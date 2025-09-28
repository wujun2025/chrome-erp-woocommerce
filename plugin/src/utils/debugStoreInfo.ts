// 调试工具函数，用于检查店铺信息数据结构
export const debugStoreInfo = (systemInfo: any) => {
  console.log('=== Store Info Debug ===')
  console.log('Full system info:', JSON.stringify(systemInfo, null, 2))
  
  if (systemInfo) {
    console.log('WordPress version:', systemInfo.wordpress?.version)
    console.log('WooCommerce version:', systemInfo.woocommerce?.version)
    
    // 检查所有可能的版本信息位置
    console.log('All possible WordPress versions:')
    console.log('  - systemInfo.wordpress?.version:', systemInfo.wordpress?.version)
    console.log('  - systemInfo.environment?.wp_version?.value:', systemInfo.environment?.wp_version?.value)
    console.log('  - systemInfo.wordpress?.data?.version:', systemInfo.wordpress?.data?.version)
    console.log('  - systemInfo.environment?.wordpress?.version:', systemInfo.environment?.wordpress?.version)
    
    console.log('All possible WooCommerce versions:')
    console.log('  - systemInfo.woocommerce?.version:', systemInfo.woocommerce?.version)
    console.log('  - systemInfo.settings?.wc_version?.value:', systemInfo.settings?.wc_version?.value)
    console.log('  - systemInfo.woocommerce?.data?.version:', systemInfo.woocommerce?.data?.version)
    console.log('  - systemInfo.settings?.woocommerce?.version:', systemInfo.settings?.woocommerce?.version)
    
    // 检查完整的数据结构
    console.log('Environment data:', systemInfo.environment)
    console.log('Settings data:', systemInfo.settings)
    console.log('WordPress data:', systemInfo.wordpress)
    console.log('WooCommerce data:', systemInfo.woocommerce)
  } else {
    console.log('No system info available')
  }
  
  console.log('=== End Store Info Debug ===')
}

// 更详细的分析函数
export const analyzeStoreInfoStructure = (systemInfo: any) => {
  console.log('=== Detailed Store Info Analysis ===')
  
  if (!systemInfo) {
    console.log('No system info to analyze')
    return
  }
  
  // 分析整个对象结构
  const analyzeObject = (obj: any, path: string = '') => {
    if (!obj || typeof obj !== 'object') return
    
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const currentPath = path ? `${path}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        // 如果是对象，递归分析
        if (Array.isArray(value)) {
          console.log(`${currentPath}: Array[${value.length}]`)
        } else {
          console.log(`${currentPath}: Object`)
          analyzeObject(value, currentPath)
        }
      } else {
        // 如果是值，直接输出
        console.log(`${currentPath}: ${value} (${typeof value})`)
      }
    })
  }
  
  analyzeObject(systemInfo)
  console.log('=== End Detailed Analysis ===')
}