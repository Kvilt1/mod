# Project Current State - Snapchat Prerenderer

## Completed Features
✅ **Static HTML Generation**
- Prerenderer script fully functional
- 32 days of conversations rendered to static HTML
- Each day accessible via date navigation arrows

✅ **Date Navigation System**
- Integrated into conversation header (not top bar)
- Fixed positioning with consistent arrow locations
- Responsive design for mobile devices

✅ **Conversation List Rendering**
- Proper avatar display from `/output/public/a/`
- Correct icon mapping (chat/snap/video × received/opened)
- Group conversations show last sender's avatar
- Time formatting (1h, 2d, 3w, etc.)

✅ **Visual Consistency**
- Matches original Snapchat-like design
- Proper HTML structure with nested divs
- Correct separator character (middle dot ·)
- "Opened" status for sent messages

## File System Structure
```
/mod (project root)
├── js/
│   ├── prerenderer.js         # Main prerenderer script
│   ├── components/
│   │   ├── dateNavigator.js   # Date nav component
│   │   └── chatItem.js        # Chat item component
│   └── utils/
│       └── helpers.js          # Updated icon mappings
├── styles/
│   └── prerender.css          # Prerender-specific styles
├── assets/
│   ├── icons16x17/            # Renamed sent → opened
│   └── icons14x/              # Renamed sent → opened
└── output/
    ├── html-days/             # Generated HTML files
    ├── data/                  # Source JSON data
    └── public/a/              # Avatar SVG files
```

## Key Configuration Values
- Chat list width: 380px
- Header height: 56px
- Date display width: 220px (fixed)
- Arrow gap: 40px
- Arrow button size: 28px
- Font size for date: 14px

## Integration Points
- Reads from: `/output/data/days/*/index.json`
- Reads from: `/output/data/index.json` (global user data)
- Writes to: `/output/html-days/*.html`
- Assets path: `../../assets/` (from HTML location)
- Avatar path: `../public/a/` (from HTML location)

## Next Possible Enhancements
- Add JavaScript for conversation click handling
- Implement actual message rendering
- Add search functionality
- Create gallery view for media
- Add real-time data updates