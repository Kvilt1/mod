// Media Viewer Component Module
const MediaViewerComponent = (function() {
    let mediaItems = [];
    let currentIndex = 0;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;
    let videoElement = null;
    let animationFrame = null;
    let onViewInChatCallback = null;
    
    function open(items, initialMediaId, onViewInChat) {
        mediaItems = items;
        currentIndex = items.findIndex(item => item.id === initialMediaId);
        onViewInChatCallback = onViewInChat;
        isPlaying = false;
        currentTime = 0;
        duration = 0;
        
        render();
        document.getElementById('mediaViewer').classList.remove('hidden');
        
        // Add keyboard listeners
        document.addEventListener('keydown', handleKeyPress);
    }
    
    function close() {
        document.getElementById('mediaViewer').classList.add('hidden');
        document.removeEventListener('keydown', handleKeyPress);
        if (videoElement) {
            videoElement.pause();
            videoElement = null;
        }
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    }
    
    function handleKeyPress(e) {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') navigatePrevious();
        if (e.key === 'ArrowRight') navigateNext();
        if (e.key === ' ' && getCurrentItem().type === 'video') {
            e.preventDefault();
            togglePlayback();
        }
    }
    
    function getCurrentItem() {
        return mediaItems[currentIndex];
    }
    
    function navigatePrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            isPlaying = false;
            currentTime = 0;
            render();
        }
    }
    
    function navigateNext() {
        if (currentIndex < mediaItems.length - 1) {
            currentIndex++;
            isPlaying = false;
            currentTime = 0;
            render();
        }
    }
    
    function togglePlayback() {
        if (videoElement) {
            if (isPlaying) {
                videoElement.pause();
                isPlaying = false;
            } else {
                videoElement.play();
                isPlaying = true;
            }
            updateControls();
        }
    }
    
    function handleProgressClick(e) {
        if (videoElement) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * duration;
            videoElement.currentTime = newTime;
            currentTime = newTime;
            updateControls();
        }
    }
    
    function updateVideoTime() {
        if (videoElement) {
            currentTime = videoElement.currentTime;
            duration = videoElement.duration || 0;
            updateControls();
            
            if (!videoElement.paused) {
                animationFrame = requestAnimationFrame(updateVideoTime);
            }
        }
    }
    
    function updateControls() {
        const progressBar = document.querySelector('.progress-bar-fill');
        const timeDisplay = document.querySelector('.video-time');
        const playPauseButton = document.querySelector('.play-pause-button');
        
        if (progressBar) {
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }
        
        if (timeDisplay) {
            timeDisplay.textContent = `${helpers.formatTime(currentTime)} / ${helpers.formatTime(duration)}`;
        }
        
        if (playPauseButton) {
            playPauseButton.innerHTML = isPlaying ? `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <rect x="5" y="4" width="3" height="12"/>
                    <rect x="12" y="4" width="3" height="12"/>
                </svg>
            ` : `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
            `;
        }
    }
    
    function render() {
        const currentItem = getCurrentItem();
        const viewer = document.getElementById('mediaViewer');
        
        viewer.innerHTML = `
            <!-- Header -->
            <div class="media-viewer-header">
                <button class="close-button" onclick="MediaViewerComponent.close()">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M1 13L13 1" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="media-viewer-info">
                    <span class="media-sender">${currentItem.sender}</span>
                    <button class="view-in-chat-button" 
                            onclick="MediaViewerComponent.viewInChat('${currentItem.messageId}')">
                        View in Chat
                    </button>
                </div>
            </div>
            
            <!-- Content -->
            <div class="media-content-container">
                ${currentIndex > 0 ? `
                    <button class="nav-button prev" onclick="MediaViewerComponent.navigatePrevious()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" 
                                  stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                ` : ''}
                
                <div class="media-content">
                    ${currentItem.type === 'image' ? `
                        <img src="${currentItem.fullUrl}" 
                             alt="${currentItem.caption || 'Shared media'}">
                    ` : `
                        <video id="mediaVideo" src="${currentItem.fullUrl}"></video>
                    `}
                </div>
                
                ${currentIndex < mediaItems.length - 1 ? `
                    <button class="nav-button next" onclick="MediaViewerComponent.navigateNext()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" 
                                  stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                ` : ''}
            </div>
            
            <!-- Video Controls -->
            ${currentItem.type === 'video' ? `
                <div class="video-controls">
                    <div class="video-controls-inner">
                        <button class="play-pause-button" onclick="MediaViewerComponent.togglePlayback()">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                        </button>
                        <div class="progress-bar-container" onclick="MediaViewerComponent.handleProgressClick(event)">
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: 0%"></div>
                            </div>
                        </div>
                        <span class="video-time">0:00 / 0:00</span>
                    </div>
                </div>
            ` : ''}
            
            <!-- Caption -->
            ${currentItem.caption ? `
                <div class="media-caption">
                    <p class="media-caption-text">${currentItem.caption}</p>
                </div>
            ` : ''}
        `;
        
        // Setup video element if needed
        if (currentItem.type === 'video') {
            videoElement = document.getElementById('mediaVideo');
            if (videoElement) {
                videoElement.addEventListener('click', () => togglePlayback());
                videoElement.addEventListener('loadedmetadata', () => {
                    duration = videoElement.duration;
                    updateControls();
                });
                videoElement.addEventListener('timeupdate', () => {
                    if (!animationFrame) {
                        updateVideoTime();
                    }
                });
                videoElement.addEventListener('ended', () => {
                    isPlaying = false;
                    updateControls();
                });
            }
        }
    }
    
    function viewInChat(messageId) {
        close();
        if (onViewInChatCallback) {
            onViewInChatCallback(messageId);
        }
    }
    
    return {
        open,
        close,
        navigatePrevious,
        navigateNext,
        togglePlayback,
        handleProgressClick,
        viewInChat
    };
})();