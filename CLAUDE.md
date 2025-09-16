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
- **sharingan-designer.tsx**: Main design interface, manages state for bezier paths, symmetry settings, colors, and animation. Includes undo/redo functionality and debounced localStorage persistence
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

## Important Notes

- This project was built with v0.app and auto-syncs to Vercel
- ESLint/TypeScript errors are ignored during builds (see next.config.mjs)  
- Uses pnpm as package manager - do NOT use npm or yarn
- All canvas operations use vanilla JavaScript Canvas API
- Coordinate transformation is critical for proper preview rendering
- Features undo/redo functionality with 50-step history limit
- Includes debounced localStorage persistence (500ms delay)
- Supports PNG image export from canvas element