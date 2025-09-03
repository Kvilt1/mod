// Chat Item Component Module
const ChatItemComponent = (function() {
    function createChatItem(chat, onClick) {
        const iconUrl = helpers.getIconUrl(chat.messageType, chat.status);
        const avatarColor = helpers.getAvatarColor(chat.name);
        const timeAgo = helpers.formatTimeAgo(chat.timestamp);
        
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.onclick = () => onClick(chat);
        
        // User Avatar
        const userAvatar = document.createElement('div');
        userAvatar.className = 'user-avatar';
        
        if (chat.bitmoji) {
            // Use initials placeholder instead of external image
            userAvatar.innerHTML = helpers.createBitmojiPlaceholder(chat.name, avatarColor);
        } else {
            userAvatar.innerHTML = helpers.createDefaultAvatar(avatarColor);
        }
        
        // Chat Content
        const chatContent = document.createElement('div');
        chatContent.className = 'chat-content';
        
        const chatName = document.createElement('div');
        chatName.className = 'chat-name';
        chatName.textContent = chat.name;
        
        // Chat Status
        const chatStatus = document.createElement('div');
        chatStatus.className = 'chat-status';
        
        const statusContent = document.createElement('div');
        statusContent.className = 'chat-status-content';
        
        statusContent.innerHTML = `
            <img src="${iconUrl}" alt="${chat.messageType} ${chat.status}" class="status-icon">
            <span class="status-text">${chat.status === 'sent' ? 'Opened' : 'Received'}</span>
            <span class="status-separator">·</span>
            <span class="status-time">${timeAgo}</span>
        `;
        
        chatStatus.appendChild(statusContent);
        chatContent.appendChild(chatName);
        chatContent.appendChild(chatStatus);
        
        chatItem.appendChild(userAvatar);
        chatItem.appendChild(chatContent);
        
        return chatItem;
    }
    
    function renderChatList(container, chats, onChatSelect) {
        container.innerHTML = '';
        
        // Sort chats by timestamp (most recent first)
        const sortedChats = [...chats].sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        
        sortedChats.forEach(chat => {
            const chatItem = createChatItem(chat, onChatSelect);
            container.appendChild(chatItem);
        });
    }
    
    function filterChats(chats, searchQuery) {
        if (!searchQuery) return chats;
        
        const query = searchQuery.toLowerCase();
        return chats.filter(chat => 
            chat.name.toLowerCase().includes(query)
        );
    }
    
    return {
        renderChatList,
        filterChats
    };
})();