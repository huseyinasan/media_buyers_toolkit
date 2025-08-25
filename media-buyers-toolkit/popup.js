// Media Buyer's Toolkit - Main Popup Script
class MediaBuyersToolkit {
    constructor() {
        this.currentTab = 'tiktok';
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.checkCurrentPage();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // TikTok Ads functionality
        document.getElementById('start-tiktok-automation').addEventListener('click', () => this.startTikTokAutomation());
        document.getElementById('stop-tiktok-automation').addEventListener('click', () => this.stopTikTokAutomation());

        // YouTube Studio functionality
        document.getElementById('start-youtube-batch').addEventListener('click', () => this.startYouTubeBatch());
        document.getElementById('stop-youtube-batch').addEventListener('click', () => this.stopYouTubeBatch());

        // Footer buttons
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('feedback-btn').addEventListener('click', () => this.showFeedback());

        // Form input handlers for saving data
        this.setupFormInputHandlers();
    }

    setupFormInputHandlers() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.saveFormData());
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });

        this.currentTab = tabName;
        this.checkCurrentPage();
    }

    async checkCurrentPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = tab.url;

            // Update status indicators based on current page
            if (url.includes('ads.tiktok.com')) {
                this.updateStatus('tiktok', 'ready', 'Connected to TikTok Ads Manager');
            } else if (url.includes('studio.youtube.com')) {
                this.updateStatus('youtube', 'ready', 'Connected to YouTube Studio');
            } else {
                if (this.currentTab === 'tiktok') {
                    this.updateStatus('tiktok', 'warning', 'Please navigate to TikTok Ads Manager');
                } else {
                    this.updateStatus('youtube', 'warning', 'Please navigate to YouTube Studio');
                }
            }
        } catch (error) {
            console.error('Error checking current page:', error);
        }
    }

    updateStatus(tool, type, message) {
        const statusEl = document.getElementById(`${tool}-status`);
        statusEl.className = `status-indicator ${type}`;
        statusEl.querySelector('span').textContent = message;
    }

    // TikTok Ads Automation
    async startTikTokAutomation() {
        if (this.isProcessing) return;

        const ctaText = document.getElementById('cta-text').value.trim();
        const ctaUrl = document.getElementById('cta-url').value.trim();
        const autoOptimize = document.getElementById('auto-optimize').checked;

        if (!ctaText || !ctaUrl) {
            this.showToast('error', 'Please fill in all required fields');
            return;
        }

        if (!this.isValidUrl(ctaUrl)) {
            this.showToast('error', 'Please enter a valid URL');
            return;
        }

        this.isProcessing = true;
        this.updateButtonStates('tiktok', true);
        this.showProgress('tiktok', 'Initializing TikTok automation...');

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('ads.tiktok.com')) {
                throw new Error('Please navigate to TikTok Ads Manager first');
            }

            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, {
                action: 'startTikTokAutomation',
                data: { ctaText, ctaUrl, autoOptimize }
            });

            this.simulateProgress('tiktok', [
                { progress: 20, message: 'Analyzing campaign structure...' },
                { progress: 40, message: 'Setting up CTA elements...' },
                { progress: 60, message: 'Configuring landing page...' },
                { progress: 80, message: 'Applying optimization settings...' },
                { progress: 100, message: 'Automation completed successfully!' }
            ]);

        } catch (error) {
            console.error('TikTok automation error:', error);
            this.showToast('error', error.message || 'Failed to start TikTok automation');
            this.stopTikTokAutomation();
        }
    }

    stopTikTokAutomation() {
        this.isProcessing = false;
        this.updateButtonStates('tiktok', false);
        this.hideProgress('tiktok');
        this.showToast('info', 'TikTok automation stopped');
    }

    // YouTube Studio Batch Publisher
    async startYouTubeBatch() {
        if (this.isProcessing) return;

        const titleTemplate = document.getElementById('video-title-template').value.trim();
        const description = document.getElementById('video-description').value.trim();
        const tags = document.getElementById('video-tags').value.trim();
        const privacy = document.getElementById('video-privacy').value;
        const autoSchedule = document.getElementById('auto-schedule').checked;

        this.isProcessing = true;
        this.updateButtonStates('youtube', true);
        this.showProgress('youtube', 'Initializing YouTube batch process...');

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('studio.youtube.com')) {
                throw new Error('Please navigate to YouTube Studio first');
            }

            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, {
                action: 'startYouTubeBatch',
                data: { titleTemplate, description, tags, privacy, autoSchedule }
            });

            this.simulateProgress('youtube', [
                { progress: 15, message: 'Scanning for videos...' },
                { progress: 30, message: 'Processing video queue...' },
                { progress: 50, message: 'Uploading and configuring videos...' },
                { progress: 75, message: 'Setting metadata and privacy...' },
                { progress: 90, message: 'Finalizing publication...' },
                { progress: 100, message: 'Batch process completed!' }
            ]);

            this.showVideoQueue();

        } catch (error) {
            console.error('YouTube batch error:', error);
            this.showToast('error', error.message || 'Failed to start YouTube batch process');
            this.stopYouTubeBatch();
        }
    }

    stopYouTubeBatch() {
        this.isProcessing = false;
        this.updateButtonStates('youtube', false);
        this.hideProgress('youtube');
        this.hideVideoQueue();
        this.showToast('info', 'YouTube batch process stopped');
    }

    // UI Helper Methods
    updateButtonStates(tool, processing) {
        const startBtn = document.getElementById(`start-${tool}-${tool === 'tiktok' ? 'automation' : 'batch'}`);
        const stopBtn = document.getElementById(`stop-${tool}-${tool === 'tiktok' ? 'automation' : 'batch'}`);
        
        startBtn.disabled = processing;
        stopBtn.disabled = !processing;
    }

    showProgress(tool, message) {
        const progressSection = document.getElementById(`${tool}-progress`);
        const progressText = document.getElementById(`${tool}-progress-text`);
        const progressFill = document.getElementById(`${tool}-progress-fill`);
        
        progressSection.style.display = 'block';
        progressText.textContent = message;
        progressFill.style.width = '0%';
    }

    hideProgress(tool) {
        const progressSection = document.getElementById(`${tool}-progress`);
        progressSection.style.display = 'none';
    }

    simulateProgress(tool, steps) {
        let currentStep = 0;
        const progressFill = document.getElementById(`${tool}-progress-fill`);
        const progressText = document.getElementById(`${tool}-progress-text`);

        const interval = setInterval(() => {
            if (currentStep >= steps.length || !this.isProcessing) {
                clearInterval(interval);
                if (this.isProcessing) {
                    setTimeout(() => {
                        this.isProcessing = false;
                        this.updateButtonStates(tool, false);
                        this.hideProgress(tool);
                        this.showToast('success', `${tool === 'tiktok' ? 'TikTok automation' : 'YouTube batch process'} completed successfully!`);
                    }, 1000);
                }
                return;
            }

            const step = steps[currentStep];
            progressFill.style.width = `${step.progress}%`;
            progressText.textContent = step.message;
            currentStep++;
        }, 1500);
    }

    showVideoQueue() {
        const queueSection = document.getElementById('video-queue');
        const queueList = document.getElementById('queue-list');
        
        // Simulate video queue
        const mockVideos = [
            { name: 'Video 1.mp4', status: 'completed' },
            { name: 'Video 2.mp4', status: 'processing' },
            { name: 'Video 3.mp4', status: 'pending' }
        ];

        queueList.innerHTML = mockVideos.map(video => `
            <div class="queue-item">
                <span class="queue-item-name">${video.name}</span>
                <span class="queue-item-status ${video.status}">${video.status}</span>
            </div>
        `).join('');

        queueSection.style.display = 'block';
    }

    hideVideoQueue() {
        const queueSection = document.getElementById('video-queue');
        queueSection.style.display = 'none';
    }

    showToast(type, message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    // Data persistence
    saveFormData() {
        const formData = {
            ctaText: document.getElementById('cta-text').value,
            ctaUrl: document.getElementById('cta-url').value,
            autoOptimize: document.getElementById('auto-optimize').checked,
            videoTitleTemplate: document.getElementById('video-title-template').value,
            videoDescription: document.getElementById('video-description').value,
            videoTags: document.getElementById('video-tags').value,
            videoPrivacy: document.getElementById('video-privacy').value,
            autoSchedule: document.getElementById('auto-schedule').checked
        };

        chrome.storage.sync.set({ formData });
    }

    async loadSavedData() {
        try {
            const result = await chrome.storage.sync.get('formData');
            if (result.formData) {
                const data = result.formData;
                
                document.getElementById('cta-text').value = data.ctaText || '';
                document.getElementById('cta-url').value = data.ctaUrl || '';
                document.getElementById('auto-optimize').checked = data.autoOptimize !== false;
                document.getElementById('video-title-template').value = data.videoTitleTemplate || '';
                document.getElementById('video-description').value = data.videoDescription || '';
                document.getElementById('video-tags').value = data.videoTags || '';
                document.getElementById('video-privacy').value = data.videoPrivacy || 'private';
                document.getElementById('auto-schedule').checked = data.autoSchedule || false;
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    // Utility methods
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showHelp() {
        const helpUrl = 'https://github.com/huseyinasan/media-buyers-toolkit#readme';
        chrome.tabs.create({ url: helpUrl });
    }

    showSettings() {
        this.showToast('info', 'Settings panel coming in future update!');
    }

    showFeedback() {
        const feedbackUrl = 'https://github.com/huseyinasan/media-buyers-toolkit/issues';
        chrome.tabs.create({ url: feedbackUrl });
    }
}

// Initialize the toolkit when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MediaBuyersToolkit();
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'automationProgress') {
        // Handle progress updates from content scripts
        console.log('Progress update:', request.data);
    } else if (request.action === 'automationError') {
        // Handle errors from content scripts
        console.error('Automation error:', request.error);
    }
});
