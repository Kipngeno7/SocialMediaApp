# Social Media App

## Overview
A React Native / Expo social media application with web support. Built with Expo SDK 54, React 19, and expo-router for file-based routing. Includes Firebase dependency for backend services.

## Project Architecture
- **Framework**: Expo (SDK 54) with React Native
- **Router**: expo-router (file-based routing)
- **Styling**: React Native StyleSheet
- **Navigation**: Bottom tabs with Home, Explore, and Create screens
- **Web Support**: Expo web via Metro bundler, static export for deployment

## Project Structure
```
app/                    # File-based routes (expo-router)
  _layout.tsx           # Root layout with theme provider
  modal.tsx             # Modal screen
  (tabs)/               # Tab navigator group
    _layout.tsx         # Tab layout configuration
    index.tsx           # Home tab
    explore.tsx         # Explore tab
    create.tsx          # Create post tab
components/             # Reusable components
  ui/                   # UI primitives (collapsible, icon-symbol)
  hello-wave.tsx        # Animated wave component
  parallax-scroll-view.tsx
  themed-text.tsx       # Theme-aware text
  themed-view.tsx       # Theme-aware view
constants/              # Theme colors and fonts
hooks/                  # Custom hooks (color scheme, theme color)
assets/images/          # Static image assets
scripts/                # Utility scripts
```

## Development
- **Dev Server**: `npx expo start --web --port 5000`
- **Port**: 5000 (web dev server)
- **Deployment**: Static export to `dist/` directory via `npx expo export --platform web`

## Dependencies
- expo, expo-router, expo-image, expo-haptics, expo-splash-screen
- react-native-reanimated, react-native-gesture-handler
- react-native-web (web support)
- firebase (backend services)
- @react-navigation/bottom-tabs

## Recent Changes
- 2026-02-11: Initial Replit setup - configured Expo web on port 5000, static deployment
