// Main Application Module
const App = (function() {
    let currentChat = null;
    let viewMode = 'messages';
    let allChats = [];
    let globalUsersData = null;
    let currentDate = null;
    let availableDates = [];
    let messagesCache = {};
    
    // DOM Elements
    let chatListContainer;
    let conversationView;
    let emptyState;
    let searchInput;
    let conversationHeader;
    let messagesView;
    let galleryView;
    
    // Initialize the application
    async function init() {
        // Get DOM elements
        chatListContainer = document.getElementById('chatItemsContainer');
        conversationView = document.getElementById('conversationView');
        emptyState = document.getElementById('emptyState');
        searchInput = document.getElementById('searchInput');
        conversationHeader = document.getElementById('conversationHeader');
        messagesView = document.getElementById('messagesView');
        galleryView = document.getElementById('galleryView');
        
        // Load global users data
        await loadGlobalUsersData();
        
        // Load mock data
        allChats = mockData.getChats();
        
        // Get available dates
        availableDates = getAvailableDates();
        if (availableDates.length > 0) {
            currentDate = availableDates[availableDates.length - 1]; // Start with most recent
        }
        
        // Render chat list
        ChatItemComponent.renderChatList(chatListContainer, allChats, handleChatSelect);
        
        // Setup search
        searchInput.addEventListener('input', handleSearch);
        
        // Setup global handlers for conversation view
        window.conversationHandlers = {
            handleBack: () => closeConversation(),
            handleGalleryToggle: () => toggleGallery(),
            handleDateChange: (date) => handleDateChange(date)
        };
    }
    
    // Load global users data from output/data/index.json
    async function loadGlobalUsersData() {
        try {
            const response = await fetch('output/data/index.json');
            if (response.ok) {
                globalUsersData = await response.json();
            }
        } catch (error) {
            console.error('Error loading global users data:', error);
        }
    }
    
    // Get available dates from the output directory structure
    function getAvailableDates() {
        // For now, return a hardcoded list based on the known date range
        // In a real implementation, this would scan the output/data/days directory
        const dates = [];
        const startDate = new Date('2025-07-18');
        const endDate = new Date('2025-08-18');
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(d.toISOString().split('T')[0]);
        }
        
        return dates;
    }
    
    // Handle date change from date navigator
    function handleDateChange(date) {
        if (!date || date === currentDate) return;
        currentDate = date;
        updateViewMode();
    }
    
    // Load messages for a conversation on a specific date
    async function loadMessagesForConversation(conversationId, date) {
        const cacheKey = `${conversationId}-${date}`;
        
        // Check cache first
        if (messagesCache[cacheKey]) {
            return messagesCache[cacheKey];
        }
        
        try {
            const messagesPath = `output/data/days/${date}/messages-${conversationId}/messages.json`;
            const response = await fetch(messagesPath);
            
            if (response.ok) {
                const messages = await response.json();
                messagesCache[cacheKey] = messages;
                return messages;
            }
        } catch (error) {
            console.error(`Error loading messages for ${conversationId} on ${date}:`, error);
        }
        
        return [];
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
        
        // Render header with date navigator
        conversationHeader.innerHTML = ConversationComponent.createHeader(
            currentChat,
            currentDate,
            availableDates,
            closeConversation,
            toggleGallery,
            handleDateChange,
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
            currentDate,
            availableDates,
            closeConversation,
            toggleGallery,
            handleDateChange,
            viewMode === 'gallery'
        );
        
        updateViewMode();
    }
    
    // Update view based on current mode
    async function updateViewMode() {
        if (!currentChat) return;
        
        // Update header to reflect current date
        conversationHeader.innerHTML = ConversationComponent.createHeader(
            currentChat,
            currentDate,
            availableDates,
            closeConversation,
            toggleGallery,
            handleDateChange,
            viewMode === 'gallery'
        );
        
        if (viewMode === 'messages') {
            messagesView.classList.remove('hidden');
            galleryView.classList.add('hidden');
            
            // Load and render real messages from output directory
            if (currentDate) {
                const messages = await loadMessagesForConversation(currentChat.id, currentDate);
                ConversationComponent.renderMessages(
                    messagesView,
                    messages,
                    globalUsersData
                );
            } else {
                // Fallback to mock data if no date selected
                const messages = mockData.getConversation(currentChat.id);
                ConversationComponent.renderMessages(
                    messagesView,
                    messages,
                    globalUsersData
                );
            }
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