import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Button // 添加 Button 组件的导入
} from '@mui/material'
import { useTranslation } from '@/hooks/useTranslation'
import { useStoreConfig, useUIState } from '@/store'

interface FeedbackDialogProps {
  open: boolean
  onClose: () => void
  onBindStore?: () => void  // 添加绑定店铺的回调函数
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose, onBindStore }) => {
  const { t } = useTranslation()
  const { stores, activeStore } = useStoreConfig()
  const { setFeedbackDialogOpen } = useUIState() // 这个现在应该可以工作了
  const [feedbackText, setFeedbackText] = useState('')
  const [localUsername, setLocalUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isFirstInstallation, setIsFirstInstallation] = useState(false)

  const hasActiveStore = activeStore && stores.find(s => s.id === activeStore)
  const username = localStorage.getItem('feedbackUsername')

  // 检查是否是首次安装
  useEffect(() => {
    if (open) {
      // 检查是否是首次安装
      chrome.storage.local.get(['isFirstInstallation'], (result) => {
        setIsFirstInstallation(result.isFirstInstallation !== false)
      })
    }
  }, [open])

  const handleSaveUsername = () => {
    if (!localUsername.trim()) {
      setError(t('validation.required'))
      return
    }
    
    // 保存用户名到localStorage
    localStorage.setItem('feedbackUsername', localUsername)
    setError(null)
    setSuccess(true) // 添加成功状态
    
    // 通知背景脚本用户名已设置
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: 'USERNAME_SET',
        data: { username: localUsername }
      }).catch((error) => {
        console.error('Failed to send message to background:', error)
      })
    }
    
    // 如果是首次安装，提示用户绑定店铺
    if (isFirstInstallation) {
      // 用户名保存成功后，可以提示用户绑定店铺
      console.log('Username saved, ready to bind store')
    }
    
    // 2秒后关闭对话框或清除成功状态
    setTimeout(() => {
      setSuccess(false)
      // 如果是首次安装，保持对话框打开让用户绑定店铺
      // 否则关闭对话框
      if (!isFirstInstallation) {
        onClose()
      }
    }, 2000)
  }

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      setError(t('validation.required'))
      return
    }
    
    const username = localStorage.getItem('feedbackUsername')
    if (!username) {
      setError(t('validation.required'))
      return
    }
    
    if (!hasActiveStore) {
      setError(t('messages.noStores'))
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // 注意：以下功能与backend项目相关，backend项目为后期开发内容
      // 发送反馈到后端API（这里使用一个示例URL，实际应用中需要替换为真实的后端API）
      const response = await fetch('https://your-backend-api.com/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          feedback: feedbackText,
          storeUrl: stores.find(s => s.id === activeStore)?.url,
          timestamp: new Date().toISOString(),
          extensionVersion: typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getManifest().version : 'unknown'
        }),
      })
      
      if (response.ok) {
        setSuccess(true)
        setFeedbackText('')
        
        // 发送消息到背景脚本，记录用户提交了反馈
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          chrome.runtime.sendMessage({
            type: 'USER_FEEDBACK_SUBMITTED',
            data: { 
              action: 'feedback_submitted',
              username,
              feedback: feedbackText,
              storeUrl: stores.find(s => s.id === activeStore)?.url,
              timestamp: new Date().toISOString()
            }
          }).catch((error) => {
            console.error('Failed to send message to background:', error)
          })
        }
        
        // 3秒后自动关闭对话框
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 3000)
      } else {
        throw new Error('Failed to send feedback')
      }
    } catch (err) {
      setError(t('messages.networkError'))
      
      // 发送消息到背景脚本，记录反馈提交失败
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: 'USER_FEEDBACK_SUBMITTED',
          data: { 
            action: 'feedback_failed',
            username: localStorage.getItem('feedbackUsername'),
            error: err instanceof Error ? err.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }
        }).catch((error) => {
          console.error('Failed to send message to background:', error)
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBindStoreClick = () => {
    // 关闭当前反馈对话框
    if (setFeedbackDialogOpen) { // 检查方法是否存在
      setFeedbackDialogOpen(false)
    }
    // 调用传递进来的绑定店铺函数
    if (onBindStore) {
      onBindStore()
    }
    
    // 发送消息到背景脚本，记录用户尝试绑定店铺
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: 'USER_FEEDBACK_SUBMITTED',
        data: { 
          action: 'bind_store_clicked',
          username: localStorage.getItem('feedbackUsername'),
          timestamp: new Date().toISOString()
        }
      }).catch((error) => {
        console.error('Failed to send message to background:', error)
      })
    }
  }

  // 当对话框打开且用户名已存在时，初始化localUsername状态
  useEffect(() => {
    if (open && username) {
      setLocalUsername(username)
    }
  }, [open, username])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {username ? t('common.feedback') : t('common.setUsername')} {/* 这些现在应该可以工作了 */}
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {!username ? (
            <>
              <Typography variant="body2" color="textSecondary">
                {t('common.enterUsername')} {/* 这个现在应该可以工作了 */}
              </Typography>
              
              <TextField
                label={t('store.username')}
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                fullWidth
                size="small"
                autoFocus
              />
              
              {isFirstInstallation && (
                <Alert severity="info" sx={{ py: 0.5, px: 1 }}>
                  {t('messages.welcomeFirstInstallation')} {/* 这个现在应该可以工作了 */}
                </Alert>
              )}
              
              {error && (
                <Alert severity="error" sx={{ py: 0.5, px: 1 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ py: 0.5, px: 1 }}>
                  {t('messages.saveSuccess')}
                </Alert>
              )}
            </>
          ) : (
            <>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="textSecondary">
                  {t('store.username')}:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {username}
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => {
                    setLocalUsername(username || '')
                    localStorage.removeItem('feedbackUsername')
                  }}
                >
                  {t('common.edit')}
                </Button>
              </Box>
              
              {!hasActiveStore && (
                <Alert severity="warning" sx={{ py: 0.5, px: 1 }}>
                  {t('messages.noStores')}
                  <Box mt={1}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={handleBindStoreClick}
                    >
                      {t('store.add')}
                    </Button>
                  </Box>
                </Alert>
              )}
              
              <TextField
                label={t('common.feedback')}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                fullWidth
                multiline
                rows={4}
                placeholder={t('common.feedbackPlaceholder') || '请输入您的反馈意见...'}
                size="small"
                disabled={!hasActiveStore}
              />
              
              {error && (
                <Alert severity="error" sx={{ py: 0.5, px: 1 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ py: 0.5, px: 1 }}>
                  {t('messages.saveSuccess')}
                </Alert>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ pt: 1, pb: 2, px: 2 }}>
        <Button 
          onClick={onClose} 
          size="small"
          disabled={loading}
        >
          {t('common.cancel')}
        </Button>
        
        {!username ? (
          <Button 
            onClick={handleSaveUsername} 
            variant="contained" 
            size="small"
            disabled={loading || success} // 在成功状态下也禁用按钮
          >
            {success ? t('messages.saveSuccess') : t('common.save')}
          </Button>
        ) : (
          <Button 
            onClick={handleSendFeedback} 
            variant="contained" 
            size="small"
            disabled={loading || !hasActiveStore}
          >
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                {t('common.sending')} {/* 这个现在应该可以工作了 */}
              </>
            ) : (
              t('common.sendFeedback') /* 这个现在应该可以工作了 */
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}