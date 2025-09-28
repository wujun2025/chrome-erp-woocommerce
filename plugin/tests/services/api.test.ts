import { apiService } from '../src/services/api'
import type { StoreConfig } from '../src/types'

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}))

describe('ApiService', () => {
  const mockStore: StoreConfig = {
    id: 'test-store',
    name: 'Test Store',
    url: 'https://test-store.com',
    authType: 'wordpress',
    credentials: {
      username: 'testuser',
      password: 'testpass'
    },
    isActive: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should set store configuration', () => {
    apiService.setStoreConfig(mockStore)
    expect(apiService).toBeDefined()
  })

  test('should handle connection test', async () => {
    apiService.setStoreConfig(mockStore)
    
    // Mock the client.get method
    const mockGet = jest.fn().mockResolvedValue({ data: {} })
    // @ts-ignore
    apiService.client = { get: mockGet }
    
    const result = await apiService.testConnection()
    expect(result).toBeDefined()
  })

  test('should handle API errors gracefully', async () => {
    apiService.setStoreConfig(mockStore)
    
    // Mock the client.get method to throw an error
    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
    // @ts-ignore
    apiService.client = { get: mockGet }
    
    const result = await apiService.testConnection()
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})