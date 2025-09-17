/**
 * Coordinate system configuration constants
 * Used to uniformly manage coordinate transformation between Bezier editor and preview area
 */

// Editor coordinate system configuration
export const EDITOR_CONFIG = {
  // Editor canvas size
  WIDTH: 300,
  HEIGHT: 300,

  // Editor center point coordinates (corresponding to the center position of the preview area)
  CENTER_X: 100,
  CENTER_Y: 150,

  // Reference radius in the editor (used for scaling calculations)
  REFERENCE_RADIUS: 200,
} as const

// Preview area coordinate system configuration
export const PREVIEW_CONFIG = {
  // Preview area canvas size
  SIZE: 400,

  // Preview area radius ratio (relative to canvas size)
  RADIUS_RATIO: 0.4,
} as const

// Coordinate transformation utility functions
export const COORDINATE_TRANSFORM = {
  /**
   * Calculate the scaling factor from editor to preview area
   * @param previewRadius Actual radius of the preview area
   * @returns Scaling factor
   */
  getScale: (previewRadius: number) => previewRadius / EDITOR_CONFIG.REFERENCE_RADIUS,

  /**
   * Convert editor coordinates to preview area coordinates
   * @param editorX Editor X coordinate
   * @param editorY Editor Y coordinate
   * @param scale Scaling factor
   * @returns Converted coordinates [x, y]
   */
  editorToPreview: (editorX: number, editorY: number, scale: number): [number, number] => [
    (editorX - EDITOR_CONFIG.CENTER_X) * scale,
    (editorY - EDITOR_CONFIG.CENTER_Y) * scale,
  ],
} as const
