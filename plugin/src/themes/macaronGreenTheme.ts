import { createTheme } from '@mui/material/styles'

// 马卡龙绿主题 - 基于柔和清新的马卡龙绿色调
export const macaronGreenTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#75e59a', // 马卡龙绿主色调 (来自 maxdpi.com)
      light: '#8cf0b3',
      dark: '#5cd185',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#b2f5e6', // 马卡龙淡绿色作为辅助色
      light: '#c4ffdd',
      dark: '#9fe6d1',
      contrastText: '#ffffff'
    },
    background: {
      default: 'rgba(240, 255, 245, 0.85)', // 柔和的浅绿色背景
      paper: 'rgba(255, 255, 255, 0.9)' // 纸张背景
    },
    text: {
      primary: '#2e7d32', // 深绿色文字，提高对比度
      secondary: '#388e3c' // 中绿色次级文字
    },
    divider: 'rgba(117, 229, 154, 0.2)' // 主绿色分割线
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          color: '#2e7d32', // 按钮文字颜色
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 2px 8px rgba(117, 229, 154, 0.25)'
          },
          '&.Mui-contained': {
            backgroundColor: '#75e59a',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#5cd185',
              boxShadow: '0 4px 12px rgba(117, 229, 154, 0.35)'
            }
          },
          '&.Mui-outlined': {
            borderColor: 'rgba(117, 229, 154, 0.7)',
            color: '#2e7d32',
            '&:hover': {
              backgroundColor: 'rgba(117, 229, 154, 0.1)',
              borderColor: '#75e59a'
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(18px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 12,
          border: '1px solid rgba(117, 229, 154, 0.25)',
          boxShadow: '0 4px 20px rgba(117, 229, 154, 0.15)',
          color: '#2e7d32' // 卡片文字颜色
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(22px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 15px rgba(117, 229, 154, 0.2)',
          color: '#2e7d32' // AppBar文字颜色
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(18px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRight: '1px solid rgba(117, 229, 154, 0.3)',
          color: '#2e7d32' // Drawer文字颜色
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(22px)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 16,
          border: '1px solid rgba(117, 229, 154, 0.4)',
          boxShadow: '0 8px 30px rgba(117, 229, 154, 0.25)',
          color: '#2e7d32' // 对话框文字颜色
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: '#2e7d32', // 输入框文字颜色
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(117, 229, 154, 0.6)',
              borderRadius: 8
            },
            '&:hover fieldset': {
              borderColor: 'rgba(117, 229, 154, 0.9)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#75e59a',
              borderWidth: '2px'
            },
            '& .MuiInputBase-input': {
              color: '#2e7d32' // 输入文字颜色
            }
          },
          '& .MuiInputLabel-root': {
            color: '#388e3c', // 标签颜色
            '&.Mui-focused': {
              color: '#75e59a' // 聚焦时标签颜色
            }
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px 4px 8px',
          color: '#2e7d32', // 列表项文字颜色
          '&.Mui-selected': {
            backgroundColor: 'rgba(117, 229, 154, 0.15)',
            color: '#75e59a', // 选中时文字颜色
            '&:hover': {
              backgroundColor: 'rgba(117, 229, 154, 0.25)'
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(117, 229, 154, 0.1)'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#2e7d32' // 默认文字颜色
        },
        h6: {
          fontWeight: 600,
          color: '#2e7d32' // 标题颜色
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          color: '#2e7d32', // Chip文字颜色
          border: '1px solid rgba(117, 229, 154, 0.35)',
          borderRadius: 16
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600
    }
  }
})