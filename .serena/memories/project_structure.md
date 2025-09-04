# Project Structure

## Directory Layout
```
/mod (project root)
├── index.html          # Main entry point
├── .gitignore          # Git ignore file
├── js/                 # JavaScript modules
│   ├── app.js          # Main application module
│   ├── components/     # UI components
│   │   ├── chatItem.js     # Chat list item component
│   │   ├── conversation.js # Conversation view component
│   │   ├── gallery.js      # Media gallery component
│   │   └── mediaViewer.js  # Media viewer modal
│   ├── data/           # Mock data
│   │   └── mockData.js     # Mock chat/message data
│   └── utils/          # Utility functions
│       └── helpers.js       # Helper functions
├── styles/             # CSS stylesheets
│   ├── main.css        # Main application styles
│   ├── chat.css        # Chat list styles
│   ├── conversation.css # Conversation view styles
│   └── media.css       # Media viewer styles
├── assets/             # Static assets
│   └── icons*/         # SVG icons for UI
└── .serena/            # Serena project config

## Component Responsibilities
- **app.js**: Application initialization, state management, routing
- **chatItem.js**: Render chat list items
- **conversation.js**: Handle conversation view and messages
- **gallery.js**: Media gallery grid view
- **mediaViewer.js**: Full-screen media viewer
- **helpers.js**: Shared utility functions
- **mockData.js**: Generate mock chat data