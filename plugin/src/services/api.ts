import axios, { AxiosInstance } from 'axios'
import type { 
  StoreConfig, 
  Product, 
  Order, 
  ApiResponse, 
  PaginatedResponse, 
  FilterParams, 
  BatchOperation, 
  BatchResponse,
  MediaItem,
  ProductCategory,
  ProductTag,
  ProductVariation,
  ProductAttribute,
  ProductAttributeTerm
} from '@/types'

export class ApiService {
  private client: AxiosInstance
  private storeConfig: StoreConfig | null = null

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (!this.storeConfig) {
          console.error('Request interceptor: No store configuration set')
          throw new Error('Store configuration is required')
        }
        
        config.baseURL = this.storeConfig.url.replace(/\/$/, '')
        
        // Setup authentication
        if (this.storeConfig.authType === 'wordpress') {
          if (this.storeConfig.credentials.username && this.storeConfig.credentials.password) {
            const token = btoa(`${this.storeConfig.credentials.username}:${this.storeConfig.credentials.password}`)
            config.headers.Authorization = `Basic ${token}`
          } else {
            console.error('WordPress credentials missing')
            throw new Error('WordPress username or password is missing')
          }
        } else if (this.storeConfig.authType === 'woocommerce') {
          if (this.storeConfig.credentials.consumerKey && this.storeConfig.credentials.consumerSecret) {
            config.auth = {
              username: this.storeConfig.credentials.consumerKey,
              password: this.storeConfig.credentials.consumerSecret
            }
          } else {
            console.error('WooCommerce credentials missing')
            throw new Error('WooCommerce Consumer Key or Consumer Secret is missing')
          }
        }
        
