# Mock HTML Site Generation

This documents the creation of a mock HTML site using the prerenderer with sample data.

## What was created

A complete mock Snapchat viewer site with:

### Data Structure
- **One day**: 2024-01-01
- **One conversation**: Between "testuser" and "Jane Smith"
- **10 messages** showcasing all message and snap types:
  - Text messages (chat) - both directions
  - Image snaps - both sent and received  
  - Video snaps - both sent and received
  - Voice note (NOTE media type) - with 40x40px play button and 28x28px icons
  - Mixed senders demonstrating conversation flow

### Generated Files
```
output/
├── data/
│   ├── index.json                                    # Global user data
│   └── days/2024-01-01/
│       ├── index.json                               # Day conversation metadata
│       └── messages-friend1/
│           ├── messages.json                        # 10 sample messages
│           └── media_mappings.json                  # Media file references
└── html-days/
    ├── index.html                                   # Redirects to 2024-01-01.html
    └── 2024-01-01.html                             # Complete prerendered page
```

## Features Demonstrated

1. **Message Types**:
   - Text messages with proper color coding by user
   - Image snaps with media message boxes
   - Video snaps with appropriate icons
   - Voice notes with enhanced play/pause buttons (40x40px)

2. **UI Components**:
   - Chat list with user avatars and status indicators
   - Conversation view with messages grouped by date
   - Gallery view toggle functionality
   - Media viewer modal (mock thumbnails)
   - Enhanced voice memo player with larger buttons

3. **Navigation**:
   - Date navigation (single day, so prev/next disabled)
   - Conversation selection
   - Gallery/messages toggle
   - Back button to return to chat list

## How to Use

1. **Generate the mock site** (if running locally):
   ```bash
   node js/prerenderer.js
   ```

2. **View the mock site**:
   - Open `output/html-days/index.html` in a browser
   - Or directly open `output/html-days/2024-01-01.html`
   - Click on "Jane Smith" conversation to view messages
   - Toggle gallery view using the gallery button
   - Click the voice note to see the enhanced play button

## Voice Note Enhancement

The voice notes include the enhanced play/pause buttons from the previous issue:
- **Button size**: 40x40px (increased from 32x32px)
- **Icon size**: 28x28px (increased from 24x24px)
- Interactive waveform visualization
- Speed control and duration display

This demonstrates a complete working example of the Snapchat web viewer with all requested message types and UI enhancements.