// Gallery Component Module
const GalleryComponent = (function() {
    function createThumbnail(item, onClick) {
        const thumbnailHtml = `
            <div class="gallery-thumbnail" data-media-id="${item.id}">
                <img src="${item.thumbnailUrl}" 
                     alt="${item.caption || `Media from ${item.sender}`}">
                ${item.type === 'video' ? `
                    <div class="video-duration">${helpers.formatDuration(item.duration)}</div>
                    <div class="video-play-overlay">
                        <div class="video-play-button">
                            <svg class="video-play-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = thumbnailHtml;
        const thumbnail = wrapper.firstElementChild;
        thumbnail.onclick = () => onClick(item.id);
        return thumbnail;
    }
    
    function renderGallery(container, conversationId, onMediaClick) {
        const mediaItems = mockData.getMediaForConversation(conversationId);
        
        if (mediaItems.length === 0) {
            container.innerHTML = `
                <div class="gallery-empty">
                    <div class="gallery-empty-content">
                        <svg class="gallery-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                            </path>
                        </svg>
                        <p class="gallery-empty-text">No media shared in this conversation yet</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Sort media by timestamp (newest first)
        const sortedMedia = [...mediaItems].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';
        
        sortedMedia.forEach(item => {
            const thumbnail = createThumbnail(item, onMediaClick);
            galleryGrid.appendChild(thumbnail);
        });
        
        container.innerHTML = '';
        container.appendChild(galleryGrid);
    }
    
    function handleMediaClick(mediaId, conversationId, onViewInChat) {
        const mediaItems = mockData.getMediaForConversation(conversationId);
        MediaViewerComponent.open(mediaItems, mediaId, onViewInChat);
    }
    
    return {
        renderGallery,
        handleMediaClick
    };
})();