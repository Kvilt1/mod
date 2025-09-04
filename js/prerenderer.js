// Snapchat Prerenderer Script
const fs = require('fs').promises;
const path = require('path');

// Configuration
const OUTPUT_DATA_DIR = path.join(__dirname, '../output/data');
const DAYS_DIR = path.join(OUTPUT_DATA_DIR, 'days');
const OUTPUT_HTML_DIR = path.join(__dirname, '../output/html-days');
const ASSETS_PATH = '../../assets';

// Color cache for deterministic user colors
const userColorCache = {};
const SIGNATURE_RED = '#FF453A'; // Snapchat signature red for "Me"

async function loadGlobalData() {
    const indexPath = path.join(OUTPUT_DATA_DIR, 'index.json');
    const data = await fs.readFile(indexPath, 'utf8');
    return JSON.parse(data);
}

async function loadDayData(dayFolder) {
    const dayPath = path.join(DAYS_DIR, dayFolder, 'index.json');
    const data = await fs.readFile(dayPath, 'utf8');
    return JSON.parse(data);
}

async function getAllDays() {
    const entries = await fs.readdir(DAYS_DIR, { withFileTypes: true });
    const days = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort();
    return days;
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

function getSnapchatIcon(conversation) {
    const kind = conversation.latest_kind || 'chat';
    const isSender = conversation.is_sender || false;
    const status = isSender ? 'opened' : 'received';
    
    // For snaps with media type
    if (kind === 'snap' && conversation.latest_media_type) {
        if (conversation.latest_media_type === 'VIDEO') {
            return `${ASSETS_PATH}/icons16x17/video-${status}.svg`;
        } else {
            return `${ASSETS_PATH}/icons16x17/snap-${status}.svg`;
        }
    }
    
    // For regular messages
    return `${ASSETS_PATH}/icons16x17/${kind}-${status}.svg`;
}

function formatMilitaryTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function createChatItem(conversationId, conversation, globalData) {
    // Get display name and avatar
    let displayName = conversationId;
    let avatarHtml = '';
    
    if (conversation.type === 'group') {
        // For groups, use the group title
        displayName = conversation.title || conversationId;
        const lastSender = conversation.latest_from;
        if (lastSender && globalData.users[lastSender]) {
            const userData = globalData.users[lastSender];
            const avatarPath = userData.avatar ? `../public${userData.avatar}` : null;
            if (avatarPath) {
                avatarHtml = `<img src="${avatarPath}" alt="${userData.display_name}" style="width: 52px; height: 52px; border-radius: 50%;">`;
            } else {
                avatarHtml = createDefaultAvatar(userData.display_name || lastSender);
            }
        } else {
            avatarHtml = createDefaultAvatar(displayName);
        }
    } else {
        // For individual conversations
        const otherUser = conversation.participants?.find(p => p !== globalData.owner) || conversationId;
        if (globalData.users[otherUser]) {
            const userData = globalData.users[otherUser];
            displayName = userData.display_name || otherUser;
            const avatarPath = userData.avatar ? `../public${userData.avatar}` : null;
            if (avatarPath) {
                avatarHtml = `<img src="${avatarPath}" alt="${displayName}" style="width: 52px; height: 52px; border-radius: 50%;">`;
            } else {
                avatarHtml = createDefaultAvatar(displayName);
            }
        } else {
            avatarHtml = createDefaultAvatar(displayName);
        }
    }
    
    const iconUrl = getSnapchatIcon(conversation);
    const militaryTime = formatMilitaryTime(conversation.latest_timestamp);
    
    return `
        <div class="chat-item" data-conversation="${conversationId}">
            <div class="user-avatar">
                ${avatarHtml}
            </div>
            <div class="chat-content">
                <div class="chat-name">${displayName}</div>
                <div class="chat-status">
                    <div class="chat-status-content">
                        <img src="${iconUrl}" class="status-icon" alt="status">
                        <span class="status-text">${conversation.is_sender ? 'Opened' : 'Received'}</span>
                        <span class="status-separator">·</span>
                        <span class="status-time">${militaryTime}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDefaultAvatar(name) {
    const color = generateUserColor(name);
    const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || name[0].toUpperCase();
    
    return `
        <div style="width: 52px; height: 52px; background: ${color}; border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center; 
                    color: white; font-weight: 600; font-size: 18px;">
            ${initials}
        </div>
    `;
}

// Load messages for a conversation
async function loadMessagesForConversation(conversationId, day) {
    try {
        const messagesPath = path.join(DAYS_DIR, day, `messages-${conversationId}`, 'messages.json');
        const data = await fs.readFile(messagesPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`No messages found for ${conversationId} on ${day}`);
        return [];
    }
}

// Get media icon URL for conversation view (14x icons)
function getMediaIconUrl(mediaType, isSender) {
    if (mediaType === 'VIDEO' || mediaType === 'video') {
        return isSender ? `${ASSETS_PATH}/icons14x/video-opened.svg` : `${ASSETS_PATH}/icons14x/video-received.svg`;
    } else {
        // Default to snap icon for IMAGE and other media types
        return isSender ? `${ASSETS_PATH}/icons14x/snap-opened.svg` : `${ASSETS_PATH}/icons14x/snap-received.svg`;
    }
}

// Format date for separator
function formatDateSeparator(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Create a single message item HTML
function createMessageItem(message, globalData) {
    const isSnap = message.kind === 'snap';
    const isChat = message.kind === 'chat';
    const isSender = message.is_sender || false;
    
    // Get sender display name and color
    let senderName = isSender ? 'Me' : message.from;
    let senderColor = getUserColor(message.from, isSender);
    
    // If we have global users data, use the display name
    if (!isSender && globalData.users && globalData.users[message.from]) {
        const userData = globalData.users[message.from];
        senderName = userData.display_name || message.from;
    }
    
    let messageContent = '';
    
    if (isSnap) {
        // Handle snap messages
        const mediaType = message.media_type || 'IMAGE';
        const iconUrl = getMediaIconUrl(mediaType, isSender);
        const status = 'Opened'; // Always show "Opened" for snaps
        
        messageContent = `
            <div class="media-message-box">
                <img src="${iconUrl}" alt="${mediaType} ${isSender ? 'sent' : 'received'}" 
                     class="media-message-icon">
                <span class="media-message-text">${status}</span>
            </div>
        `;
    } else if (isChat) {
        // Handle chat messages
        if (message.media_type === 'TEXT' && message.text) {
            const shouldWrap = message.text.length > 50;
            messageContent = `
                <div class="text-message ${shouldWrap ? 'wrapped' : ''}">
                    ${message.text}
                </div>
            `;
        } else {
            // Show placeholder for non-TEXT media types
            const mediaType = message.media_type || 'UNKNOWN';
            messageContent = `
                <div class="text-message placeholder">
                    [${mediaType}]
                </div>
            `;
        }
    }
    
    return `
        <div class="message-item ${isChat && message.media_type === 'TEXT' ? 'text-message' : 'media-message'}">
            <div class="message-header" style="color: ${senderColor}">
                ${senderName}
            </div>
            <div class="message-content ${isChat && message.media_type === 'TEXT' ? 'text-type' : 'media-type'}">
                <div class="message-highlight ${isChat && message.media_type === 'TEXT' ? 'text-type' : 'media-type'}" 
                     style="background-color: ${senderColor}"></div>
                ${messageContent}
            </div>
        </div>
    `;
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

// Create messages HTML for a conversation
function createMessagesHTML(messages, globalData) {
    if (!messages || messages.length === 0) {
        return `
            <div class="empty-messages">No messages to display</div>
        `;
    }
    
    const messageGroups = groupMessagesByDate(messages);
    const messagesHtml = messageGroups.map(group => {
        const groupMessagesHtml = group.messages.map(message => 
            createMessageItem(message, globalData)
        ).join('\n');
        
        return `
            <div class="message-group">
                <div class="date-separator">${group.date}</div>
                <div class="message-group-messages">
                    ${groupMessagesHtml}
                </div>
            </div>
        `;
    }).join('\n');
    
    return messagesHtml;
}

async function generateDayHTML(dayData, globalData, currentDay, allDays) {
    const currentIndex = allDays.indexOf(currentDay);
    const prevDay = currentIndex > 0 ? allDays[currentIndex - 1] : null;
    const nextDay = currentIndex < allDays.length - 1 ? allDays[currentIndex + 1] : null;
    
    // Format date display
    const date = new Date(currentDay);
    const dateDisplay = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Generate chat items sorted by timestamp (most recent first)
    const chatItems = Object.entries(dayData.conversations || {})
        .sort((a, b) => b[1].latest_timestamp - a[1].latest_timestamp)
        .map(([id, conv]) => createChatItem(id, conv, globalData))
        .join('\n');
    
    // Generate conversation sections with messages for each conversation
    const conversationSections = [];
    for (const [conversationId, conversation] of Object.entries(dayData.conversations || {})) {
        // Load messages for this conversation
        const messages = await loadMessagesForConversation(conversationId, currentDay);
        const messagesHtml = createMessagesHTML(messages, globalData);
        
        // Get conversation display name
        let displayName = conversationId;
        if (conversation.type === 'group') {
            displayName = conversation.title || conversationId;
        } else {
            const otherUser = conversation.participants?.find(p => p !== globalData.owner) || conversationId;
            if (globalData.users[otherUser]) {
                displayName = globalData.users[otherUser].display_name || otherUser;
            }
        }
        
        conversationSections.push({
            id: conversationId,
            name: displayName,
            messagesHtml: messagesHtml
        });
    }
    
    // Generate conversation divs for each conversation
    const conversationDivs = conversationSections.map(conv => `
        <div id="conversation-${conv.id}" class="conversation-content" style="display: none;">
            <div class="conversation-header">
                <div class="header-left">
                    <button class="back-button" onclick="hideConversation()">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" 
                                  d="M10.6862 13.3099C10.9671 13.0286 11.1248 12.6474 11.1248 12.2499C11.1248 11.8524 10.9671 11.4711 10.6862 11.1899L6.49617 6.99988L10.6862 2.80988C10.8294 2.67144 10.9436 2.50587 11.0221 2.32283C11.1006 2.13979 11.1419 1.94294 11.1435 1.74377C11.1452 1.5446 11.1071 1.3471 11.0316 1.16279C10.9561 0.978482 10.8447 0.811057 10.7037 0.670285C10.5628 0.529513 10.3953 0.418213 10.2109 0.342878C10.0266 0.267544 9.82902 0.229684 9.62985 0.231508C9.43068 0.233332 9.23387 0.274803 9.0509 0.353502C8.86793 0.432201 8.70247 0.54655 8.56417 0.68988L3.31417 5.93988C3.03327 6.22113 2.87549 6.60238 2.87549 6.99988C2.87549 7.39738 3.03327 7.77863 3.31417 8.05988L8.56417 13.3099C8.70347 13.4493 8.86887 13.5598 9.05092 13.6353C9.23297 13.7107 9.4281 13.7496 9.62517 13.7496C9.82223 13.7496 10.0174 13.7107 10.1994 13.6353C10.3815 13.5598 10.5469 13.4493 10.6862 13.3099Z"
                                  fill="#2C3137"/>
                        </svg>
                    </button>
                    <div class="username-badge">
                        <span>${conv.name}</span>
                    </div>
                </div>
                <div class="header-center">
                    <div class="date-navigator">
                        ${prevDay ? `<a href="${prevDay}.html" class="date-nav-arrow date-nav-prev">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </a>` : '<button class="date-nav-arrow date-nav-prev disabled" disabled></button>'}
                        
                        <div class="date-display">${dateDisplay}</div>
                        
                        ${nextDay ? `<a href="${nextDay}.html" class="date-nav-arrow date-nav-next">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </a>` : '<button class="date-nav-arrow date-nav-next disabled" disabled></button>'}
                    </div>
                </div>
                <div class="header-right">
                    <button class="gallery-button" title="View Gallery">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="1" width="6" height="6" rx="0.5" stroke="#16191C" stroke-opacity="0.56" stroke-width="1.5"/>
                            <rect x="9" y="1" width="6" height="6" rx="0.5" stroke="#16191C" stroke-opacity="0.56" stroke-width="1.5"/>
                            <rect x="1" y="9" width="6" height="6" rx="0.5" stroke="#16191C" stroke-opacity="0.56" stroke-width="1.5"/>
                            <rect x="9" y="9" width="6" height="6" rx="0.5" stroke="#16191C" stroke-opacity="0.56" stroke-width="1.5"/>
                        </svg>
                    </button>
                    <button class="media-button">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                            <g clip-path="url(#clip0_417_24)">
                                <path d="M7.167 6.08302C7.167 6.41454 7.0353 6.73248 6.80088 6.9669C6.56646 7.20132 6.24852 7.33302 5.917 7.33302C5.58548 7.33302 5.26754 7.20132 5.03312 6.9669C4.7987 6.73248 4.667 6.41454 4.667 6.08302C4.667 5.7515 4.7987 5.43355 5.03312 5.19913C5.26754 4.96471 5.58548 4.83302 5.917 4.83302C6.24852 4.83302 6.56646 4.96471 6.80088 5.19913C7.0353 5.43355 7.167 5.7515 7.167 6.08302Z" fill="#16191C" fill-opacity="0.56"/>
                                <path d="M0.5 13.688C0.5 13.74 0.504 13.792 0.513 13.842C0.590779 14.7797 1.01818 15.6538 1.71042 16.291C2.40265 16.9283 3.30913 17.282 4.25 17.282H11.75C12.7446 17.282 13.6984 16.8869 14.4017 16.1837C15.1049 15.4804 15.5 14.5266 15.5 13.532V4.46802C15.5 3.47346 15.1049 2.51963 14.4017 1.81637C13.6984 1.11311 12.7446 0.718018 11.75 0.718018H4.25C3.75746 0.718018 3.26974 0.815047 2.81471 1.00357C2.35967 1.19208 1.94623 1.4684 1.598 1.81672C1.24976 2.16505 0.973561 2.57856 0.785165 3.03365C0.596768 3.48873 0.499869 3.97648 0.5 4.46902V13.688ZM4.25 2.59402H11.75C12.786 2.59402 13.625 3.43402 13.625 4.46902V8.15502C13.1254 7.88242 12.5641 7.74295 11.995 7.75002C11.15 7.75002 10.475 8.18602 9.972 8.64802C9.469 9.11002 9.026 9.70402 8.65 10.218L8.525 10.388C8.181 10.862 7.893 11.256 7.607 11.555C7.268 11.908 7.123 11.917 7.123 11.917C6.955 11.917 6.841 11.837 6.283 11.328C5.804 10.892 5.065 10.25 3.874 10.25C3.316 10.25 2.812 10.364 2.375 10.57V4.46902C2.375 3.43302 3.215 2.59402 4.25 2.59402ZM13.625 11.188C13.625 11.2 13.625 11.199 13.622 11.184C13.617 11.154 13.602 11.062 13.555 10.92C13.4858 10.7056 13.3876 10.5017 13.263 10.314C13.003 9.92702 12.624 9.62502 11.996 9.62502C11.826 9.62502 11.588 9.71002 11.241 10.029C10.893 10.349 10.55 10.796 10.164 11.324L10.038 11.497C9.708 11.949 9.341 12.455 8.961 12.852C8.551 13.28 7.934 13.792 7.123 13.792C6.167 13.792 5.503 13.168 5.124 12.812C5.08924 12.7791 5.05424 12.7464 5.019 12.714C4.583 12.316 4.307 12.125 3.874 12.125C3.324 12.125 2.977 12.326 2.755 12.583C2.531 12.841 2.393 13.208 2.377 13.609C2.417 14.609 3.24 15.406 4.25 15.406H11.75C12.786 15.406 13.625 14.566 13.625 13.531V11.188Z" fill="#16191C" fill-opacity="0.56"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_417_24">
                                    <rect width="16" height="18" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="messages-view">
                <div class="messages-container">
                    <div class="messages-inner">
                        ${conv.messagesHtml}
                    </div>
                </div>
            </div>
        </div>
    `).join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snapchat - ${currentDay}</title>
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/chat.css">
    <link rel="stylesheet" href="../../styles/conversation.css">
    <link rel="stylesheet" href="../../styles/prerender.css">
    <script>
        function showConversation(conversationId) {
            // Hide empty state, default header, and show selected conversation
            document.getElementById('emptyState').style.display = 'none';
            document.getElementById('defaultHeader').style.display = 'none';
            document.querySelectorAll('.conversation-content').forEach(el => {
                el.style.display = 'none';
            });
            const convEl = document.getElementById('conversation-' + conversationId);
            if (convEl) {
                convEl.style.display = 'block';
                document.getElementById('conversationView').style.display = 'flex';
            }
        }
        
        function hideConversation() {
            // Hide all conversations and show empty state with default header
            document.querySelectorAll('.conversation-content').forEach(el => {
                el.style.display = 'none';
            });
            document.getElementById('conversationView').style.display = 'flex';
            document.getElementById('defaultHeader').style.display = 'flex';
            document.getElementById('emptyState').style.display = 'flex';
        }
        
        // Add click handlers after page load
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.chat-item').forEach(item => {
                item.addEventListener('click', function() {
                    const conversationId = this.getAttribute('data-conversation');
                    if (conversationId) {
                        showConversation(conversationId);
                    }
                });
            });
        });
    </script>
</head>
<body>
    <div id="app" class="app-container">
        <!-- Chat List Container (always visible) -->
        <div id="chatList" class="chat-list-container">
            <!-- Search Bar -->
            <div class="search-bar">
                <div class="search-input-container">
                    <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input type="text" placeholder="Search" class="search-input" id="searchInput">
                </div>
            </div>
            
            <!-- Chat Items Container -->
            <div id="chatItemsContainer" class="chat-items-container">
                ${chatItems || '<div class="empty-state">No conversations for this day</div>'}
            </div>
        </div>
        
        <!-- Conversation View Container (right panel) -->
        <div id="conversationView" class="conversation-view-container">
            <!-- Default Header with Date Navigator (shown with empty state) -->
            <div id="defaultHeader" class="conversation-header">
                <div class="header-left">
                    <!-- Empty left section for balance -->
                </div>
                <div class="header-center">
                    <div class="date-navigator">
                        ${prevDay ? `<a href="${prevDay}.html" class="date-nav-arrow date-nav-prev">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </a>` : '<button class="date-nav-arrow date-nav-prev disabled" disabled></button>'}
                        
                        <div class="date-display">${dateDisplay}</div>
                        
                        ${nextDay ? `<a href="${nextDay}.html" class="date-nav-arrow date-nav-next">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </a>` : '<button class="date-nav-arrow date-nav-next disabled" disabled></button>'}
                    </div>
                </div>
                <div class="header-right">
                    <!-- Empty right section for balance -->
                </div>
            </div>
            
            <!-- Empty State (shown by default) -->
            <div id="emptyState" class="empty-state">
                <div class="empty-state-content">
                    <div class="empty-state-icon-wrapper">
                        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                            </path>
                        </svg>
                    </div>
                    <h3 class="empty-state-title">Select a conversation</h3>
                    <p class="empty-state-description">Choose from your existing conversations to view messages</p>
                </div>
            </div>
            
            <!-- Conversation Content (hidden by default, one for each conversation) -->
            ${conversationDivs}
        </div>
    </div>
</body>
</html>`;
}

async function generateAllDays() {
    try {
        // Create output directory
        await fs.mkdir(OUTPUT_HTML_DIR, { recursive: true });
        
        // Load global data
        const globalData = await loadGlobalData();
        
        // Get all days
        const allDays = await getAllDays();
        console.log(`Found ${allDays.length} days to process`);
        
        // Generate HTML for each day
        for (const day of allDays) {
            console.log(`Processing ${day}...`);
            const dayData = await loadDayData(day);
            const html = await generateDayHTML(dayData, globalData, day, allDays);
            
            const outputPath = path.join(OUTPUT_HTML_DIR, `${day}.html`);
            await fs.writeFile(outputPath, html);
        }
        
        // Create index.html that redirects to the latest day
        if (allDays.length > 0) {
            const latestDay = allDays[allDays.length - 1];
            const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=${latestDay}.html">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to latest day...</p>
</body>
</html>`;
            await fs.writeFile(path.join(OUTPUT_HTML_DIR, 'index.html'), indexHtml);
        }
        
        console.log(`Successfully generated ${allDays.length} HTML files in ${OUTPUT_HTML_DIR}`);
        
    } catch (error) {
        console.error('Error generating HTML files:', error);
    }
}

// Run the prerenderer
generateAllDays();