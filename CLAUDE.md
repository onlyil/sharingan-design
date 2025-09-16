# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kaleidoscope Sharingan Designer - A Next.js web application for creating custom Mangekyo Sharingan eye patterns inspired by Naruto anime. Uses canvas-based graphics with real-time bezier curve editing and symmetry replication.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Start production server
pnpm start
```

## Architecture Overview

### Core Components
- **sharingan-designer/**: Modular design interface with split components
  - `index.tsx`: Main component orchestrating state and tab navigation (~300 lines)
  - `basic-settings-tab.tsx`: Preset selection, symmetry axes, pupil size controls
  - `drawing-tab.tsx`: Bezier path editor with path management
  - `color-settings-tab.tsx`: Pupil and path color configuration
  - `animation-tab.tsx`: Rotation speed controls
  - `data-tab.tsx`: Save/load designs, reset, copy config functionality
  - `types.ts`: Shared TypeScript interfaces
  - `utils.ts`: Utility functions for data persistence and manipulation
- **sharingan-preview.tsx**: Optimized canvas-based preview component with dirty checking, path caching, and separate animation loop for performance  
- **bezier-editor.tsx**: Interactive canvas editor for creating/editing bezier curves with drag-and-drop control points

### Coordinate System
The app uses two coordinate systems with transformation logic in `/constants/coordinate-system.ts`:
- **Editor coordinates**: 300x300 canvas, center at (100, 150), reference radius 200
- **Preview coordinates**: 400x400 canvas, dynamic radius based on size
- **Transformation**: `editorToPreview()` function handles scaling and offset conversion

### State Management
- React hooks for local state in SharinganDesigner component
- Bezier paths stored as arrays of `BezierPoint` objects with control points
- Symmetry settings control how many axes (3, 4, etc.) for pattern replication
- Color settings include pupil color, path fill color, and pupil size ratio

### Key Interfaces
```typescript
interface BezierPoint {
  x: number
  y: number
  cp1x?: number  // First control point X
  cp1y?: number  // First control point Y
  cp2x?: number  // Second control point X
  cp2y?: number  // Second control point Y
}

interface SymmetrySettings {
  axes: number  // Number of symmetry axes
}

interface ColorSettings {
  pupilColor: string     // Default: "#e70808" (red)  
  pathFillColor: string  // Default: "#000000" (black)
  pupilSize: number      // Default: 0.14 (ratio of radius)
}
```

### UI Framework
- Uses shadcn/ui components with Radix UI primitives
- Tailwind CSS v4.1.9 for styling
- Dark theme support via next-themes
- Responsive design with mobile considerations

### Canvas Rendering
- HTML5 Canvas API for both editor and preview  
- Real-time path rendering with bezier curve support
- Symmetry transformation using mathematical rotation
- Animation loop with configurable speed

### Component Architecture
The sharingan-designer component follows a modular architecture:
- **Main Component** (`index.tsx`): Manages global state and tab navigation
- **Tab Components**: Each tab is a separate component with specific responsibilities:
  - Basic settings: Preset management and basic parameters
  - Drawing: Bezier path editing and management
  - Color: Color scheme configuration
  - Animation: Rotation and animation controls
  - Data: Save/load functionality and configuration export
- **Utility Layer** (`utils.ts`): Handles data persistence, clipboard operations, and design management
- **Type Definitions** (`types.ts`): Centralized TypeScript interfaces for type safety

### Build Configuration
- **ESLint/TypeScript**: Errors ignored during builds (see next.config.mjs)
- **Image Optimization**: Disabled for faster builds
- **Vercel Deployment**: Auto-sync from v0.app

## Key Technical Details

### Coordinate Transformation
The coordinate system is critical for proper rendering. Editor uses fixed 300x300 canvas while preview scales dynamically:
```typescript
// Scale calculation
const scale = previewRadius / EDITOR_CONFIG.REFERENCE_RADIUS

// Coordinate conversion
const [previewX, previewY] = [
  (editorX - EDITOR_CONFIG.CENTER_X) * scale,
  (editorY - EDITOR_CONFIG.CENTER_Y) * scale
]
```

### State Persistence
- LocalStorage with 500ms debounce delay
- Supports both legacy format (single path) and current format (multiple paths)
- Automatic migration from old data formats

### Performance Optimizations
- Dirty checking in preview component to avoid unnecessary re-renders
- Path caching for animation frames
- Separate animation loop using requestAnimationFrame
- Canvas-based rendering for smooth graphics

### Preset System
Built-in character presets with predefined bezier paths:
- **Itachi (鼬)**: 3-axis symmetry, red pupil
- **Shisui (止水)**: 4-axis symmetry, darker red pupil

## Important Notes

- This project was built with v0.app and auto-syncs to Vercel
- ESLint/TypeScript errors are ignored during builds (see next.config.mjs)  
- Uses pnpm as package manager - do NOT use npm or yarn
- All canvas operations use vanilla JavaScript Canvas API
- Coordinate transformation is critical for proper preview rendering
- Features undo/redo functionality with 50-step history limit
- Includes debounced localStorage persistence (500ms delay)
- Supports PNG image export from canvas element
- **Component Refactoring**: The sharingan-designer component has been modularized into separate tab components for better maintainability while preserving all existing functionality

## Common Development Tasks

### Adding New Features
1. Check existing components in `/components/` for patterns
2. Use shadcn/ui components for consistency
3. Follow the established coordinate system for canvas operations
4. Maintain the separation between editor and preview logic
5. For sharingan-designer components, follow the modular structure:
   - Create new tab components in `/components/sharingan-designer/`
   - Add types to `types.ts` if needed
   - Use utility functions from `utils.ts`
   - Update the main `index.tsx` to include new tabs

### Working with Canvas
- All canvas operations should use the coordinate transformation system
- Editor canvas is 300x300, preview canvas is 400x400
- Use the `editorToPreview()` function for coordinate conversion
- Implement dirty checking for performance

### State Management
- Use React hooks for local state
- Follow the existing pattern for localStorage persistence
- Maintain backward compatibility with legacy data formats
- Use debouncing for expensive operations

### Styling
- Use Tailwind CSS classes exclusively
- Follow the shadcn/ui component patterns
- Support both light and dark themes
- Maintain responsive design principles