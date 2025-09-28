// Chrome Extension Types
export {}

// Store Configuration Types
export interface StoreConfig {
  id: string
  name: string
  url: string
  authType: 'wordpress' | 'woocommerce'
  credentials: {
    username?: string           // WordPress用户名
    password?: string          // WordPress应用密码
    consumerKey?: string       // WooCommerce Consumer Key
    consumerSecret?: string    // WooCommerce Consumer Secret
  }
  isActive: boolean
  status?: StoreStatus
}

export interface StoreStatus {
  isOnline: boolean
  lastChecked: string
  productCount: number
  error?: string
}

// Product Types
export interface Product {
  id?: number
  name: string
  description: string
  shortDescription?: string
  price: number
  regularPrice: number
  salePrice?: number
  sku: string
  stockQuantity: number
  manageStock: boolean
  stockStatus: 'instock' | 'outofstock' | 'onbackorder'
  categories: ProductCategory[]
  tags: ProductTag[]
  images: ProductImage[]
  status: 'draft' | 'pending' | 'private' | 'publish'
  type: 'simple' | 'grouped' | 'external' | 'variable'
  attributes: ProductAttribute[]
  variations?: number[]
  weight?: string
  dimensions?: ProductDimensions
  shippingClass?: string
  taxStatus: 'taxable' | 'shipping' | 'none'
  taxClass?: string
  reviewsAllowed: boolean
  upsellIds?: number[]
  crossSellIds?: number[]
  parentId?: number
  purchaseNote?: string
  menuOrder?: number
  dateCreated?: string
  dateModified?: string
}

export interface ProductImage {
  id?: number
  src: string
  name?: string
  alt?: string
  position?: number
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface ProductTag {
  id: number
  name: string
  slug: string
}

export interface ProductAttribute {
  id?: number
  name: string
  slug?: string
  type?: 'select' | 'text' | 'number'
  orderBy?: 'menu_order' | 'name' | 'name_num' | 'id'
  hasArchives?: boolean
  position?: number
  visible?: boolean
  variation?: boolean
  options: string[]
}

export interface ProductVariation {
  id?: number
  dateCreated?: string
  dateModified?: string
  description?: string
  permalink?: string
  sku?: string
  price: number
  regularPrice: number
  salePrice?: number
  onSale?: boolean
  purchasable?: boolean
  virtual?: boolean
  downloadable?: boolean
  downloads?: any[]
  downloadLimit?: number
  downloadExpiry?: number
  taxStatus?: 'taxable' | 'shipping' | 'none'
  taxClass?: string
  manageStock?: boolean
  stockQuantity?: number
  stockStatus?: 'instock' | 'outofstock' | 'onbackorder'
  backorders?: 'no' | 'notify' | 'yes'
  backordersAllowed?: boolean
  backordered?: boolean
  weight?: string
  dimensions?: ProductDimensions
  shippingClass?: string
  shippingClassId?: number
  image?: ProductImage
  attributes: VariationAttribute[]
  menuOrder?: number
  metaData?: MetaData[]
}

export interface VariationAttribute {
  id?: number
  name: string
  option: string
}

export interface ProductAttributeTerm {
  id?: number
  name: string
  slug: string
  description?: string
  menuOrder?: number
  count?: number
}

export interface ProductDimensions {
  length: string
  width: string
  height: string
}

// Order Types
export interface Order {
  id: number
  number: string
  status: OrderStatus
  currency: string
  total: string
  totalTax: string
  customerId: number
  customerNote?: string
  billing: Address
  shipping: Address
  paymentMethod: string
  paymentMethodTitle: string
  transactionId?: string
  lineItems: LineItem[]
  shippingLines: ShippingLine[]
  taxLines: TaxLine[]
  feeLines: FeeLine[]
  couponLines: CouponLine[]
  dateCreated: string
  dateModified: string
  datePaid?: string
  dateCompleted?: string
}

export type OrderStatus = 
  | 'pending'
  | 'processing' 
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'trash'

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postcode: string
  country: string
  email?: string
  phone?: string
}

