import React, { useState } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Breadcrumbs,
  Link,
  Chip,
  Button,
  Alert
} from '@mui/material'
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Store as StoreIcon,
  Inventory as ProductIcon,
  Receipt as OrderIcon,
  Dashboard as DashboardIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { useStoreConfig, useUIState } from '@/store'
import { StoreManagement } from '@/components/StoreManagement'
import { ProductManagement } from '@/components/ProductManagement'
import { OrderManagement } from '@/components/OrderManagement'
import { SettingsDialog } from '@/components/SettingsDialog'

type ViewType = 'dashboard' | 'stores' | 'products' | 'orders'

export const MaximizedApp: React.FC = () => {
  const { t } = useTranslation()
  const { stores, activeStore } = useStoreConfig()
  const { isSettingsDialogOpen, setSettingsDialogOpen } = useUIState()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  const currentStore = stores.find(s => s.id === activeStore)
  const hasActiveStore = !!currentStore

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSettings = () => {
    setSettingsDialogOpen(true)
  }

  const sidebarWidth = 280

  const navigationItems = [
    {
      id: 'dashboard' as ViewType,
      label: t('common.dashboard'),
      icon: <DashboardIcon />,
      disabled: false
    },
    {
      id: 'stores' as ViewType,
      label: t('store.title'),
      icon: <StoreIcon />,
      disabled: false
    },
    {
      id: 'products' as ViewType,
      label: t('product.title'),
      icon: <ProductIcon />,
      disabled: !hasActiveStore
    },
    {
      id: 'orders' as ViewType,
      label: t('order.title'),
      icon: <OrderIcon />,
      disabled: !hasActiveStore
    }
  ]

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return t('common.dashboard')
      case 'stores':
        return t('store.title')
      case 'products':
        return t('product.title')
      case 'orders':
        return t('order.title')
      default:
        return ''
    }
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: t('app.title'), href: '#' }
    ]

    if (currentView !== 'dashboard') {
      breadcrumbs.push({ label: getPageTitle(), href: '#' })
    }

    return breadcrumbs
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Paper sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h4" gutterBottom>
              {t('common.welcome')} {t('app.title')}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {t('app.description')}
            </Typography>
            
            {!hasActiveStore ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                {t('messages.noStores')}
              </Alert>
            ) : (
              <Alert severity="success" sx={{ mb: 3 }}>
                {t('store.active')}: {currentStore.name}
              </Alert>
            )}

            <Box display="flex" gap={2} flexWrap="wrap" mt={3}>
              <Button
                variant="outlined"
                startIcon={<StoreIcon />}
                onClick={() => handleViewChange('stores')}
                size="medium"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: '6px',
                  minWidth: '120px'
                }}
              >
                {t('store.title')}
              </Button>
              
              {hasActiveStore && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<ProductIcon />}
                    onClick={() => handleViewChange('products')}
                    size="medium"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '6px',
                      minWidth: '120px'
                    }}
                  >
                    {t('product.title')}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<OrderIcon />}
                    onClick={() => handleViewChange('orders')}
                    size="medium"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '6px',
                      minWidth: '120px'
                    }}
                  >
                    {t('order.title')}
                  </Button>
                </>
              )}
            </Box>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                {t('common.systemStatus')}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                  label={`${stores.length} ${t('store.title')}`} 
                  color={stores.length > 0 ? 'success' : 'default'} 
                />
                <Chip 
                  label={hasActiveStore ? t('store.active') : t('store.inactive')} 
                  color={hasActiveStore ? 'success' : 'warning'} 
                />
                <Chip 
                  label={`${t('app.version')} ${typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getManifest().version || '1.0.0' : '1.0.0'}`} 
                  color="info" 
                />
              </Box>
            </Box>
          </Paper>
        )
      case 'stores':
        return <StoreManagement />
      case 'products':
        return <ProductManagement />
      case 'orders':
        return <OrderManagement />
      default:
        return null
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
          boxShadow: '0 2px 15px rgba(0, 0, 0, 0.2)'
        }}
        elevation={1}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={handleToggleSidebar}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>

          {currentStore && (
            <Chip 
              label={currentStore.name} 
              color="primary" 
              size="small" 
              sx={{ mr: 2 }}
            />
          )}

          <IconButton 
            color="inherit" 
            onClick={handleSettings}
            title={t('common.settings')}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', pt: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.id}
                button
                selected={currentView === item.id}
                disabled={item.disabled}
                onClick={() => !item.disabled && handleViewChange(item.id)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          
          {/* Donation QR Code Area */}
          <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" align="center" gutterBottom>
              {t('settings.supportDeveloper')}
            </Typography>
            <Box textAlign="center">
              <Box
                component="img"
                src="/images/donation-qrcode.jpg"
                alt={t('settings.donationQRCode')}
                sx={{ 
                  width: '100%',
                  maxWidth: '120px',
                  height: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px'
                }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {t('settings.scanToSupport')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: sidebarOpen ? 0 : `-${sidebarWidth}px`,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Toolbar />
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          {getBreadcrumbs().map((breadcrumb, index) => (
            <Link
              key={index}
              color={index === getBreadcrumbs().length - 1 ? 'text.primary' : 'inherit'}
              href={breadcrumb.href}
              onClick={(e) => e.preventDefault()}
              underline="hover"
            >
              {breadcrumb.label}
            </Link>
          ))}
        </Breadcrumbs>

        {/* Page Content */}
        <Container maxWidth={false} sx={{ px: 0 }}>
          {renderContent()}
        </Container>
      </Box>

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
      />
    </Box>
  )
}