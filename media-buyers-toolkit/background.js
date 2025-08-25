// Media Buyer's Toolkit - Background Service Worker

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Media Buyer\'s Toolkit installed');
        
        // Set default settings
        chrome.storage.sync.set({
            settings: {
                autoSave: true,
                notifications: true,
                theme: 'light'
            }
        });
        
        // Open welcome page (optional)
        // chrome.tabs.create({ url: 'welcome.html' });
    } else if (details.reason === 'update') {
        console.log('Media Buyer\'s Toolkit updated to version', chrome.runtime.getManifest().version);
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'automationProgress':
            handleAutomationProgress(request.data);
            break;
        case 'automationError':
            handleAutomationError(request.data);
            break;
        case 'getTabInfo':
            getTabInfo(sendResponse);
            return true; // Keep message channel open for async response
        case 'logActivity':
            logActivity(request.data);
            break;
        default:
            console.log('Unknown message action:', request.action);
    }
});

// Handle automation progress updates
function handleAutomationProgress(data) {
    console.log(`${data.tool} automation progress:`, data.message);
    
    // Store progress in storage for popup to access
    chrome.storage.local.set({
        [`${data.tool}_progress`]: {
            message: data.message,
            timestamp: Date.now()
        }
    });
    
    // Show notification if enabled
    showNotification('progress', `${data.tool.toUpperCase()} Automation`, data.message);
}

// Handle automation errors
function handleAutomationError(data) {
    console.error(`${data.tool} automation error:`, data.error);
    
    // Store error in storage
    chrome.storage.local.set({
        [`${data.tool}_error`]: {
            error: data.error,
            timestamp: Date.now()
        }
    });
    
    // Show error notification
    showNotification('error', `${data.tool.toUpperCase()} Automation Error`, data.error);
}

// Get current tab information
async function getTabInfo(sendResponse) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        sendResponse({
            url: tab.url,
            title: tab.title,
            id: tab.id
        });
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

// Log user activities for analytics
function logActivity(data) {
    const activity = {
        ...data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    };
    
    // Store activity locally (could be sent to analytics service)
    chrome.storage.local.get('activities').then((result) => {
        const activities = result.activities || [];
        activities.push(activity);
        
        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }
        
        chrome.storage.local.set({ activities });
    });
}

// Show notifications
async function showNotification(type, title, message) {
    try {
        const settings = await chrome.storage.sync.get('settings');
        if (settings.settings && !settings.settings.notifications) {
            return; // Notifications disabled
        }

        const iconPath = getNotificationIcon(type);
        
        chrome.notifications.create({
            type: 'basic',
            iconUrl: iconPath,
            title: title,
            message: message,
            priority: type === 'error' ? 2 : 1
        });
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Get appropriate icon for notification type
function getNotificationIcon(type) {
    switch (type) {
        case 'error':
            return 'icons/icon-error-48.png';
        case 'success':
            return 'icons/icon-success-48.png';
        case 'progress':
        default:
            return 'icons/icon48.png';
    }
}

// Handle tab updates to check for relevant pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (tab.url.includes('ads.tiktok.com') || tab.url.includes('studio.youtube.com')) {
            // Inject content scripts if needed (they should auto-inject via manifest)
            console.log('Relevant page detected:', tab.url);
        }
    }
});

// Clean up old data periodically
chrome.alarms.create('cleanup', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
        cleanupOldData();
    }
});

// Clean up old stored data
async function cleanupOldData() {
    try {
        const result = await chrome.storage.local.get();
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        
        const keysToRemove = [];
        
        Object.keys(result).forEach(key => {
            if (key.endsWith('_progress') || key.endsWith('_error')) {
                const data = result[key];
                if (data.timestamp && data.timestamp < cutoffTime) {
                    keysToRemove.push(key);
                }
            }
        });
        
        if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove);
            console.log('Cleaned up old data:', keysToRemove);
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// Handle extension context menu (optional feature)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'media-buyers-toolkit',
        title: 'Media Buyer\'s Toolkit',
        contexts: ['page'],
        documentUrlPatterns: [
            'https://ads.tiktok.com/*',
            'https://studio.youtube.com/*'
        ]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'media-buyers-toolkit') {
        // Open the extension popup programmatically
        chrome.action.openPopup();
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleAutomationProgress,
        handleAutomationError,
        logActivity,
        cleanupOldData
    };
}
