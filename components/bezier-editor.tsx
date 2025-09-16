"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import type { BezierPoint } from "./sharingan-designer"
import { Button } from "@/components/ui/button"

interface BezierEditorProps {
  path: BezierPoint[]
  onChange: (path: BezierPoint[]) => void
}

export function BezierEditor({ path, onChange }: BezierEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<"point" | "cp1" | "cp2">("point")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = 300
    const height = 200
    canvas.width = width
    canvas.height = height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 绘制网格
    drawGrid(ctx, width, height)

    drawEyeBackground(ctx, width, height)

    // 绘制贝塞尔路径
    drawBezierPath(ctx, path, selectedPoint)
  }, [path, selectedPoint])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 检查是否点击了控制点或路径点
    for (let i = 0; i < path.length; i++) {
      const point = path[i]

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

    const newPath = [...path]
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
    const newPoint: BezierPoint = {
      x: 180 + Math.random() * 40 - 20,
      y: 140 + Math.random() * 40 - 20,
      cp1x: 160 + Math.random() * 40 - 20,
      cp1y: 120 + Math.random() * 40 - 20,
      cp2x: 200 + Math.random() * 40 - 20,
      cp2y: 160 + Math.random() * 40 - 20,
    }
    onChange([...path, newPoint])
  }

  const removePoint = () => {
    if (path.length > 2 && selectedPoint !== null) {
      const newPath = path.filter((_, index) => index !== selectedPoint)
      onChange(newPath)
      setSelectedPoint(null)
    }
  }

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
        <Button size="sm" variant="outline" onClick={addPoint}>
          添加点
        </Button>
        <Button size="sm" variant="outline" onClick={removePoint} disabled={path.length <= 2 || selectedPoint === null}>
          删除点
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">点击并拖拽路径点或控制点来编辑曲线</div>
    </div>
  )
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "#e5e7eb"
  ctx.lineWidth = 0.5

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

function drawBezierPath(ctx: CanvasRenderingContext2D, path: BezierPoint[], selectedPoint: number | null) {
  if (path.length < 2) return

  // 绘制路径
  ctx.strokeStyle = "#dc2626"
  ctx.lineWidth = 2
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

  // 绘制控制点和连线
  path.forEach((point, index) => {
    // 绘制控制点连线
    if (point.cp1x !== undefined) {
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(point.cp1x, point.cp1y!)
      ctx.stroke()
      ctx.setLineDash([])
    }

    if (point.cp2x !== undefined) {
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(point.cp2x, point.cp2y!)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 绘制主点
    ctx.fillStyle = index === selectedPoint ? "#f59e0b" : "#dc2626"
    ctx.beginPath()
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
    ctx.fill()

    // 绘制控制点
    if (point.cp1x !== undefined) {
      ctx.fillStyle = index === selectedPoint ? "#fbbf24" : "#6b7280"
      ctx.beginPath()
      ctx.arc(point.cp1x, point.cp1y!, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    if (point.cp2x !== undefined) {
      ctx.fillStyle = index === selectedPoint ? "#fbbf24" : "#6b7280"
      ctx.beginPath()
      ctx.arc(point.cp2x, point.cp2y!, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

function drawEyeBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // 贝塞尔编辑器中的 (100, 100) 对应预览区的圆心位置
  const centerX = 100
  const centerY = 100
  const radius = 200 // 和预览区相同比例的半径，会溢出编辑器区域

  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.strokeStyle = "#dc2626"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(centerX, centerY, 30, 0, Math.PI * 2) // 瞳孔区域也按比例放大
  ctx.stroke()

  // 添加中心点标记
  ctx.fillStyle = "#9ca3af"
  ctx.beginPath()
  ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
  ctx.fill()
}
