import { apiService } from '@/services/api'
import type { StoreConfig, ApiResponse } from '@/types'

/**
 * API调试和诊断工具
 */
export class ApiDebugger {
  /**
   * 全面的API健康检查
   */
  static async performHealthCheck(storeConfig: StoreConfig): Promise<{
    overall: boolean
    details: Record<string, { status: boolean; message: string; data?: any }>
  }> {
    const results: Record<string, { status: boolean; message: string; data?: any }> = {}
    
    // 设置API配置
    apiService.setStoreConfig(storeConfig)
    
    // 1. 基础连接测试
    console.log('🔍 1. 基础连接测试')
    try {
      const connectionResult = await apiService.testConnection()
      results.connection = {
        status: connectionResult.success,
        message: connectionResult.success ? '连接成功' : connectionResult.error || '连接失败',
        data: connectionResult.data
      }
    } catch (error) {
      results.connection = {
        status: false,
        message: `连接异常: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }
    
    // 2. WordPress基础API测试
    console.log('🔍 2. WordPress基础API测试')
    try {
      const wpResult = await apiService.getWordPressInfo()
      results.wordpress = {
        status: wpResult.success,
        message: wpResult.success ? 'WordPress API可用' : wpResult.error || 'WordPress API不可用',
        data: wpResult.data
      }
    } catch (error) {
      results.wordpress = {
        status: false,
        message: `WordPress API异常: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }
    
    // 3. WooCommerce API测试
    console.log('🔍 3. WooCommerce API测试')
    try {
      const wcResult = await apiService.getWooCommerceInfo()
      results.woocommerce = {
        status: wcResult.success,
        message: wcResult.success ? 'WooCommerce API可用' : wcResult.error || 'WooCommerce API不可用',
        data: wcResult.data
      }
    } catch (error) {
      results.woocommerce = {
        status: false,
        message: `WooCommerce API异常: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }
    
    // 4. 系统状态检查
    console.log('🔍 4. 系统状态检查')
    try {
      const systemResult = await apiService.getSystemStatus()
      results.system = {
        status: systemResult.success,
        message: systemResult.success ? '系统状态正常' : systemResult.error || '系统状态异常',
        data: systemResult.data
      }
    } catch (error) {
      results.system = {
        status: false,
        message: `系统状态检查异常: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }
    
    // 5. 产品API权限测试
    console.log('🔍 5. 产品API权限测试')
    try {
      const productsResult = await apiService.getProducts({ perPage: 1 })
      results.products = {
        status: productsResult.success,
        message: productsResult.success ? '产品API可用' : productsResult.error || '产品API不可用',
        data: productsResult.success ? `找到${productsResult.data?.total || 0}个产品` : undefined
      }
    } catch (error) {
      results.products = {
        status: false,
        message: `产品API异常: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }
    
    // 6. 属性API权限测试
    console.log('🔍 6. 属性API权限测试')
    try {
      const attributesResult = await apiService.getProductAttributes()
      results.attributes = {
        status: attributesResult.success,
        message: attributesResult.success ? '属性API可用' : attributesResult.error || '属性API不可用',
        data: attributesResult.success ? `找到${attributesResult.data?.length || 0}个属性` : undefined
      }
    } catch (error) {
      results.attributes = {
        status: false,
        message: `属性API异常: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }
    
    // 计算总体状态
    const overallStatus = Object.values(results).every(result => result.status)
    
    console.log('🔍 健康检查完成:', {
      overall: overallStatus,
      details: results
    })
    
    return {
      overall: overallStatus,
      details: results
    }
  }
  
  /**
   * 手动测试属性创建（使用最小数据集）
   */
  static async testAttributeCreation(storeConfig: StoreConfig): Promise<ApiResponse<any>> {
    console.log('🧪 开始属性创建测试')
    
    apiService.setStoreConfig(storeConfig)
    
    // 使用最简单的属性数据进行测试
    const testAttribute = {
      name: `测试属性_${Date.now()}`,
      slug: `test-attr-${Date.now()}`,
      type: 'select' as const,
      orderBy: 'menu_order' as const,
      hasArchives: false,
      visible: true,
      variation: true,
      options: ['选项1', '选项2']
    }
    
    console.log('🧪 测试属性数据:', testAttribute)
    
    try {
      const result = await apiService.createProductAttribute(testAttribute)
      console.log('🧪 测试结果:', result)
      
      // 如果创建成功，尝试删除测试属性
      if (result.success && result.data?.id) {
        console.log('🧪 清理测试数据...')
        try {
          await apiService.deleteProductAttribute(result.data.id)
          console.log('🧪 测试数据清理完成')
        } catch (cleanupError) {
          console.warn('🧪 测试数据清理失败:', cleanupError)
        }
      }
      
      return result
    } catch (error) {
      console.error('🧪 属性创建测试失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '测试失败'
      }
    }
  }
  
  /**
   * 生成详细的诊断报告
   */
  static generateDiagnosticReport(healthCheck: any, testResult: any): string {
    const report = []
    
    report.push('=== WooCommerce API 诊断报告 ===')
    report.push(`生成时间: ${new Date().toLocaleString()}`)
    report.push('')
    
    // 健康检查结果
    report.push('📊 健康检查结果:')
    Object.entries(healthCheck.details).forEach(([key, result]: [string, any]) => {
      const status = result.status ? '✅' : '❌'
      report.push(`  ${status} ${key}: ${result.message}`)
      if (result.data) {
        report.push(`     数据: ${typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}`)
      }
    })
    
    report.push('')
    
    // 属性创建测试结果
    report.push('🧪 属性创建测试:')
    const testStatus = testResult.success ? '✅' : '❌'
    report.push(`  ${testStatus} ${testResult.success ? '成功' : `失败: ${testResult.error}`}`)
    
    report.push('')
    
    // 建议
    report.push('💡 建议:')
    if (!healthCheck.overall) {
      report.push('  - 检查WordPress错误日志')
      report.push('  - 确认WooCommerce插件已正确安装并启用')
      report.push('  - 检查PHP内存限制和执行时间限制')
      report.push('  - 验证数据库连接')
      report.push('  - 检查用户权限是否足够')
    } else if (!testResult.success) {
      report.push('  - 基础API正常，但属性创建失败')
      report.push('  - 检查属性创建的具体权限')
      report.push('  - 查看WooCommerce日志')
    } else {
      report.push('  - 所有测试通过，API工作正常')
    }
    
    return report.join('\n')
  }
}