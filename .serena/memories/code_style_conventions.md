# Code Style and Conventions

## JavaScript Patterns
- **Module Pattern**: IIFE (Immediately Invoked Function Expression) for encapsulation
- **Naming**: camelCase for functions and variables
- **Component Suffix**: Components use `Component` suffix (e.g., `ChatItemComponent`)
- **Public API**: Return object pattern for public methods
- **No ES6 modules**: Uses script tags with global scope management

## Code Organization
```
const ModuleName = (function() {
    // Private variables
    let privateVar;
    
    // Private functions
    function privateFunction() {}
    
    // Public functions
    function publicFunction() {}
    
    // Public API
    return {
        publicFunction
    };
})();
```

## File Structure
- Component-based organization in `js/components/`
- Utility functions in `js/utils/`
- Mock data in `js/data/`
- Main app logic in `js/app.js`

## CSS Conventions
- Separate stylesheets by concern (main, chat, conversation, media)
- BEM-like naming (`.chat-item`, `.chat-content`)
- Mobile-first responsive design

## DOM Manipulation
- Direct DOM API usage (no framework)
- Element creation with `createElement`
- Event handlers via `addEventListener` or `onclick`

## Comments
- Module-level comments at file start
- Function purpose comments for complex logic
- Minimal inline comments