export interface LineItem {
  id: number
  name: string
  productId: number
  variationId?: number
  quantity: number
  taxClass: string
  subtotal: string
  subtotalTax: string
  total: string
  totalTax: string
  taxes: Tax[]
  metaData: MetaData[]
  sku?: string
  price: number
  image?: ProductImage
}

export interface ShippingLine {
  id: number
  methodTitle: string
  methodId: string
  instanceId: string
  total: string
  totalTax: string
  taxes: Tax[]
  metaData: MetaData[]
}

export interface TaxLine {
  id: number
  rateCode: string
  rateId: number
  label: string
  compound: boolean
  taxTotal: string
  shippingTaxTotal: string
  ratePercent?: number
  metaData: MetaData[]
}

export interface FeeLine {
  id: number
  name: string
  taxClass: string
  taxStatus: string
  total: string
  totalTax: string
  taxes: Tax[]
  metaData: MetaData[]
}

export interface CouponLine {
  id: number
  code: string
  discount: string
  discountTax: string
  metaData: MetaData[]
}

export interface Tax {
  id: number
  total: string
  subtotal: string
}

export interface MetaData {
  id: number
  key: string
  value: string
  displayKey?: string
  displayValue?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Filter and Search Types
export interface FilterParams {
  search?: string
  status?: string
  category?: string
  tag?: string
  sku?: string
  priceMin?: number
  priceMax?: number
  stockStatus?: string
  page?: number
  perPage?: number
  orderBy?: string
  order?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
}

// Batch Operation Types
export interface BatchOperation {
  create?: Partial<Product>[]
  update?: Partial<Product>[]
  delete?: number[]
}

export interface BatchResponse {
  create?: Product[]
  update?: Product[]
  delete?: { id: number; success: boolean }[]
}

// Media Types
export interface MediaItem {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: {
    rendered: string
  }
  author: number
  comment_status: string
  ping_status: string
  alt_text: string
  caption: {
    rendered: string
  }
  description: {
    rendered: string
  }
  media_type: string
  mime_type: string
  media_details: {
    width: number
    height: number
    file: string
    sizes: Record<string, MediaSize>
  }
  source_url: string
}

export interface MediaSize {
  file: string
  width: number
  height: number
  mime_type: string
  source_url: string
}

// UI State Types
export interface AppState {
  // Store related
  stores: StoreConfig[]
  activeStore: string | null
  storeStatuses: Record<string, StoreStatus>
  
  // Product related
  products: Product[]
  selectedProducts: Product[]
  productCategories: ProductCategory[]
  productTags: ProductTag[]
  
  // Order related
  orders: Order[]
  selectedOrders: Order[]
  
  // UI state
  loading: boolean
  theme: 'default' | 'light' | 'dark' | 'macaron'
  language: 'zh-CN' | 'zh-TW' | 'en-US'
  
  // Dialog states
  isProductFormOpen: boolean
  isFilterDialogOpen: boolean
  isSettingsDialogOpen: boolean
  isFeedbackDialogOpen?: boolean // 添加缺失的状态定义
  
  // API Config (添加缺失的API配置定义)
  // 注意：此功能与backend项目相关，backend项目为后期开发内容
  apiConfig?: {
    primaryUrl: string
    backupUrl: string
  }
  
  // Actions
  addStore: (store: StoreConfig) => void
  updateStore: (id: string, store: StoreConfig) => void
  deleteStore: (id: string) => void
  setActiveStore: (id: string) => void
  updateStoreStatus: (id: string, status: StoreStatus) => void
  
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  setSelectedProducts: (products: Product[]) => void
  
  setOrders: (orders: Order[]) => void
  setSelectedOrders: (orders: Order[]) => void
  
  setLoading: (loading: boolean) => void
  setTheme: (theme: 'default' | 'light' | 'dark' | 'macaron') => void
  setLanguage: (language: 'zh-CN' | 'zh-TW' | 'en-US') => void
  
