/**
 * 获取浏览器信息的工具函数
 */

// Chrome Extension API类型声明
declare const chrome: any

export interface BrowserInfo {
  name: string
  version: string
  platform: string
  userAgent: string
  language: string
  cookieEnabled: boolean
  onLine: boolean
  engine: string
  architecture: string
  memory?: {
    used: number
    limit: number
  }
  hardwareConcurrency: number
}

export interface SystemInfo {
  browser: BrowserInfo
  screen: {
    width: number
    height: number
    colorDepth: number
    pixelRatio: number
    orientation?: string
  }
  performance: {
    timing: {
      domContentLoaded: number
      loadComplete: number
    }
    memory?: {
      used: number
      limit: number
    }
  }
  network: {
    online: boolean
    effectiveType?: string
    downlink?: number
    rtt?: number
  }
  timezone: string
  timestamp: string
}

/**
 * 获取浏览器信息
 */
export const getBrowserInfo = (): BrowserInfo => {
  const userAgent = navigator.userAgent
  
  // 检测浏览器类型和版本
  let browserName = 'Unknown'
  let browserVersion = 'Unknown'
  let engine = 'Unknown'
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browserName = 'Chrome'
    const chromeMatch = userAgent.match(/Chrome\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/)
    if (chromeMatch) {
      browserVersion = chromeMatch[1]
    }
    engine = 'Blink'
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox'
    const firefoxMatch = userAgent.match(/Firefox\/([0-9]+\.[0-9]+)/)
    if (firefoxMatch) {
      browserVersion = firefoxMatch[1]
    }
    engine = 'Gecko'
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari'
    const safariMatch = userAgent.match(/Version\/([0-9]+\.[0-9]+)/)
    if (safariMatch) {
      browserVersion = safariMatch[1]
    }
    engine = 'WebKit'
  } else if (userAgent.includes('Edg')) {
    browserName = 'Edge'
    const edgeMatch = userAgent.match(/Edg\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/)
    if (edgeMatch) {
      browserVersion = edgeMatch[1]
    }
    engine = 'Blink'
  }
  
  // 检测操作系统
  let platform = 'Unknown'
  let architecture = 'Unknown'
  
  if (userAgent.includes('Windows NT 10.0')) {
    platform = 'Windows 10/11'
  } else if (userAgent.includes('Windows NT 6.3')) {
    platform = 'Windows 8.1'
  } else if (userAgent.includes('Windows NT 6.1')) {
    platform = 'Windows 7'
  } else if (userAgent.includes('Windows')) {
    platform = 'Windows'
  } else if (userAgent.includes('Mac OS X')) {
    const macMatch = userAgent.match(/Mac OS X ([0-9_]+)/)
    if (macMatch) {
      platform = `macOS ${macMatch[1].replace(/_/g, '.')}`
    } else {
      platform = 'macOS'
    }
  } else if (userAgent.includes('Linux')) {
    platform = 'Linux'
  } else if (userAgent.includes('Android')) {
    const androidMatch = userAgent.match(/Android ([0-9.]+)/)
    platform = androidMatch ? `Android ${androidMatch[1]}` : 'Android'
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    const iosMatch = userAgent.match(/OS ([0-9_]+)/)
    platform = iosMatch ? `iOS ${iosMatch[1].replace(/_/g, '.')}` : 'iOS'
  }
  
  // 检测架构
  if (userAgent.includes('x64') || userAgent.includes('x86_64') || userAgent.includes('Win64')) {
    architecture = 'x64'
  } else if (userAgent.includes('x86') || userAgent.includes('i386')) {
    architecture = 'x86'
  } else if (userAgent.includes('ARM') || userAgent.includes('arm64')) {
    architecture = 'ARM'
  }
  
  // 获取内存信息（如果可用）
  let memory
  if ('memory' in performance) {
    const performanceMemory = (performance as any).memory
    memory = {
      used: Math.round(performanceMemory.usedJSHeapSize / 1024 / 1024), // MB
      limit: Math.round(performanceMemory.jsHeapSizeLimit / 1024 / 1024) // MB
    }
  }
  
  return {
    name: browserName,
    version: browserVersion,
    platform: platform,
    userAgent: userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    engine: engine,
    architecture: architecture,
    memory: memory,
    hardwareConcurrency: navigator.hardwareConcurrency || 1
  }
}

/**
 * 获取完整的系统信息
 */
export const getSystemInfo = (): SystemInfo => {
  const browser = getBrowserInfo()
  
  // 获取网络信息
  const networkInfo: any = {
    online: navigator.onLine
  }
  
  // 尝试获取网络连接信息（如果支持）
  if ('connection' in navigator) {
    const connection = (navigator as any).connection
    if (connection) {
      networkInfo.effectiveType = connection.effectiveType
      networkInfo.downlink = connection.downlink
      networkInfo.rtt = connection.rtt
    }
  }
  
  // 获取屏幕方向
  let orientation
  if (screen.orientation) {
    orientation = screen.orientation.type
  } else if ('mozOrientation' in screen) {
    orientation = (screen as any).mozOrientation
  } else if ('msOrientation' in screen) {
    orientation = (screen as any).msOrientation
  }
  
  // 获取性能信息
  const performanceTiming = {
    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
  }
  
  let performanceMemory
  if ('memory' in performance) {
    const memory = (performance as any).memory
    performanceMemory = {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
    }
  }
  
  return {
    browser,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: orientation
    },
    performance: {
      timing: performanceTiming,
      memory: performanceMemory
    },
    network: networkInfo,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  }
}

/**
 * 格式化浏览器信息显示文本
 */
export const formatBrowserInfo = (info: BrowserInfo): string => {
  return `${info.name} ${info.version} (${info.platform})`
}

/**
 * 获取Chrome扩展信息
 */
export const getChromeExtensionInfo = (): Promise<{
  version: string
  name: string
  id: string
}> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      const manifest = chrome.runtime.getManifest()
      resolve({
        version: manifest.version || '1.0.0',
        name: manifest.name || 'Chrome ERP WooCommerce',
        id: chrome.runtime.id || 'unknown'
      })
    } else {
      resolve({
        version: '1.0.0',
        name: 'Chrome ERP WooCommerce',
        id: 'development'
      })
    }
  })
}