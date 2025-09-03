// Mock Data Module
const mockData = (function() {
    const mockChats = [
        {
            id: 'chat_1',
            name: 'Alex Johnson',
            status: 'received',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            messageType: 'chat',
            bitmoji: 'alex.png'
        },
        {
            id: 'chat_2',
            name: 'Emma Davis',
            status: 'sent',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            messageType: 'snap',
            bitmoji: null
        },
        {
            id: 'chat_3',
            name: 'Michael Chen',
            status: 'received',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            messageType: 'video',
            bitmoji: 'michael.png'
        },
        {
            id: 'chat_4',
            name: 'Sarah Williams',
            status: 'sent',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            messageType: 'chat',
            bitmoji: null
        },
        {
            id: 'chat_5',
            name: 'James Anderson',
            status: 'received',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            messageType: 'snap',
            bitmoji: 'james.png'
        }
    ];

    const mockConversations = {
        'chat_1': [
            { id: 'msg_1', text: 'Hey! How are you doing?', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 3700000).toISOString() },
            { id: 'msg_2', text: "I'm good! Just working on the new project", type: 'chat', isSender: true, timestamp: new Date(Date.now() - 3650000).toISOString() },
            { id: 'msg_3', text: 'That sounds exciting! What kind of project?', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'msg_4', type: 'snap', isSender: true, timestamp: new Date(Date.now() - 3550000).toISOString() },
            { id: 'msg_5', text: 'Nice! Let me know if you need any help', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 3500000).toISOString() }
        ],
        'chat_2': [
            { id: 'msg_6', text: 'Are we still meeting tomorrow?', type: 'chat', isSender: true, timestamp: new Date(Date.now() - 7400000).toISOString() },
            { id: 'msg_7', text: 'Yes! 2 PM at the coffee shop?', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 7350000).toISOString() },
            { id: 'msg_8', text: 'Perfect! See you there', type: 'chat', isSender: true, timestamp: new Date(Date.now() - 7300000).toISOString() },
            { id: 'msg_9', type: 'video', isSender: false, timestamp: new Date(Date.now() - 7200000).toISOString() }
        ],
        'chat_3': [
            { id: 'msg_10', type: 'video', isSender: false, timestamp: new Date(Date.now() - 11000000).toISOString() },
            { id: 'msg_11', text: 'Check out this amazing view!', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 10950000).toISOString() },
            { id: 'msg_12', text: 'Wow! Where is that?', type: 'chat', isSender: true, timestamp: new Date(Date.now() - 10900000).toISOString() },
            { id: 'msg_13', text: 'Grand Canyon! Just got here this morning', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 10850000).toISOString() },
            { id: 'msg_14', type: 'snap', isSender: false, timestamp: new Date(Date.now() - 10800000).toISOString() }
        ],
        'chat_4': [
            { id: 'msg_15', text: 'Did you see the game last night?', type: 'chat', isSender: true, timestamp: new Date(Date.now() - 14500000).toISOString() },
            { id: 'msg_16', text: 'Yes! That last minute goal was incredible!', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 14450000).toISOString() },
            { id: 'msg_17', text: "I know right! I couldn't believe it", type: 'chat', isSender: true, timestamp: new Date(Date.now() - 14400000).toISOString() }
        ],
        'chat_5': [
            { id: 'msg_18', text: 'Happy Birthday! 🎉', type: 'chat', isSender: false, timestamp: new Date(Date.now() - 86500000).toISOString() },
            { id: 'msg_19', text: 'Thank you so much!', type: 'chat', isSender: true, timestamp: new Date(Date.now() - 86450000).toISOString() },
            { id: 'msg_20', type: 'snap', isSender: false, timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]
    };

    // Generate placeholder image URLs using gradient colors
    function generatePlaceholderImage(seed, width = 400, height = 300) {
        const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FECA57', 'DDA0DD'];
        const color = colors[seed.length % colors.length];
        return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='${width}' height='${height}' fill='%23${color}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3E📷%3C/text%3E%3C/svg%3E`;
    }

    const placeholderMedia = {
        'chat_1': [
            {
                id: 'media_1',
                type: 'image',
                thumbnailUrl: generatePlaceholderImage('thumb1', 150, 150),
                fullUrl: generatePlaceholderImage('full1', 800, 600),
                sender: 'Alex Johnson',
                timestamp: new Date(Date.now() - 3550000).toISOString(),
                messageId: 'msg_4',
                caption: 'Working on the project'
            }
        ],
        'chat_2': [
            {
                id: 'media_2',
                type: 'video',
                thumbnailUrl: generatePlaceholderImage('thumb2', 150, 150),
                fullUrl: generatePlaceholderImage('full2', 800, 600),
                sender: 'Emma Davis',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                messageId: 'msg_9',
                duration: 15,
                caption: 'Coffee shop preview'
            }
        ],
        'chat_3': [
            {
                id: 'media_3',
                type: 'video',
                thumbnailUrl: generatePlaceholderImage('thumb3', 150, 150),
                fullUrl: generatePlaceholderImage('full3', 800, 600),
                sender: 'Michael Chen',
                timestamp: new Date(Date.now() - 11000000).toISOString(),
                messageId: 'msg_10',
                duration: 30,
                caption: 'Grand Canyon sunrise'
            },
            {
                id: 'media_4',
                type: 'image',
                thumbnailUrl: generatePlaceholderImage('thumb4', 150, 150),
                fullUrl: generatePlaceholderImage('full4', 800, 600),
                sender: 'Michael Chen',
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                messageId: 'msg_14',
                caption: 'Amazing view!'
            }
        ],
        'chat_5': [
            {
                id: 'media_5',
                type: 'image',
                thumbnailUrl: generatePlaceholderImage('thumb5', 150, 150),
                fullUrl: generatePlaceholderImage('full5', 800, 600),
                sender: 'James Anderson',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                messageId: 'msg_20',
                caption: 'Birthday surprise!'
            }
        ]
    };

    return {
        getChats: () => [...mockChats],
        getConversation: (chatId) => mockConversations[chatId] || [],
        getMediaForConversation: (chatId) => placeholderMedia[chatId] || []
    };
})();