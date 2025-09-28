import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { TranslationProvider } from '@/hooks/useTranslation'
import { useUIState } from '@/store'
import { themes } from '@/themes'
import { MaximizedApp } from './MaximizedApp'

// 创建主题提供者组件
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: themeType } = useUIState()
  const theme = themes[themeType] || themes.light
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <TranslationProvider>
        <ThemeWrapper>
          <MaximizedApp />
        </ThemeWrapper>
      </TranslationProvider>
    </React.StrictMode>
  )
}