  setProductFormOpen: (open: boolean) => void
  setFilterDialogOpen: (open: boolean) => void
  setSettingsDialogOpen: (open: boolean) => void
  setFeedbackDialogOpen?: (open: boolean) => void // 添加缺失的方法定义
  
  // API Config Actions (添加缺失的API配置方法定义)
  // 注意：此功能与backend项目相关，backend项目为后期开发内容
  setApiConfig?: (config: { primaryUrl: string; backupUrl: string }) => void
}

// Internationalization Types
export interface TranslationKeys {
  // Common
  'common.save': string
  'common.cancel': string
  'common.delete': string
  'common.edit': string
  'common.add': string
  'common.search': string
  'common.filter': string
  'common.loading': string
  'common.error': string
  'common.success': string
  'common.confirm': string
  'common.close': string
  'common.refresh': string
  'common.export': string
  'common.import': string
  'common.upload': string
  'common.download': string
  'common.copy': string
  'common.paste': string
  'common.select': string
  'common.selectAll': string
  'common.clear': string
  'common.reset': string
  'common.back': string
  'common.next': string
  'common.previous': string
  'common.finish': string
  'common.submit': string
  'common.apply': string
  'common.preview': string
  'common.settings': string
  'common.actions': string
  'common.dashboard': string
  'common.welcome': string
  'common.systemStatus': string
  'common.recommended': string
  'common.featureComingSoon': string
  'common.featureComingSoonDesc': string
  'common.lightweight': string
  'common.pureFunctionality': string
  'common.completelyFree': string
  
  // App
  'app.title': string
  'app.description': string
  'app.version': string
  'app.maximize': string
  'app.minimize': string

  // Store Management
  'store.title': string
  'store.add': string
  'store.addNew': string
  'store.edit': string
  'store.name': string
  'store.url': string
  'store.authType': string
  'store.status': string
  'store.online': string
  'store.offline': string
  'store.testConnection': string
  'store.upgradeToLevel2': string
  'store.upgradeDescription': string
  'store.upgradeBenefits': string
  'store.currentLimitations': string
  'store.seamlessUpgrade': string
  'store.upgradeMigration': string
  'store.upgradeSteps': string
  'store.upgradeStepsDescription': string
  'store.upgrading': string
  'store.startUpgrade': string
  'store.lastChecked': string
  'store.systemInfo': string
  'store.serverInfo': string
  'store.themeInfo': string
  'store.hideDetails': string
  'store.viewDetails': string
  'store.consumerKey': string
  'store.consumerSecret': string
  'store.username': string
  'store.password': string
  'store.wordpress': string
  'store.woocommerce': string
  'store.active': string
  'store.setActive': string
  'store.productCount': string
  'store.extensionVersion': string
  'store.browserInfo': string
  'store.phpVersion': string
  'store.mysqlVersion': string
  'store.wordPressVersion': string
  'store.wooCommerceVersion': string
  'store.bindingGuide': string
  'store.bindingLevel': string
  'store.basicBinding': string
  'store.advancedBinding': string
  'store.upgradeBinding': string
  'store.bindingBenefits': string
  'store.functionalLimitations': string
  'store.permissionLevel': string
  'store.featureComparison': string
  'store.connecting': string
  'store.connectionSuccess': string
  'store.connectionFailed': string
  'store.credentials': string
  'store.selectAuthType': string
  'store.basic': string
  'store.advanced': string
  'store.extension': string
  'store.clientEnvironment': string
  'store.displayInfo': string
  'store.networkInfo': string
  'store.performanceInfo': string
  'store.onlineStatus': string
  'store.offlineStatus': string
  'store.connectionType': string
  'store.downlinkSpeed': string
  'store.latency': string
  'store.domLoad': string
  'store.pageComplete': string
  'store.jsMemory': string
  'store.browser': string
  'store.engine': string
  'store.platform': string
  'store.architecture': string
  'store.hardwareConcurrency': string
  'store.language': string
  'store.timezone': string
  'store.resolution': string
  'store.pixelRatio': string
  'store.colorDepth': string
  'store.orientation': string
  'store.multisite': string
  'store.debugMode': string
  'store.databaseVersion': string
  'store.api': string
  'store.server': string
  'store.theme': string
  'store.version': string
  'store.unknown': string
  'store.yes': string
  'store.no': string
  'store.on': string
  'store.off': string
  'store.upgrade': string
  'store.delete': string
  'store.inactive': string
  
