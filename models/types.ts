export interface BezierPoint {
  x: number
  y: number
  cp1x?: number  // First control point X
  cp1y?: number  // First control point Y
  cp2x?: number  // Second control point X
  cp2y?: number  // Second control point Y
}

export interface BezierPath {
  points: BezierPoint[]
  color: string
}

// Shape type enumeration
export enum ShapeType {
  BEZIER = 'bezier',
  CIRCLE = 'circle',
  LINE = 'line'
}

// Base shape interface
export interface BaseShape {
  type: ShapeType
  color: string
  id: string
}

// Bezier curve shape
export interface BezierShape extends BaseShape {
  type: ShapeType.BEZIER
  points: BezierPoint[]
}

// Circle shape
export interface CircleShape extends BaseShape {
  type: ShapeType.CIRCLE
  center: { x: number; y: number }
  radius: number
}

// Line shape
export interface LineShape extends BaseShape {
  type: ShapeType.LINE
  start: { x: number; y: number }
  end: { x: number; y: number }
}

// Union type for all shapes
export type Shape = BezierShape | CircleShape | LineShape

// Legacy support - keep BezierPath for backward compatibility
export interface SymmetrySettings {
  axes: number
}

export interface ColorSettings {
  pupilColor: string
  pupilSize: number
}

export interface SavedDesign {
  name: string
  bezierPaths: BezierPath[] // Keep for backward compatibility
  shapes?: Shape[] // New field for multiple shape types
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
  timestamp: number
}