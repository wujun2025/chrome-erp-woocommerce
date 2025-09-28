import { zhCN } from './zh-CN'
import { zhTW } from './zh-TW'
import { enUS } from './en-US'

export const locales = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS
} as const

export type Locale = keyof typeof locales
export type TranslationKey = keyof typeof zhCN

// Simple translation function with template support
export const createTranslation = (locale: Locale) => {
  const translations = locales[locale] || locales['zh-CN']
  
  return (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = (translations as any)[key] || key
    
    // Simple template replacement
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value))
      })
    }
    
    return text
  }
}

// Default translation function
export const t = createTranslation('zh-CN')

export { zhCN, zhTW, enUS }