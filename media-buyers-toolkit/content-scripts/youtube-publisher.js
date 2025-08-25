// YouTube Studio Batch Publisher Content Script
class YouTubePublisher {
    constructor() {
        this.isRunning = false;
        this.videoQueue = [];
        this.currentVideoIndex = 0;
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'startYouTubeBatch') {
                this.startBatchProcess(request.data);
                sendResponse({ success: true });
            } else if (request.action === 'stopYouTubeBatch') {
                this.stopBatchProcess();
                sendResponse({ success: true });
            }
        });
    }

    async startBatchProcess(data) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const { titleTemplate, description, tags, privacy, autoSchedule } = data;

        try {
            console.log('Starting YouTube batch process with:', data);
            
            // Wait for page to be fully loaded
            await this.waitForPageLoad();
            
            // Step 1: Navigate to content tab if not already there
            await this.navigateToContentTab();
            
            // Step 2: Find videos to process
            await this.scanForVideos();
            
            // Step 3: Process each video
            await this.processVideoQueue({
                titleTemplate,
                description,
                tags,
                privacy,
                autoSchedule
            });
            
            this.sendProgressUpdate('YouTube batch process completed successfully!');
            
        } catch (error) {
            console.error('YouTube batch error:', error);
            this.sendError(error.message);
        } finally {
            this.isRunning = false;
        }
    }

    stopBatchProcess() {
        this.isRunning = false;
        this.videoQueue = [];
        this.currentVideoIndex = 0;
        console.log('YouTube batch process stopped');
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

    async navigateToContentTab() {
        // Look for content tab link
        const contentTabSelectors = [
            'a[href*="/content"]',
            'a[data-testid*="content"]',
            'tp-yt-paper-tab:contains("Content")',
            '[role="tab"]:contains("Content")'
        ];

        const contentTab = await this.findElement(contentTabSelectors);
        if (contentTab && !contentTab.classList.contains('active')) {
            contentTab.click();
            await this.waitForNavigation();
        }
    }

    async scanForVideos() {
        // Look for video rows in the content table
        const videoRowSelectors = [
            '#video-list tr[data-video-id]',
            '.video-row',
            '[data-testid*="video-row"]',
            'tr[role="row"]:has([data-video-id])'
        ];

        await this.waitForElement(videoRowSelectors);
        
        const videoRows = document.querySelectorAll(videoRowSelectors.join(', '));
        this.videoQueue = Array.from(videoRows).slice(0, 10); // Limit to 10 videos for safety
        
        console.log(`Found ${this.videoQueue.length} videos to process`);
    }

    async processVideoQueue(settings) {
        for (let i = 0; i < this.videoQueue.length && this.isRunning; i++) {
            this.currentVideoIndex = i;
            const videoRow = this.videoQueue[i];
            
            try {
                await this.processVideo(videoRow, settings, i);
                this.sendProgressUpdate(`Processed video ${i + 1} of ${this.videoQueue.length}`);
            } catch (error) {
                console.error(`Error processing video ${i + 1}:`, error);
                // Continue with next video
            }
            
            // Delay between videos to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    async processVideo(videoRow, settings, index) {
        // Click on the video to open details
        const editButton = videoRow.querySelector('[aria-label*="edit"], [data-testid*="edit"], .edit-button');
        if (editButton) {
            editButton.click();
            await this.waitForVideoEditor();
        } else {
            throw new Error('Could not find edit button for video');
        }

        // Update video details
        await this.updateVideoTitle(settings.titleTemplate, index);
        await this.updateVideoDescription(settings.description);
        await this.updateVideoTags(settings.tags);
        await this.updateVideoPrivacy(settings.privacy);
        
        if (settings.autoSchedule) {
            await this.scheduleVideo();
        }

        // Save changes
        await this.saveVideoChanges();
        
        // Return to content list
        await this.returnToContentList();
    }

    async updateVideoTitle(template, index) {
        const titleSelectors = [
            'input[aria-label*="title"]',
            'input[data-testid*="title"]',
            '#textbox[aria-label*="title"]',
            '.video-title-input'
        ];

        const titleInput = await this.findElement(titleSelectors);
        if (titleInput) {
            const newTitle = this.generateTitle(template, index);
            await this.fillField(titleInput, newTitle);
        }
    }

    async updateVideoDescription(description) {
        if (!description) return;

        const descriptionSelectors = [
            'div[aria-label*="description"]',
            'div[data-testid*="description"]',
            '#textbox[aria-label*="description"]',
            '.video-description-input'
        ];

        const descriptionInput = await this.findElement(descriptionSelectors);
        if (descriptionInput) {
            await this.fillField(descriptionInput, description);
        }
    }

    async updateVideoTags(tags) {
        if (!tags) return;

        const tagsSelectors = [
            'input[aria-label*="tags"]',
            'input[data-testid*="tags"]',
            '#tags-input',
            '.video-tags-input'
        ];

        const tagsInput = await this.findElement(tagsSelectors);
        if (tagsInput) {
            await this.fillField(tagsInput, tags);
        }
    }

    async updateVideoPrivacy(privacy) {
        const privacySelectors = [
            `[role="radio"][data-value="${privacy}"]`,
            `input[value="${privacy}"]`,
            `.privacy-option[data-privacy="${privacy}"]`
        ];

        const privacyOption = await this.findElement(privacySelectors);
        if (privacyOption) {
            privacyOption.click();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async scheduleVideo() {
        // Look for schedule toggle or button
        const scheduleSelectors = [
            'tp-yt-paper-radio-button[name="SCHEDULE"]',
            '[data-testid*="schedule"]',
            'input[value="schedule"]',
            '.schedule-option'
        ];

        const scheduleOption = await this.findElement(scheduleSelectors);
        if (scheduleOption) {
            scheduleOption.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Set schedule time (default to next hour)
            await this.setScheduleTime();
        }
    }

    async setScheduleTime() {
        // This would need to be customized based on specific scheduling requirements
        const dateInput = await this.findElement(['input[type="date"]', '[data-testid*="date"]']);
        const timeInput = await this.findElement(['input[type="time"]', '[data-testid*="time"]']);
        
        if (dateInput && timeInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const dateStr = tomorrow.toISOString().split('T')[0];
            const timeStr = '12:00';
            
            await this.fillField(dateInput, dateStr);
            await this.fillField(timeInput, timeStr);
        }
    }

    async saveVideoChanges() {
        const saveSelectors = [
            'button[aria-label*="save"]',
            'button[data-testid*="save"]',
            '#save-button',
            '.save-button'
        ];

        const saveButton = await this.findElement(saveSelectors);
        if (saveButton && !saveButton.disabled) {
            saveButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    async returnToContentList() {
        const backSelectors = [
            'button[aria-label*="back"]',
            'button[data-testid*="back"]',
            '.back-button',
            'a[href*="/content"]'
        ];

        const backButton = await this.findElement(backSelectors);
        if (backButton) {
            backButton.click();
            await this.waitForNavigation();
        }
    }

    generateTitle(template, index) {
        if (!template) return `Video ${index + 1}`;
        
        const date = new Date().toLocaleDateString();
        const filename = `video_${index + 1}`;
        
        return template
            .replace('{filename}', filename)
            .replace('{date}', date)
            .replace('{index}', index + 1);
    }

    async waitForVideoEditor() {
        const editorSelectors = [
            '.video-editor',
            '[data-testid*="video-editor"]',
            '#video-details-form'
        ];
        
        await this.waitForElement(editorSelectors, 10000);
    }

    async waitForNavigation() {
        await new Promise(resolve => setTimeout(resolve, 2000));
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

    async waitForElement(selectors, timeout = 10000) {
        const element = await this.findElement(selectors, timeout);
        if (!element) {
            throw new Error(`Could not find element with selectors: ${selectors.join(', ')}`);
        }
        return element;
    }

    async fillField(field, value) {
        // Focus the field
        field.focus();
        
        // Clear existing value
        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
            field.select();
            document.execCommand('delete');
            field.value = value;
        } else {
            // For contenteditable divs
            field.innerHTML = value;
        }
        
        // Trigger input events
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Small delay to ensure the value is set
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    sendProgressUpdate(message) {
        chrome.runtime.sendMessage({
            action: 'automationProgress',
            data: { tool: 'youtube', message }
        });
    }

    sendError(error) {
        chrome.runtime.sendMessage({
            action: 'automationError',
            data: { tool: 'youtube', error }
        });
    }
}

// Initialize the YouTube publisher
if (window.location.hostname.includes('studio.youtube.com')) {
    new YouTubePublisher();
}