        console.log('Request config:', {
          url: config.url,
          baseURL: config.baseURL,
          method: config.method,
          authType: this.storeConfig.authType,
          hasAuth: !!(config.headers.Authorization || config.auth)
        })
        
        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error)
        return Promise.reject(this.handleError(error))
      }
    )
  }

  // Initialize with store configuration
  setStoreConfig(config: StoreConfig): void {
    this.storeConfig = config
  }

  // Error handling
  private handleError<T = any>(error: any): ApiResponse<T> {
    console.error('=== API Error Details ===', {
      errorType: error.constructor.name,
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config,
      code: error.code
    })
    
    let message = 'Unknown error occurred'
    
    if (error.response) {
      // 服务器响应错误
      const errorData = error.response.data
      console.error('Server response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: errorData,
        headers: error.response.headers
      })
      
      if (errorData && typeof errorData === 'object') {
        if (errorData.message) {
          message = errorData.message
        } else if (errorData.data && errorData.data.message) {
          message = errorData.data.message
        } else if (errorData.data && errorData.data.status) {
          message = `HTTP ${errorData.data.status}: ${errorData.data.message || errorData.code || 'API Error'}`
        } else {
          message = errorData.code || `HTTP ${error.response.status}: ${error.response.statusText}`
        }
      } else {
        message = `HTTP ${error.response.status}: ${error.response.statusText}`
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      console.error('Network error - no response received:', {
        request: error.request,
        timeout: error.timeout,
        code: error.code
      })
      message = `Network error: ${error.code || 'Unable to connect to the server'}`
    } else {
      // 配置错误或其他错误
      console.error('Request configuration or other error:', {
        message: error.message,
        stack: error.stack,
        config: error.config
      })
      
      const errorMessage = error.message || ''
      
      if (errorMessage.includes('configuration') || error.code === 'ERR_INVALID_ARG_TYPE') {
        message = `Request configuration error: ${errorMessage}`
      } else if (errorMessage.includes('Network Error')) {
        message = 'Network connection failed - please check your internet connection and store URL'
      } else {
        message = errorMessage || 'Request configuration error'
      }
    }

    console.error('Final error message:', message)
    
    return {
      success: false,
      error: message
    } as ApiResponse<T>
  }

  // Connection testing
  async testConnection(): Promise<ApiResponse<boolean>> {
    try {
      if (!this.storeConfig) {
        return { success: false, error: 'No store configuration provided' }
      }

      const endpoint = this.storeConfig.authType === 'wordpress' 
        ? '/wp-json/wp/v2/users/me'
        : '/wp-json/wc/v3/system_status'

      await this.client.get(endpoint)
      
      return {
        success: true,
        data: true,
        message: 'Connection successful'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Product API methods
  async getProducts(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const endpoint = this.storeConfig?.authType === 'wordpress' 
        ? '/wp-json/wc/v3/products'
        : '/wp-json/wc/v3/products'

      const queryParams: any = {
        per_page: params?.perPage || 20,
        page: params?.page || 1,
        orderby: params?.orderBy || 'date',
        order: params?.order || 'desc'
      }

      if (params?.search) queryParams.search = params.search
      if (params?.status) queryParams.status = params.status
      if (params?.category) queryParams.category = params.category
      if (params?.tag) queryParams.tag = params.tag
      if (params?.sku) queryParams.sku = params.sku
      if (params?.stockStatus) queryParams.stock_status = params.stockStatus
      if (params?.priceMin) queryParams.min_price = params.priceMin
      if (params?.priceMax) queryParams.max_price = params.priceMax

      const response = await this.client.get(endpoint, { params: queryParams })
      
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1')
      const total = parseInt(response.headers['x-wp-total'] || '0')
      const currentPage = params?.page || 1

      // 映射WooCommerce API数据到我们的Product类型
      const mappedProducts = response.data.map((product: any) => this.mapFromWooCommerceFormat(product))
      
      console.log('Mapped products:', {
        originalCount: response.data.length,
        mappedCount: mappedProducts.length,
        sampleProduct: mappedProducts[0] ? {
          id: mappedProducts[0].id,
          name: mappedProducts[0].name,
          price: mappedProducts[0].price,
          regularPrice: mappedProducts[0].regularPrice,
          salePrice: mappedProducts[0].salePrice,
          priceTypes: {
            price: typeof mappedProducts[0].price,
            regularPrice: typeof mappedProducts[0].regularPrice,
            salePrice: typeof mappedProducts[0].salePrice
          }
        } : 'No products'
      })

      return {
        success: true,
        data: {
          data: mappedProducts,
          total,
          totalPages,
          currentPage,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        }
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/${id}`
      const response = await this.client.get(endpoint)
      
      // 映射WooCommerce API数据到我们的Product类型
      const mappedProduct = this.mapFromWooCommerceFormat(response.data)
      
      console.log('Mapped single product:', {
        original: {
          id: response.data.id,
          name: response.data.name,
          price: response.data.price,
          regular_price: response.data.regular_price,
          sale_price: response.data.sale_price
        },
        mapped: {
          id: mappedProduct.id,
          name: mappedProduct.name,
          price: mappedProduct.price,
          regularPrice: mappedProduct.regularPrice,
          salePrice: mappedProduct.salePrice
        }
      })
      
      return {
        success: true,
        data: mappedProduct
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    try {
      const endpoint = '/wp-json/wc/v3/products'
      
      // 将我们的Product类型字段映射到WooCommerce API格式
      const wooCommerceData = this.mapToWooCommerceFormat(product)
      
      console.log('Creating product with WooCommerce API data:', {
        originalData: {
          name: product.name,
          regularPrice: product.regularPrice,
          salePrice: product.salePrice,
          stockQuantity: product.stockQuantity
        },
        mappedData: {
          name: wooCommerceData.name,
          regular_price: wooCommerceData.regular_price,
          sale_price: wooCommerceData.sale_price,
          stock_quantity: wooCommerceData.stock_quantity
        }
      })
      
      const response = await this.client.post(endpoint, wooCommerceData)
      
      // 映射返回的数据
      const mappedProduct = this.mapFromWooCommerceFormat(response.data)
      
      return {
        success: true,
        data: mappedProduct,
        message: 'Product created successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/${id}`
      
      // 将我们的Product类型字段映射到WooCommerce API格式
      const wooCommerceData = this.mapToWooCommerceFormat(product)
      
      console.log('Updating product with WooCommerce API data:', {
        id,
        originalData: {
          regularPrice: product.regularPrice,
          salePrice: product.salePrice,
          stockQuantity: product.stockQuantity
        },
        mappedData: {
          regular_price: wooCommerceData.regular_price,
          sale_price: wooCommerceData.sale_price,
          stock_quantity: wooCommerceData.stock_quantity
        }
      })
      
      const response = await this.client.put(endpoint, wooCommerceData)
      
      // 映射返回的数据
      const mappedProduct = this.mapFromWooCommerceFormat(response.data)
      
      return {
        success: true,
        data: mappedProduct,
        message: 'Product updated successfully'
      }
    } catch (error: any) {
      console.error('Product update error:', error)
      return this.handleError(error)
    }
  }

  async deleteProduct(id: number, force = false): Promise<ApiResponse<Product>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/${id}`
      const response = await this.client.delete(endpoint, { 
        params: { force } 
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Product deleted successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Batch operations
  async batchProducts(operations: BatchOperation): Promise<ApiResponse<BatchResponse>> {
    try {
      const endpoint = '/wp-json/wc/v3/products/batch'
      
      // 映射批量操作数据到WooCommerce API格式
      const batchData: any = {}
      
      if (operations.create) {
        batchData.create = operations.create.map(product => this.mapToWooCommerceFormat(product))
      }
      
      if (operations.update) {
        batchData.update = operations.update.map(product => this.mapToWooCommerceFormat(product))
      }
      
      if (operations.delete) {
        batchData.delete = operations.delete
      }
      
      console.log('Batch products operation:', {
        originalOperations: operations,
        mappedData: batchData
      })
      
      const response = await this.client.post(endpoint, batchData)
      
      // 映射返回的数据
      const result: BatchResponse = {}
      
      if (response.data.create) {
        result.create = response.data.create.map((product: any) => this.mapFromWooCommerceFormat(product))
      }
      
      if (response.data.update) {
        result.update = response.data.update.map((product: any) => this.mapFromWooCommerceFormat(product))
      }
      
      if (response.data.delete) {
        result.delete = response.data.delete
      }
      
      return {
        success: true,
        data: result,
        message: 'Batch operation completed successfully'
      }
    } catch (error: any) {
      console.error('Batch products error:', error)
      return this.handleError(error)
    }
  }

  // Product categories
  async getProductCategories(): Promise<ApiResponse<ProductCategory[]>> {
    try {
      const endpoint = '/wp-json/wc/v3/products/categories'
      const response = await this.client.get(endpoint, {
        params: { per_page: 100 }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async createProductCategory(category: Omit<ProductCategory, 'id'>): Promise<ApiResponse<ProductCategory>> {
    try {
      const endpoint = '/wp-json/wc/v3/products/categories'
      const response = await this.client.post(endpoint, category)
      
      return {
        success: true,
        data: response.data,
        message: 'Category created successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Product attributes API methods
  async getProductAttributes(): Promise<ApiResponse<ProductAttribute[]>> {
    try {
      const endpoint = '/wp-json/wc/v3/products/attributes'
      const response = await this.client.get(endpoint, {
        params: { per_page: 100 }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async createProductAttribute(attribute: Omit<ProductAttribute, 'id'>): Promise<ApiResponse<ProductAttribute>> {
    try {
      // 检查配置
      if (!this.storeConfig) {
        console.error('API Error: No store configuration set')
        return {
          success: false,
          error: 'No store configuration provided. Please select a store first.'
        }
      }
      
      // 检查变体商品权限
      if (this.storeConfig.authType !== 'wordpress') {
        return {
          success: false,
          error: 'Product attribute management requires WordPress authentication'
        }
      }
      
      // 检查认证信息
      if (this.storeConfig.authType === 'wordpress') {
        if (!this.storeConfig.credentials.username || !this.storeConfig.credentials.password) {
          console.error('API Error: WordPress credentials missing')
          return {
            success: false,
            error: 'WordPress username or password is missing'
          }
        }
      } else if (this.storeConfig.authType === 'woocommerce') {
        if (!this.storeConfig.credentials.consumerKey || !this.storeConfig.credentials.consumerSecret) {
          console.error('API Error: WooCommerce credentials missing')
          return {
            success: false,
            error: 'WooCommerce Consumer Key or Consumer Secret is missing'
          }
        }
      }
      
      const endpoint = '/wp-json/wc/v3/products/attributes'
      
      // 映射属性数据到WooCommerce API格式
      const attributeData = {
        name: attribute.name,
        slug: attribute.slug || attribute.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        type: attribute.type || 'select',
        order_by: attribute.orderBy || 'menu_order',
        has_archives: attribute.hasArchives || false
      }
      
      console.log('Creating product attribute with data:', {
        storeConfig: {
          url: this.storeConfig.url,
          authType: this.storeConfig.authType,
          hasCredentials: this.storeConfig.authType === 'wordpress' 
            ? !!(this.storeConfig.credentials.username && this.storeConfig.credentials.password)
            : !!(this.storeConfig.credentials.consumerKey && this.storeConfig.credentials.consumerSecret)
        },
        endpoint,
        originalData: attribute,
        mappedData: attributeData
      })
      
      const response = await this.client.post(endpoint, attributeData)
      
      console.log('Attribute creation response:', response.data)
      
      return {
        success: true,
        data: response.data,
        message: 'Product attribute created successfully'
      }
    } catch (error: any) {
      console.error('Attribute creation error:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        },
        attributeData: attribute
      })
      return this.handleError(error)
    }
  }

  async updateProductAttribute(id: number, attribute: Partial<ProductAttribute>): Promise<ApiResponse<ProductAttribute>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/attributes/${id}`
      const response = await this.client.put(endpoint, attribute)
      
      return {
        success: true,
        data: response.data,
        message: 'Product attribute updated successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async deleteProductAttribute(id: number): Promise<ApiResponse<any>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/attributes/${id}`
      const response = await this.client.delete(endpoint, {
        params: { force: true }
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Product attribute deleted successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Product attribute terms API methods
  async getProductAttributeTerms(attributeId: number): Promise<ApiResponse<ProductAttributeTerm[]>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/attributes/${attributeId}/terms`
      const response = await this.client.get(endpoint, {
        params: { per_page: 100 }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async createProductAttributeTerm(attributeId: number, term: Omit<ProductAttributeTerm, 'id'>): Promise<ApiResponse<ProductAttributeTerm>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/attributes/${attributeId}/terms`
      const response = await this.client.post(endpoint, term)
      
      return {
        success: true,
        data: response.data,
        message: 'Attribute term created successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Product variations API methods
  async getProductVariations(productId: number): Promise<ApiResponse<ProductVariation[]>> {
    try {
      // 变体功能权限检查
      if (this.storeConfig?.authType !== 'wordpress') {
        return {
          success: false,
          error: 'Product variations management requires WordPress authentication'
        }
      }
      
      const endpoint = `/wp-json/wc/v3/products/${productId}/variations`
      const response = await this.client.get(endpoint, {
        params: { per_page: 100 }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async getProductVariation(productId: number, variationId: number): Promise<ApiResponse<ProductVariation>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/${productId}/variations/${variationId}`
      const response = await this.client.get(endpoint)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async createProductVariation(productId: number, variation: Omit<ProductVariation, 'id'>): Promise<ApiResponse<ProductVariation>> {
    try {
      // 变体功能权限检查
      if (this.storeConfig?.authType !== 'wordpress') {
        return {
          success: false,
          error: 'Product variations management requires WordPress authentication'
        }
      }
      
      const endpoint = `/wp-json/wc/v3/products/${productId}/variations`
      
      // 映射到WooCommerce API格式
      const wooCommerceData = this.mapVariationToWooCommerceFormat(variation)
      
      console.log('Creating variation with data:', {
        productId,
        originalData: variation,
        mappedData: wooCommerceData
      })
      
      const response = await this.client.post(endpoint, wooCommerceData)
      
      return {
        success: true,
        data: response.data,
        message: 'Product variation created successfully'
      }
    } catch (error: any) {
      console.error('Variation creation error:', error)
      return this.handleError(error)
    }
  }

  async updateProductVariation(productId: number, variationId: number, variation: Partial<ProductVariation>): Promise<ApiResponse<ProductVariation>> {
    try {
      // 变体功能权限检查
      if (this.storeConfig?.authType !== 'wordpress') {
        return {
          success: false,
          error: 'Product variations management requires WordPress authentication'
        }
      }
      
      const endpoint = `/wp-json/wc/v3/products/${productId}/variations/${variationId}`
      
      // 映射到WooCommerce API格式
      const wooCommerceData = this.mapVariationToWooCommerceFormat(variation)
      
      console.log('Updating variation with data:', {
        productId,
        variationId,
        originalData: variation,
        mappedData: wooCommerceData
      })
      
      const response = await this.client.put(endpoint, wooCommerceData)
      
      return {
        success: true,
        data: response.data,
        message: 'Product variation updated successfully'
      }
    } catch (error: any) {
      console.error('Variation update error:', error)
      return this.handleError(error)
    }
  }

  async deleteProductVariation(productId: number, variationId: number): Promise<ApiResponse<any>> {
    try {
      const endpoint = `/wp-json/wc/v3/products/${productId}/variations/${variationId}`
      const response = await this.client.delete(endpoint, {
        params: { force: true }
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Product variation deleted successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async batchProductVariations(productId: number, operations: { create?: Partial<ProductVariation>[], update?: Partial<ProductVariation>[], delete?: number[] }): Promise<ApiResponse<any>> {
    try {
      // 变体功能权限检查
      if (this.storeConfig?.authType !== 'wordpress') {
        return {
          success: false,
          error: 'Product variations management requires WordPress authentication'
        }
      }
      
      const endpoint = `/wp-json/wc/v3/products/${productId}/variations/batch`
      
      // 映射批量操作数据
      const batchData: any = {}
      
      if (operations.create) {
        batchData.create = operations.create.map(variation => this.mapVariationToWooCommerceFormat(variation))
      }
      
      if (operations.update) {
        batchData.update = operations.update.map(variation => this.mapVariationToWooCommerceFormat(variation))
      }
      
      if (operations.delete) {
        batchData.delete = operations.delete
      }
      
      console.log('Batch variations operation:', {
        productId,
        originalOperations: operations,
        mappedData: batchData
      })
      
      const response = await this.client.post(endpoint, batchData)
      
      return {
        success: true,
        data: response.data,
        message: 'Batch variations operation completed successfully'
      }
    } catch (error: any) {
      console.error('Batch variations error:', error)
      return this.handleError(error)
    }
  }

  // Product tags
  async getProductTags(): Promise<ApiResponse<ProductTag[]>> {
    try {
      const endpoint = '/wp-json/wc/v3/products/tags'
      const response = await this.client.get(endpoint, {
        params: { per_page: 100 }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async createProductTag(tag: Omit<ProductTag, 'id'>): Promise<ApiResponse<ProductTag>> {
    try {
      const endpoint = '/wp-json/wc/v3/products/tags'
      const response = await this.client.post(endpoint, tag)
      
      return {
        success: true,
        data: response.data,
        message: 'Tag created successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Media upload (WordPress API required)
  async uploadImage(file: File): Promise<ApiResponse<MediaItem>> {
    try {
      if (this.storeConfig?.authType !== 'wordpress') {
        return {
          success: false,
          error: 'Image upload requires WordPress authentication'
        }
      }

      const formData = new FormData()
      formData.append('file', file)

      const endpoint = '/wp-json/wp/v2/media'
      const response = await this.client.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Image uploaded successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Order API methods
  async getOrders(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const endpoint = '/wp-json/wc/v3/orders'

      const queryParams: any = {
        per_page: params?.perPage || 20,
        page: params?.page || 1,
        orderby: params?.orderBy || 'date',
        order: params?.order || 'desc'
      }

      if (params?.status) queryParams.status = params.status
      if (params?.search) queryParams.search = params.search
      if (params?.dateFrom) queryParams.after = params.dateFrom
      if (params?.dateTo) queryParams.before = params.dateTo

      const response = await this.client.get(endpoint, { params: queryParams })
      
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1')
      const total = parseInt(response.headers['x-wp-total'] || '0')
      const currentPage = params?.page || 1

      return {
        success: true,
        data: {
          data: response.data,
          total,
          totalPages,
          currentPage,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        }
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    try {
      const endpoint = `/wp-json/wc/v3/orders/${id}`
      const response = await this.client.get(endpoint)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async updateOrder(id: number, order: Partial<Order>): Promise<ApiResponse<Order>> {
    try {
      const endpoint = `/wp-json/wc/v3/orders/${id}`
      const response = await this.client.put(endpoint, order)
      
      return {
        success: true,
        data: response.data,
        message: 'Order updated successfully'
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // System information
  async getSystemStatus(): Promise<ApiResponse<any>> {
    try {
      const endpoint = '/wp-json/wc/v3/system_status'
      const response = await this.client.get(endpoint)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Get WordPress version
  async getWordPressInfo(): Promise<ApiResponse<any>> {
    try {
      const endpoint = '/wp-json/wp/v2'
      const response = await this.client.get(endpoint)
      
      return {
        success: true,
        data: {
          namespaces: response.data.namespaces,
          site_url: response.data.url,
          home_url: response.data.home,
          gmt_offset: response.data.gmt_offset,
          timezone_string: response.data.timezone_string
        }
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Get WooCommerce version and info
  async getWooCommerceInfo(): Promise<ApiResponse<any>> {
    try {
      const endpoint = '/wp-json/wc/v3'
      const response = await this.client.get(endpoint)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // Get comprehensive store information
  async getStoreInfo(): Promise<ApiResponse<any>> {
    try {
      const [systemStatus, wpInfo, wcInfo] = await Promise.allSettled([
        this.getSystemStatus(),
        this.getWordPressInfo(),
        this.getWooCommerceInfo()
      ])

      const result: any = {
        timestamp: new Date().toISOString()
      }

      if (systemStatus.status === 'fulfilled' && systemStatus.value.success) {
        const data = systemStatus.value.data
        console.log('System Status Data:', JSON.stringify(data, null, 2))
        
        // 修复版本号获取逻辑，尝试多种可能的路径
        result.woocommerce = {
          version: data.settings?.wc_version?.value || 
                  data.woocommerce?.version || 
                  data.settings?.woocommerce?.version || 
                  data.settings?.woocommerce_version?.value ||
                  data.environment?.woocommerce_version?.value ||
                  'Unknown',
          database_version: data.database?.wc_database_version?.value || 
                           data.database?.woocommerce?.database_version || 
                           data.settings?.woocommerce?.database_version ||
                           'Unknown',
          api_enabled: data.settings?.api_enabled?.value || 
                      data.settings?.woocommerce?.api_enabled || 
                      data.woocommerce?.api_enabled ||
                      false
        }
        result.wordpress = {
          version: data.environment?.wp_version?.value || 
                  data.wordpress?.version || 
                  data.environment?.wordpress?.version || 
                  data.settings?.wp_version?.value ||
                  data.wp_version?.value ||
                  'Unknown',
          multisite: data.environment?.wp_multisite?.value || 
                    data.wordpress?.multisite || 
                    data.wp_multisite?.value ||
                    false,
          memory_limit: data.environment?.wp_memory_limit?.value || 
                       data.wordpress?.memory_limit || 
                       data.wp_memory_limit?.value ||
                       'Unknown',
          debug_mode: data.environment?.wp_debug_mode?.value || 
                     data.wordpress?.debug_mode || 
                     data.wp_debug_mode?.value ||
                     false
        }
        result.server = {
          software: data.environment?.server_info?.value || 
                   data.server?.software || 
                   data.server_info?.value ||
                   'Unknown',
          php_version: data.environment?.php_version?.value || 
                      data.server?.php_version || 
                      data.php_version?.value ||
                      'Unknown',
          mysql_version: data.database?.mysql_version?.value || 
                        data.server?.mysql_version || 
                        data.mysql_version?.value ||
                        'Unknown'
        }
        result.theme = {
          name: data.theme?.name?.value || 
               data.theme?.name || 
               data.active_theme?.name?.value ||
               'Unknown',
          version: data.theme?.version?.value || 
                  data.theme?.version || 
                  data.active_theme?.version?.value ||
                  'Unknown',
          author: data.theme?.author_url?.value || 
                 data.theme?.author || 
                 data.active_theme?.author?.value ||
                 'Unknown'
        }
      }

      if (wpInfo.status === 'fulfilled' && wpInfo.value.success) {
        result.site = wpInfo.value.data
      }

      if (wcInfo.status === 'fulfilled' && wcInfo.value.success) {
        result.api = wcInfo.value.data
      }

      // 添加完整的原始数据用于调试
      if (systemStatus.status === 'fulfilled' && systemStatus.value.success) {
        result.rawData = systemStatus.value.data
      }

      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  // 将WooCommerce API格式映射到我们的Product类型
  private mapFromWooCommerceFormat(wooCommerceProduct: any): Product {
    const product: any = {
      ...wooCommerceProduct
    }

    // 映射价格字段 - 确保数值转换和安全处理
    product.price = Number(wooCommerceProduct.price) || 0
    product.regularPrice = Number(wooCommerceProduct.regular_price) || 0
    product.salePrice = Number(wooCommerceProduct.sale_price) || 0

    // 映射库存字段
    product.stockQuantity = Number(wooCommerceProduct.stock_quantity) || 0
    product.manageStock = Boolean(wooCommerceProduct.manage_stock)
    product.stockStatus = wooCommerceProduct.stock_status || 'instock'

    // 映射商品图片
    if (wooCommerceProduct.images && Array.isArray(wooCommerceProduct.images)) {
      product.images = wooCommerceProduct.images.map((img: any, index: number) => ({
        id: img.id,
        src: img.src,
        name: img.name || `Image ${index + 1}`,
        alt: img.alt || '',
        position: img.position || index
      }))
    } else {
      product.images = []
    }

    // 映射商品分类
    if (wooCommerceProduct.categories && Array.isArray(wooCommerceProduct.categories)) {
      product.categories = wooCommerceProduct.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      }))
    } else {
      product.categories = []
    }

    // 映射商品标签
    if (wooCommerceProduct.tags && Array.isArray(wooCommerceProduct.tags)) {
      product.tags = wooCommerceProduct.tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      }))
    } else {
      product.tags = []
    }

    // 映射商品属性
    if (wooCommerceProduct.attributes && Array.isArray(wooCommerceProduct.attributes)) {
      product.attributes = wooCommerceProduct.attributes.map((attr: any) => ({
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        position: attr.position,
        visible: attr.visible,
        variation: attr.variation,
        options: attr.options || []
      }))
    } else {
      product.attributes = []
    }

    // 映射尺寸信息
    if (wooCommerceProduct.dimensions) {
      product.dimensions = {
        length: wooCommerceProduct.dimensions.length || '',
        width: wooCommerceProduct.dimensions.width || '',
        height: wooCommerceProduct.dimensions.height || ''
      }
    } else {
      product.dimensions = { length: '', width: '', height: '' }
    }

    // 映射其他字段
    product.shortDescription = wooCommerceProduct.short_description || ''
    product.taxStatus = wooCommerceProduct.tax_status || 'taxable'
    product.reviewsAllowed = Boolean(wooCommerceProduct.reviews_allowed)
    product.purchaseNote = wooCommerceProduct.purchase_note || ''
    product.dateCreated = wooCommerceProduct.date_created
    product.dateModified = wooCommerceProduct.date_modified

    // 确保所有字段都有默认值
    if (!product.salePrice) {
      product.salePrice = 0
    }

    // 清理WooCommerce专有字段
    delete product.regular_price
    delete product.sale_price
    delete product.stock_quantity
    delete product.manage_stock
    delete product.stock_status
    delete product.short_description
    delete product.tax_status
    delete product.reviews_allowed
    delete product.purchase_note
    delete product.date_created
    delete product.date_modified
    delete product.date_created_gmt
    delete product.date_modified_gmt
    delete product.permalink
    delete product.on_sale
    delete product.purchasable
    delete product.total_sales
    delete product.virtual
    delete product.downloadable
    delete product.downloads
    delete product.download_limit
    delete product.download_expiry
    delete product.external_url
    delete product.button_text
    delete product.tax_class
    delete product.shipping_required
    delete product.shipping_taxable
    delete product.shipping_class
    delete product.shipping_class_id
    delete product.related_ids
    delete product.upsell_ids
    delete product.cross_sell_ids
    delete product.parent_id
    delete product.grouped_products
    delete product.menu_order
    delete product.meta_data
    delete product.variations
    delete product.default_attributes
    delete product.backorders
    delete product.backorders_allowed
    delete product.backordered
    delete product.sold_individually
    delete product.low_stock_amount
    delete product.catalog_visibility
    delete product.featured

    return product as Product
  }

  // 将我们的Product类型字段映射到WooCommerce API格式
  private mapToWooCommerceFormat(product: Partial<Product>): any {
    const wooCommerceData: any = {
      ...product
    }

    // 映射价格字段
    if (product.regularPrice !== undefined) {
      wooCommerceData.regular_price = product.regularPrice.toString()
      delete wooCommerceData.regularPrice
    }

    if (product.salePrice !== undefined) {
      // 修复：始终发送sale_price字段，即使是0值也要发送"0"而不是空字符串
      wooCommerceData.sale_price = product.salePrice.toString()
      delete wooCommerceData.salePrice
    }

    // 映射库存字段
    if (product.stockQuantity !== undefined) {
      wooCommerceData.stock_quantity = product.stockQuantity
      delete wooCommerceData.stockQuantity
    }

    if (product.manageStock !== undefined) {
      wooCommerceData.manage_stock = product.manageStock
      delete wooCommerceData.manageStock
    }

    if (product.stockStatus !== undefined) {
      wooCommerceData.stock_status = product.stockStatus
      delete wooCommerceData.stockStatus
    }

    if (product.taxStatus !== undefined) {
      wooCommerceData.tax_status = product.taxStatus
      delete wooCommerceData.taxStatus
    }

    // 不发送price字段，让WooCommerce自动计算
    delete wooCommerceData.price

    return wooCommerceData
  }

  // 将变体数据映射到WooCommerce API格式
  private mapVariationToWooCommerceFormat(variation: Partial<ProductVariation>): any {
    const wooCommerceData: any = {
      ...variation
    }

    // 映射价格字段
    if (variation.regularPrice !== undefined) {
      wooCommerceData.regular_price = variation.regularPrice.toString()
      delete wooCommerceData.regularPrice
    }

    if (variation.salePrice !== undefined) {
      // 修复：始终发送sale_price字段，即使是0值也要发送"0"而不是空字符串
      wooCommerceData.sale_price = variation.salePrice.toString()
      delete wooCommerceData.salePrice
    }

    // 映射库存字段
    if (variation.stockQuantity !== undefined) {
      wooCommerceData.stock_quantity = variation.stockQuantity
      delete wooCommerceData.stockQuantity
    }

    if (variation.manageStock !== undefined) {
      wooCommerceData.manage_stock = variation.manageStock
      delete wooCommerceData.manageStock
    }

    if (variation.stockStatus !== undefined) {
      wooCommerceData.stock_status = variation.stockStatus
      delete wooCommerceData.stockStatus
    }

    if (variation.taxStatus !== undefined) {
      wooCommerceData.tax_status = variation.taxStatus
      delete wooCommerceData.taxStatus
    }

    // 不发送price字段，让WooCommerce自动计算
    delete wooCommerceData.price

    return wooCommerceData
  }
}

// Singleton instance
export const apiService = new ApiService()
export default apiService