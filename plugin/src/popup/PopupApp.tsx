import React, { useState } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Chip,
  Tooltip
} from '@mui/material'
import {
  Settings as SettingsIcon,
  OpenInNew as MaximizeIcon,
  Store as StoreIcon,
  Inventory as ProductIcon,
  Receipt as OrderIcon
} from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { useStoreConfig, useUIState } from '@/store'
import { StoreManagement } from '@/components/StoreManagement'
import { ProductManagement } from '@/components/ProductManagement'
import { SettingsDialog } from '@/components/SettingsDialog'

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
      id={`popup-tabpanel-${index}`}
      aria-labelledby={`popup-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export const PopupApp: React.FC = () => {
  const { t } = useTranslation()
  const { stores, activeStore } = useStoreConfig()
  const { setSettingsDialogOpen, isSettingsDialogOpen } = useUIState()
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleMaximize = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/maximized/index.html')
    })
    window.close()
  }

  const handleSettings = () => {
    setSettingsDialogOpen(true)
  }

  const hasActiveStore = activeStore && stores.find(s => s.id === activeStore)
  const currentStore = stores.find(s => s.id === activeStore)

  return (
    <Box sx={{ width: 400, height: 600, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={1} sx={{ 
        background: (theme) => {
          // 根据不同主题设置不同的渐变背景
          if (theme.palette.mode === 'dark') {
            return 'linear-gradient(135deg, #2c3e50 0%, #4a235a 100%)'
          } else if (theme.palette.primary.main === '#9c27b0') {
            // 朱紫主题
            return 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)'
          } else if (theme.palette.primary.main === '#75e59a') {
            // 马卡龙绿主题
            return 'linear-gradient(135deg, #75e59a 0%, #b2f5e6 100%)'
          } else {
            // 默认浅色主题
            return 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)'
          }
        },
        color: (theme) => theme.palette.mode === 'dark' ? '#e0e0e0' : '#ffffff',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Toolbar variant="dense" sx={{ minHeight: 48, px: 1.5 }}>
          <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
            <Box
              component="img"
              src="/icons/icon-16.png"
              alt="Mini ERP Logo"
              sx={{ width: 20, height: 20, borderRadius: '4px' }}
            />
            <Typography variant="h6" component="div" sx={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1, color: 'text.primary' }}>
              {t('app.title')}
            </Typography>
            {currentStore && (
              <Tooltip title={currentStore.name}>
                <Chip 
                  label={currentStore.name.length > 10 ? `${currentStore.name.substring(0, 10)}...` : currentStore.name}
                  size="small"
                  sx={{ 
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 500,
                    maxWidth: 70,
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      px: 0.5
                    },
                    borderRadius: '6px'
                  }}
                />
              </Tooltip>
            )}
          </Box>
          <IconButton 
            color="primary" 
            size="small"
            onClick={handleSettings}
            title={t('common.settings')}
            sx={{ 
              mr: 0.5,
              p: 0.5,
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
              }
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
          <IconButton 
            color="primary" 
            size="small"
            onClick={handleMaximize}
            title={t('app.maximize')}
            sx={{ 
              p: 0.5,
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
              }
            }}
          >
            <MaximizeIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          aria-label="popup tabs"
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              py: 1,
              px: 0.5,
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main'
              },
              minWidth: 0,
              borderRadius: '4px 4px 0 0'
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'primary.main',
              height: 3
            },
            '& .MuiTab-iconWrapper': {
              mb: '2px',
              fontSize: '1rem'
            }
          }}
        >
          <Tab 
            icon={<StoreIcon fontSize="small" />} 
            label={t('store.title')} 
            id="popup-tab-0"
            aria-controls="popup-tabpanel-0"
            sx={{ minHeight: 44, fontSize: '0.75rem' }}
          />
          <Tab 
            icon={<ProductIcon fontSize="small" />} 
            label={t('product.title')} 
            id="popup-tab-1"
            aria-controls="popup-tabpanel-1"
            sx={{ minHeight: 44, fontSize: '0.75rem' }}
            disabled={!hasActiveStore}
          />
          <Tab 
            icon={<OrderIcon fontSize="small" />} 
            label={t('order.title')} 
            id="popup-tab-2"
            aria-controls="popup-tabpanel-2"
            sx={{ minHeight: 44, fontSize: '0.75rem' }}
            disabled={!hasActiveStore}
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        bgcolor: 'background.default'
      }}>
        <TabPanel value={tabValue} index={0}>
          <StoreManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {hasActiveStore ? (
            <ProductManagement />
          ) : (
            <Card sx={{ 
              boxShadow: 'none',
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mx: 'auto',
              mt: 2,
              maxWidth: 300
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, px: 2 }}>
                <Typography color="textSecondary" gutterBottom sx={{ mb: 2, fontSize: '0.9rem' }}>
                  {t('messages.noStores')}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setTabValue(0)}
                  size="small"
                  sx={{ 
                    borderRadius: 6,
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    fontSize: '0.8rem'
                  }}
                >
                  {t('store.add')}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {hasActiveStore ? (
            <Card sx={{ 
              boxShadow: 'none',
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mx: 'auto',
              mt: 2,
              maxWidth: 300
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, px: 2 }}>
                <Typography color="textSecondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                  {t('order.title')} - Coming Soon
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                  {t('common.featureComingSoonDesc')}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ 
              boxShadow: 'none',
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mx: 'auto',
              mt: 2,
              maxWidth: 300
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, px: 2 }}>
                <Typography color="textSecondary" gutterBottom sx={{ mb: 2, fontSize: '0.9rem' }}>
                  {t('messages.noStores')}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setTabValue(0)}
                  size="small"
                  sx={{ 
                    borderRadius: 6,
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    fontSize: '0.8rem'
                  }}
                >
                  {t('store.add')}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 1.5, 
        borderTop: 1, 
        borderColor: 'divider', 
        bgcolor: 'background.paper',
        textAlign: 'center'
      }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
          {t('app.description')}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontSize: '0.6rem' }}>
          {t('common.lightweight')} · {t('common.pureFunctionality')} · {t('common.completelyFree')}
        </Typography>
      </Box>

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
      />
    </Box>
  )
}