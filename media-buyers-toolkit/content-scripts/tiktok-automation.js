// TikTok Ads CTA Automation Content Script
class TikTokAutomation {
    constructor() {
        this.isRunning = false;
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'startTikTokAutomation') {
                this.startAutomation(request.data);
                sendResponse({ success: true });
            } else if (request.action === 'stopTikTokAutomation') {
                this.stopAutomation();
                sendResponse({ success: true });
            }
        });
    }

    async startAutomation(data) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const { ctaText, ctaUrl, autoOptimize } = data;

        try {
            console.log('Starting TikTok CTA automation with:', data);
            
            // Wait for page to be fully loaded
            await this.waitForPageLoad();
            
            // Step 1: Find CTA input fields
            await this.findAndFillCTAFields(ctaText, ctaUrl);
            
            // Step 2: Apply optimization settings if enabled
            if (autoOptimize) {
                await this.applyOptimizationSettings();
            }
            
            // Step 3: Save changes
            await this.saveChanges();
            
            this.sendProgressUpdate('TikTok CTA automation completed successfully!');
            
        } catch (error) {
            console.error('TikTok automation error:', error);
            this.sendError(error.message);
        } finally {
            this.isRunning = false;
        }
    }

    stopAutomation() {
        this.isRunning = false;
        console.log('TikTok automation stopped');
    }

    async waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    async findAndFillCTAFields(ctaText, ctaUrl) {
        // Common selectors for TikTok Ads CTA fields
        const ctaTextSelectors = [
            'input[placeholder*="call-to-action"]',
            'input[placeholder*="CTA"]',
            'input[data-testid*="cta-text"]',
            'input[name*="cta_text"]',
            '.cta-text-input input',
            '[data-cy*="cta"] input[type="text"]'
        ];

        const ctaUrlSelectors = [
            'input[placeholder*="landing"]',
            'input[placeholder*="URL"]',
            'input[placeholder*="website"]',
            'input[data-testid*="landing-page"]',
            'input[name*="landing_page"]',
            '.landing-page-input input',
            '[data-cy*="url"] input[type="url"]'
        ];

        // Try to find and fill CTA text field
        const ctaTextField = await this.findElement(ctaTextSelectors);
        if (ctaTextField) {
            await this.fillField(ctaTextField, ctaText);
            console.log('CTA text field filled');
        } else {
            throw new Error('Could not find CTA text input field');
        }

        // Try to find and fill CTA URL field
        const ctaUrlField = await this.findElement(ctaUrlSelectors);
        if (ctaUrlField) {
            await this.fillField(ctaUrlField, ctaUrl);
            console.log('CTA URL field filled');
        } else {
            throw new Error('Could not find CTA URL input field');
        }
    }

    async findElement(selectors, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const checkForElement = () => {
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element && element.offsetParent !== null) {
                        resolve(element);
                        return;
                    }
                }
                
                if (Date.now() - startTime < timeout) {
                    setTimeout(checkForElement, 100);
                } else {
                    resolve(null);
                }
            };
            
            checkForElement();
        });
    }

    async fillField(field, value) {
        // Focus the field
        field.focus();
        
        // Clear existing value
        field.select();
        document.execCommand('delete');
        
        // Type the new value
        field.value = value;
        
        // Trigger input events
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Small delay to ensure the value is set
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    async applyOptimizationSettings() {
        // Look for optimization checkboxes or toggles
        const optimizationSelectors = [
            'input[type="checkbox"][data-testid*="optimize"]',
            'input[type="checkbox"][data-testid*="auto"]',
            '.optimization-toggle input',
            '[data-cy*="optimize"] input[type="checkbox"]',
            'input[name*="auto_optimize"]'
        ];

        const optimizationToggles = document.querySelectorAll(optimizationSelectors.join(', '));
        
        for (const toggle of optimizationToggles) {
            if (!toggle.checked) {
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        console.log('Optimization settings applied');
    }

    async saveChanges() {
        // Look for save or continue buttons
        const saveSelectors = [
            'button[data-testid*="save"]',
            'button[data-testid*="continue"]',
            'button[data-testid*="next"]',
            'button:contains("Save")',
            'button:contains("Continue")',
            'button:contains("Next")',
            '.save-button',
            '.continue-button'
        ];

        const saveButton = await this.findElement(saveSelectors, 2000);
        
        if (saveButton && !saveButton.disabled) {
            saveButton.click();
            console.log('Changes saved');
            
            // Wait for save to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    sendProgressUpdate(message) {
        chrome.runtime.sendMessage({
            action: 'automationProgress',
            data: { tool: 'tiktok', message }
        });
    }

    sendError(error) {
        chrome.runtime.sendMessage({
            action: 'automationError',
            data: { tool: 'tiktok', error }
        });
    }
}

// Initialize the TikTok automation
if (window.location.hostname.includes('ads.tiktok.com')) {
    new TikTokAutomation();
}
