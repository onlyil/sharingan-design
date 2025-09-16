export interface BezierPoint {
  x: number
  y: number
  cp1x?: number  // First control point X
  cp1y?: number  // First control point Y
  cp2x?: number  // Second control point X
  cp2y?: number  // Second control point Y
}

export interface SymmetrySettings {
  axes: number
}

export interface ColorSettings {
  pupilColor: string
  pathFillColor: string
  pupilSize: number
}

export interface SavedDesign {
  name: string
  bezierPaths: BezierPoint[][]
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
  timestamp: number
}