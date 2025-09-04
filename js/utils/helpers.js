// Helper Functions Module
const helpers = (function() {
    // Cache for deterministic user colors
    const userColorCache = {};
    const SIGNATURE_RED = '#FF453A'; // Snapchat signature red for "Me"
    
    // Get icon URL based on message type and status
    function getIconUrl(messageType, status) {
        const iconMap = {
            'chat-received': 'assets/icons16x17/chat-received.svg',
            'chat-sent': 'assets/icons16x17/chat-opened.svg',
            'snap-received': 'assets/icons16x17/snap-received.svg',
            'snap-sent': 'assets/icons16x17/snap-opened.svg',
            'video-received': 'assets/icons16x17/video-received.svg',
            'video-sent': 'assets/icons16x17/video-opened.svg'
        };
        return iconMap[`${messageType}-${status}`] || 'assets/icons16x17/chat-received.svg';
    }
    
    // Get Snapchat-style icon based on conversation data
    function getSnapchatIcon(conversation) {
        const kind = conversation.latest_kind || 'chat';
        const isSender = conversation.is_sender || false;
        const status = isSender ? 'opened' : 'received';
        
        // For snaps with media type
        if (kind === 'snap' && conversation.latest_media_type) {
            if (conversation.latest_media_type === 'VIDEO') {
                return `assets/icons16x17/video-${status}.svg`;
            } else {
                return `assets/icons16x17/snap-${status}.svg`;
            }
        }
        
        // For regular messages
        return `assets/icons16x17/${kind}-${status}.svg`;
    }

    // Get media icon URL for conversation view (14x icons)
    function getMediaIconUrl(mediaType, isSender) {
        if (mediaType === 'VIDEO' || mediaType === 'video') {
            return isSender ? 'assets/icons14x/video-opened.svg' : 'assets/icons14x/video-received.svg';
        } else {
            // Default to snap icon for IMAGE and other media types
            return isSender ? 'assets/icons14x/snap-opened.svg' : 'assets/icons14x/snap-received.svg';
        }
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

    // Generate deterministic user color from username
    function generateUserColor(username) {
        // If already cached, return it
        if (userColorCache[username]) {
            return userColorCache[username];
        }
        
        // Hash the username to get a deterministic number
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = ((hash << 5) - hash) + username.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Snapchat accent colors palette (warm, saturated tones)
        // Using HSL for consistent saturation and lightness
        const hueRanges = [
            [0, 20],    // Reds
            [20, 45],   // Oranges
            [45, 65],   // Yellows
            [160, 200], // Cyans
            [200, 260], // Blues
            [260, 290], // Purples
            [290, 330], // Magentas
            [330, 360]  // Pink-reds
        ];
        
        // Pick a hue range based on hash
        const rangeIndex = Math.abs(hash) % hueRanges.length;
        const [minHue, maxHue] = hueRanges[rangeIndex];
        
        // Generate hue within the selected range
        const hue = minHue + (Math.abs(hash * 7919) % (maxHue - minHue));
        
        // Fixed saturation and lightness for Snapchat-style colors
        const saturation = 85; // High saturation for vibrant colors
        const lightness = 55;  // Medium lightness for good contrast
        
        // Convert HSL to hex
        const color = hslToHex(hue, saturation, lightness);
        
        // Cache the color
        userColorCache[username] = color;
        return color;
    }

    // Convert HSL to Hex
    function hslToHex(h, s, l) {
        s = s / 100;
        l = l / 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`;
    }

    // Get user color for messages
    function getUserColor(username, isSender) {
        if (isSender) {
            return SIGNATURE_RED;
        }
        return generateUserColor(username);
    }

    // Get username for messages
    function getUsername(username, isSender) {
        return isSender ? 'Me' : username;
    }

    // Get message status text for snaps
    function getMessageStatus(isSender, type) {
        // Always return "Opened" for snaps per requirements
        return 'Opened';
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
        getSnapchatIcon,
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
        createBitmojiPlaceholder,
        generateUserColor,
        SIGNATURE_RED
    };
})();;