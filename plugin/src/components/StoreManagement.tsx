import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
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
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as OnlineIcon,
  Error as OfflineIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Upgrade as UpgradeIcon,
  Security as SecurityIcon,
  Launch as LaunchIcon
} from '@mui/icons-material'
import { useStoreConfig } from '@/store'
import { useTranslation } from '@/hooks/useTranslation'
import { apiService } from '@/services/api'
import { getBrowserInfo, getChromeExtensionInfo, formatBrowserInfo, getSystemInfo } from '@/utils/systemInfo'
import { debugStoreInfo, analyzeStoreInfoStructure } from '@/utils/debugStoreInfo'
import type { StoreConfig } from '@/types'
import { StoreBindingGuide } from '@/components/StoreBindingGuide'
import { StoreUpgradeDialog } from '@/components/StoreUpgradeDialog'
import { AUTH_LEVELS } from '@/config/featurePermissions'

export const StoreManagement: React.FC = () => {
  const { t } = useTranslation()
  const { 
    stores, 
    activeStore, 
    storeStatuses, 
    addStore, 
    updateStore, 
    deleteStore, 
    setActiveStore, 
    updateStoreStatus 
  } = useStoreConfig()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreConfig | null>(null)
  const [formData, setFormData] = useState<Partial<StoreConfig>>({
    name: '',
    url: '',
    authType: 'wordpress',
    credentials: {},
    isActive: false
  })
  const [testing, setTesting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set())
  const [storeSystemInfo, setStoreSystemInfo] = useState<{[key: string]: any}>({})
  const [browserInfo] = useState(() => getBrowserInfo())
  const [clientSystemInfo] = useState(() => getSystemInfo())
  const [extensionInfo, setExtensionInfo] = useState<any>(null)
  const [bindingGuideOpen, setBindingGuideOpen] = useState(false)
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [selectedStoreForUpgrade, setSelectedStoreForUpgrade] = useState<StoreConfig | null>(null)

  // 获取扩展信息
  React.useEffect(() => {
    getChromeExtensionInfo().then(setExtensionInfo)
  }, [])

  const handleOpenDialog = (store?: StoreConfig) => {
    if (store) {
      setEditingStore(store)
      setFormData(store)
    } else {
      setEditingStore(null)
      setFormData({
        name: '',
        url: '',
        authType: 'woocommerce', // 修改默认认证方式为WooCommerce REST API
        credentials: {},
        isActive: false
      })
    }
    setDialogOpen(true)
    setError(null)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingStore(null)
    setError(null)
  }

  const handleSave = () => {
    if (!formData.name || !formData.url) {
      setError(t('validation.required'))
      return
    }

    const storeData: StoreConfig = {
      id: editingStore?.id || Date.now().toString(),
      name: formData.name,
      url: formData.url.replace(/\/$/, ''), // Remove trailing slash
      authType: formData.authType || 'wordpress',
      credentials: formData.credentials || {},
      isActive: formData.isActive || false
    }

    if (editingStore) {
      updateStore(editingStore.id, storeData)
    } else {
      addStore(storeData)
    }

    handleCloseDialog()
  }

  const handleDelete = (storeId: string) => {
    if (window.confirm(t('messages.deleteConfirm'))) {
      deleteStore(storeId)
    }
  }

  const handleTestConnection = async (store: StoreConfig) => {
    setTesting(store.id)
    setError(null)

    try {
      apiService.setStoreConfig(store)
      const [connectionResult, systemInfoResult] = await Promise.allSettled([
        apiService.testConnection(),
        apiService.getStoreInfo()
      ])
      
      console.log('Connection result:', connectionResult)
      console.log('System info result:', systemInfoResult)
      
      if (connectionResult.status === 'fulfilled' && connectionResult.value.success) {
        updateStoreStatus(store.id, {
          isOnline: true,
          lastChecked: new Date().toISOString(),
          productCount: 0
        })
        
        // 存储系统信息
        if (systemInfoResult.status === 'fulfilled' && systemInfoResult.value.success) {
          console.log('Store system info result:', systemInfoResult.value.data)
          
          // 添加调试信息
          debugStoreInfo(systemInfoResult.value.data)
          analyzeStoreInfoStructure(systemInfoResult.value.data)
          
          setStoreSystemInfo(prev => ({
            ...prev,
            [store.id]: systemInfoResult.value.data
          }))
        }
      } else {
        const errorMessage = connectionResult.status === 'fulfilled' 
          ? connectionResult.value.error 
          : 'Connection test failed'
        updateStoreStatus(store.id, {
          isOnline: false,
          lastChecked: new Date().toISOString(),
          productCount: 0,
          error: errorMessage
        })
      }
    } catch (error) {
      console.error('Test connection error:', error)
      updateStoreStatus(store.id, {
        isOnline: false,
        lastChecked: new Date().toISOString(),
        productCount: 0,
        error: 'Connection test failed'
      })
    } finally {
      setTesting(null)
    }
  }

  const handleSetActive = (storeId: string) => {
    setActiveStore(storeId)
    const store = stores.find(s => s.id === storeId)
    if (store) {
      apiService.setStoreConfig(store)
    }
  }

  const getStatusColor = (storeId: string) => {
    const status = storeStatuses[storeId]
    if (!status) return 'default'
    return status.isOnline ? 'success' : 'error'
  }

  const handleToggleDetails = (storeId: string) => {
    setExpandedStores(prev => {
      const newSet = new Set(prev)
      if (newSet.has(storeId)) {
        newSet.delete(storeId)
      } else {
        newSet.add(storeId)
      }
      return newSet
    })
  }

  const handleStartBinding = (level: 'basic' | 'advanced') => {
    // 根据选择的级别设置默认认证方式
    const authType = level === 'basic' ? 'woocommerce' : 'wordpress'
    setFormData({
      name: '',
      url: '',
      authType,
      credentials: {},
      isActive: false
    })
    setDialogOpen(true)
  }

  const handleUpgradeStore = (store: StoreConfig) => {
    setSelectedStoreForUpgrade(store)
    setUpgradeDialogOpen(true)
  }

  const handleConfirmUpgrade = () => {
    if (selectedStoreForUpgrade) {
      setEditingStore(selectedStoreForUpgrade)
      setFormData({
        ...selectedStoreForUpgrade,
        authType: 'wordpress' // 升级到WordPress认证
      })
      setUpgradeDialogOpen(false)
      setDialogOpen(true)
    }
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
          {t('store.title')}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LaunchIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => setBindingGuideOpen(true)}
            sx={{ 
              px: 1.5, 
              py: 0.75,
              fontSize: '0.75rem',
              borderRadius: '6px',
              minWidth: '90px'
            }}
          >
            {t('store.bindingGuide')}
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              px: 1.5, 
              py: 0.75,
              fontSize: '0.75rem',
              borderRadius: '6px',
              minWidth: '90px'
            }}
          >
            {t('store.add')}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 1, py: 0.5, px: 1 }}>
          {error}
        </Alert>
      )}

      {stores.length === 0 ? (
        <Card sx={{ boxShadow: 'none', border: '1px dashed', borderColor: 'divider' }}>
          <CardContent sx={{ textAlign: 'center', py: 3, px: 2 }}>
            <Typography color="textSecondary" sx={{ fontSize: '0.9rem' }}>
              {t('messages.noStores')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {stores.map((store) => {
            const status = storeStatuses[store.id]
            const isActive = activeStore === store.id
            const isOnline = status?.isOnline || false
            const isExpanded = expandedStores.has(store.id)
            const systemInfo = storeSystemInfo[store.id]

            return (
              <Card key={store.id} variant={isActive ? 'outlined' : 'elevation'} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ py: 1.5, px: 1.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1} mr={1}>
                      <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          {store.name}
                        </Typography>
                        {isActive && (
                          <Chip
                            label={t('store.active')}
                            color="primary"
                            size="small"
                            sx={{ height: 16, fontSize: '0.6rem', px: 0.5 }}
                          />
                        )}
                        <Chip
                          icon={isOnline ? <OnlineIcon sx={{ fontSize: '0.8rem' }} /> : <OfflineIcon sx={{ fontSize: '0.8rem' }} />}
                          label={isOnline ? t('store.online') : t('store.offline')}
                          color={getStatusColor(store.id)}
                          size="small"
                          sx={{ height: 16, fontSize: '0.6rem', px: 0.5 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                        {store.url}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.7rem', mb: 0.5 }}>
                        {t('store.authType')}: {store.authType === 'wordpress' ? t('store.wordpress') : t('store.woocommerce')}
                      </Typography>
                      
                      {/* 绑定级别显示 */}
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                        <Chip
                          icon={store.authType === 'wordpress' ? <SecurityIcon sx={{ fontSize: '0.8rem' }} /> : undefined}
                          label={store.authType === 'wordpress' ? AUTH_LEVELS.advanced.name : AUTH_LEVELS.basic.name}
                          color={store.authType === 'wordpress' ? 'secondary' : 'primary'}
                          size="small"
                          variant="outlined"
                          sx={{ height: 16, fontSize: '0.6rem', px: 0.5 }}
                        />
                        {store.authType === 'woocommerce' && (
                          <Button
                            size="small"
                            startIcon={<UpgradeIcon sx={{ fontSize: '0.8rem' }} />}
                            onClick={() => handleUpgradeStore(store)}
                            sx={{ 
                              minWidth: 'auto', 
                              px: 0.5, 
                              py: 0, 
                              fontSize: '0.65rem',
                              height: 18
                            }}
                          >
                            {t('store.upgrade')}
                          </Button>
                        )}
                      </Box>
                      
                      {/* 基本信息 */}
                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                        {extensionInfo && (
                          <Chip 
                            label={`${t('store.extensionVersion')}: ${extensionInfo.version}`}
                            size="small"
                            variant="outlined"
                            color="info"
                            sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                          />
                        )}
                        <Chip 
                          label={formatBrowserInfo(browserInfo)}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                        />
                        {/* 添加调试信息显示 */}
                        {systemInfo && systemInfo.wordpress && (
                          <Chip 
                            label={`WP: ${systemInfo.wordpress.version || 'Unknown'}`}
                            size="small"
                            variant="outlined"
                            color="success"
                            sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                          />
                        )}
                        {systemInfo && systemInfo.woocommerce && (
                          <Chip 
                            label={`WC: ${systemInfo.woocommerce.version || 'Unknown'}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                          />
                        )}
                        {/* 原始显示逻辑保留 */}
                        {systemInfo?.wordpress?.version && systemInfo.wordpress.version !== 'Unknown' && (
                          <Chip 
                            label={`WordPress: ${systemInfo.wordpress.version}`}
                            size="small"
                            variant="outlined"
                            color="success"
                            sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                          />
                        )}
                        {systemInfo?.woocommerce?.version && systemInfo.woocommerce.version !== 'Unknown' && (
                          <Chip 
                            label={`WooCommerce: ${systemInfo.woocommerce.version}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                          />
                        )}
                      </Box>
                      
                      {status?.lastChecked && (
                        <Typography variant="caption" color="textSecondary" display="block" mt={0.5} sx={{ fontSize: '0.6rem' }}>
                          {t('store.lastChecked')}: {new Date(status.lastChecked).toLocaleString()}
                        </Typography>
                      )}
                      
                      {/* 详细信息区域 */}
                      {isExpanded && (
                        <Box mt={1} p={1} bgcolor="grey.50" borderRadius={0.5}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                            {t('store.systemInfo')}
                          </Typography>
                          
                          {/* 客户端环境信息 */}
                          <Box mb={1}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                              {t('store.clientEnvironment')}
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              <Chip label={`浏览器: ${clientSystemInfo.browser.name} ${clientSystemInfo.browser.version}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`引擎: ${clientSystemInfo.browser.engine}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`操作系统: ${clientSystemInfo.browser.platform}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`架构: ${clientSystemInfo.browser.architecture}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`CPU核心: ${clientSystemInfo.browser.hardwareConcurrency}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`语言: ${clientSystemInfo.browser.language}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`时区: ${clientSystemInfo.timezone}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              {clientSystemInfo.browser.memory && (
                                <Chip 
                                  label={`内存: ${clientSystemInfo.browser.memory.used}MB / ${clientSystemInfo.browser.memory.limit}MB`} 
                                  size="small" 
                                  color="info"
                                  sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                                />
                              )}
                            </Box>
                          </Box>
                          
                          {/* 显示信息 */}
                          <Box mb={1}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                              {t('store.displayInfo')}
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              <Chip label={`分辨率: ${clientSystemInfo.screen.width}x${clientSystemInfo.screen.height}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`像素比: ${clientSystemInfo.screen.pixelRatio}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              <Chip label={`色深: ${clientSystemInfo.screen.colorDepth}位`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              {clientSystemInfo.screen.orientation && (
                                <Chip label={`方向: ${clientSystemInfo.screen.orientation}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              )}
                            </Box>
                          </Box>
                          
                          {/* 网络信息 */}
                          <Box mb={1}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                              {t('store.networkInfo')}
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              <Chip 
                                label={clientSystemInfo.network.online ? t('store.onlineStatus') : t('store.offlineStatus')} 
                                size="small" 
                                color={clientSystemInfo.network.online ? 'success' : 'error'}
                                sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                              />
                              {clientSystemInfo.network.effectiveType && (
                                <Chip label={`${t('store.connectionType')}: ${clientSystemInfo.network.effectiveType}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              )}
                              {clientSystemInfo.network.downlink && (
                                <Chip label={`${t('store.downlinkSpeed')}: ${clientSystemInfo.network.downlink}Mbps`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              )}
                              {clientSystemInfo.network.rtt && (
                                <Chip label={`${t('store.latency')}: ${clientSystemInfo.network.rtt}ms`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              )}
                            </Box>
                          </Box>
                          
                          {/* 性能信息 */}
                          {clientSystemInfo.performance && (
                            <Box mb={1}>
                              <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                                {t('store.performanceInfo')}
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                <Chip 
                                  label={`${t('store.domLoad')}: ${Math.round(clientSystemInfo.performance.timing.domContentLoaded)}ms`} 
                                  size="small" 
                                  sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                                />
                                <Chip 
                                  label={`${t('store.pageComplete')}: ${Math.round(clientSystemInfo.performance.timing.loadComplete)}ms`} 
                                  size="small" 
                                  sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                                />
                                {clientSystemInfo.performance.memory && (
                                  <Chip 
                                    label={`${t('store.jsMemory')}: ${clientSystemInfo.performance.memory.used}MB / ${clientSystemInfo.performance.memory.limit}MB`} 
                                    size="small" 
                                    color="warning"
                                    sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }}
                                  />
                                )}
                              </Box>
                            </Box>
                          )}

                          {/* WordPress 信息 */}
                          {storeSystemInfo[store.id] && (
                            <Box mb={1}>
                              <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                                WordPress
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                <Chip label={`${t('store.version')}: ${storeSystemInfo[store.id]?.wordpress?.version || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`${t('store.multisite')}: ${storeSystemInfo[store.id]?.wordpress?.multisite ? t('store.yes') : t('store.no')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`${t('store.memoryLimit')}: ${storeSystemInfo[store.id]?.wordpress?.memory_limit || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`${t('store.debugMode')}: ${storeSystemInfo[store.id]?.wordpress?.debug_mode ? t('store.on') : t('store.off')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              </Box>
                            </Box>
                          )}
                          
                          {/* WooCommerce 信息 */}
                          {storeSystemInfo[store.id] && (
                            <Box mb={1}>
                              <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                                WooCommerce
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                <Chip label={`${t('store.version')}: ${storeSystemInfo[store.id]?.woocommerce?.version || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`${t('store.databaseVersion')}: ${storeSystemInfo[store.id]?.woocommerce?.database_version || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`${t('store.api')}: ${storeSystemInfo[store.id]?.woocommerce?.api_enabled ? t('store.on') : t('store.off')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              </Box>
                            </Box>
                          )}
                          
                          {/* 服务器信息 */}
                          {storeSystemInfo[store.id] && (
                            <Box mb={1}>
                              <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                                {t('store.server')}
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                <Chip label={`${t('store.server')}: ${storeSystemInfo[store.id]?.server?.software || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`PHP: ${storeSystemInfo[store.id]?.server?.php_version || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`MySQL: ${storeSystemInfo[store.id]?.server?.mysql_version || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              </Box>
                            </Box>
                          )}
                          
                          {/* 主题信息 */}
                          {storeSystemInfo[store.id] && (
                            <Box>
                              <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.75rem' }}>
                                {t('store.theme')}
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                <Chip label={`${t('store.theme')}: ${storeSystemInfo[store.id]?.theme?.name || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                                <Chip label={`${t('store.version')}: ${storeSystemInfo[store.id]?.theme?.version || t('store.unknown')}`} size="small" sx={{ height: 16, fontSize: '0.55rem', px: 0.5 }} />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>

                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Box display="flex" gap={0.5}>
                        {testing === store.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => handleTestConnection(store)}
                            title={t('store.testConnection')}
                            sx={{ p: 0.5 }}
                          >
                            <RefreshIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        )}
                        
                        <IconButton
                          size="small"
                          onClick={() => handleToggleDetails(store.id)}
                          title={isExpanded ? t('store.hideDetails') : t('store.viewDetails')}
                          sx={{ p: 0.5 }}
                        >
                          {isExpanded ? <ExpandLessIcon sx={{ fontSize: '1rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
                        </IconButton>
                        
                        {!isActive && (
                          <Button
                            size="small"
                            onClick={() => handleSetActive(store.id)}
                            sx={{ 
                              minWidth: 'auto', 
                              px: 0.5, 
                              py: 0, 
                              fontSize: '0.7rem',
                              height: 22
                            }}
                          >
                            {t('store.setActive')}
                          </Button>
                        )}
                      </Box>
                      
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(store)}
                          title={t('store.edit')}
                          sx={{ p: 0.5 }}
                        >
                          <EditIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(store.id)}
                          title={t('store.delete')}
                          color="error"
                          sx={{ p: 0.5 }}
                        >
                          <DeleteIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      )}

      {/* Store Configuration Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 1.5, px: 1.5 }}>
          {editingStore ? t('store.edit') : t('store.addNew')}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 1 }}>
          <Box display="flex" flexDirection="column" gap={1} pt={0.5}>
            <TextField
              label={t('store.name')}
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              size="small"
            />
            
            <TextField
              label={t('store.url')}
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              fullWidth
              required
              placeholder="https://your-store.com"
              size="small"
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>{t('store.authType')}</InputLabel>
              <Select
                value={formData.authType || 'woocommerce'} // 修改默认值为WooCommerce
                onChange={(e) => setFormData({ 
                  ...formData, 
                  authType: e.target.value as 'wordpress' | 'woocommerce',
                  credentials: {} // Reset credentials when auth type changes
                })}
                label={t('store.authType')}
                size="small"
              >
                <MenuItem value="wordpress">{t('store.wordpress')}</MenuItem>
                <MenuItem value="woocommerce">{t('store.woocommerce')}</MenuItem>
              </Select>
            </FormControl>

            {formData.authType === 'wordpress' ? (
              <>
                <TextField
                  label={t('store.username')}
                  value={formData.credentials?.username || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    credentials: { ...formData.credentials, username: e.target.value }
                  })}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label={t('store.password')}
                  type="password"
                  value={formData.credentials?.password || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    credentials: { ...formData.credentials, password: e.target.value }
                  })}
                  fullWidth
                  required
                  size="small"
                />
              </>
            ) : (
              <>
                <TextField
                  label={t('store.consumerKey')}
                  value={formData.credentials?.consumerKey || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    credentials: { ...formData.credentials, consumerKey: e.target.value }
                  })}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label={t('store.consumerSecret')}
                  type="password"
                  value={formData.credentials?.consumerSecret || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    credentials: { ...formData.credentials, consumerSecret: e.target.value }
                  })}
                  fullWidth
                  required
                  size="small"
                />
              </>
            )}

            {error && (
              <Alert severity="error" sx={{ py: 0.5, px: 1 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ pt: 1, pb: 1.5, px: 1.5 }}>
          <Button onClick={handleCloseDialog} size="small">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} variant="contained" size="small">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 绑定引导对话框 */}
      <StoreBindingGuide
        open={bindingGuideOpen}
        onClose={() => setBindingGuideOpen(false)}
        onStartBinding={handleStartBinding}
        currentAuthType={editingStore?.authType}
      />

      {/* 升级对话框 */}
      <StoreUpgradeDialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        onUpgrade={handleConfirmUpgrade}
        storeName={selectedStoreForUpgrade?.name || ''}
      />
    </Box>
  )
}