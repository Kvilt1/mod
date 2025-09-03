// Helper Functions Module
const helpers = (function() {
    // Get icon URL based on message type and status
    function getIconUrl(messageType, status) {
        const iconMap = {
            'chat-received': 'assets/icons16x17/chat-received.svg',
            'chat-sent': 'assets/icons16x17/chat-sent.svg',
            'snap-received': 'assets/icons16x17/snap-received.svg',
            'snap-sent': 'assets/icons16x17/snap-sent.svg',
            'video-received': 'assets/icons16x17/video-received.svg',
            'video-sent': 'assets/icons16x17/video-sent.svg'
        };
        return iconMap[`${messageType}-${status}`] || 'assets/icons16x17/chat-received.svg';
    }

    // Get media icon URL for conversation view
    function getMediaIconUrl(type, isSender) {
        const iconMap = {
            'snap-true': 'assets/icons14x/snap-sent.svg',
            'snap-false': 'assets/icons14x/snap-received.svg',
            'video-true': 'assets/icons14x/video-sent.svg',
            'video-false': 'assets/icons14x/video-received.svg'
        };
        return iconMap[`${type}-${isSender}`] || 'assets/icons14x/snap-received.svg';
    }

    // Get avatar color based on name
    function getAvatarColor(name) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FECA57', '#DDA0DD', '#98D8C8', '#F7DC6F',
            '#BB8FCE', '#85C1E9', '#F8B739', '#52C3A5'
        ];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    }

    // Get user color for messages
    function getUserColor(chatId, isSender) {
        if (isSender) return '#007AFF';
        const colors = ['#FF3B30', '#34C759', '#FF9500', '#AF52DE', '#5AC8FA', '#FFD60A'];
        const hash = chatId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    }

    // Get username for messages
    function getUsername(chatName, isSender) {
        return isSender ? 'Me' : chatName.split(' ')[0];
    }

    // Get message status text
    function getMessageStatus(isSender, type) {
        return isSender ? 'Opened' : 'Received';
    }

    // Format time ago
    function formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
        return `${Math.floor(seconds / 604800)}w`;
    }

    // Format date for separator
    function formatDateSeparator(date) {
        const today = new Date();
        const messageDate = new Date(date);
        const diffDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return messageDate.toLocaleDateString('en-US', options);
    }

    // Group messages by date
    function groupMessagesByDate(messages) {
        const groups = [];
        let currentGroup = null;
        
        messages.forEach(message => {
            const date = formatDateSeparator(message.timestamp);
            
            if (!currentGroup || currentGroup.date !== date) {
                currentGroup = {
                    date: date,
                    messages: []
                };
                groups.push(currentGroup);
            }
            
            currentGroup.messages.push(message);
        });
        
        return groups;
    }

    // Check if text should wrap
    function shouldWrapText(text) {
        return text && text.length > 50;
    }

    // Format video duration
    function formatDuration(seconds) {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Format video time
    function formatTime(seconds) {
        if (!seconds && seconds !== 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Create default avatar SVG
    function createDefaultAvatar(color) {
        return `
            <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27 54.06C33.48 54.06 39.48 51.78 44.16 47.94C43.32 46.68 42.36 45.78 41.34 44.94C38.22 42.48 33.78 41.58 30.72 41.04L30.6 39.84C35.28 37.08 36.42 34.14 38.28 27.96L38.34 27.54C38.34 27.54 39.96 26.88 40.2 23.88C40.56 19.8 38.88 21 38.88 20.7C39.06 18.6 39 15.84 38.4 13.8C37.14 9.42 32.88 5.94 27 5.94C21.12 5.94 16.86 9.36 15.6 13.8C15 15.84 14.94 18.6 15.12 20.76C15.12 21.06 13.5 19.86 13.8 23.94C14.04 26.94 15.66 27.6 15.66 27.6L15.72 28.02C17.58 34.2 18.72 37.14 23.4 39.9L23.28 41.1C20.28 41.64 15.78 42.54 12.66 45C11.64 45.84 10.68 46.74 9.84 48C14.52 51.78 20.52 54.06 27 54.06Z"
                    fill="${color}"
                    stroke="black"
                    stroke-opacity="0.2"
                    stroke-width="0.9"/>
            </svg>
        `;
    }

    // Create Bitmoji placeholder with initials
    function createBitmojiPlaceholder(name, color) {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        return `
            <div style="width: 52px; height: 52px; background: ${color}; border-radius: 50%; 
                        display: flex; align-items: center; justify-content: center; 
                        color: white; font-weight: 600; font-size: 18px;">
                ${initials}
            </div>
        `;
    }

    return {
        getIconUrl,
        getMediaIconUrl,
        getAvatarColor,
        getUserColor,
        getUsername,
        getMessageStatus,
        formatTimeAgo,
        formatDateSeparator,
        groupMessagesByDate,
        shouldWrapText,
        formatDuration,
        formatTime,
        createDefaultAvatar,
        createBitmojiPlaceholder
    };
})();