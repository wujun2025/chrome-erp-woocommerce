import React from 'react'
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material'
import {
  Lock as LockIcon,
  Upgrade as UpgradeIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'
import { hasPermission, FEATURE_PERMISSIONS, AUTH_LEVELS } from '@/config/featurePermissions'
import type { StoreConfig } from '@/types'

interface FeaturePermissionAlertProps {
  storeConfig: StoreConfig | null
  requiredFeatures: string[]
  onUpgrade?: () => void
  severity?: 'warning' | 'info' | 'error'
  showUpgradeButton?: boolean
  compact?: boolean
}

export const FeaturePermissionAlert: React.FC<FeaturePermissionAlertProps> = ({
  storeConfig,
  requiredFeatures,
  onUpgrade,
  severity = 'warning',
  showUpgradeButton = true,
  compact = false
}) => {
  if (!storeConfig) {
    return (
      <Alert severity="error">
        <Typography variant="body2">
          请先配置店铺连接
        </Typography>
      </Alert>
    )
  }

  const currentAuthType = storeConfig.authType
  const isBasicAuth = currentAuthType === 'woocommerce'
  
  // 检查所需功能的权限状态
  const restrictedFeatures = requiredFeatures.filter(featureId => 
    !hasPermission(currentAuthType, featureId)
  )
  
  // 如果没有受限功能，显示成功状态
  if (restrictedFeatures.length === 0) {
    return compact ? null : (
      <Alert severity="success">
        <Box display="flex" alignItems="center">
          <CheckIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">
            当前认证级别支持所有所需功能
          </Typography>
        </Box>
      </Alert>
    )
  }

  const restrictedFeatureDetails = restrictedFeatures
    .map(featureId => FEATURE_PERMISSIONS.find(f => f.id === featureId))
    .filter(Boolean)

  const currentLevel = isBasicAuth ? AUTH_LEVELS.basic : AUTH_LEVELS.advanced

  return (
    <Alert 
      severity={severity}
      action={
        showUpgradeButton && isBasicAuth && onUpgrade ? (
          <Button
            color="inherit"
            size="small"
            onClick={onUpgrade}
            startIcon={<UpgradeIcon />}
          >
            升级绑定
          </Button>
        ) : null
      }
    >
      <AlertTitle>
        <Box display="flex" alignItems="center">
          <LockIcon fontSize="small" sx={{ mr: 1 }} />
          功能权限限制
          <Chip 
            label={currentLevel.name}
            size="small"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>
      </AlertTitle>
      
      {compact ? (
        <Typography variant="body2">
          当前功能受限，需要{isBasicAuth ? '二级绑定' : '更高权限'}才能访问
          {restrictedFeatureDetails.length > 0 && ` (${restrictedFeatureDetails.length}项功能受限)`}
        </Typography>
      ) : (
        <Box>
          <Typography variant="body2" paragraph>
            当前使用 <strong>{currentLevel.name}</strong>，以下功能受限：
          </Typography>
          
          <List dense sx={{ mt: 1 }}>
            {restrictedFeatureDetails.map((feature) => (
              <ListItem key={feature!.id} sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <LockIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={feature!.name}
                  secondary={feature!.description}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>

          {isBasicAuth && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              💡 升级到二级绑定（WordPress应用密码）即可解锁所有功能
            </Typography>
          )}
        </Box>
      )}
    </Alert>
  )
}

// 功能权限检查 Hook
export const useFeaturePermission = (storeConfig: StoreConfig | null, featureIds: string[]) => {
  if (!storeConfig) {
    return {
      hasAllPermissions: false,
      restrictedFeatures: featureIds,
      canUpgrade: true
    }
  }

  const restrictedFeatures = featureIds.filter(featureId => 
    !hasPermission(storeConfig.authType, featureId)
  )

  return {
    hasAllPermissions: restrictedFeatures.length === 0,
    restrictedFeatures,
    canUpgrade: storeConfig.authType === 'woocommerce'
  }
}