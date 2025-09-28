import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishIcon
} from '@mui/icons-material'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { useProductState, useStoreConfig } from '@/store'
import { useTranslation } from '@/hooks/useTranslation'
import { apiService } from '@/services/api'
import type { Product, FilterParams } from '@/types'
import { ProductForm } from './ProductForm'
import { ProductViewDialog } from './ProductViewDialog'

export const ProductManagement: React.FC = () => {
  const { t } = useTranslation()
  const { activeStore, stores } = useStoreConfig()
  const { 
    products, 
    selectedProducts, 
    setProducts, 
    setSelectedProducts 
  } = useProductState()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalProducts, setTotalProducts] = useState(0)
  const [batchActionAnchor, setBatchActionAnchor] = useState<null | HTMLElement>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ open: false, title: '', message: '', onConfirm: () => {} })
  
  // Product Form State
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  
  // Product View State
  const [productViewOpen, setProductViewOpen] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

  const currentStore = stores.find(s => s.id === activeStore)

  const loadProducts = async (params?: FilterParams) => {
    if (!currentStore) {
      setError(t('messages.noStores'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      apiService.setStoreConfig(currentStore)
      const result = await apiService.getProducts({
        page,
        perPage: pageSize,
        search: searchTerm,
        ...params
      })

      if (result.success && result.data) {
        setProducts(result.data.data)
        setTotalProducts(result.data.total)
      } else {
        setError(result.error || t('messages.loadingProducts'))
      }
    } catch (error) {
      setError(t('messages.networkError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentStore) {
      loadProducts()
      loadCategories()
      loadTags()
    }
  }, [currentStore, page, pageSize])

  const loadCategories = async () => {
    try {
      apiService.setStoreConfig(currentStore!)
      const result = await apiService.getProductCategories()
      if (result.success && result.data) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadTags = async () => {
    try {
      apiService.setStoreConfig(currentStore!)
      const result = await apiService.getProductTags()
      if (result.success && result.data) {
        setTags(result.data)
      }
    } catch (error) {
      console.error('Failed to load tags:', error)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadProducts()
  }

  const handleRefresh = () => {
    loadProducts()
  }

  const handleDeleteProduct = async (productId: number) => {
    setConfirmDialog({
      open: true,
      title: t('common.delete'),
      message: t('messages.deleteConfirm'),
      onConfirm: async () => {
        try {
          const result = await apiService.deleteProduct(productId)
          if (result.success) {
            loadProducts()
          } else {
            setError(result.error || t('messages.deleteError'))
          }
        } catch (error) {
          setError(t('messages.deleteError'))
        }
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product)
    setProductViewOpen(true)
  }

  const handleCloseViewProduct = () => {
    setProductViewOpen(false)
    setViewingProduct(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductFormOpen(true)
  }

  const handlePublishProduct = async (product: Product) => {
    try {
      setLoading(true)
      apiService.setStoreConfig(currentStore!)
      
      const result = await apiService.updateProduct(product.id!, {
        status: 'publish'
      })
      
      if (result.success) {
        loadProducts() // 重新加载商品列表
        setError(null)
      } else {
        setError(result.error || t('messages.saveError'))
      }
    } catch (error) {
      setError(t('messages.saveError'))
    } finally {
      setLoading(false)
    }
  }

  const handleUnpublishProduct = async (product: Product) => {
    try {
      setLoading(true)
      apiService.setStoreConfig(currentStore!)
      
      const result = await apiService.updateProduct(product.id!, {
        status: 'draft'
      })
      
      if (result.success) {
        loadProducts() // 重新加载商品列表
        setError(null)
      } else {
        setError(result.error || t('messages.saveError'))
      }
    } catch (error) {
      setError(t('messages.saveError'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setProductFormOpen(true)
  }

  const handleProductFormClose = () => {
    setProductFormOpen(false)
    setEditingProduct(null)
  }

  const handleProductSave = async (productData: Partial<Product>) => {
    setLoading(true)
    setError(null)
    
    // 打印调试信息
    console.log('ProductManagement - handleProductSave called with:', {
      id: editingProduct?.id,
      name: productData.name,
      price: productData.price,
      regularPrice: productData.regularPrice,
      salePrice: productData.salePrice
    })
    
    try {
      apiService.setStoreConfig(currentStore!)
      
      let result
      if (editingProduct) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct.id)
        result = await apiService.updateProduct(editingProduct.id!, productData)
        console.log('Update result:', result)
      } else {
        // Create new product
        console.log('Creating new product')
        result = await apiService.createProduct(productData as Omit<Product, 'id'>)
        console.log('Create result:', result)
      }
      
      if (result.success) {
        console.log('Product save successful, reloading products')
        handleProductFormClose()
        loadProducts() // Reload products list
        setError(null)
      } else {
        console.error('Product save failed:', result.error)
        setError(result.error || (editingProduct ? t('messages.saveError') : t('messages.saveError')))
      }
    } catch (error) {
      console.error('Product save exception:', error)
      setError(editingProduct ? t('messages.saveError') : t('messages.saveError'))
    } finally {
      setLoading(false)
    }
  }

  const handleBatchAction = (event: React.MouseEvent<HTMLElement>) => {
    setBatchActionAnchor(event.currentTarget)
  }

  const handleBatchPublish = async () => {
    setBatchActionAnchor(null)
    if (selectedProducts.length === 0) {
      setError(t('messages.selectProductsFirst'))
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      apiService.setStoreConfig(currentStore!)
      
      // 构建批量更新操作
      const updateData = selectedProducts.map(product => ({
        id: product.id!,
        status: 'publish' as const
      }))
      
      const result = await apiService.batchProducts({
        update: updateData
      })
      
      if (result.success) {
        await loadProducts() // 重新加载商品列表
        setSelectedProducts([]) // 清空选择
        setError(null)
      } else {
        setError(result.error || t('messages.batchPublishFailed'))
      }
    } catch (error) {
      console.error('Batch publish error:', error)
      setError(t('messages.batchPublishFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleBatchUnpublish = async () => {
    setBatchActionAnchor(null)
    if (selectedProducts.length === 0) {
      setError(t('messages.selectProductsFirst'))
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      apiService.setStoreConfig(currentStore!)
      
      // 构建批量更新操作
      const updateData = selectedProducts.map(product => ({
        id: product.id!,
        status: 'draft' as const
      }))
      
      const result = await apiService.batchProducts({
        update: updateData
      })
      
      if (result.success) {
        await loadProducts() // 重新加载商品列表
        setSelectedProducts([]) // 清空选择
        setError(null)
      } else {
        setError(result.error || t('messages.batchUnpublishFailed'))
      }
    } catch (error) {
      console.error('Batch unpublish error:', error)
      setError(t('messages.batchUnpublishFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleBatchDelete = async () => {
    setBatchActionAnchor(null)
    if (selectedProducts.length === 0) {
      setError(t('messages.selectProductsFirst'))
      return
    }

    setConfirmDialog({
      open: true,
      title: t('batch.delete'),
      message: t('messages.deleteConfirmBatch', { count: selectedProducts.length }),
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }))
        setLoading(true)
        setError(null)
        
        try {
          apiService.setStoreConfig(currentStore!)
          
          // 构建批量删除操作
          const deleteIds = selectedProducts.map(product => product.id!)
          
          const result = await apiService.batchProducts({
            delete: deleteIds
          })
          
          if (result.success) {
            await loadProducts() // 重新加载商品列表
            setSelectedProducts([]) // 清空选择
            setError(null)
          } else {
            setError(result.error || t('messages.batchDeleteFailed'))
          }
        } catch (error) {
          console.error('Batch delete error:', error)
          setError(t('messages.batchDeleteFailed'))
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      type: 'number',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'images',
      headerName: t('product.image'),
      width: 80,
      renderCell: (params) => {
        const images = params.value as Product['images']
        const mainImage = images && images.length > 0 ? images[0] : null
        return mainImage ? (
          <img 
            src={mainImage.src} 
            alt={mainImage.alt || ''} 
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
        ) : null
      },
      sortable: false,
      filterable: false
    },
    {
      field: 'name',
      headerName: t('product.name'),
      width: 200,
      flex: 1
    },
    {
      field: 'sku',
      headerName: t('product.sku'),
      width: 120
    },
    {
      field: 'type',
      headerName: t('product.type'),
      width: 120,
      renderCell: (params) => {
        const type = params.value as string
        const label = type === 'simple' ? t('product.simple') :
                     type === 'variable' ? t('product.variable') :
                     type === 'grouped' ? t('product.grouped') :
                     type === 'external' ? t('product.external') : type
        return <Chip label={label} size="small" variant="outlined" />
      }
    },
    {
      field: 'price',
      headerName: t('product.price'),
      width: 100,
      type: 'number',
      renderCell: (params) => `$${params.value}`,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'stockQuantity',
      headerName: t('product.stock'),
      width: 100,
      type: 'number',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'stockStatus',
      headerName: t('product.stockStatus'),
      width: 120,
      renderCell: (params) => {
        const status = params.value as string
        const color = status === 'instock' ? 'success' : 
                     status === 'outofstock' ? 'error' : 'warning'
        const label = status === 'instock' ? t('product.inStock') :
                     status === 'outofstock' ? t('product.outOfStock') : t('product.onBackorder')
        return <Chip label={label} color={color} size="small" />
      }
    },
    {
      field: 'status',
      headerName: t('product.status'),
      width: 120,
      renderCell: (params) => {
        const status = params.value as string
        const color = status === 'publish' ? 'success' : 
                     status === 'draft' ? 'default' : 'warning'
        const label = status === 'publish' ? t('product.publish') :
                     status === 'draft' ? t('product.draft') :
                     status === 'pending' ? t('product.pending') : t('product.private')
        return <Chip label={label} color={color} size="small" />
      }
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('product.viewDetails')}>
            <IconButton 
              size="small" 
              onClick={() => handleViewProduct(params.row)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.edit')}>
            <IconButton 
              size="small" 
              onClick={() => handleEditProduct(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === 'publish' ? (
            <Tooltip title={t('product.unpublish')}>
              <IconButton 
                size="small" 
                onClick={() => handleUnpublishProduct(params.row)}
                color="warning"
              >
                <UnpublishIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={t('product.publish')}>
              <IconButton 
                size="small" 
                onClick={() => handlePublishProduct(params.row)}
                color="success"
              >
                <PublishIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('product.deleteProduct')}>
            <IconButton 
              size="small" 
              onClick={() => handleDeleteProduct(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    const selectedProductIds = selection as number[]
    const selected = products.filter(p => selectedProductIds.includes(p.id!))
    setSelectedProducts(selected)
  }

  if (!currentStore) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">
            {t('messages.noStores')}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
          {t('product.title')}
        </Typography>
        <Box display="flex" gap={0.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => {/* TODO: 实现筛选功能 */}}
            sx={{ 
              minWidth: 'auto', 
              px: 1, 
              py: 0.5,
              fontSize: '0.7rem',
              borderRadius: '4px'
            }}
          >
            {t('common.filter')}
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
            onClick={handleCreateProduct}
            sx={{ 
              minWidth: 'auto', 
              px: 1, 
              py: 0.5,
              fontSize: '0.7rem',
              borderRadius: '4px'
            }}
          >
            {t('product.createNew')}
          </Button>
        </Box>
      </Box>

      {/* Search and Actions Bar */}
      <Card sx={{ mb: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ py: 1, px: 1.5 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('filter.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />,
                  sx: { fontSize: '0.8rem' }
                }}
                sx={{ fontSize: '0.8rem' }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={handleSearch}
                disabled={loading}
                sx={{ py: 0.5, px: 1, fontSize: '0.7rem' }}
              >
                {t('common.search')}
              </Button>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{ py: 0.5, px: 1, fontSize: '0.7rem' }}
              >
                {t('common.refresh')}
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={0.5}>
                {selectedProducts.length > 0 && (
                  <>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                      {t('batch.selectedCount', { count: selectedProducts.length })}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<MoreIcon sx={{ fontSize: '1rem' }} />}
                      onClick={handleBatchAction}
                      sx={{ 
                        minWidth: 'auto', 
                        px: 1, 
                        py: 0.5,
                        fontSize: '0.7rem'
                      }}
                    >
                      {t('product.batchActions')}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 1, py: 0.5, px: 1 }}>
          {error}
        </Alert>
      )}

      {/* Products Data Grid */}
      <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={products}
            columns={columns}
            loading={loading}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={handleSelectionChange}
            paginationModel={{ page: page - 1, pageSize }}
            onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
              if (newPageSize !== pageSize) {
                setPageSize(newPageSize)
                setPage(1)
              } else {
                setPage(newPage + 1)
              }
            }}
            rowCount={totalProducts}
            paginationMode="server"
            pageSizeOptions={[10, 20, 50]}
            sx={{
              border: 'none',
              height: 400,
              '& .MuiDataGrid-cell': {
                borderColor: 'divider',
                fontSize: '0.75rem',
                py: 0.5
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'grey.50',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid',
                borderColor: 'divider'
              },
              '& .MuiTablePagination-displayedRows': {
                fontSize: '0.75rem'
              },
              '& .MuiTablePagination-selectLabel': {
                fontSize: '0.75rem'
              },
              '& .MuiTablePagination-toolbar': {
                minHeight: 36
              }
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'desc' }]
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Summary */}
      <Box mt={1}>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '0.7rem' }}>
          {t('pagination.total', { current: (page - 1) * pageSize + 1, total: Math.min(page * pageSize, totalProducts), all: totalProducts })}
        </Typography>
      </Box>

      {/* Batch Actions Menu */}
      <Menu
        anchorEl={batchActionAnchor}
        open={Boolean(batchActionAnchor)}
        onClose={() => setBatchActionAnchor(null)}
        sx={{ '& .MuiMenuItem-root': { fontSize: '0.8rem', py: 0.5, px: 1 } }}
      >
        <MenuItem onClick={handleBatchPublish}>
          <PublishIcon sx={{ mr: 1, fontSize: '1rem' }} />
          {t('batch.publish')}
        </MenuItem>
        <MenuItem onClick={handleBatchUnpublish}>
          <UnpublishIcon sx={{ mr: 1, fontSize: '1rem' }} />
          {t('batch.unpublish')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleBatchDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
          {t('batch.delete')}
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, pt: 1.5, px: 1.5, fontSize: '1rem' }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 1 }}>
          <Typography sx={{ fontSize: '0.9rem' }}>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ pt: 1, pb: 1.5, px: 1.5 }}>
          <Button 
            onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            size="small"
            sx={{ fontSize: '0.8rem' }}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={confirmDialog.onConfirm} 
            color="error" 
            variant="contained"
            size="small"
            sx={{ fontSize: '0.8rem' }}
          >
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Form Dialog */}
      <ProductForm
        open={productFormOpen}
        onClose={handleProductFormClose}
        onSave={handleProductSave}
        product={editingProduct}
        categories={categories}
        tags={tags}
      />

      {/* Product View Dialog */}
      <ProductViewDialog
        open={productViewOpen}
        onClose={handleCloseViewProduct}
        product={viewingProduct}
      />
    </Box>
  )
}