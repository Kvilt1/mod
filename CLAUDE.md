# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Snapchat web viewer application that displays exported Snapchat conversation data in a web interface. The project consists of:
- A client-side web application (index.html) with vanilla JavaScript modules
- A Node.js prerenderer that generates static HTML files for each day's conversations
- JSON data structure containing messages, media mappings, and user information

## Commands

### Generate Static HTML Files
```bash
node js/prerenderer.js
```
This generates static HTML files in `/output/html-days/` for each day with conversation data.

### Check JavaScript Syntax
```bash
node -c js/app.js
node -c js/components/*.js
node -c js/prerenderer.js
```

### Debug Code Search
```bash
grep -r "console.log" js/
grep -r "debugger" js/
grep -r "TODO" js/
```

## Architecture

### Data Structure
- **Input Data**: `/output/data/days/YYYY-MM-DD/` contains:
  - `index.json`: Day's conversation metadata
  - `messages-{id}/messages.json`: Conversation messages
  - `messages-{id}/media_mappings.json`: Media file references
- **Global Data**: `/output/data/index.json` contains user information

### Client-Side Architecture (index.html)
- **IIFE Module Pattern**: All components use Immediately Invoked Function Expressions
- **Main Components**:
  - `App`: Main application controller
  - `ChatItemComponent`: Chat list rendering
  - `ConversationComponent`: Message display
  - `GalleryComponent`: Media gallery view
  - `MediaViewerComponent`: Full-screen media viewer
- **No Framework**: Pure vanilla JavaScript with DOM manipulation

### Static Site Generator (prerenderer.js)
- Generates individual HTML files for each day
- Includes inline styles and JavaScript
- Creates navigation between days
- Generates mock gallery thumbnails (no actual media extraction yet)

### Key Features
- **Dual Mode**: Can run as dynamic web app or static prerendered pages
- **Gallery View**: Toggle between messages and media gallery (conversation-specific)
- **Grid Button**: Global button visible on all days (reserved for future functionality)
- **Date Navigation**: Navigate between available days
- **User Colors**: Deterministic color generation based on username hash

### CSS Organization
- `styles/main.css`: Core application styles
- `styles/conversation.css`: Message and conversation UI
- `styles/gallery.css`: Gallery and media viewer
- `styles/prerender.css`: Static HTML-specific styles

### Button Functionality
- **Gallery Button** (media/image icon): Only appears when conversation selected, toggles gallery view
- **Grid Button** (grid icon): Always visible, no current functionality (future use)