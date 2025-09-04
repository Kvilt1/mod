# Snapchat Prerenderer Implementation

## Overview
Created a static HTML prerenderer for Snapchat-like chat interface that generates individual HTML files for each day from the output data.

## Key Components

### 1. Date Navigation System
- Moved date navigation from top header into conversation header area
- Fixed width (220px) for date display to prevent arrow shifting
- Increased gap between arrows (40px) for consistent positioning
- Smaller design (28px arrows, 14px font) aligned with search bar height (56px)

### 2. Prerenderer Script (`js/prerenderer.js`)
- Parses all days from `/output/data/days/` directory
- Generates static HTML for each day with proper conversation list
- Maps users to avatars from `/output/public/a/` directory
- Handles both individual and group conversations
- For groups: uses `latest_from` to determine last sender's avatar

### 3. Icon System Updates
- Renamed all "sent" icons to "opened" for consistency:
  - `chat-sent.svg` → `chat-opened.svg`
  - `snap-sent.svg` → `snap-opened.svg`  
  - `video-sent.svg` → `video-opened.svg`
- Updated in both `icons16x17` and `icons14x` folders
- Icon mapping logic:
  - Chat: `is_sender: true` → `chat-opened.svg`, `false` → `chat-received.svg`
  - Snap (IMAGE): `is_sender: true` → `snap-opened.svg`, `false` → `snap-received.svg`
  - Video: `is_sender: true` → `video-opened.svg`, `false` → `video-received.svg`

### 4. HTML Structure Fixes
- Added `chat-status-content` wrapper div inside `chat-status`
- Changed separator from bullet `•` to middle dot `·` 
- Status text shows "Opened" for sent messages, "Received" for received
- Added bordered container (`messages-container`) around messages area

### 5. Layout Improvements
- Two-panel layout: chat list (380px) + conversation area (flex: 1)
- Persistent empty conversation header for consistent spacing
- Message area with centered empty state
- Responsive design with mobile support

## File Structure
```
/output/html-days/
├── 2025-07-18.html through 2025-08-18.html (32 files)
└── index.html (redirects to latest day)
```

## CSS Organization
- `styles/prerender.css` - Specific styles for prerendered pages
- Header height: 56px (matching search bar)
- Messages container with 12px border radius and #E1E1E1 border

## Data Flow
1. Load global data from `/output/data/index.json`
2. For each day in `/output/data/days/`:
   - Load day's `index.json`
   - Generate conversation items with proper icons
   - Create HTML with date navigation
   - Write to `/output/html-days/[date].html`