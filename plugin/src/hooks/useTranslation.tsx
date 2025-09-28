import { createContext, useContext, ReactNode } from 'react'
import { createTranslation, type Locale, type TranslationKey } from '@/locales'
import { useAppStore } from '@/store'

interface TranslationContextType {
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  locale: Locale
  setLocale: (locale: Locale) => void
}

const TranslationContext = createContext<TranslationContextType | null>(null)

interface TranslationProviderProps {
  children: ReactNode
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const { language, setLanguage } = useAppStore()
  
  const t = createTranslation(language)
  
  const setLocale = (locale: Locale) => {
    setLanguage(locale)
  }
  
  return (
    <TranslationContext.Provider value={{ t, locale: language, setLocale }}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}