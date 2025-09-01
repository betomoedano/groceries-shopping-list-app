# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **local-first shopping list application** built with modern cross-platform technologies. The app enables real-time synchronization while maintaining offline functionality through TinyBase's local-first architecture.

**Tech Stack:**
- **Frontend:** Expo/React Native with file-based routing
- **Backend:** Cloudflare Workers with Durable Objects
- **Database:** TinyBase (local-first database with sync capabilities)
- **Auth:** Clerk (authentication & user management)
- **Deployment:** Cloudflare for server, EAS for mobile apps

## Core Architecture

### Dual Store Pattern
The app uses a sophisticated two-store architecture:

1. **ShoppingListsStore** (`/client/stores/ShoppingListsStore.tsx`)
   - Master store containing metadata/IDs of all shopping lists
   - Handles user's collection of lists
   - Syncs across devices via Cloudflare Durable Objects

2. **ShoppingListStore** (`/client/stores/ShoppingListStore.tsx`) 
   - Individual stores for each shopping list's products/items
   - Each list gets its own isolated store instance
   - Provides granular sync and offline capabilities

### Local-First Synchronization
- **Client Persistence:** SQLite (native) / IndexedDB (web) via TinyBase persisters
- **Server Sync:** WebSocket connections to Cloudflare Durable Objects
- **Conflict Resolution:** TinyBase's built-in mergeable store capabilities handle conflicts automatically
- **Offline Support:** Full CRUD operations work offline, sync when connected

### Cross-Platform Structure
- **File-based Routing:** Uses Expo Router with `(auth)` and `(index)` route groups
- **Platform-Specific Files:** `.web.tsx`, `.ios.tsx` suffixes for platform customizations
- **Shared Components:** UI components in `/client/components/` work across all platforms

## Development Commands

### Client (Expo App)
```bash
# Navigate to client directory
cd client

# Install dependencies
bun install

# Start development server
npx expo start

# Platform-specific development
npx expo start --ios       # iOS simulator
npx expo start --android   # Android emulator
npx expo start --web       # Web browser

# Build and deploy
npm run deploy             # Build web and deploy via EAS

# Testing
npm test                   # Run Jest tests
npm run lint              # Lint code
```

### Server (Cloudflare Workers)
```bash
# Navigate to server directory
cd server

# Install dependencies
bun install

# Local development
bun dev                    # Runs wrangler dev locally

# Deploy to production
bun run deploy            # Deploy to Cloudflare Workers
```

## Environment Setup

### Required Environment Variables (Client)
Copy `client/.env.example` to `client/.env` and fill in:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication key
- `EXPO_PUBLIC_SYNC_SERVER_URL` - Server URL for synchronization

### Server Configuration
Server configuration is handled through `server/wrangler.toml`:
- Durable Objects binding for persistence
- Custom domain routing configuration
- Migration settings for schema changes

## Key Development Areas

### Data Flow Pattern
1. **User Actions** → UI Components
2. **Components** → TinyBase Store Callbacks (via useAddShoppingListCallback, etc.)
3. **Store Changes** → Automatic Persistence (SQLite/IndexedDB)  
4. **Store Changes** → WebSocket Sync to Durable Objects
5. **Server Updates** → Propagate to all connected clients

### Store Schema Management
- Stores use TypeScript schemas for type safety
- `TABLES_SCHEMA` constants define structure
- TinyBase UI-React hooks provide type-safe store operations

### Authentication Integration
- Clerk handles all auth flows with custom screens in `app/(auth)/`
- User context drives store isolation (each user gets separate store namespaces)
- Token caching configured in `cache.ts`

### Testing Strategy
- Jest configuration in `package.json` with Expo preset
- Test files use `__tests__/` directories
- Component tests for UI, unit tests for store logic

## Common Development Patterns

### Adding New List Features
1. Extend `ShoppingListStore.tsx` schema if needed
2. Create UI components in `/client/components/`
3. Add routes in `/client/app/(index)/list/[listId]/`
4. Use TinyBase hooks for reactive data binding

### Cross-Platform Customization
1. Create base component (e.g., `Component.tsx`)
2. Add platform variants (e.g., `Component.web.tsx`, `Component.ios.tsx`) 
3. Expo will automatically select the appropriate version

### Store Synchronization
- Use `useCreateServerSynchronizerAndStart` for real-time sync
- Sync happens automatically when online
- TinyBase handles conflict resolution via operational transforms

## Mobile App Deployment

### iOS App Store
- Bundle identifier: `com.betoatexpo.groceries-shopping-list`
- Apple Team ID configured in `app.json`
- App groups for widget sharing

### Android Play Store  
- Package name: `com.betoatexpo.groceriesshoppinglist`
- Adaptive icon configuration

### Web Deployment
- Metro bundler with server output
- Auto-deploys via EAS integration

Rules:

- Don’t use legacy shadow style; use box shadow instead.
- Always implement dark mode.
- Don’t use SafeAreaView since it’s deprecated.
- Use contentInsetAdjustmentBehavior="automatic" with ScrollViews.
- Each screen should use a ScrollView as its main container.
