import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  Chip
} from '@mui/material'
import {
  Palette as ThemeIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { useUIState } from '@/store'
import type { Locale } from '@/locales'

// 声明Chrome扩展API类型
declare global {
  interface Window {
    chrome: typeof chrome
  }
}

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose
}) => {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useUIState()
  const [tabValue, setTabValue] = useState(0)
  const [notifications, setNotifications] = useState({
    orderNotifications: true
  })

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'default' | 'macaron') => {
    setTheme(newTheme)
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const languages = [
    { code: 'zh-CN' as Locale, name: '中文简体', flag: '🇨🇳' },
    { code: 'zh-TW' as Locale, name: '繁體中文', flag: '🇹🇼' },
    { code: 'en-US' as Locale, name: 'English', flag: '🇺🇸' }
  ]

  const themes = [
    { value: 'macaron' as const, label: t('settings.macaronGreenTheme') },
    { value: 'default' as const, label: t('settings.glassPurpleTheme') },
    { value: 'light' as const, label: t('settings.lightTheme') },
    { value: 'dark' as const, label: t('settings.darkTheme') }
  ]

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '350px',
          maxHeight: '450px',
          m: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 1.5, px: 1.5 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <SettingsIcon sx={{ fontSize: '1.2rem' }} />
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            {t('settings.title')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        p: 0 
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                minHeight: 36,
                py: 0.5,
                px: 1.5,
                fontSize: '0.8rem',
                textTransform: 'none'
              },
              '& .MuiTab-iconWrapper': {
                mr: 0.5,
                fontSize: '1rem'
              }
            }}
          >
            <Tab 
              icon={<SettingsIcon fontSize="small" />} 
              label={t('settings.general')} 
              iconPosition="start"
            />
            <Tab 
              icon={<ThemeIcon fontSize="small" />} 
              label={t('settings.appearance')} 
              iconPosition="start"
            />
            <Tab 
              icon={<NotificationsIcon fontSize="small" />} 
              label={t('settings.notifications')} 
              iconPosition="start"
            />
            <Tab 
              icon={<InfoIcon fontSize="small" />} 
              label={t('settings.about')} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content with Scroll */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          px: 1.5,
          py: 1
        }}>
          {/* General Settings Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.language')}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.8rem' }}>{t('settings.language')}</InputLabel>
                      <Select
                        value={locale}
                        onChange={(e) => handleLanguageChange(e.target.value as Locale)}
                        label={t('settings.language')}
                        size="small"
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code} sx={{ fontSize: '0.8rem' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.advanced')}
                    </Typography>
                    <List sx={{ py: 0 }}>
                      <ListItem sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <SecurityIcon sx={{ fontSize: '1rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.dataSecurity')}
                          secondary={t('settings.dataSecurityDesc')}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.85rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.75rem' } }}
                        />
                      </ListItem>
                      <ListItem sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <HelpIcon sx={{ fontSize: '1rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.helpDocs')}
                          secondary={t('settings.helpDocsDesc')}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.85rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.75rem' } }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Appearance Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.theme')}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.8rem' }}>{t('settings.theme')}</InputLabel>
                      <Select
                        value={theme}
                        onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'default' | 'macaron')}
                        label={t('settings.theme')}
                        size="small"
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {themes.map((themeOption) => (
                          <MenuItem key={themeOption.value} value={themeOption.value} sx={{ fontSize: '0.8rem' }}>
                            {themeOption.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.interfaceSettings')}
                    </Typography>
                    <Alert severity="info" sx={{ mt: 1, py: 0.5, px: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {t('settings.interfaceSettingsDesc')}
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.notifications')}
                    </Typography>
                    <List sx={{ py: 0 }}>
                      <ListItem sx={{ py: 0.5, px: 0 }}>
                        <ListItemText 
                          primary={t('settings.orderNotifications')}
                          secondary={t('settings.orderNotificationsDesc')}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.85rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.75rem' } }}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notifications.orderNotifications}
                              onChange={() => handleNotificationChange('orderNotifications')}
                              size="small"
                              sx={{ 
                                '& .MuiSwitch-switchBase': {
                                  '&.Mui-checked': {
                                    color: '#4CAF50',
                                  },
                                },
                                '& .MuiSwitch-thumb': {
                                  width: 16,
                                  height: 16,
                                },
                                '& .MuiSwitch-track': {
                                  borderRadius: 16/2,
                                },
                              }}
                            />
                          }
                          label=""
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* About Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={1.5}>
              {/* 支持开发者部分移到顶部 */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.supportDeveloper')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph sx={{ fontSize: '0.75rem', mb: 1.5 }}>
                      {t('settings.supportDeveloperDesc')}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="img"
                        src="/images/donation-qrcode.jpg"
                        alt={t('settings.donationQRCode')}
                        sx={{ 
                          width: 120, 
                          height: 120, 
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                      <Typography variant="caption" align="center" sx={{ fontSize: '0.7rem' }}>
                        {t('settings.scanToSupport')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* 原有的项目信息部分 */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                      <Box
                        component="img"
                        src="/icons/icon-32.png"
                        alt="Mini ERP Logo"
                        sx={{ width: 32, height: 32, borderRadius: '6px' }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                          {t('app.title')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                          {t('app.version')} {typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getManifest().version || '1.0.0' : '1.0.0'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" paragraph sx={{ fontSize: '0.8rem', mb: 1 }}>
                      {t('app.description')}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.developerStory')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph sx={{ fontSize: '0.75rem', mb: 1 }}>
                      {t('settings.developerStoryDesc')}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.techStack')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      <Chip label="React 18" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label="TypeScript" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label="Material-UI 5" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label="Vite 5" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label="Zustand" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label="Chrome Extension API" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label="WooCommerce REST API" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>
                    
                    <Alert severity="info" sx={{ mt: 1, py: 0.5, px: 1, mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        轻量级架构设计，专注于核心功能，避免冗余复杂性
                      </Typography>
                    </Alert>

                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.features')}
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                      <ListItem sx={{ py: 0.3, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.multiStoreManagement')} 
                          secondary={t('settings.multiStoreManagementDesc')} 
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.8rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.7rem' } }}
                        />
                      </ListItem>
                      <ListItem sx={{ py: 0.3, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.productManagement')} 
                          secondary={t('settings.productManagementDesc')} 
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.8rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.7rem' } }}
                        />
                      </ListItem>
                      <ListItem sx={{ py: 0.3, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.orderManagement')} 
                          secondary={t('settings.orderManagementDesc')} 
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.8rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.7rem' } }}
                        />
                      </ListItem>
                      <ListItem sx={{ py: 0.3, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.batchOperations')} 
                          secondary={t('settings.batchOperationsDesc')} 
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.8rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.7rem' } }}
                        />
                      </ListItem>
                    </List>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5, mb: 1 }}>
                      <Chip label={t('common.lightweight')} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label={t('common.pureFunctionality')} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Chip label={t('common.completelyFree')} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>

                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600, mt: 1 }}>
                      {t('settings.openSourceLicense')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph sx={{ fontSize: '0.75rem' }}>
                      {t('settings.openSourceLicenseDesc')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 帮助和支持部分 */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ py: 1.5, px: 1.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {t('settings.helpAndSupport')}
                    </Typography>
                    <List sx={{ py: 0 }}>
                      <ListItem button component="a" href="https://github.com/your-repo/wiki" target="_blank" sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <HelpIcon sx={{ fontSize: '1rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.helpDocs')}
                          secondary={t('settings.helpDocsDesc')}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.85rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.75rem' } }}
                        />
                      </ListItem>
                      <ListItem button component="a" href="https://github.com/your-repo/issues" target="_blank" sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <FeedbackIcon sx={{ fontSize: '1rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('settings.feedback')}
                          secondary={t('settings.helpDocsDesc')}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.85rem', fontWeight: 500 } }}
                          secondaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.75rem' } }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
        <Button onClick={onClose} variant="contained" size="small">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
