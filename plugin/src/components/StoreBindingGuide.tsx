import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon,
  Store as StoreIcon,
  Security as SecurityIcon,
  Extension as FeaturesIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { AUTH_LEVELS, FEATURE_PERMISSIONS, hasPermission } from '@/config/featurePermissions'

// 辅助函数来安全地调用翻译函数
const safeTranslate = (t: (key: any) => string, key: string, fallback: string = key): string => {
  try {
    // 检查是否是已知的翻译键
    return t(key as any) || fallback;
  } catch (error) {
    return fallback;
  }
};

interface StoreBindingGuideProps {
  open: boolean
  onClose: () => void
  onStartBinding: (level: 'basic' | 'advanced') => void
  currentAuthType?: 'woocommerce' | 'wordpress'
}

export const StoreBindingGuide: React.FC<StoreBindingGuideProps> = ({
  open,
  onClose,
  onStartBinding,
  currentAuthType
}) => {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'advanced'>('basic')

  const steps = [
    {
      label: t('store.binding.understandLevels'),
      content: 'understand-levels'
    },
    {
      label: t('store.binding.selectBinding'),
      content: 'select-binding'
    },
    {
      label: t('store.binding.featureComparison'),
      content: 'feature-comparison'
    },
    {
      label: t('store.binding.startBinding'),
      content: 'start-binding'
    }
  ]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStartBinding = () => {
    onStartBinding(selectedLevel)
    onClose()
  }

  const renderStepContent = (step: string) => {
    switch (step) {
      case 'understand-levels':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('store.binding.levelIntroduction')}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {t('store.binding.systemDescription')}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <StoreIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">{t('store.binding.level1')}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {t('store.basicBinding')}
                    </Typography>
                    <Chip 
                      label={t('store.binding.quickStart')} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <SecurityIcon color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="h6">{t('store.binding.level2')}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {t('store.advancedBinding')}
                    </Typography>
                    <Chip 
                      label={t('store.binding.fullFeatures')} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                💡 <strong>{t('store.binding.recommendation')}</strong>：{t('store.binding.recommendationDesc')}
              </Typography>
            </Alert>
          </Box>
        )

      case 'select-binding':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('store.binding.chooseLevel')}
            </Typography>
            
            <Grid container spacing={2}>
              {Object.values(AUTH_LEVELS).map((level) => (
                <Grid item xs={12} key={level.id}>
                  <Card 
                    variant={selectedLevel === level.id ? "elevation" : "outlined"}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedLevel === level.id ? 2 : 1,
                      borderColor: selectedLevel === level.id ? 'primary.main' : 'divider'
                    }}
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          {level.id === 'basic' ? (
                            <StoreIcon color="primary" sx={{ mr: 2 }} />
                          ) : (
                            <SecurityIcon color="secondary" sx={{ mr: 2 }} />
                          )}
                          <Box>
                            <Typography variant="h6">{safeTranslate(t, level.name)}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {safeTranslate(t, level.description)}
                            </Typography>
                          </Box>
                        </Box>
                        {selectedLevel === level.id && (
                          <CheckIcon color="primary" />
                        )}
                      </Box>
                      
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('store.binding.mainAdvantages')}
                        </Typography>
                        <List dense>
                          {level.benefits.slice(0, 3).map((benefit, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={safeTranslate(t, benefit)}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                          {level.benefits.length > 3 && (
                            <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                              {t('store.binding.andMore', { count: level.benefits.length - 3 })}
                            </Typography>
                          )}
                        </List>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {currentAuthType && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {t('store.binding.currentWarning', { 
                    authType: currentAuthType === 'wordpress' ? t('store.binding.level2') : t('store.binding.level1') 
                  })}
                </Typography>
              </Alert>
            )}
          </Box>
        )

      case 'feature-comparison':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('store.binding.details')}
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <FeaturesIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">{t('store.binding.productManagement')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      {t('store.binding.level1')}
                    </Typography>
                    <List dense>
                      {FEATURE_PERMISSIONS
                        .filter(f => f.category === 'product' && hasPermission('woocommerce', f.id))
                        .map((feature) => (
                          <ListItem key={feature.id}>
                            <ListItemIcon>
                              <CheckIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={safeTranslate(t, feature.name)}
                              secondary={safeTranslate(t, feature.description)}
                            />
                          </ListItem>
                        ))}
                      {FEATURE_PERMISSIONS
                        .filter(f => f.category === 'product' && !hasPermission('woocommerce', f.id))
                        .map((feature) => (
                          <ListItem key={feature.id}>
                            <ListItemIcon>
                              <LockIcon color="disabled" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={safeTranslate(t, feature.name)}
                              secondary={t('store.binding.requiresLevel2')}
                              sx={{ opacity: 0.6 }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom color="secondary">
                      {t('store.binding.level2')}
                    </Typography>
                    <List dense>
                      {FEATURE_PERMISSIONS
                        .filter(f => f.category === 'product')
                        .map((feature) => (
                          <ListItem key={feature.id}>
                            <ListItemIcon>
                              <CheckIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={safeTranslate(t, feature.name)}
                              secondary={safeTranslate(t, feature.description)}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">{t('store.binding.otherFeatures')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('store.binding.level1Limitations')}
                    </Typography>
                    <List dense>
                      {AUTH_LEVELS.basic.limitations.map((limitation, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={safeTranslate(t, limitation)} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('store.binding.level2Additional')}
                    </Typography>
                    <List dense>
                      {FEATURE_PERMISSIONS
                        .filter(f => f.requiredAuth === 'wordpress')
                        .map((feature) => (
                          <ListItem key={feature.id}>
                            <ListItemIcon>
                              <UpgradeIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={safeTranslate(t, feature.name)}
                              secondary={safeTranslate(t, feature.description)}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )

      case 'start-binding':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('store.binding.preparation')}
            </Typography>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {t('store.binding.selectedLevel', { level: safeTranslate(t, AUTH_LEVELS[selectedLevel].name) })}
              </Typography>
            </Alert>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedLevel === 'basic' ? t('store.binding.level1Steps') : t('store.binding.level2Steps')}
                </Typography>
                
                {selectedLevel === 'basic' ? (
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary={t('store.binding.prepareWooCommerce')}
                        secondary={t('store.binding.prepareWooCommerceDesc')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={t('store.binding.fillStoreInfo')}
                        secondary={t('store.binding.fillStoreInfoDesc')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={t('store.binding.testConnection')}
                        secondary={t('store.binding.testConnectionDesc')}
                      />
                    </ListItem>
                  </List>
                ) : (
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary={t('store.binding.createWordPress')}
                        secondary={t('store.binding.createWordPressDesc')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={t('store.binding.fillAuthInfo')}
                        secondary={t('store.binding.fillAuthInfoDesc')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={t('store.binding.verifyPermissions')}
                        secondary={t('store.binding.verifyPermissionsDesc')}
                      />
                    </ListItem>
                  </List>
                )}
              </CardContent>
            </Card>

            <Alert severity="info">
              <Typography variant="body2">
                💡 <strong>{t('store.binding.tip')}</strong>：{t('store.binding.tipDesc')}
              </Typography>
            </Alert>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <StoreIcon sx={{ mr: 1 }} />
          {t('store.binding.dialogTitle')}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {renderStepContent(step.content)}
                
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleStartBinding : handleNext}
                    sx={{ mr: 1 }}
                  >
                    {index === steps.length - 1 ? t('store.binding.start') : t('store.binding.next')}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                  >
                    {t('store.binding.previous')}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('store.binding.cancel')}</Button>
        {activeStep < steps.length - 1 && (
          <Button variant="outlined" onClick={() => setActiveStep(steps.length - 1)}>
            {t('store.binding.skipGuide')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}