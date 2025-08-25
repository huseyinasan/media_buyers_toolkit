# Installation & Setup Guide

## Quick Start

### 1. Prepare the Extension
Before loading the extension, you need to add icon files:

1. Navigate to the `icons/` folder
2. Add these PNG files (you can create them from the provided `icon.svg`):
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

### 2. Load the Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the `media-buyers-toolkit` folder
6. The extension should now appear in your extensions list

### 3. Verify Installation

1. Look for the Media Buyer's Toolkit icon in your Chrome toolbar
2. Click the icon to open the popup
3. You should see two tabs: "TikTok Ads" and "YouTube Studio"

## Testing the Extension

### Test TikTok Ads Automation

1. Navigate to [TikTok Ads Manager](https://ads.tiktok.com) and log in
2. Open the extension popup
3. Go to the "TikTok Ads" tab
4. The status should show "Connected to TikTok Ads Manager"
5. Fill in test CTA text and URL
6. Click "Start Automation" to test (it will simulate the process)

### Test YouTube Studio Batch Publisher

1. Navigate to [YouTube Studio](https://studio.youtube.com) and log in
2. Open the extension popup
3. Go to the "YouTube Studio" tab
4. The status should show "Connected to YouTube Studio"
5. Fill in template and settings
6. Click "Start Batch Process" to test (it will simulate the process)

## Project Structure

```
media-buyers-toolkit/
├── manifest.json                 # Extension configuration
├── popup.html                   # Main popup interface
├── popup.js                     # Popup functionality
├── background.js                # Background service worker
├── README.md                    # Main documentation
├── INSTALLATION.md              # This file
├── generate-icons.js            # Icon generation helper
├── styles/
│   └── popup.css               # Extension styling
├── content-scripts/
│   ├── tiktok-automation.js    # TikTok automation logic
│   └── youtube-publisher.js    # YouTube automation logic
└── icons/
    ├── icon.svg                # Source SVG icon
    ├── placeholder.txt         # Icon requirements
    ├── icon16.png             # Required (add manually)
    ├── icon32.png             # Required (add manually)
    ├── icon48.png             # Required (add manually)
    └── icon128.png            # Required (add manually)
```

## Features Overview

### ✅ Completed Features

1. **Modern UI Design**
   - Professional gradient design
   - Tabbed interface for different tools
   - Responsive layout
   - Toast notifications
   - Progress indicators

2. **TikTok Ads Automation**
   - CTA text and URL configuration
   - Auto-optimization settings
   - Page detection and status indicators
   - Form data persistence

3. **YouTube Studio Batch Publisher**
   - Title templates with placeholders
   - Bulk description and tags
   - Privacy settings
   - Auto-scheduling options
   - Video queue management

4. **Background Services**
   - Message handling between components
   - Data persistence
   - Activity logging
   - Cleanup routines

5. **Content Scripts**
   - TikTok Ads Manager integration
   - YouTube Studio integration
   - DOM manipulation and form filling
   - Progress reporting

## Troubleshooting

### Common Issues

**Extension doesn't load:**
- Make sure all required icon files are present
- Check browser console for errors
- Verify manifest.json syntax

**Popup doesn't open:**
- Check if extension is enabled
- Look for errors in extension details page
- Try reloading the extension

**Automation doesn't work:**
- Ensure you're on the correct website
- Check browser console for JavaScript errors
- Verify page hasn't changed structure

### Development Tips

1. **Debugging:**
   - Use Chrome DevTools on the popup (right-click popup → Inspect)
   - Check background script in chrome://extensions (click "Service Worker")
   - Monitor content script in page console

2. **Testing:**
   - Test on both platforms regularly
   - Check for UI changes on target websites
   - Verify data persistence across browser sessions

3. **Updates:**
   - Reload extension after code changes
   - Clear extension data if needed
   - Test with different Chrome versions

## Next Steps

1. **Add Icons:** Create the required PNG icon files
2. **Test Thoroughly:** Test on both TikTok Ads and YouTube Studio
3. **Customize:** Modify settings and features as needed
4. **Deploy:** Package for Chrome Web Store when ready

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify you're using supported websites
3. Review this installation guide
4. Check the main README.md for additional help

The extension is now ready for testing and further development!
