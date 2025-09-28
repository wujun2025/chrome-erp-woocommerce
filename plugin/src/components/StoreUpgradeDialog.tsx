import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from '@mui/material'
import {
  Upgrade as UpgradeIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { getUpgradeFeatures, AUTH_LEVELS } from '@/config/featurePermissions'
import { useTranslation } from '@/hooks/useTranslation'

interface StoreUpgradeDialogProps {
  open: boolean
  onClose: () => void
  onUpgrade: () => void
  storeName: string
}

export const StoreUpgradeDialog: React.FC<StoreUpgradeDialogProps> = ({
  open,
  onClose,
  onUpgrade,
  storeName
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const upgradeFeatures = getUpgradeFeatures()

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      await onUpgrade()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <UpgradeIcon color="primary" sx={{ mr: 1 }} />
          {t('store.upgradeToLevel2')}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            {t('store.upgradeDescription', { storeName })}
          </Typography>
        </Alert>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SecurityIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {AUTH_LEVELS.advanced.name}
              </Typography>
              <Chip 
                label={t('common.recommended')} 
                size="small" 
                color="secondary" 
                sx={{ ml: 1 }}
              />
            </Box>
            
            <Typography variant="body2" color="textSecondary" paragraph>
              {AUTH_LEVELS.advanced.description}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              {t('store.upgradeBenefits')}
            </Typography>
            
            <List dense>
              {upgradeFeatures.map((feature) => (
                <ListItem key={feature.id} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <StarIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature.name}
                    secondary={feature.description}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              {t('store.currentLimitations')}
            </Typography>
            
            <List dense>
              {AUTH_LEVELS.basic.limitations.slice(0, 3).map((limitation, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <LockIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={limitation}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Alert severity="success">
          <Typography variant="body2">
            <strong>{t('store.seamlessUpgrade')}</strong>：{t('store.upgradeMigration')}
          </Typography>
        </Alert>

        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            {t('store.upgradeSteps')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('store.upgradeStepsDescription')}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button 
          variant="contained"
          onClick={handleUpgrade}
          disabled={loading}
          startIcon={<UpgradeIcon />}
        >
          {loading ? t('store.upgrading') : t('store.startUpgrade')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}