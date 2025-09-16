"use client"

import type React from "react"
import { EDITOR_CONFIG } from "@/constants/coordinate-system"
import { useRef, useEffect, useState } from "react"
import type { BezierPoint } from "./sharingan-designer"
import { Button } from "@/components/ui/button"

interface BezierEditorProps {
  pupilSize: number
  allPaths: BezierPoint[][]
  currentPathIndex: number
  onChange: (path: BezierPoint[]) => void
}

export function BezierEditor({ pupilSize, allPaths, currentPathIndex, onChange }: BezierEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<"point" | "cp1" | "cp2">("point")

  const currentPath = allPaths[currentPathIndex] || []

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = EDITOR_CONFIG.WIDTH
    const height = EDITOR_CONFIG.HEIGHT
    canvas.width = width
    canvas.height = height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 绘制网格
    drawGrid(ctx, width, height)

    drawEyeBackground(ctx, width, height, pupilSize)

    drawAllBezierPaths(ctx, allPaths, currentPathIndex, selectedPoint)
  }, [allPaths, currentPathIndex, selectedPoint])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = 0; i < currentPath.length; i++) {
      const point = currentPath[i]

      // 检查主点
      if (Math.abs(x - point.x) < 8 && Math.abs(y - point.y) < 8) {
        setSelectedPoint(i)
        setIsDragging(true)
        setDragType("point")
        return
      }

      // 检查控制点
      if (point.cp1x !== undefined && point.cp1y !== undefined) {
        if (Math.abs(x - point.cp1x) < 6 && Math.abs(y - point.cp1y) < 6) {
          setSelectedPoint(i)
          setIsDragging(true)
          setDragType("cp1")
          return
        }
      }

      if (point.cp2x !== undefined && point.cp2y !== undefined) {
        if (Math.abs(x - point.cp2x) < 6 && Math.abs(y - point.cp2y) < 6) {
          setSelectedPoint(i)
          setIsDragging(true)
          setDragType("cp2")
          return
        }
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedPoint === null) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPath = [...currentPath]
    const point = newPath[selectedPoint]

    if (dragType === "point") {
      point.x = Math.max(0, Math.min(360, x))
      point.y = Math.max(0, Math.min(280, y))
    } else if (dragType === "cp1") {
      point.cp1x = Math.max(0, Math.min(360, x))
      point.cp1y = Math.max(0, Math.min(280, y))
    } else if (dragType === "cp2") {
      point.cp2x = Math.max(0, Math.min(360, x))
      point.cp2y = Math.max(0, Math.min(280, y))
    }

    onChange(newPath)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const addPoint = () => {
    if (selectedPoint === null) return

    const isStartPoint = selectedPoint === 0
    const isEndPoint = selectedPoint === currentPath.length - 1

    if (!isStartPoint && !isEndPoint) return

    const newPoint: BezierPoint = {
      x: 180 + Math.random() * 40 - 20,
      y: 140 + Math.random() * 40 - 20,
      cp1x: 160 + Math.random() * 40 - 20,
      cp1y: 120 + Math.random() * 40 - 20,
      cp2x: 200 + Math.random() * 40 - 20,
      cp2y: 160 + Math.random() * 40 - 20,
    }

    if (isStartPoint) {
      // 在起始位置添加点
      onChange([newPoint, ...currentPath])
      setSelectedPoint(0) // 保持选中新添加的起始点
    } else {
      // 在末尾添加点
      onChange([...currentPath, newPoint])
      setSelectedPoint(currentPath.length) // 选中新添加的末尾点
    }
  }

  const removePoint = () => {
    if (currentPath.length <= 2 || selectedPoint === null) return

    const isStartPoint = selectedPoint === 0
    const isEndPoint = selectedPoint === currentPath.length - 1

    if (!isStartPoint && !isEndPoint) return

    const newPath = currentPath.filter((_, index) => index !== selectedPoint)
    onChange(newPath)
    setSelectedPoint(null)
  }

  const canAddPoint = selectedPoint !== null && (selectedPoint === 0 || selectedPoint === currentPath.length - 1)
  const canRemovePoint =
    currentPath.length > 2 &&
    selectedPoint !== null &&
    (selectedPoint === 0 || selectedPoint === currentPath.length - 1)

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="border border-border rounded cursor-crosshair bg-muted/30"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={addPoint} disabled={!canAddPoint}>
          添加点
        </Button>
        <Button size="sm" variant="outline" onClick={removePoint} disabled={!canRemovePoint}>
          删除点
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        点击并拖拽路径点或控制点来编辑曲线。选中起始点或结束点时可添加/删除点。
      </div>
    </div>
  )
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "#f3f4f6" // 从 #e5e7eb 改为更淡的 #f3f4f6
  ctx.lineWidth = 0.2

  // 垂直线
  for (let x = 0; x <= width; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // 水平线
  for (let y = 0; y <= height; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function drawAllBezierPaths(
  ctx: CanvasRenderingContext2D,
  allPaths: BezierPoint[][],
  currentPathIndex: number,
  selectedPoint: number | null,
) {
  // 先绘制所有非当前路径（置灰）
  allPaths.forEach((path, pathIndex) => {
    if (pathIndex !== currentPathIndex) {
      drawBezierPath(ctx, path, null, true) // 置灰显示
    }
  })

  // 最后绘制当前路径（正常显示）
  if (allPaths[currentPathIndex]) {
    drawBezierPath(ctx, allPaths[currentPathIndex], selectedPoint, false)
  }
}

function drawBezierPath(
  ctx: CanvasRenderingContext2D,
  path: BezierPoint[],
  selectedPoint: number | null,
  isGrayed = false,
) {
  if (path.length < 2) return

  const pathColor = isGrayed ? "#d1d5db" : "#dc2626"
  const pointColor = isGrayed ? "#d1d5db" : "#dc2626"
  const selectedPointColor = isGrayed ? "#d1d5db" : "#f59e0b"
  const controlLineColor = isGrayed ? "#e5e7eb" : "#9ca3af"
  const controlPointColor = isGrayed ? "#e5e7eb" : "#fbbf24"

  // 绘制路径
  ctx.strokeStyle = pathColor
  ctx.lineWidth = isGrayed ? 1 : 2
  ctx.setLineDash([])
  ctx.beginPath()

  const firstPoint = path[0]
  ctx.moveTo(firstPoint.x, firstPoint.y)

  for (let i = 1; i < path.length; i++) {
    const point = path[i]
    const prevPoint = path[i - 1]

    if (prevPoint.cp2x !== undefined && point.cp1x !== undefined) {
      ctx.bezierCurveTo(prevPoint.cp2x, prevPoint.cp2y!, point.cp1x, point.cp1y!, point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }

  ctx.stroke()

  // 绘制所有主点
  path.forEach((point, index) => {
    ctx.fillStyle = !isGrayed && index === selectedPoint ? selectedPointColor : pointColor
    ctx.beginPath()
    ctx.arc(point.x, point.y, isGrayed ? 3 : 4, 0, Math.PI * 2)
    ctx.fill()
  })

  if (!isGrayed && selectedPoint !== null && selectedPoint < path.length) {
    const point = path[selectedPoint]

    // 绘制控制点连线
    if (point.cp1x !== undefined) {
      ctx.strokeStyle = controlLineColor
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(point.cp1x, point.cp1y!)
      ctx.stroke()
      ctx.setLineDash([])
    }

    if (point.cp2x !== undefined) {
      ctx.strokeStyle = controlLineColor
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(point.cp2x, point.cp2y!)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 绘制控制点
    if (point.cp1x !== undefined) {
      ctx.fillStyle = controlPointColor
      ctx.beginPath()
      ctx.arc(point.cp1x, point.cp1y!, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    if (point.cp2x !== undefined) {
      ctx.fillStyle = controlPointColor
      ctx.beginPath()
      ctx.arc(point.cp2x, point.cp2y!, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawEyeBackground(ctx: CanvasRenderingContext2D, width: number, height: number, pupilSize: number) {
  // 贝塞尔编辑器中的中心点对应预览区的圆心位置
  const centerX = EDITOR_CONFIG.CENTER_X
  const centerY = EDITOR_CONFIG.CENTER_Y
  const radius = EDITOR_CONFIG.REFERENCE_RADIUS // 和预览区相同比例的半径，会溢出

  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.stroke()

  const pupilDisplayRadius = radius * pupilSize
  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(centerX, centerY, pupilDisplayRadius, 0, Math.PI * 2) // 瞳孔区域按配置大小显示
  ctx.stroke()

  // 添加中心点标记
  ctx.fillStyle = "#9ca3af"
  ctx.beginPath()
  ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
  ctx.fill()
}
