import {
  BezierPoint,
  BezierPath,
  SymmetrySettings,
  ColorSettings,
  SavedDesign,
} from '@/models/types'

// 生成默认设计名称
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
  return `设计_${timeString}`
}

// 复制配置到剪贴板
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

// 创建新路径
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

// 保存设计到本地存储
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

// 从本地存储加载设计
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

// 删除设计
export function deleteDesignFromLocalStorage(
  index: number,
  storageKey: string = 'sharingan-saved-designs'
): SavedDesign[] {
  const designs = loadDesignsFromLocalStorage(storageKey)
  const updatedDesigns = designs.filter((_, i) => i !== index)
  window.localStorage.setItem(storageKey, JSON.stringify(updatedDesigns))
  return updatedDesigns
}

// 加载设计数据（支持向后兼容）
export function loadDesignData(design: any): {
  bezierPaths: BezierPath[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
} {
  let bezierPaths: BezierPath[] = []

  if (design.bezierPath && Array.isArray(design.bezierPath)) {
    // 老的单路径数据转换为新结构
    const defaultColor = design.colorSettings?.pathFillColor || '#000000'
    bezierPaths = [{ points: design.bezierPath, color: defaultColor }]
  } else if (design.bezierPaths && Array.isArray(design.bezierPaths)) {
    // 检查是否是新结构
    if (design.bezierPaths.length > 0 && design.bezierPaths[0].points) {
      // 新结构，直接使用
      bezierPaths = design.bezierPaths
    } else {
      // 老的多路径数据结构转换
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
