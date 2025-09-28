import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete
} from '@mui/material'
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon
} from '@mui/icons-material'
import { useStoreConfig } from '@/store'
import { apiService } from '@/services/api'
import { ApiDebugger } from '@/utils/apiDebugger'
import type { 
  Product, 
  ProductAttribute
} from '@/types'

interface ProductVariationsProps {
  product: Product
}

export const ProductVariations: React.FC<ProductVariationsProps> = ({
  product
}) => {
  const { activeStore, stores } = useStoreConfig()
  
  const [attributes, setAttributes] = useState<ProductAttribute[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Dialog states
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState<ProductAttribute | null>(null)
  
  // Form data
  const [attributeFormData, setAttributeFormData] = useState<Partial<ProductAttribute>>({
    name: '',
    visible: true,
    variation: true,
    options: []
  })

  // Get current store configuration
  const currentStore = stores.find(s => s.id === activeStore)
  const canManageVariations = currentStore?.authType === 'wordpress'

  // Load data when product changes
  useEffect(() => {
    if (product.id && product.type === 'variable') {
      loadAttributes()
    }
  }, [product.id])

  const loadAttributes = async () => {
    setLoading(true)
    
    try {
      if (currentStore) {
        apiService.setStoreConfig(currentStore)
        const result = await apiService.getProductAttributes()
        
        if (result.success && result.data) {
          setAttributes(result.data)
        } else {
          setError(result.error || 'Failed to load attributes')
        }
      }
    } catch (error) {
      setError('Failed to load attributes')
      console.error('Load attributes error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAttribute = () => {
    if (!canManageVariations) {
      setError('变体商品功能需要WordPress应用密码认证方式')
      return
    }
    
    setEditingAttribute(null)
    setAttributeFormData({
      name: '',
      type: 'select',
      visible: true,
      variation: true,
      orderBy: 'menu_order',
      hasArchives: false,
      options: []
    })
    setAttributeDialogOpen(true)
  }

  const handleSaveAttribute = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 详细的诊断信息
      console.log('=== 属性保存诊断开始 ===')
      console.log('1. 当前活跃店铺ID:', activeStore)
      console.log('2. 找到的店铺配置:', currentStore)
      console.log('3. 所有店铺列表:', stores)
      console.log('4. 属性表单数据:', attributeFormData)
      
      // 检查活跃店铺配置
      if (!currentStore) {
        console.error('❌ 错误：没有活跃的店铺配置')
        setError('请先在店铺管理中选择一个活跃的店铺')
        return
      }
      
      // 检查店铺URL
      if (!currentStore.url) {
        console.error('❌ 错误：店铺URL为空')
        setError('店铺URL配置错误，请检查店铺设置')
        return
      }
      
      // 检查认证信息
      if (currentStore.authType === 'wordpress') {
        if (!currentStore.credentials.username || !currentStore.credentials.password) {
          console.error('❌ 错误：WordPress认证信息不完整')
          setError('WordPress用户名或密码未配置，请检查店铺认证设置')
          return
        }
        console.log('✅ WordPress认证信息完整')
      } else if (currentStore.authType === 'woocommerce') {
        if (!currentStore.credentials.consumerKey || !currentStore.credentials.consumerSecret) {
          console.error('❌ 错误：WooCommerce认证信息不完整')
          setError('WooCommerce Consumer Key或Consumer Secret未配置，请检查店铺认证设置')
          return
        }
        console.log('✅ WooCommerce认证信息完整')
      }
      
      // 检查必需字段
      if (!attributeFormData.name || attributeFormData.name.trim() === '') {
        console.error('❌ 错误：属性名称为空')
        setError('请填写属性名称')
        return
      }
      
      console.log('✅ 所有检查通过，开始设置API配置')
      console.log('店铺配置详情:', {
        url: currentStore.url,
        authType: currentStore.authType,
        hasCredentials: currentStore.authType === 'wordpress' 
          ? !!(currentStore.credentials.username && currentStore.credentials.password)
          : !!(currentStore.credentials.consumerKey && currentStore.credentials.consumerSecret)
      })
      
      apiService.setStoreConfig(currentStore)
      
      let result
      if (editingAttribute && editingAttribute.id) {
        // Update existing attribute
        console.log('更新现有属性, ID:', editingAttribute.id)
        result = await apiService.updateProductAttribute(
          editingAttribute.id, 
          attributeFormData
        )
      } else {
        // 直接使用WooCommerce API创建属性（绕过WordPress API检查）
        console.log('检测到WordPress API权限问题，直接使用WooCommerce API')
        console.log('创建新属性，数据:', attributeFormData)
        
        result = await apiService.createProductAttribute(
          attributeFormData as Omit<ProductAttribute, 'id'>
        )
      }
      
      console.log('API调用结果:', result)
      
      if (result.success && result.data) {
        console.log('✅ 属性操作成功:', result.data)
        
        // 如果是新属性且有选项，创建属性术语
        if (!editingAttribute && attributeFormData.options && attributeFormData.options.length > 0 && result.data.id) {
          console.log('开始创建属性术语:', attributeFormData.options)
          
          // 批量创建属性术语
          const termPromises = attributeFormData.options.map(option => 
            apiService.createProductAttributeTerm(result.data!.id!, {
              name: option,
              slug: option.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            })
          )
          
          try {
            const termResults = await Promise.allSettled(termPromises)
            const failedTerms = termResults.filter(r => r.status === 'rejected')
            
            if (failedTerms.length > 0) {
              console.warn('部分术语创建失败:', failedTerms)
              setError(`属性创建成功，但部分选项创建失败：${failedTerms.length}/${attributeFormData.options.length}`)
            } else {
              console.log('✅ 所有术语创建成功')
            }
          } catch (termError) {
            console.error('术语创建过程出错:', termError)
            setError('属性创建成功，但选项创建失败')
          }
        }
        
        setAttributeDialogOpen(false)
        loadAttributes() // Reload attributes
      } else {
        console.error('❌ 属性操作失败:', result.error)
        setError(result.error || 'Failed to save attribute')
      }
    } catch (error) {
      console.error('❌ 属性保存过程发生异常:', error)
      
      // 提供更详细的错误信息
      if (error instanceof Error) {
        console.error('错误详情:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        setError(`保存属性失败: ${error.message}`)
      } else {
        console.error('未知错误类型:', typeof error, error)
        setError('保存属性失败: 发生未知错误')
      }
    } finally {
      console.log('=== 属性保存诊断结束 ===')
      setLoading(false)
    }
  }

  if (product.type !== 'variable') {
    return (
      <Alert severity="info">
        只有变体商品才能管理变体。请先将商品类型设置为"可变商品"。
      </Alert>
    )
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 调试信息面板 */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>调试信息:</strong><br/>
            活跃店铺ID: {activeStore || '未设置'}<br/>
            店铺配置: {currentStore ? '已找到' : '未找到'}<br/>
            {currentStore && (
              <>
                店铺URL: {currentStore.url}<br/>
                认证方式: {currentStore.authType}<br/>
                认证状态: {currentStore.authType === 'wordpress' 
                  ? (currentStore.credentials.username && currentStore.credentials.password ? '完整' : '不完整')
                  : (currentStore.credentials.consumerKey && currentStore.credentials.consumerSecret ? '完整' : '不完整')
                }
              </>
            )}
          </Typography>
        </Alert>
      )}

      {/* 属性管理 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">商品属性</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {!canManageVariations && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LockIcon fontSize="small" />
                  <Typography variant="body2">
                    <strong>功能限制：</strong>变体商品管理需要WordPress应用密码认证
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  当前使用WooCommerce API认证，只能管理简单商品和外部商品。要使用变体商品功能，请切换到WordPress应用密码认证方式。
                </Typography>
              </Alert>
            )}
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  属性定义了变体商品的可变选项，如颜色、尺寸等。创建的属性是全局属性，可以在多个商品中使用。
                </Typography>
              </Grid>
              <Box display="flex" gap={1}>
                {currentStore && (
                  <>
                    <Button
                      variant="text"
                      size="small"
                      onClick={async () => {
                        setLoading(true)
                        setError(null)
                        
                        try {
                          console.log('🔍 开始全面健康检查')
                          const healthCheck = await ApiDebugger.performHealthCheck(currentStore)
                          const testResult = await ApiDebugger.testAttributeCreation(currentStore)
                          
                          const report = ApiDebugger.generateDiagnosticReport(healthCheck, testResult)
                          console.log(report)
                          
                          if (healthCheck.overall && testResult.success) {
                            setError('✅ 所有测试通过！API工作正常')
                            setTimeout(() => setError(null), 5000)
                          } else {
                            setError('❌ 检测到问题，请查看控制台的详细诊断报告')
                          }
                        } catch (error) {
                          console.error('❌ 诊断过程异常:', error)
                          setError(`❌ 诊断异常: ${error instanceof Error ? error.message : '未知错误'}`)
                        } finally {
                          setLoading(false)
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? '诊断中...' : '完整诊断'}
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={async () => {
                        setLoading(true)
                        setError(null)
                        
                        try {
                          console.log('🔍 开始测试连接:', currentStore.url)
                          apiService.setStoreConfig(currentStore)
                          const result = await apiService.testConnection()
                          
                          console.log('🔍 测试结果:', result)
                          
                          if (result.success) {
                            setError(null)
                            // 显示成功消息
                            setError('✅ 连接测试成功!')
                            // 3秒后清除成功消息
                            setTimeout(() => setError(null), 3000)
                          } else {
                            setError(`❌ 连接测试失败: ${result.error}`)
                          }
                        } catch (error) {
                          console.error('❌ 测试连接异常:', error)
                          setError(`❌ 测试连接异常: ${error instanceof Error ? error.message : '未知错误'}`)
                        } finally {
                          setLoading(false)
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? '测试中...' : '测试连接'}
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  startIcon={canManageVariations ? <AddIcon /> : <LockIcon />}
                  onClick={handleCreateAttribute}
                  size="small"
                  disabled={!currentStore || !canManageVariations}
                  title={!canManageVariations ? '变体商品功能需要WordPress应用密码认证' : ''}
                >
                  {canManageVariations ? '添加属性' : '功能限制'}
                </Button>
              </Box>
            </Box>
            
            {attributes.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {attributes.map(attr => (
                  <Chip
                    key={attr.id}
                    label={`${attr.name} (${attr.options?.length || 0} 个选项)`}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  暂无属性。由于服务器问题，建议您：
                </Typography>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>应急解决方案：</strong><br/>
                    1. 在WordPress后台手动创建产品属性<br/>
                    2. 然后点击下方的"刷新属性"按钮<br/>
                    3. 或联系网站管理员修复服务器问题
                  </Typography>
                </Alert>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => window.open(`${currentStore?.url}/wp-admin/edit.php?post_type=product&page=product_attributes`, '_blank')}
                    disabled={!currentStore}
                  >
                    在WordPress后台创建属性
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={loadAttributes}
                    disabled={loading}
                  >
                    {loading ? '刷新中...' : '刷新属性'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 属性创建/编辑对话框 */}
      <Dialog 
        open={attributeDialogOpen} 
        onClose={() => setAttributeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAttribute ? '编辑属性' : '创建属性'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="属性名称"
                value={attributeFormData.name || ''}
                onChange={(e) => setAttributeFormData({
                  ...attributeFormData,
                  name: e.target.value
                })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>属性类型</InputLabel>
                <Select
                  value={attributeFormData.type || 'select'}
                  label="属性类型"
                  onChange={(e) => setAttributeFormData({
                    ...attributeFormData,
                    type: e.target.value as 'select' | 'text' | 'number'
                  })}
                >
                  <MenuItem value="select">选择框</MenuItem>
                  <MenuItem value="text">文本</MenuItem>
                  <MenuItem value="number">数字</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={attributeFormData.options || []}
                onChange={(_, newValue) => setAttributeFormData({
                  ...attributeFormData,
                  options: newValue
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="属性选项"
                    placeholder="输入选项值并按回车添加"
                    helperText="例如：红色、蓝色、绿色"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttributeDialogOpen(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSaveAttribute}
            variant="contained"
            disabled={loading || !attributeFormData.name}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}