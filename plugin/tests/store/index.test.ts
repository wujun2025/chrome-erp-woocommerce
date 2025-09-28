import { create } from 'zustand'
import { useAppStore } from '../src/store'
import type { StoreConfig } from '../src/types'

// Mock Chrome storage
const mockChromeStorage = {
  local: {
    get: jest.fn().mockResolvedValue({}),
    set: jest.fn().mockResolvedValue(undefined)
  }
}

// @ts-ignore
global.chrome = {
  storage: mockChromeStorage
}

describe('Zustand Store', () => {
  const mockStore: StoreConfig = {
    id: 'test-store-1',
    name: 'Test Store',
    url: 'https://test.com',
    authType: 'wordpress',
    credentials: {
      username: 'test',
      password: 'test'
    },
    isActive: true
  }

  beforeEach(() => {
    // Reset store state
    useAppStore.setState({
      stores: [],
      activeStore: null,
      products: [],
      orders: [],
      loading: false
    })
  })

  test('should add a store', () => {
    const { addStore, stores } = useAppStore.getState()
    
    addStore(mockStore)
    
    const updatedState = useAppStore.getState()
    expect(updatedState.stores).toHaveLength(1)
    expect(updatedState.stores[0]).toEqual(mockStore)
  })

  test('should set active store', () => {
    const { addStore, setActiveStore } = useAppStore.getState()
    
    addStore(mockStore)
    setActiveStore(mockStore.id)
    
    const updatedState = useAppStore.getState()
    expect(updatedState.activeStore).toBe(mockStore.id)
  })

  test('should update store', () => {
    const { addStore, updateStore } = useAppStore.getState()
    
    addStore(mockStore)
    
    const updatedData = { name: 'Updated Store Name' }
    updateStore(mockStore.id, { ...mockStore, ...updatedData })
    
    const updatedState = useAppStore.getState()
    expect(updatedState.stores[0].name).toBe('Updated Store Name')
  })

  test('should delete store', () => {
    const { addStore, deleteStore } = useAppStore.getState()
    
    addStore(mockStore)
    deleteStore(mockStore.id)
    
    const updatedState = useAppStore.getState()
    expect(updatedState.stores).toHaveLength(0)
  })

  test('should set loading state', () => {
    const { setLoading } = useAppStore.getState()
    
    setLoading(true)
    
    const updatedState = useAppStore.getState()
    expect(updatedState.loading).toBe(true)
  })
})