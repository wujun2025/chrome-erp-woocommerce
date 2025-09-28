import { createTheme } from '@mui/material/styles'

// 进一步优化的毛玻璃紫色主题
export const glassPurpleTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7d3c98', // 调深紫色主色调
      light: '#8e44ad',
      dark: '#6c3483',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#9b59b6', // 辅助紫色
      light: '#af7ac5',
      dark: '#884ea0',
      contrastText: '#ffffff'
    },
    background: {
      default: 'rgba(245, 240, 255, 0.8)', // 调整背景色，降低透明度
      paper: 'rgba(255, 255, 255, 0.85)' // 纸张背景
    },
    text: {
      primary: '#2a0a3a', // 更深的紫色文字，提高对比度
      secondary: '#5d2d7c' // 中紫色次级文字
    },
    divider: 'rgba(142, 68, 173, 0.3)' // 加深分割线颜色
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          color: '#2a0a3a', // 按钮文字颜色
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 2px 8px rgba(142, 68, 173, 0.2)'
          },
          '&.Mui-contained': {
            backgroundColor: '#7d3c98',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#6c3483',
              boxShadow: '0 4px 12px rgba(142, 68, 173, 0.3)'
            }
          },
          '&.Mui-outlined': {
            borderColor: 'rgba(142, 68, 173, 0.6)',
            color: '#2a0a3a',
            '&:hover': {
              backgroundColor: 'rgba(142, 68, 173, 0.15)',
              borderColor: '#7d3c98'
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          borderRadius: 12,
          border: '1px solid rgba(142, 68, 173, 0.3)',
          boxShadow: '0 4px 20px rgba(142, 68, 173, 0.2)',
          color: '#2a0a3a' // 卡片文字颜色
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 15px rgba(142, 68, 173, 0.25)',
          color: '#2a0a3a' // AppBar文字颜色
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRight: '1px solid rgba(142, 68, 173, 0.4)',
          color: '#2a0a3a' // Drawer文字颜色
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 16,
          border: '1px solid rgba(142, 68, 173, 0.5)',
          boxShadow: '0 8px 30px rgba(142, 68, 173, 0.3)',
          color: '#2a0a3a' // 对话框文字颜色
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            color: '#2a0a3a', // 输入框文字颜色
            '& fieldset': {
              borderColor: 'rgba(142, 68, 173, 0.5)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(142, 68, 173, 0.8)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7d3c98',
              borderWidth: '2px'
            },
            '& .MuiInputBase-input': {
              color: '#2a0a3a' // 输入文字颜色
            }
          },
          '& .MuiInputLabel-root': {
            color: '#5d2d7c', // 标签颜色
            '&.Mui-focused': {
              color: '#7d3c98' // 聚焦时标签颜色
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
          color: '#2a0a3a', // 列表项文字颜色
          '&.Mui-selected': {
            backgroundColor: 'rgba(142, 68, 173, 0.2)',
            color: '#7d3c98', // 选中时文字颜色
            '&:hover': {
              backgroundColor: 'rgba(142, 68, 173, 0.3)'
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(142, 68, 173, 0.15)'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#2a0a3a' // 默认文字颜色
        },
        h6: {
          fontWeight: 600,
          color: '#2a0a3a' // 标题颜色
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          color: '#2a0a3a', // Chip文字颜色
          border: '1px solid rgba(142, 68, 173, 0.4)'
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