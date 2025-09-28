import { createTheme } from '@mui/material/styles'

// 朱紫主题 - 基于中国传统朱砂色和紫色的玻璃态设计
// 优化配色方案，参考成熟紫色调色板
export const vermilionPurpleTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9c27b0', // 主紫色 (Material Design 紫色)
      light: '#ab47bc',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ff4081', // 辅助粉色 (Material Design 粉色)
      light: '#ff79b0',
      dark: '#c60055',
      contrastText: '#ffffff'
    },
    background: {
      default: 'rgba(243, 229, 245, 0.85)', // 柔和紫色背景
      paper: 'rgba(255, 255, 255, 0.9)' // 纸张背景
    },
    text: {
      primary: '#4a148c', // 深紫色文字，提高对比度
      secondary: '#7b1fa2' // 中紫色次级文字
    },
    divider: 'rgba(156, 39, 176, 0.2)' // 主紫色分割线
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          color: '#4a148c', // 按钮文字颜色
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 2px 8px rgba(156, 39, 176, 0.25)'
          },
          '&.Mui-contained': {
            backgroundColor: '#9c27b0',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#7b1fa2',
              boxShadow: '0 4px 12px rgba(156, 39, 176, 0.35)'
            }
          },
          '&.Mui-outlined': {
            borderColor: 'rgba(156, 39, 176, 0.7)',
            color: '#4a148c',
            '&:hover': {
              backgroundColor: 'rgba(156, 39, 176, 0.1)',
              borderColor: '#9c27b0'
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
          border: '1px solid rgba(156, 39, 176, 0.25)',
          boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
          color: '#4a148c' // 卡片文字颜色
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(22px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 15px rgba(156, 39, 176, 0.2)',
          color: '#4a148c' // AppBar文字颜色
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(18px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRight: '1px solid rgba(156, 39, 176, 0.3)',
          color: '#4a148c' // Drawer文字颜色
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(22px)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 16,
          border: '1px solid rgba(156, 39, 176, 0.4)',
          boxShadow: '0 8px 30px rgba(156, 39, 176, 0.25)',
          color: '#4a148c' // 对话框文字颜色
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: '#4a148c', // 输入框文字颜色
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(156, 39, 176, 0.6)',
              borderRadius: 8
            },
            '&:hover fieldset': {
              borderColor: 'rgba(156, 39, 176, 0.9)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9c27b0',
              borderWidth: '2px'
            },
            '& .MuiInputBase-input': {
              color: '#4a148c' // 输入文字颜色
            }
          },
          '& .MuiInputLabel-root': {
            color: '#7b1fa2', // 标签颜色
            '&.Mui-focused': {
              color: '#9c27b0' // 聚焦时标签颜色
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
          color: '#4a148c', // 列表项文字颜色
          '&.Mui-selected': {
            backgroundColor: 'rgba(156, 39, 176, 0.15)',
            color: '#9c27b0', // 选中时文字颜色
            '&:hover': {
              backgroundColor: 'rgba(156, 39, 176, 0.25)'
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(156, 39, 176, 0.1)'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#4a148c' // 默认文字颜色
        },
        h6: {
          fontWeight: 600,
          color: '#4a148c' // 标题颜色
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          color: '#4a148c', // Chip文字颜色
          border: '1px solid rgba(156, 39, 176, 0.35)',
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