  // Store Binding Guide
  'store.binding.dialogTitle': string
  'store.binding.preparation': string
  'store.binding.selectedLevel': string
  'store.binding.level1': string
  'store.binding.level2': string
  'store.binding.level1Limitations': string
  'store.binding.level2Additional': string
  'store.binding.requiresLevel2': string
  'store.binding.productManagement': string
  'store.binding.orderManagement': string
  'store.binding.otherFeatures': string
  'store.binding.level1Steps': string
  'store.binding.level2Steps': string
  'store.binding.prepareWooCommerce': string
  'store.binding.prepareWooCommerceDesc': string
  'store.binding.fillStoreInfo': string
  'store.binding.fillStoreInfoDesc': string
  'store.binding.testConnection': string
  'store.binding.testConnectionDesc': string
  'store.binding.createWordPress': string
  'store.binding.createWordPressDesc': string
  'store.binding.fillAuthInfo': string
  'store.binding.fillAuthInfoDesc': string
  'store.binding.verifyPermissions': string
  'store.binding.verifyPermissionsDesc': string
  'store.binding.tip': string
  'store.binding.tipDesc': string
  'store.binding.next': string
  'store.binding.previous': string
  'store.binding.cancel': string
  'store.binding.skipGuide': string
  'store.binding.start': string
  'store.binding.understandLevels': string
  'store.binding.selectBinding': string
  'store.binding.featureComparison': string
  'store.binding.startBinding': string
  'store.binding.levelIntroduction': string
  'store.binding.systemDescription': string
  'store.binding.quickStart': string
  'store.binding.fullFeatures': string
  'store.binding.recommendation': string
  'store.binding.recommendationDesc': string
  'store.binding.chooseLevel': string
  'store.binding.mainAdvantages': string
  'store.binding.andMore': string
  'store.binding.currentWarning': string
  'store.binding.details': string
  'store.binding.benefits.productView': string
  'store.binding.benefits.simpleProduct': string
  'store.binding.benefits.externalProduct': string
  'store.binding.benefits.variableProductBasic': string
  'store.binding.benefits.groupedProductBasic': string
  'store.binding.benefits.orderView': string
  'store.binding.benefits.categoryManagement': string
  'store.binding.benefits.stockMonitoring': string
  'store.binding.limitations.noImageUpload': string
  'store.binding.limitations.noAttributeManagement': string
  'store.binding.limitations.noNewVariableProducts': string
  'store.binding.limitations.noVariationManagement': string
  'store.binding.limitations.noAdvancedConfig': string
  'store.binding.limitations.apiLimitations': string
  'store.binding.benefits.allBasicFeatures': string
  'store.binding.benefits.imageUpload': string
  'store.binding.benefits.variableProductFull': string
  'store.binding.benefits.attributeManagement': string
  'store.binding.benefits.variationConfig': string
  'store.binding.benefits.groupedProductFull': string
  'store.binding.benefits.advancedConfig': string
  'store.binding.benefits.wordpressApiAccess': string
  'store.binding.benefits.secureAuth': string
  'store.binding.benefits.stableConnection': string
  'store.binding.limitations.wordpressPasswordRequired': string
  'store.binding.limitations.higherServerPermissions': string
  'store.binding.features.productView': string
  'store.binding.features.productViewDesc': string
  'store.binding.features.productBasicEdit': string
  'store.binding.features.productBasicEditDesc': string
  'store.binding.features.simpleProductFull': string
  'store.binding.features.simpleProductFullDesc': string
  'store.binding.features.externalProductFull': string
  'store.binding.features.externalProductFullDesc': string
  'store.binding.features.variableProductCreate': string
  'store.binding.features.variableProductCreateDesc': string
  'store.binding.features.groupedProductFull': string
  'store.binding.features.groupedProductFullDesc': string
  'store.binding.features.imageUpload': string
  'store.binding.features.imageUploadDesc': string
  'store.binding.features.attributeManagement': string
  'store.binding.features.attributeManagementDesc': string
  'store.binding.features.variationManagement': string
  'store.binding.features.variationManagementDesc': string

