/**
 * API配置功能演示
 * 
 * 这个文件演示了如何使用主备API地址配置功能
 * 
 * 注意：此功能与backend项目相关，backend项目为后期开发内容
 */

import { useAppStore } from '../store'

// 演示API配置设置
export const demoApiConfig = () => {
  console.log('=== API配置功能演示 ===')
  
  // 1. 设置主备API地址
  const apiConfig = {
    primaryUrl: 'https://primary-api.example.com',
    backupUrl: 'https://backup-api.example.com'
  }
  
  console.log('1. 设置API配置:', apiConfig)
  const state = useAppStore.getState();
  if (state.setApiConfig) { // 检查方法是否存在
    state.setApiConfig(apiConfig)
  }
  
  // 2. 验证配置已设置
  const currentConfig = state.apiConfig
  console.log('2. 当前API配置:', currentConfig)
  
  // 3. 测试配置切换逻辑
  console.log('3. API服务将优先使用主地址，如果主地址不可用则自动切换到备用地址')
  
  return currentConfig
}

// 演示如何在实际应用中使用API配置
export const demoApiUsage = () => {
  console.log('=== API使用演示 ===')
  
  // 获取当前API配置
  const state = useAppStore.getState();
  const apiConfig = state.apiConfig
  console.log('当前API配置:', apiConfig)
  
  // 在实际应用中，API服务会自动使用这些配置
  // 优先级: 主地址 > 备用地址 > 商店默认地址
  if (apiConfig?.primaryUrl) {
    console.log('将使用主API地址:', apiConfig.primaryUrl)
  } else if (apiConfig?.backupUrl) {
    console.log('将使用备用API地址:', apiConfig.backupUrl)
  } else {
    console.log('将使用商店默认地址')
  }
}

// 运行演示
if (typeof window !== 'undefined') {
  // 在浏览器环境中运行演示
  demoApiConfig()
  demoApiUsage()
}

export default {
  demoApiConfig,
  demoApiUsage
}