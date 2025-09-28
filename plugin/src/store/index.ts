import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  AppState, 
  StoreConfig, 
  StoreStatus, 
  Product, 
  Order
} from '@/types'

interface AppStore extends AppState {}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // Store related state
        stores: [],
        activeStore: null,
        storeStatuses: {},
        
        // Product related state
        products: [],
        selectedProducts: [],
        productCategories: [],
        productTags: [],
        
        // Order related state
        orders: [],
        selectedOrders: [],
        
        // UI state
        loading: false,
        theme: 'default', // 将默认主题设置为朱紫主题
        language: 'zh-CN',
        
        // Dialog states
        isProductFormOpen: false,
        isFilterDialogOpen: false,
        isSettingsDialogOpen: false,
        isFeedbackDialogOpen: false, // 添加缺失的状态
        
        // API Config state (添加API配置状态)
        apiConfig: {
          primaryUrl: '',
          backupUrl: ''
        },
        
        // Store actions
        addStore: (store: StoreConfig) => {
          set((state) => ({
            stores: [...state.stores, store]
          }))
        },
        
        updateStore: (id: string, updatedStore: StoreConfig) => {
          set((state) => ({
            stores: state.stores.map(store => 
              store.id === id ? { ...store, ...updatedStore } : store
            )
          }))
        },
        
        deleteStore: (id: string) => {
          set((state) => ({
            stores: state.stores.filter(store => store.id !== id),
            activeStore: state.activeStore === id ? null : state.activeStore
          }))
        },
        
        setActiveStore: (id: string) => {
          set({ activeStore: id })
          // Clear products and orders when switching stores
          set({ products: [], orders: [] })
        },
        
        updateStoreStatus: (id: string, status: StoreStatus) => {
          set((state) => ({
            storeStatuses: {
              ...state.storeStatuses,
              [id]: status
            }
          }))
        },
        
        // Product actions
        setProducts: (products: Product[]) => {
          set({ products })
        },
        
        addProduct: (product: Product) => {
          set((state) => ({
            products: [...state.products, product]
          }))
        },
        
        updateProduct: (id: number, updatedProduct: Partial<Product>) => {
          set((state) => ({
            products: state.products.map(product => 
              product.id === id ? { ...product, ...updatedProduct } : product
            )
          }))
        },
        
        deleteProduct: (id: number) => {
          set((state) => ({
            products: state.products.filter(product => product.id !== id),
            selectedProducts: state.selectedProducts.filter(product => product.id !== id)
          }))
        },
        
        setSelectedProducts: (products: Product[]) => {
          set({ selectedProducts: products })
        },
        
        // Order actions
        setOrders: (orders: Order[]) => {
          set({ orders })
        },
        
        setSelectedOrders: (orders: Order[]) => {
          set({ selectedOrders: orders })
        },
        
        // UI actions
        setLoading: (loading: boolean) => {
          set({ loading })
        },
        
        setTheme: (theme: 'default' | 'light' | 'dark' | 'macaron') => {
          set({ theme })
        },
        
        setLanguage: (language: 'zh-CN' | 'zh-TW' | 'en-US') => {
          set({ language })
        },
        
        // Dialog actions
        setProductFormOpen: (open: boolean) => {
          set({ isProductFormOpen: open })
        },
        
        setFilterDialogOpen: (open: boolean) => {
          set({ isFilterDialogOpen: open })
        },
        
        setSettingsDialogOpen: (open: boolean) => {
          set({ isSettingsDialogOpen: open })
        },
        
        // 添加缺失的对话框状态方法
        setFeedbackDialogOpen: (open: boolean) => {
          set({ isFeedbackDialogOpen: open })
        },
        
        // API Config actions (添加API配置方法)
        // 注意：此功能与backend项目相关，backend项目为后期开发内容
        setApiConfig: (config: { primaryUrl: string; backupUrl: string }) => {
          set({ apiConfig: config })
        }
      }),
      {
        name: 'chrome-erp-storage',
        partialize: (state) => ({
          stores: state.stores,
          activeStore: state.activeStore,
          theme: state.theme,
          language: state.language,
          apiConfig: state.apiConfig // 添加API配置到持久化存储
        })
      }
    ),
    {
      name: 'chrome-erp-store'
    }
  )
)

// Selector hooks for better performance
export const useStoreConfig = () => useAppStore((state) => ({
  stores: state.stores,
  activeStore: state.activeStore,
  storeStatuses: state.storeStatuses,
  addStore: state.addStore,
  updateStore: state.updateStore,
  deleteStore: state.deleteStore,
  setActiveStore: state.setActiveStore,
  updateStoreStatus: state.updateStoreStatus
}))

export const useProductState = () => useAppStore((state) => ({
  products: state.products,
  selectedProducts: state.selectedProducts,
  productCategories: state.productCategories,
  productTags: state.productTags,
  setProducts: state.setProducts,
  addProduct: state.addProduct,
  updateProduct: state.updateProduct,
  deleteProduct: state.deleteProduct,
  setSelectedProducts: state.setSelectedProducts
}))

export const useOrderState = () => useAppStore((state) => ({
  orders: state.orders,
  selectedOrders: state.selectedOrders,
  setOrders: state.setOrders,
  setSelectedOrders: state.setSelectedOrders
}))

export const useUIState = () => useAppStore((state) => ({
  loading: state.loading,
  theme: state.theme,
  language: state.language,
  isProductFormOpen: state.isProductFormOpen,
  isFilterDialogOpen: state.isFilterDialogOpen,
  isSettingsDialogOpen: state.isSettingsDialogOpen,
  isFeedbackDialogOpen: state.isFeedbackDialogOpen, // 添加缺失的状态
  setLoading: state.setLoading,
  setTheme: state.setTheme,
  setLanguage: state.setLanguage,
  setProductFormOpen: state.setProductFormOpen,
  setFilterDialogOpen: state.setFilterDialogOpen,
  setSettingsDialogOpen: state.setSettingsDialogOpen,
  setFeedbackDialogOpen: state.setFeedbackDialogOpen // 添加缺失的方法
}))

// 添加API配置的hook
// 注意：此功能与backend项目相关，backend项目为后期开发内容
export const useApiConfig = () => useAppStore((state) => ({
  apiConfig: state.apiConfig,
  setApiConfig: state.setApiConfig
}))

// Chrome extension storage helpers
export const syncWithChromeStorage = async () => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      const state = useAppStore.getState()
      await chrome.storage.local.set({
        stores: state.stores,
        activeStore: state.activeStore,
        settings: {
          theme: state.theme,
          language: state.language
        }
      })
    } catch (error) {
      console.error('Failed to sync with Chrome storage:', error)
    }
  }
}

export const loadFromChromeStorage = async () => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      const result = await chrome.storage.local.get(['stores', 'activeStore', 'settings'])
      
      const { setState } = useAppStore
      
      if (result.stores) {
        setState((state) => ({ ...state, stores: result.stores }))
      }
      
      if (result.activeStore) {
        setState((state) => ({ ...state, activeStore: result.activeStore }))
      }
      
      if (result.settings) {
        setState((state) => ({ 
          ...state,
          theme: result.settings.theme || 'default', // 默认使用朱紫主题
          language: result.settings.language || 'zh-CN'
        }))
      }
    } catch (error) {
      console.error('Failed to load from Chrome storage:', error)
    }
  }
}