import {
  BezierPoint,
  BezierPath,
  SymmetrySettings,
  ColorSettings,
  SavedDesign,
} from '@/models/types'

// Generate default design name
export function generateDefaultDesignName(): string {
  const now = new Date()
  const timeString = now
    .toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/[/\s:]/g, '')
  return `Design_${timeString}`
}

// Copy configuration to clipboard
export async function copyConfigToClipboard(config: {
  bezierPaths: BezierPath[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
}): Promise<void> {
  const configData = {
    ...config,
    timestamp: Date.now(),
  }

  await navigator.clipboard.writeText(JSON.stringify(configData, null, 2))
}

// Create new path
export function createNewPath(): BezierPoint[] {
  return [
    {
      x: 160 + Math.random() * 40 - 20,
      y: 120 + Math.random() * 40 - 20,
      cp1x: 140 + Math.random() * 40 - 20,
      cp1y: 100 + Math.random() * 40 - 20,
      cp2x: 180 + Math.random() * 40 - 20,
      cp2y: 140 + Math.random() * 40 - 20,
    },
    {
      x: 200 + Math.random() * 40 - 20,
      y: 160 + Math.random() * 40 - 20,
      cp1x: 180 + Math.random() * 40 - 20,
      cp1y: 140 + Math.random() * 40 - 20,
      cp2x: 220 + Math.random() * 40 - 20,
      cp2y: 180 + Math.random() * 40 - 20,
    },
  ]
}

// Save design to local storage
export function saveDesignToLocalStorage(
  designName: string,
  config: {
    bezierPaths: BezierPath[]
    symmetrySettings: SymmetrySettings
    animationSpeed: number[]
    colorSettings: ColorSettings
  },
  storageKey: string = 'sharingan-saved-designs'
): void {
  const currentDesign: SavedDesign = {
    name: designName.trim(),
    ...config,
    timestamp: Date.now(),
  }

  const savedDesigns = JSON.parse(
    window.localStorage.getItem(storageKey) || '[]'
  )
  savedDesigns.push(currentDesign)
  window.localStorage.setItem(storageKey, JSON.stringify(savedDesigns))
}

// Load designs from local storage
export function loadDesignsFromLocalStorage(
  storageKey: string = 'sharingan-saved-designs'
): SavedDesign[] {
  try {
    const designs = JSON.parse(window.localStorage.getItem(storageKey) || '[]')
    return designs.sort(
      (a: SavedDesign, b: SavedDesign) => b.timestamp - a.timestamp
    )
  } catch (error) {
    console.error('Failed to load saved designs:', error)
    return []
  }
}

// Delete design
export function deleteDesignFromLocalStorage(
  index: number,
  storageKey: string = 'sharingan-saved-designs'
): SavedDesign[] {
  const designs = loadDesignsFromLocalStorage(storageKey)
  const updatedDesigns = designs.filter((_, i) => i !== index)
  window.localStorage.setItem(storageKey, JSON.stringify(updatedDesigns))
  return updatedDesigns
}

// Load design data (backward compatibility support)
export function loadDesignData(design: any): {
  bezierPaths: BezierPath[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
} {
  let bezierPaths: BezierPath[] = []

  if (design.bezierPath && Array.isArray(design.bezierPath)) {
    // Convert old single path data to new structure
    const defaultColor = design.colorSettings?.pathFillColor || '#000000'
    bezierPaths = [{ points: design.bezierPath, color: defaultColor }]
  } else if (design.bezierPaths && Array.isArray(design.bezierPaths)) {
    // Check if it's the new structure
    if (design.bezierPaths.length > 0 && design.bezierPaths[0].points) {
      // New structure, use directly
      bezierPaths = design.bezierPaths
    } else {
      // Convert old multi-path data structure
      const defaultColor = design.colorSettings?.pathFillColor || '#000000'
      bezierPaths = design.bezierPaths.map((path: BezierPoint[]) => ({
        points: path,
        color: defaultColor,
      }))
    }
  }

  return {
    bezierPaths,
    symmetrySettings: design.symmetrySettings || { axes: 3 },
    animationSpeed: design.animationSpeed || [0],
    colorSettings: design.colorSettings || {
      pupilColor: '#e70808',
      pupilSize: 0.14,
    },
  }
}
