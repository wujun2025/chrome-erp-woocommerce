import { useAppStore } from '../store'

// 注意：以下测试与backend项目相关，backend项目为后期开发内容

// Mock the Chrome extension API
global.chrome = {
  storage: {
    local: {
      get: jest.fn().mockResolvedValue({}),
      set: jest.fn().mockResolvedValue(undefined)
    }
  },
  runtime: {
    getManifest: jest.fn().mockReturnValue({ version: '1.0.0' })
  }
} as any

describe('API Configuration', () => {
  beforeEach(() => {
    // Reset the store to initial state
    const state = useAppStore.getState();
    if (state.setApiConfig) { // 检查方法是否存在
      state.setApiConfig({
        primaryUrl: '',
        backupUrl: ''
      })
    }
  })

  test('should set API configuration', () => {
    const apiConfig = {
      primaryUrl: 'https://api.example.com',
      backupUrl: 'https://backup.example.com'
    }
    
    const state = useAppStore.getState();
    if (state.setApiConfig) { // 检查方法是否存在
      state.setApiConfig(apiConfig)
    }
    
    const newState = useAppStore.getState()
    expect(newState.apiConfig?.primaryUrl).toBe(apiConfig.primaryUrl)
    expect(newState.apiConfig?.backupUrl).toBe(apiConfig.backupUrl)
  })

  test('should use primary API URL when configured', () => {
    const apiConfig = {
      primaryUrl: 'https://api.example.com',
      backupUrl: 'https://backup.example.com'
    }
    
    const state = useAppStore.getState();
    if (state.setApiConfig) { // 检查方法是否存在
      state.setApiConfig(apiConfig)
    }
    
    // 这里我们只是验证状态管理，实际的URL使用在API服务中测试
    const newState = useAppStore.getState()
    expect(newState.apiConfig?.primaryUrl).toBe(apiConfig.primaryUrl)
  })
})