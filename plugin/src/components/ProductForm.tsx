import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Lock as LockIcon
} from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { useStoreConfig } from '@/store'
import { apiService } from '@/services/api'
import { ProductVariations } from '@/components/ProductVariations'
import type { Product, ProductCategory, ProductTag, ProductImage } from '@/types'
import type { ProductDimensions } from '@/types'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

interface ProductFormProps {
  open: boolean
  onClose: () => void
  onSave: (product: Partial<Product>) => void
  product?: Product | null
  categories?: ProductCategory[]
  tags?: ProductTag[]
}

export const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSave,
  product,
  categories = [],
  tags = []
}) => {
  const { t } = useTranslation()
  const { activeStore, stores } = useStoreConfig()
  const [tabValue, setTabValue] = useState(0)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    regularPrice: 0,
    salePrice: 0,
    sku: '',
    stockQuantity: 0,
    manageStock: true,
    stockStatus: 'instock',
    status: 'draft',
    type: 'simple',
    categories: [],
    tags: [],
    images: [],
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    taxStatus: 'taxable',
    reviewsAllowed: true
  })
  
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([])
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Get current store configuration
  const currentStore = stores.find(s => s.id === activeStore)
  const isWordPressAuth = currentStore?.authType === 'wordpress'
  const canUploadImages = isWordPressAuth
  const canManageAdvancedProducts = isWordPressAuth

  useEffect(() => {
    if (product) {
      console.log('Editing product:', {
        id: product.id,
        name: product.name,
        price: product.price,
        regularPrice: product.regularPrice,
        salePrice: product.salePrice,
        priceTypes: {
          price: typeof product.price,
          regularPrice: typeof product.regularPrice,
          salePrice: typeof product.salePrice
        }
      })
      
      setFormData({
        ...product,
        dimensions: product.dimensions || { length: '', width: '', height: '' },
        // 确保价格字段正确转换
        price: Number(product.price) || 0,
        regularPrice: Number(product.regularPrice) || 0,
        salePrice: Number(product.salePrice) || 0,
        // 确保库存状态和税务状态正确设置
        stockStatus: product.stockStatus || 'instock',
        taxStatus: product.taxStatus || 'taxable'
      })
      setSelectedCategories(product.categories || [])
      setSelectedTags(product.tags || [])
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        price: 0,
        regularPrice: 0,
        salePrice: 0,
        sku: '',
        stockQuantity: 0,
        manageStock: true,
        stockStatus: 'instock',
        status: 'draft',
        type: 'simple',
        categories: [],
        tags: [],
        images: [],
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: ''
        },
        taxStatus: 'taxable',
        reviewsAllowed: true
      })
      setSelectedCategories([])
      setSelectedTags([])
    }
  }, [product, open])

  const handleInputChange = (field: keyof Product, value: any) => {
    // 检查商品类型限制
    if (field === 'type' && !canManageAdvancedProducts) {
      if (value === 'variable' || value === 'grouped') {
        setError(t('messages.productTypeRestricted'))
        return
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDimensionChange = (dimension: 'length' | 'width' | 'height', value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      } as ProductDimensions
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Check if WordPress authentication is available
    if (!canUploadImages) {
      setError(t('messages.uploadRequireWordPress'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const uploadPromises = Array.from(files).map(file => apiService.uploadImage(file))
      const results = await Promise.all(uploadPromises)
      
      const newImages: ProductImage[] = results
        .filter(result => result.success && result.data)
        .map((result, index) => ({
          id: result.data!.id,
          src: result.data!.source_url,
          alt: result.data!.alt_text,
          name: result.data!.title.rendered,
          position: (formData.images?.length || 0) + index
        }))

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }))
    } catch (error) {
      setError(t('messages.uploadError'))
    } finally {
      setLoading(false)
    }
  }

  const handleImageDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSave = () => {
    if (!formData.name || !formData.sku) {
      setError(t('validation.required'))
      return
    }

    // 处理价格字段 - 根据WooCommerce REST API文档，price字段由regular_price和sale_price自动计算
    // 我们只需要提供regularPrice和salePrice，不要手动设置price字段
    const regularPrice = Number(formData.regularPrice) || 0
    const salePrice = Number(formData.salePrice) || 0

    // 构建产品数据，按照我们的Product类型结构，然后在API层进行字段映射
    const productData: Partial<Product> = {
      ...formData,
      categories: selectedCategories,
      tags: selectedTags,
      // 使用我们的Product类型字段名，API层会处理到WooCommerce API格式的映射
      regularPrice: regularPrice,
      salePrice: salePrice, // 保持原值，包括0
      stockQuantity: Number(formData.stockQuantity) || 0,
      manageStock: formData.manageStock || false,
      stockStatus: formData.stockStatus || 'instock',
      taxStatus: formData.taxStatus || 'taxable'
      // 不设置price字段，让WooCommerce根据regularPrice和salePrice自动计算
    }

    // 打印调试信息
    console.log('Saving product data:', {
      name: productData.name,
      regularPrice: productData.regularPrice,
      salePrice: productData.salePrice,
      stockQuantity: productData.stockQuantity,
      manageStock: productData.manageStock,
      stockStatus: productData.stockStatus,
      note: 'price字段将由WooCommerce根据regularPrice和salePrice自动计算'
    })

    onSave(productData)
    onClose()
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const productTypes = [
    { value: 'simple', label: t('product.simple') },
    { 
      value: 'grouped', 
      label: t('product.grouped'),
      disabled: !canManageAdvancedProducts,
      tooltip: !canManageAdvancedProducts ? t('messages.groupedProductRequireWordPress') : undefined
    },
    { 
      value: 'external', 
      label: t('product.external')
    },
    { 
      value: 'variable', 
      label: t('product.variable'),
      disabled: !canManageAdvancedProducts,
      tooltip: !canManageAdvancedProducts ? t('messages.variableProductRequireWordPress') : undefined
    }
  ]

  const productStatuses = [
    { value: 'draft', label: t('product.draft') },
    { value: 'pending', label: t('product.pending') },
    { value: 'private', label: t('product.private') },
    { value: 'publish', label: t('product.publish') }
  ]

  const stockStatuses = [
    { value: 'instock', label: t('product.inStock') },
    { value: 'outofstock', label: t('product.outOfStock') },
    { value: 'onbackorder', label: t('product.onBackorder') }
  ]

  const taxStatuses = [
    { value: 'taxable', label: t('product.taxable') },
    { value: 'shipping', label: t('product.shippingOnly') },
    { value: 'none', label: t('product.none') }
  ]

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth 
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle>
        {product ? t('product.editProduct') : t('product.createNew')}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('product.basicInfo')} />
            <Tab label={t('product.inventoryAndPricing')} />
            <Tab label={t('product.images')} />
            {(formData.type === 'variable' || formData.type === 'grouped') && (
              <Tab label={formData.type === 'variable' ? t('product.variations') : t('product.groupedProducts')} />
            )}
            <Tab label={t('product.shippingInfo')} />
            <Tab label={t('product.advancedOptions')} />
          </Tabs>
        </Box>

        {/* Basic Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('product.name')}
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('product.sku')}
                value={formData.sku || ''}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('product.type')}</InputLabel>
                <Select
                  value={formData.type || 'simple'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  label={t('product.type')}
                >
                  {productTypes.map(type => (
                    <MenuItem 
                      key={type.value} 
                      value={type.value}
                      disabled={type.disabled}
                      title={type.tooltip}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                        <span style={{ 
                          color: type.disabled ? 'text.disabled' : 'inherit',
                          opacity: type.disabled ? 0.6 : 1 
                        }}>
                          {type.label}
                        </span>
                        {type.disabled && (
                          <LockIcon 
                            fontSize="small" 
                            sx={{ 
                              color: 'text.disabled', 
                              ml: 1 
                            }} 
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {!canManageAdvancedProducts && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    {t('messages.advancedFeaturesRestricted')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {t('messages.upgradeToWordPressAuth')}
                  </Typography>
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('product.description')}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('product.shortDescription')}
                value={formData.shortDescription || ''}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={categories}
                getOptionLabel={(option) => option.name}
                value={selectedCategories}
                onChange={(_, newValue) => setSelectedCategories(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('product.category')}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={tags}
                getOptionLabel={(option) => option.name}
                value={selectedTags}
                onChange={(_, newValue) => setSelectedTags(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('product.tag')}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('product.status')}</InputLabel>
                <Select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label={t('product.status')}
                >
                  {productStatuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Inventory & Pricing Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('product.regularPrice')}
                value={formData.regularPrice === 0 ? '' : formData.regularPrice}
                onChange={(e) => {
                  const value = e.target.value
                  const numValue = value === '' ? 0 : Number(value)
                  if (!isNaN(numValue)) {
                    handleInputChange('regularPrice', numValue)
                  }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                inputProps={{
                  step: "0.01",
                  min: "0"
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('product.salePrice')}
                value={formData.salePrice === 0 ? '' : formData.salePrice}
                onChange={(e) => {
                  const value = e.target.value
                  const numValue = value === '' ? 0 : Number(value)
                  if (!isNaN(numValue)) {
                    handleInputChange('salePrice', numValue)
                  }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                inputProps={{
                  step: "0.01",
                  min: "0"
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.manageStock || false}
                    onChange={(e) => handleInputChange('manageStock', e.target.checked)}
                  />
                }
                label={t('product.manageStock')}
              />
            </Grid>

            {formData.manageStock && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('product.stockQuantity')}
                  value={formData.stockQuantity === 0 ? '' : formData.stockQuantity}
                  onChange={(e) => {
                    const value = e.target.value
                    const numValue = value === '' ? 0 : Number(value)
                    if (!isNaN(numValue) && numValue >= 0) {
                      handleInputChange('stockQuantity', Math.floor(numValue))
                    }
                  }}
                  inputProps={{
                    min: "0",
                    step: "1"
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('product.stockStatus')}</InputLabel>
                <Select
                  value={formData.stockStatus || 'instock'}
                  onChange={(e) => handleInputChange('stockStatus', e.target.value)}
                  label={t('product.stockStatus')}
                >
                  {stockStatuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('product.taxStatus')}</InputLabel>
                <Select
                  value={formData.taxStatus || 'taxable'}
                  onChange={(e) => handleInputChange('taxStatus', e.target.value)}
                  label={t('product.taxStatus')}
                >
                  {taxStatuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Product Images Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{t('product.images')}</Typography>
              {canUploadImages ? (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  disabled={loading}
                >
                  {t('common.upload')}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  disabled
                  startIcon={<UploadIcon />}
                >
                  {t('common.upload')}
                </Button>
              )}
            </Box>

            {!canUploadImages && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {t('messages.uploadRequireWordPress')}
                </Typography>
              </Alert>
            )}

            {formData.images && formData.images.length > 0 ? (
              <ImageList cols={4} rowHeight={200}>
                {formData.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image.src}
                      alt={image.alt || `Product image ${index + 1}`}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                    <ImageListItemBar
                      title={index === 0 ? t('product.mainImage') : `Image ${index + 1}`}
                      actionIcon={
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          onClick={() => handleImageDelete(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight={200}
                border="2px dashed"
                borderColor={canUploadImages ? "grey.300" : "grey.200"}
                borderRadius={1}
                sx={{
                  backgroundColor: canUploadImages ? "transparent" : "grey.50"
                }}
              >
                <Typography color={canUploadImages ? "textSecondary" : "text.disabled"} gutterBottom>
                  {t('product.noImages')}
                </Typography>
                {canUploadImages ? (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddIcon />}
                  >
                    {t('product.addImage')}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    {t('messages.uploadDisabled')}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Variable/Grouped Product Tab */}
        {(formData.type === 'variable' || formData.type === 'grouped') && (
          <TabPanel value={tabValue} index={3}>
            <Box>
              {formData.type === 'variable' ? (
                <ProductVariations 
                  product={{
                    ...formData,
                    id: product?.id,
                    categories: selectedCategories,
                    tags: selectedTags
                  } as Product}
                />
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('product.combinedProductManagement')}
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {t('product.combinedProductDescription')}
                    </Typography>
                  </Alert>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('product.subProductSettings')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t('product.selectProductsForCombination')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center" 
                        justifyContent="center" 
                        minHeight={200}
                        border="2px dashed"
                        borderColor="grey.300"
                        borderRadius={1}
                        sx={{ backgroundColor: "grey.50" }}
                      >
                        <Typography color="textSecondary" gutterBottom>
                          {t('product.combinedProductFeatureDevelopment')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {t('product.combinedProductFeatureSupport')}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </TabPanel>
        )}

        {/* Shipping Information Tab */}
        <TabPanel value={tabValue} index={formData.type === 'variable' || formData.type === 'grouped' ? 4 : 3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('product.weight')}
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t('product.dimensions')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('product.length')}
                value={formData.dimensions?.length || ''}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('product.width')}
                value={formData.dimensions?.width || ''}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('product.height')}
                value={formData.dimensions?.height || ''}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Advanced Options Tab */}
        <TabPanel value={tabValue} index={formData.type === 'variable' || formData.type === 'grouped' ? 5 : 4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.reviewsAllowed || false}
                    onChange={(e) => handleInputChange('reviewsAllowed', e.target.checked)}
                  />
                }
                label={t('product.reviewsAllowed')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('product.purchaseNote')}
                value={formData.purchaseNote || ''}
                onChange={(e) => handleInputChange('purchaseNote', e.target.value)}
                placeholder={t('product.purchaseNotePlaceholder')}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
        >
          {loading ? t('common.loading') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}