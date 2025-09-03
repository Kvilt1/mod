// Main Application Module
const App = (function() {
    let currentChat = null;
    let viewMode = 'messages';
    let allChats = [];
    
    // DOM Elements
    let chatListContainer;
    let conversationView;
    let emptyState;
    let searchInput;
    let conversationHeader;
    let messagesView;
    let galleryView;
    
    // Initialize the application
    function init() {
        // Get DOM elements
        chatListContainer = document.getElementById('chatItemsContainer');
        conversationView = document.getElementById('conversationView');
        emptyState = document.getElementById('emptyState');
        searchInput = document.getElementById('searchInput');
        conversationHeader = document.getElementById('conversationHeader');
        messagesView = document.getElementById('messagesView');
        galleryView = document.getElementById('galleryView');
        
        // Load mock data
        allChats = mockData.getChats();
        
        // Render chat list
        ChatItemComponent.renderChatList(chatListContainer, allChats, handleChatSelect);
        
        // Setup search
        searchInput.addEventListener('input', handleSearch);
        
        // Setup global handlers for conversation view
        window.conversationHandlers = {
            handleBack: () => closeConversation(),
            handleGalleryToggle: () => toggleGallery()
        };
    }
    
    // Handle chat selection
    function handleChatSelect(chat) {
        currentChat = chat;
        viewMode = 'messages';
        openConversation();
    }
    
    // Open conversation view
    function openConversation() {
        if (!currentChat) return;
        
        // Hide empty state, show conversation
        emptyState.classList.add('hidden');
        conversationView.classList.remove('hidden');
        
        // Render header
        conversationHeader.innerHTML = ConversationComponent.createHeader(
            currentChat,
            closeConversation,
            toggleGallery,
            viewMode === 'gallery'
        );
        
        // Show appropriate view
        updateViewMode();
    }
    
    // Close conversation view
    function closeConversation() {
        currentChat = null;
        conversationView.classList.add('hidden');
        emptyState.classList.remove('hidden');
    }
    
    // Toggle between messages and gallery
    function toggleGallery() {
        viewMode = viewMode === 'messages' ? 'gallery' : 'messages';
        
        // Update header button state
        conversationHeader.innerHTML = ConversationComponent.createHeader(
            currentChat,
            closeConversation,
            toggleGallery,
            viewMode === 'gallery'
        );
        
        updateViewMode();
    }
    
    // Update view based on current mode
    function updateViewMode() {
        if (!currentChat) return;
        
        if (viewMode === 'messages') {
            messagesView.classList.remove('hidden');
            galleryView.classList.add('hidden');
            
            // Load and render messages
            const messages = mockData.getConversation(currentChat.id);
            ConversationComponent.renderMessages(
                messagesView,
                messages,
                currentChat.id,
                currentChat.name
            );
        } else {
            messagesView.classList.add('hidden');
            galleryView.classList.remove('hidden');
            
            // Render gallery
            GalleryComponent.renderGallery(
                galleryView,
                currentChat.id,
                (mediaId) => handleMediaClick(mediaId)
            );
        }
    }
    
    // Handle media click in gallery
    function handleMediaClick(mediaId) {
        GalleryComponent.handleMediaClick(
            mediaId,
            currentChat.id,
            handleViewInChat
        );
    }
    
    // Handle view in chat from media viewer
    function handleViewInChat(messageId) {
        // Switch to messages view
        viewMode = 'messages';
        updateViewMode();
        
        // TODO: Scroll to specific message
        console.log('Jumping to message:', messageId);
    }
    
    // Handle search
    function handleSearch(e) {
        const query = e.target.value;
        const filteredChats = ChatItemComponent.filterChats(allChats, query);
        ChatItemComponent.renderChatList(chatListContainer, filteredChats, handleChatSelect);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    return {
        init
    };
})();