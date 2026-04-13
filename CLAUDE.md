# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScTranslator is a Chrome extension that provides a great inline web translation experience. It supports translating with multiple translation sources simultaneously, translation history, separated translate windows, customizable themes, text preprocessing, translation collection, and webpage translation.

## Architecture

### Entry Points
The extension has multiple entry points managed by webpack:
- `popup`: Main popup interface when clicking the extension icon
- `content`: Content script injected into web pages
- `background`: Service worker managing extension lifecycle, context menus, and commands
- `options`: Settings page for user configuration
- `collection`: Page for translation collections
- `history`: Page for translation history
- `separate`: Separate translate window

### Tech Stack
- React 19 with TypeScript
- Redux Toolkit for state management
- Webpack 5 for bundling
- Manifest V3 for Chrome extension

### State Management
- Redux store located at `src/redux/store/index.ts`
- Slices for different state concerns:
  - `panelStatusSlice`: Manages UI panel states
  - `translateHistorySlice`: Handles translation history
  - `translationSlice`: Manages current translation state

### Core Components
- Located in `src/components/` - reusable UI components
- Entry-specific UI in respective `src/entry/*/` directories
- CSS modules and global styles in `src/styles/`

### Data Flow
- User interactions trigger Redux actions
- Translation requests are processed through `fetchTranslationFromSource` async thunk
- Results update the Redux state which propagates to UI components
- Options are persisted in browser storage

## Development Commands

### Essential Commands
```bash
# Install dependencies
yarn install

# Build for production
yarn build

# Development build with hot reload
yarn dev

# Type checking
yarn check-types
```

### Extension Loading
1. Run `yarn build` to create a production build
2. Load the `build/` directory in Chrome as an unpacked extension
3. Enable developer mode in Chrome Extensions page

## Key Files and Directories

### Core Logic
- `src/public/` - Shared utilities and browser-agnostic functions
- `src/redux/` - State management (actions, reducers, middleware)
- `src/types/index.ts` - Main type definitions
- `src/constants/` - Configuration constants

### Extension Specific
- `public/manifest.json` - Extension manifest (Manifest V3)
- `src/entry/background/` - Service worker functionality
- `src/entry/content/` - Content script that interacts with web pages
- `src/entry/popup/` - Main extension popup UI

## Important Patterns

### Translation Process
1. Text is preprocessed using `textPreprocessing()` function
2. Translation requests are dispatched via `fetchTranslationFromSource` thunk
3. Multiple translation sources can be queried simultaneously
4. Results are stored in Redux state and displayed in UI

### State Updates
- Use Redux Toolkit's createSlice for new reducers
- Async operations handled via createAsyncThunk
- State normalization follows Redux best practices

### Browser Compatibility
- Target Chrome 88+ (as per babel config)
- Use chrome.* APIs appropriately with Manifest V3
- Handle browser storage asynchronously

## Common Tasks

### Adding New Translation Sources
1. Define source configuration in constants
2. Implement translation logic in `src/public/send.ts`
3. Update types in `src/types/index.ts`

### Modifying UI Components
1. Components are in `src/components/`
2. Entry-specific UI is in respective `src/entry/*/` directories
3. Use CSS modules or global styles appropriately

### Updating Extension Options
1. Modify `DefaultOptions` type in `src/types/index.ts`
2. Update initialization in `src/entry/background/install.ts`
3. Update options UI in `src/entry/options/`