  // Product Management
  'product.title': string
  'product.createNew': string
  'product.name': string
  'product.description': string
  'product.price': string
  'product.stock': string
  'product.status': string
  'product.category': string
  'product.tag': string
  'product.image': string
  'product.editProduct': string
  'product.deleteProduct': string
  'product.batchActions': string
  'product.shortDescription': string
  'product.regularPrice': string
  'product.salePrice': string
  'product.stockQuantity': string
  'product.stockStatus': string
  'product.inStock': string
  'product.outOfStock': string
  'product.onBackorder': string
  'product.manageStock': string
  'product.draft': string
  'product.pending': string
  'product.private': string
  'product.publish': string
  'product.images': string
  'product.mainImage': string
  'product.gallery': string
  'product.sku': string
  'product.weight': string
  'product.dimensions': string
  'product.length': string
  'product.width': string
  'product.height': string
  'product.type': string
  'product.simple': string
  'product.grouped': string
  'product.external': string
  'product.variable': string
  'product.viewDetails': string
  'product.unpublish': string
  'product.taxable': string
  'product.shippingOnly': string
  'product.none': string
  'product.taxStatus': string
  'product.reviewsAllowed': string
  'product.purchaseNote': string
  'product.basicInfo': string
  'product.inventoryAndPricing': string
  'product.shippingInfo': string
  'product.advancedOptions': string
  'product.variations': string
  'product.groupedProducts': string
  'product.noImages': string
  'product.addImage': string
  'product.combinedProductManagement': string
  'product.subProductSettings': string
  'product.combinedProductDescription': string
  'product.selectProductsForCombination': string
  'product.combinedProductFeatureDevelopment': string
  'product.combinedProductFeatureSupport': string
  'product.purchaseNotePlaceholder': string

  // Order Management
  'order.title': string
  'order.number': string
  'order.status': string
  'order.customer': string
  'order.total': string
  'order.date': string
  'order.viewDetails': string
  'order.updateStatus': string
  'order.customerNote': string
  'order.billingAddress': string
  'order.shippingAddress': string
  'order.paymentMethod': string
  'order.shippingMethod': string
  'order.items': string
  'order.quantity': string
  'order.subtotal': string
  'order.shipping': string
  'order.tax': string
  'order.discount': string
  'order.fee': string
  'order.refund': string
  'order.pending': string
  'order.processing': string
  'order.onHold': string
  'order.completed': string
  'order.cancelled': string
  'order.refunded': string
  'order.failed': string
  'order.dateCreated': string
  'order.dateModified': string
  'order.datePaid': string
  'order.dateCompleted': string
  'order.billing': string
  'order.lineItems': string
  'order.viewOrder': string
  'order.editOrder': string

  // Filter and Search
  'filter.advanced': string
  'filter.quickFilter': string
  'filter.searchPlaceholder': string
  'filter.priceRange': string
  'filter.priceMin': string
  'filter.priceMax': string
  'filter.dateRange': string
  'filter.dateFrom': string
  'filter.dateTo': string
  'filter.category': string
  'filter.tag': string
  'filter.status': string
  'filter.stock': string
  'filter.clear': string
  'filter.apply': string

  // Batch Operations
  'batch.selectAll': string
  'batch.deselectAll': string
  'batch.selectedCount': string
  'batch.publish': string
  'batch.unpublish': string
  'batch.delete': string
  'batch.export': string
  'batch.updateStock': string
  'batch.updatePrice': string
  'batch.updateCategory': string

