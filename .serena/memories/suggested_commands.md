# Suggested Commands

## System Information
- **Node.js**: Available at `/Users/rokur/.nvm/versions/node/v22.17.1/bin/node`
- **npm**: Available at `/Users/rokur/.nvm/versions/node/v22.17.1/bin/npm`
- **Git**: Available at `/opt/homebrew/bin/git`
- **OS**: Darwin (macOS)

## Development Commands

### Running the Project
```bash
# Open index.html in browser (no build step required)
open index.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

### Version Control
```bash
git status              # Check current changes
git add .              # Stage all changes
git commit -m "msg"    # Commit changes
git push               # Push to remote
git branch             # Check current branch
git checkout -b name   # Create new feature branch
```

### File Operations (macOS)
```bash
ls -la                 # List all files with details
find . -name "*.js"    # Find JavaScript files
grep -r "function"     # Search for text in files
open .                 # Open current directory in Finder
```

### Code Quality
Since this is a vanilla JS project without package.json:
```bash
# No linting/formatting tools configured
# Consider adding ESLint/Prettier if needed
```

## Notes
- This is a static site - no build/compile step required
- No npm scripts or dependencies to manage
- Direct file editing and browser refresh for development