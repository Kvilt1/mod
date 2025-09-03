// Conversation Component Module
const ConversationComponent = (function() {
    function createHeader(chat, onBack, onGalleryClick, isGalleryActive) {
        return `
            <div class="header-left">
                <button class="back-button" onclick="conversationHandlers.handleBack()">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" 
                              d="M10.6862 13.3099C10.9671 13.0286 11.1248 12.6474 11.1248 12.2499C11.1248 11.8524 10.9671 11.4711 10.6862 11.1899L6.49617 6.99988L10.6862 2.80988C10.8294 2.67144 10.9436 2.50587 11.0221 2.32283C11.1006 2.13979 11.1419 1.94294 11.1435 1.74377C11.1452 1.5446 11.1071 1.3471 11.0316 1.16279C10.9561 0.978482 10.8447 0.811057 10.7037 0.670285C10.5628 0.529513 10.3953 0.418213 10.2109 0.342878C10.0266 0.267544 9.82902 0.229684 9.62985 0.231508C9.43068 0.233332 9.23387 0.274803 9.0509 0.353502C8.86793 0.432201 8.70247 0.54655 8.56417 0.68988L3.31417 5.93988C3.03327 6.22113 2.87549 6.60238 2.87549 6.99988C2.87549 7.39738 3.03327 7.77863 3.31417 8.05988L8.56417 13.3099C8.70347 13.4493 8.86887 13.5598 9.05092 13.6353C9.23297 13.7107 9.4281 13.7496 9.62517 13.7496C9.82223 13.7496 10.0174 13.7107 10.1994 13.6353C10.3815 13.5598 10.5469 13.4493 10.6862 13.3099Z"
                              fill="#2C3137"/>
                    </svg>
                </button>
                <div class="username-badge">
                    <span>${chat.name}</span>
                </div>
            </div>
            <div class="header-right">
                <button class="gallery-button ${isGalleryActive ? 'active' : ''}" 
                        onclick="conversationHandlers.handleGalleryToggle()" title="View Gallery">
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
        `;
    }
    
    function createMessageItem(message, senderName, senderColor, chatId) {
        const isTextMessage = message.type === 'chat';
        const shouldWrap = isTextMessage && message.text ? helpers.shouldWrapText(message.text) : false;
        
        let messageContent = '';
        
        if (isTextMessage) {
            messageContent = `
                <div class="text-message ${shouldWrap ? 'wrapped' : ''}">
                    ${message.text || ''}
                </div>
            `;
        } else {
            const iconUrl = helpers.getMediaIconUrl(message.type, message.isSender);
            const status = helpers.getMessageStatus(message.isSender, message.type);
            messageContent = `
                <div class="media-message-box">
                    <img src="${iconUrl}" alt="${message.type} ${message.isSender ? 'sent' : 'received'}" 
                         class="media-message-icon">
                    <span class="media-message-text">${status}</span>
                </div>
            `;
        }
        
        return `
            <div class="message-item ${isTextMessage ? 'text-message' : 'media-message'}">
                <div class="message-header" style="color: ${senderColor}">
                    ${senderName}
                </div>
                <div class="message-content ${isTextMessage ? 'text-type' : 'media-type'}">
                    <div class="message-highlight ${isTextMessage ? 'text-type' : 'media-type'}" 
                         style="background-color: ${senderColor}"></div>
                    ${messageContent}
                </div>
            </div>
        `;
    }
    
    function createMessageGroup(group, chatId, chatName) {
        const messagesHtml = group.messages.map(message => {
            const senderName = helpers.getUsername(chatName, message.isSender);
            const senderColor = helpers.getUserColor(chatId, message.isSender);
            return createMessageItem(message, senderName, senderColor, chatId);
        }).join('');
        
        return `
            <div class="message-group">
                <div class="date-separator">${group.date}</div>
                <div class="message-group-messages">
                    ${messagesHtml}
                </div>
            </div>
        `;
    }
    
    function renderMessages(container, messages, chatId, chatName) {
        const messageGroups = helpers.groupMessagesByDate(messages);
        const messagesHtml = messageGroups.map(group => 
            createMessageGroup(group, chatId, chatName)
        ).join('');
        
        container.innerHTML = `
            <div class="messages-container">
                <div class="messages-inner">
                    ${messagesHtml}
                </div>
            </div>
        `;
    }
    
    return {
        createHeader,
        renderMessages
    };
})();