  // Settings
  'settings.title': string
  'settings.general': string
  'settings.appearance': string
  'settings.language': string
  'settings.theme': string
  'settings.lightTheme': string
  'settings.darkTheme': string
  'settings.glassPurpleTheme': string
  'settings.macaronGreenTheme': string
  'settings.autoTheme': string
  'settings.notifications': string
  'settings.orderNotifications': string
  'settings.advanced': string
  'settings.about': string
  'settings.version': string
  'settings.support': string
  'settings.supportDeveloper': string
  'settings.donationQRCode': string
  'settings.scanToSupport': string
  'settings.dataSecurity': string
  'settings.dataSecurityDesc': string
  'settings.helpDocs': string
  'settings.helpDocsDesc': string
  'settings.interfaceSettings': string
  'settings.interfaceSettingsDesc': string
  'settings.orderNotificationsDesc': string
  'settings.developerStory': string
  'settings.developerStoryDesc': string
  'settings.techStack': string
  'settings.features': string
  'settings.multiStoreManagement': string
  'settings.multiStoreManagementDesc': string
  'settings.productManagement': string
  'settings.productManagementDesc': string
  'settings.orderManagement': string
  'settings.orderManagementDesc': string
  'settings.batchOperations': string
  'settings.batchOperationsDesc': string
  'settings.openSourceLicense': string
  'settings.openSourceLicenseDesc': string
  'settings.usageHelp': string
  'settings.usageHelpDesc': string
  'settings.supportDeveloperDesc': string
  'settings.chromeStoreReview': string
  'settings.recommendToOthers': string
  'settings.contributeOnGitHub': string
  'settings.wechatDonationSupport': string
  'settings.scanToSupportDeveloper': string
  'settings.thankYou': string
  'settings.projectRepo': string
  'settings.versionInfo': string
  'settings.currentVersion': string
  'settings.releaseDate': string
  'settings.compatibility': string
  'settings.feedback': string
  'settings.feedbackDesc': string
  'settings.feedbackUrl': string

  // Messages
  'messages.saveSuccess': string
  'messages.saveError': string
  'messages.deleteSuccess': string
  'messages.deleteError': string
  'messages.deleteConfirm': string
  'messages.connectionSuccess': string
  'messages.connectionFailed': string
  'messages.loadingProducts': string
  'messages.loadingOrders': string
  'messages.noProducts': string
  'messages.noOrders': string
  'messages.noStores': string
  'messages.uploadSuccess': string
  'messages.uploadError': string
  'messages.uploadDisabled': string
  'messages.uploadRequireWordPress': string
  'messages.productTypeRestricted': string
  'messages.variableProductRequireWordPress': string
  'messages.groupedProductRequireWordPress': string
  'messages.advancedFeaturesRestricted': string
  'messages.upgradeToWordPressAuth': string
  'messages.networkError': string
  'messages.serverError': string
  'messages.invalidData': string
  'messages.permissionDenied': string
  'messages.operationCancelled': string
  'messages.selectProductsFirst': string
  'messages.batchPublishFailed': string
  'messages.batchUnpublishFailed': string
  'messages.batchDeleteFailed': string
  'messages.deleteConfirmBatch': string

  // Validation
  'validation.required': string
  'validation.minLength': string
  'validation.maxLength': string
  'validation.email': string
  'validation.url': string
  'validation.number': string
  'validation.positive': string
  'validation.integer': string

  // Pagination
  'pagination.page': string
  'pagination.total': string
  'pagination.pageSize': string
  'pagination.goTo': string
  'pagination.first': string
  'pagination.last': string
  'pagination.prev': string
  'pagination.next': string

  // Time
  'time.justNow': string
  'time.minutesAgo': string
  'time.hoursAgo': string
  'time.daysAgo': string
  'time.today': string
  'time.yesterday': string
  'time.thisWeek': string
  'time.lastWeek': string
  'time.thisMonth': string
  'time.lastMonth': string
}

// Chrome Extension Storage Types
export interface ChromeStorageData {
  stores: StoreConfig[]
  activeStore: string | null
  settings: {
    theme: 'default' | 'light' | 'dark'
    language: 'zh-CN' | 'zh-TW' | 'en-US'
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>