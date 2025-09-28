// Chrome extension background script
console.log('Chrome ERP Extension background script loaded')

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Chrome ERP Extension installed:', details.reason)
  
  if (details.reason === 'install') {
    // First time installation
    console.log('First time installation - setting up default settings')
    
    // Set default settings
    chrome.storage.local.set({
      settings: {
        theme: 'light',
        language: 'zh-CN'
      },
      stores: [],
      activeStore: null
    })
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('Extension updated from version:', details.previousVersion)
  }
})

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked for tab:', tab.id)
})

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background script received message:', message)
  
  switch (message.type) {
    case 'GET_ACTIVE_TAB':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        sendResponse({ tab: tabs[0] })
      })
      return true // Keep message channel open for async response
      
    case 'OPEN_MAXIMIZED_VIEW':
      chrome.tabs.create({
        url: chrome.runtime.getURL('src/maximized/index.html')
      })
      sendResponse({ success: true })
      break
      
    case 'UPDATE_BADGE':
      if (message.text) {
        chrome.action.setBadgeText({ text: message.text })
        chrome.action.setBadgeBackgroundColor({ color: message.color || '#FF0000' })
      } else {
        chrome.action.setBadgeText({ text: '' })
      }
      sendResponse({ success: true })
      break
      
    case 'SYNC_STORAGE':
      // Sync data between different parts of the extension
      if (message.data) {
        chrome.storage.local.set(message.data, () => {
          sendResponse({ success: true })
        })
        return true
      }
      break
      
    default:
      console.log('Unknown message type:', message.type)
      sendResponse({ error: 'Unknown message type' })
  }
})

// Storage change listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('Storage changed in namespace:', namespace)
  
  Object.keys(changes).forEach(key => {
    const change = changes[key]
    console.log(`Storage key "${key}" changed:`, {
      oldValue: change.oldValue,
      newValue: change.newValue
    })
  })
  
  // Notify all open extension pages about storage changes
  chrome.runtime.sendMessage({
    type: 'STORAGE_CHANGED',
    changes,
    namespace
  }).catch(() => {
    // Ignore errors if no listeners
  })
})

// Handle tab updates to potentially update badge or other UI elements
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if this is a WooCommerce site
    if (tab.url.includes('wp-admin') || tab.url.includes('woocommerce')) {
      console.log('WooCommerce admin detected:', tab.url)
      // Could potentially show a different badge or notification
    }
  }
})

// Alarm handler for periodic tasks
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name)
  
  switch (alarm.name) {
    case 'SYNC_STORES':
      // Periodically sync store data
      syncStoresData()
      break
      
    case 'UPDATE_BADGES':
      // Update extension badges
      updateExtensionBadges()
      break
  }
})

// Helper function to sync stores data
async function syncStoresData() {
  try {
    const result = await chrome.storage.local.get(['stores', 'activeStore'])
    console.log('Synced stores data:', result)
    
    // Could implement background sync with WooCommerce stores here
    // For now, just log the data
  } catch (error) {
    console.error('Error syncing stores data:', error)
  }
}

// Helper function to update extension badges
async function updateExtensionBadges() {
  try {
    const result = await chrome.storage.local.get(['stores', 'activeStore'])
    
    if (result.stores && result.stores.length > 0) {
      chrome.action.setBadgeText({ text: result.stores.length.toString() })
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' })
    } else {
      chrome.action.setBadgeText({ text: '' })
    }
  } catch (error) {
    console.error('Error updating badges:', error)
  }
}

// Set up periodic alarms
chrome.alarms.create('SYNC_STORES', { periodInMinutes: 30 })
chrome.alarms.create('UPDATE_BADGES', { periodInMinutes: 5 })

// Initial badge update
updateExtensionBadges()

export {} // Make this a module