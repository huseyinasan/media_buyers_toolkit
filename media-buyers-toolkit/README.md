# Media Buyer's Toolkit

A comprehensive Chrome extension designed specifically for media buyers, combining powerful automation tools for TikTok Ads and YouTube Studio management.

## Features

### 🎯 TikTok Ads CTA Automation
- **Automated CTA Setup**: Quickly configure call-to-action buttons across multiple campaigns
- **Landing Page Integration**: Seamlessly connect your campaigns to landing pages
- **Auto-Optimization**: Enable automatic optimization settings for better performance
- **Bulk Processing**: Handle multiple campaigns efficiently

### 📺 YouTube Studio Batch Publisher
- **Batch Video Management**: Process multiple videos simultaneously
- **Template-Based Titles**: Use dynamic templates with placeholders like `{filename}` and `{date}`
- **Bulk Metadata Updates**: Apply descriptions, tags, and privacy settings across multiple videos
- **Auto-Scheduling**: Schedule video publications automatically
- **Progress Tracking**: Monitor batch operations with real-time progress indicators

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The Media Buyer's Toolkit icon will appear in your Chrome toolbar

## Usage

### Getting Started
1. Click the Media Buyer's Toolkit icon in your Chrome toolbar
2. Navigate to either TikTok Ads Manager or YouTube Studio
3. Select the appropriate tool tab in the extension popup
4. Configure your settings and start automation

### TikTok Ads Automation
1. Navigate to [TikTok Ads Manager](https://ads.tiktok.com)
2. Open the extension and go to the "TikTok Ads" tab
3. Enter your CTA text and landing page URL
4. Enable auto-optimization if desired
5. Click "Start Automation"

### YouTube Studio Batch Publishing
1. Navigate to [YouTube Studio](https://studio.youtube.com)
2. Open the extension and go to the "YouTube Studio" tab
3. Configure your title template, description, and tags
4. Set privacy preferences and scheduling options
5. Click "Start Batch Process"

## Configuration Options

### TikTok Ads Settings
- **CTA Text**: The call-to-action button text (e.g., "Shop Now", "Learn More")
- **Landing Page URL**: The destination URL for your campaigns
- **Auto-Optimization**: Automatically enable optimization features

### YouTube Studio Settings
- **Title Template**: Use `{filename}` and `{date}` placeholders
- **Default Description**: Applied to all processed videos
- **Default Tags**: Comma-separated list of tags
- **Privacy Setting**: Choose between Private, Unlisted, or Public
- **Auto-Schedule**: Automatically schedule video publishing

## Supported Platforms

- ✅ TikTok Ads Manager (ads.tiktok.com)
- ✅ YouTube Studio (studio.youtube.com)

## Privacy & Security

- All data is stored locally in your browser
- No personal information is transmitted to external servers
- Extension only requests necessary permissions for functionality
- All automation happens locally within your browser

## Troubleshooting

### Common Issues

**Extension not working on TikTok/YouTube**
- Ensure you're on the correct domain (ads.tiktok.com or studio.youtube.com)
- Refresh the page and try again
- Check that the extension has the necessary permissions

**Automation stops unexpectedly**
- Check browser console for error messages
- Ensure the page hasn't navigated away during automation
- Try reducing the number of items being processed

**Fields not being filled correctly**
- Platform UI changes may affect automation
- Report issues with specific page layouts
- Try manual verification of filled fields

### Getting Help

1. Check the browser console for error messages
2. Ensure you're using the latest version of the extension
3. Report issues on the project repository
4. Include browser version and specific error details

## Development

### Project Structure
```
media-buyers-toolkit/
├── manifest.json              # Extension configuration
├── popup.html                # Main extension interface
├── popup.js                  # Popup logic and UI interactions
├── background.js             # Service worker for background tasks
├── styles/
│   └── popup.css            # Extension styling
├── content-scripts/
│   ├── tiktok-automation.js # TikTok automation logic
│   └── youtube-publisher.js # YouTube automation logic
└── icons/                   # Extension icons
```

### Building from Source

1. Clone the repository
2. Make your changes
3. Test locally by loading as unpacked extension
4. Submit pull requests for improvements

## Roadmap

### Upcoming Features
- [ ] Facebook Ads integration
- [ ] Google Ads automation
- [ ] Advanced scheduling options
- [ ] Campaign performance analytics
- [ ] Export/import configuration presets
- [ ] Multi-language support

### Version History
- **v1.0.0**: Initial release with TikTok Ads and YouTube Studio automation

## Contributing

We welcome contributions from the community! Please feel free to:

1. Report bugs and issues
2. Suggest new features
3. Submit pull requests
4. Improve documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, questions, or feedback:
- Open an issue on the project repository
- Check the troubleshooting section above
- Review the browser console for error messages

## Disclaimer

This extension is designed to automate repetitive tasks and improve productivity. Users are responsible for ensuring compliance with platform terms of service and applicable regulations. Use at your own discretion and always verify automated actions.
