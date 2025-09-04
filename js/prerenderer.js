// Snapchat Prerenderer Script
const fs = require('fs').promises;
const path = require('path');

// Configuration
const OUTPUT_DATA_DIR = path.join(__dirname, '../output/data');
const DAYS_DIR = path.join(OUTPUT_DATA_DIR, 'days');
const OUTPUT_HTML_DIR = path.join(__dirname, '../output/html-days');
const ASSETS_PATH = '../../assets';

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
    const timeAgo = formatTimeAgo(conversation.latest_timestamp);
    
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
                        <span class="status-time">${timeAgo}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDefaultAvatar(name) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FECA57', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#BB8FCE', '#85C1E9', '#F8B739', '#52C3A5'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];
    const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || name[0].toUpperCase();
    
    return `
        <div style="width: 52px; height: 52px; background: ${color}; border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center; 
                    color: white; font-weight: 600; font-size: 18px;">
            ${initials}
        </div>
    `;
}

function generateDayHTML(dayData, globalData, currentDay, allDays) {
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
    
    // Generate chat items
    const chatItems = Object.entries(dayData.conversations || {})
        .sort((a, b) => b[1].latest_timestamp - a[1].latest_timestamp)
        .map(([id, conv]) => createChatItem(id, conv, globalData))
        .join('\n');
    
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
</head>
<body>
    <div id="app" class="app-container">
        <!-- Chat List Container -->
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
        
        <!-- Conversation View Container -->
        <div id="conversationView" class="conversation-view-container">
            <!-- Conversation Header with Date Navigation -->
            <div id="conversationHeader" class="conversation-header">
                <div class="header-date-nav">
                    ${prevDay ? `<a href="${prevDay}.html" class="date-nav-arrow date-nav-prev">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </a>` : '<div class="date-nav-arrow date-nav-prev disabled"></div>'}
                    
                    <div class="date-display">${dateDisplay}</div>
                    
                    ${nextDay ? `<a href="${nextDay}.html" class="date-nav-arrow date-nav-next">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </a>` : '<div class="date-nav-arrow date-nav-next disabled"></div>'}
                </div>
            </div>
            
            <!-- Messages View -->
            <div id="messagesView" class="messages-view">
                <div class="messages-container">
                    <div class="empty-conversation">
                        <svg class="empty-conversation-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                            </path>
                        </svg>
                        <p class="empty-conversation-text">Select a conversation to view messages</p>
                    </div>
                </div>
            </div>
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
            const html = generateDayHTML(dayData, globalData, day, allDays);
            
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