/**
 * WooCommerce 服务器端500错误完整解决指南
 * 当属性创建端点返回"critical error"时的系统性排查方案
 */

export const WooCommerceServerErrorGuide = {
  
  /**
   * 问题诊断清单
   */
  diagnosticChecklist: {
    immediate: [
      "1. 检查WordPress错误日志（wp-content/debug.log）",
      "2. 查看服务器错误日志（Apache/Nginx）", 
      "3. 验证PHP内存限制（建议512MB+）",
      "4. 检查PHP执行时间限制",
      "5. 确认数据库连接状态"
    ],
    
    database: [
      "1. 检查 wp_woocommerce_attribute_taxonomies 表是否存在",
      "2. 验证表结构完整性",
      "3. 检查数据库用户权限（CREATE, INSERT, UPDATE）",
      "4. 确认表空间是否充足",
      "5. 运行 WooCommerce 状态检查"
    ],
    
    plugin: [
      "1. 暂时停用所有其他插件测试",
      "2. 切换到默认主题测试",
      "3. 检查WooCommerce版本兼容性",
      "4. 验证WordPress核心文件完整性",
      "5. 重新安装WooCommerce插件"
    ]
  },

  /**
   * 常见解决方案
   */
  solutions: {
    phpMemory: {
      description: "增加PHP内存限制",
      steps: [
        "在wp-config.php中添加: ini_set('memory_limit', '512M');",
        "或在.htaccess中添加: php_value memory_limit 512M",
        "或联系主机商调整PHP配置"
      ]
    },
    
    databaseRepair: {
      description: "修复WooCommerce数据库",
      steps: [
        "访问 WooCommerce > 状态 > 工具",
        "点击'重新创建店铺页面'",
        "点击'清除模板缓存'",
        "运行'更新数据库'",
        "重置WooCommerce属性表"
      ]
    },
    
    pluginConflict: {
      description: "排查插件冲突",
      steps: [
        "停用所有非必需插件",
        "只保留WooCommerce运行",
        "逐个启用插件测试",
        "确定冲突插件并寻找替代方案"
      ]
    }
  },

  /**
   * 快速修复命令（需要服务器访问权限）
   */
  quickFixes: {
    phpSettings: [
      "ini_set('memory_limit', '512M');",
      "ini_set('max_execution_time', 300);",
      "ini_set('max_input_vars', 3000);"
    ],
    
    wpConfig: [
      "define('WP_DEBUG', true);",
      "define('WP_DEBUG_LOG', true);",
      "define('WP_DEBUG_DISPLAY', false);"
    ]
  },

  /**
   * 紧急联系方案
   */
  emergencyContacts: {
    hostingProvider: "联系您的主机服务商技术支持",
    wordpressDeveloper: "寻找WordPress开发人员协助",
    woocommerceSupport: "联系WooCommerce官方支持（付费用户）"
  }
}

/**
 * 服务器状态检查工具
 */
export const ServerHealthChecker = {
  
  /**
   * 检查PHP环境
   */
  async checkPHPEnvironment(baseUrl: string, auth: string) {
    const checks = []
    
    try {
      // 检查系统状态端点
      const response = await fetch(`${baseUrl}/wp-json/wc/v3/system_status`, {
        headers: { Authorization: auth }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        checks.push({
          item: "PHP版本",
          status: data.environment?.php_version?.value || "未知",
          recommendation: "建议PHP 7.4+"
        })
        
        checks.push({
          item: "内存限制", 
          status: data.environment?.wp_memory_limit?.value || "未知",
          recommendation: "建议512MB+"
        })
        
        checks.push({
          item: "WooCommerce版本",
          status: data.settings?.wc_version?.value || "未知", 
          recommendation: "使用最新稳定版"
        })
      }
    } catch (error) {
      checks.push({
        item: "系统状态检查",
        status: "失败",
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
    
    return checks
  },

  /**
   * 生成服务器健康报告
   */
  generateHealthReport(checks: any[]) {
    const report = [
      "=== WooCommerce 服务器健康报告 ===",
      `生成时间: ${new Date().toLocaleString()}`,
      "",
      "📊 环境检查:"
    ]
    
    checks.forEach(check => {
      report.push(`  ${check.item}: ${check.status}`)
      if (check.recommendation) {
        report.push(`    建议: ${check.recommendation}`)
      }
      if (check.error) {
        report.push(`    错误: ${check.error}`)
      }
    })
    
    report.push("")
    report.push("🛠️ 建议的排查步骤:")
    report.push("1. 检查WordPress错误日志")
    report.push("2. 增加PHP内存限制到512MB")
    report.push("3. 暂时停用其他插件测试")
    report.push("4. 联系主机商检查服务器配置")
    report.push("5. 考虑重新安装WooCommerce")
    
    return report.join('\n')
  }
}