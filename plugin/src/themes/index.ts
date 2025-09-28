import { createTheme } from '@mui/material/styles'
import { vermilionPurpleTheme } from './vermilionPurpleTheme'
import { macaronGreenTheme } from './macaronGreenTheme'

// 默认朱紫主题（设置为默认主题）
export const defaultTheme = vermilionPurpleTheme

// 优化的浅色主题 - 基于2025年流行色彩趋势和Material Design推荐
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3', // 清新的蓝色，符合Material Design标准
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ff4081', // 活力粉色，增加视觉层次
      light: '#ff79b0',
      dark: '#c60055',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f7fa', // 柔和的浅灰蓝背景，符合2025年流行趋势
      paper: '#ffffff'
    },
    text: {
      primary: '#263238', // 深蓝灰色文字，提高可读性
      secondary: '#546e7a'
    },
    divider: 'rgba(0, 0, 0, 0.12)'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
          },
          '&.Mui-contained': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)'
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px 4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(33, 150, 243, 0.15)',
            color: '#2196f3',
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.25)'
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.1)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderRadius: 8
            },
            '&:hover fieldset': {
              borderWidth: '1px'
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px'
            }
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#263238'
        },
        h6: {
          fontWeight: 600
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  }
})

// 优化的深色主题 - 基于Material Design深色主题规范和2025年趋势
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5', // 明亮的蓝色，在深色背景下更突出
      light: '#80d6ff',
      dark: '#0077c2',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f48fb1', // 柔和的粉色，与深色背景协调
      light: '#ffbfdf',
      dark: '#bf5f82',
      contrastText: '#000000'
    },
    background: {
      default: '#1a1a2e', // 深蓝灰色背景，减少眼部疲劳
      paper: '#222236'
    },
    text: {
      primary: '#e0e0e0', // 浅灰色文字，确保对比度
      secondary: '#b0b0b0'
    },
    divider: 'rgba(255, 255, 255, 0.12)'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
          },
          '&.Mui-contained': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(22px)',
          backgroundColor: 'rgba(34, 34, 54, 0.95)', // 使用深色主题的背景色
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          color: '#e0e0e0' // 使用深色主题的文字颜色
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#222236',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px 4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(66, 165, 245, 0.15)',
            color: '#42a5f5',
            '&:hover': {
              backgroundColor: 'rgba(66, 165, 245, 0.25)'
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(66, 165, 245, 0.1)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderRadius: 8
            },
            '&:hover fieldset': {
              borderWidth: '1px'
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px'
            }
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#e0e0e0'
        },
        h6: {
          fontWeight: 600
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  }
})

// 主题映射
export const themes = {
  default: defaultTheme,
  light: lightTheme,
  dark: darkTheme,
  macaron: macaronGreenTheme
}

// 主题类型
export type ThemeType = 'default' | 'light' | 'dark' | 'macaron'