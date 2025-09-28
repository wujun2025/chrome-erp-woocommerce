import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material'
import { useTranslation } from '@/hooks/useTranslation'
import type { Product } from '@/types'

interface ProductViewDialogProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

export const ProductViewDialog: React.FC<ProductViewDialogProps> = ({
  open,
  onClose,
  product
}) => {
  const { t } = useTranslation()

  if (!product) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publish': return 'success'
      case 'draft': return 'default'
      case 'pending': return 'warning'
      case 'private': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'publish': return t('product.publish')
      case 'draft': return t('product.draft')
      case 'pending': return t('product.pending')
      case 'private': return t('product.private')
      default: return status
    }
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'instock': return 'success'
      case 'outofstock': return 'error'
      case 'onbackorder': return 'warning'
      default: return 'default'
    }
  }

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case 'instock': return t('product.inStock')
      case 'outofstock': return t('product.outOfStock')
      case 'onbackorder': return t('product.onBackorder')
      default: return status
    }
  }

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
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            {product.name}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip 
              label={getStatusLabel(product.status)} 
              color={getStatusColor(product.status)} 
              size="small" 
            />
            <Chip 
              label={getStockStatusLabel(product.stockStatus)} 
              color={getStockStatusColor(product.stockStatus)} 
              size="small" 
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* 基本信息 */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  基本信息
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>
                          商品ID
                        </TableCell>
                        <TableCell>{product.id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          SKU
                        </TableCell>
                        <TableCell>{product.sku || '未设置'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          商品类型
                        </TableCell>
                        <TableCell>
                          {product.type === 'simple' ? t('product.simple') :
                           product.type === 'variable' ? t('product.variable') :
                           product.type === 'grouped' ? t('product.grouped') :
                           product.type === 'external' ? t('product.external') : product.type}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          创建时间
                        </TableCell>
                        <TableCell>
                          {product.dateCreated ? new Date(product.dateCreated).toLocaleString() : '未知'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          修改时间
                        </TableCell>
                        <TableCell>
                          {product.dateModified ? new Date(product.dateModified).toLocaleString() : '未知'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {product.description && (
                  <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                      商品描述
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </Typography>
                  </Box>
                )}

                {product.shortDescription && (
                  <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                      简短描述
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <div dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 价格和库存 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  价格信息
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    {t('product.regularPrice')}: <strong>${product.regularPrice || 0}</strong>
                  </Typography>
                  {product.salePrice && product.salePrice > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      {t('product.salePrice')}: <strong>${product.salePrice}</strong>
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    {t('product.price')}: <strong>${product.price || 0}</strong>
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  库存信息
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  库存管理: {product.manageStock ? '启用' : '禁用'}
                </Typography>
                {product.manageStock && (
                  <Typography variant="body2" color="textSecondary">
                    库存数量: <strong>{product.stockQuantity || 0}</strong>
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  库存状态: <Chip 
                    label={getStockStatusLabel(product.stockStatus)} 
                    color={getStockStatusColor(product.stockStatus)} 
                    size="small" 
                  />
                </Typography>
              </CardContent>
            </Card>

            {/* 分类和标签 */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  分类标签
                </Typography>
                {product.categories && product.categories.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      分类:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {product.categories.map((category, index) => (
                        <Chip 
                          key={index} 
                          label={category.name} 
                          size="small" 
                          variant="outlined" 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {product.tags && product.tags.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      标签:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {product.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag.name} 
                          size="small" 
                          color="secondary" 
                          variant="outlined" 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 商品图片 */}
          {product.images && product.images.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    商品图片
                  </Typography>
                  <ImageList cols={6} rowHeight={200}>
                    {product.images.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image.src}
                          alt={image.alt || `商品图片 ${index + 1}`}
                          loading="lazy"
                          style={{ objectFit: 'cover' }}
                        />
                        <ImageListItemBar
                          title={index === 0 ? '主图' : `图片 ${index + 1}`}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* 尺寸重量信息 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  尺寸重量
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          重量
                        </TableCell>
                        <TableCell>{product.weight || '未设置'} kg</TableCell>
                      </TableRow>
                      {product.dimensions && (
                        <>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              长度
                            </TableCell>
                            <TableCell>{product.dimensions.length || '未设置'} cm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              宽度
                            </TableCell>
                            <TableCell>{product.dimensions.width || '未设置'} cm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              高度
                            </TableCell>
                            <TableCell>{product.dimensions.height || '未设置'} cm</TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 其他设置 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  其他设置
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          税务状态
                        </TableCell>
                        <TableCell>
                          {product.taxStatus === 'taxable' ? t('product.taxable') :
                           product.taxStatus === 'shipping' ? t('product.shippingOnly') :
                           product.taxStatus === 'none' ? t('product.none') : product.taxStatus || t('product.taxable')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          允许评论
                        </TableCell>
                        <TableCell>{product.reviewsAllowed ? '是' : '否'}</TableCell>
                      </TableRow>
                      {product.purchaseNote && (
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            购买备注
                          </TableCell>
                          <TableCell>{product.purchaseNote}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  )
}