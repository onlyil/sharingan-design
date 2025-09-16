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

export interface SymmetrySettings {
  axes: number
}

export interface ColorSettings {
  pupilColor: string
  pupilSize: number
}

export interface SavedDesign {
  name: string
  bezierPaths: BezierPath[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
  timestamp: number
}