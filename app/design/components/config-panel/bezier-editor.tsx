'use client'

import type React from 'react'
import { EDITOR_CONFIG } from '@/constants/coordinate-system'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { BezierPath, BezierPoint } from '@/models/types'

interface BezierEditorProps {
  pupilSize: number
  allPaths: BezierPath[]
  currentPathIndex: number
  onChange: (path: BezierPoint[]) => void
}

export function BezierEditor({
  pupilSize,
  allPaths,
  currentPathIndex,
  onChange,
}: BezierEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<'point' | 'cp1' | 'cp2'>('point')

  const currentPath = allPaths[currentPathIndex]?.points || []

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = EDITOR_CONFIG.WIDTH
    const height = EDITOR_CONFIG.HEIGHT
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
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

      // Check main point
      if (Math.abs(x - point.x) < 8 && Math.abs(y - point.y) < 8) {
        setSelectedPoint(i)
        setIsDragging(true)
        setDragType('point')
        return
      }

      // Check control points
      if (point.cp1x !== undefined && point.cp1y !== undefined) {
        if (Math.abs(x - point.cp1x) < 6 && Math.abs(y - point.cp1y) < 6) {
          setSelectedPoint(i)
          setIsDragging(true)
          setDragType('cp1')
          return
        }
      }

      if (point.cp2x !== undefined && point.cp2y !== undefined) {
        if (Math.abs(x - point.cp2x) < 6 && Math.abs(y - point.cp2y) < 6) {
          setSelectedPoint(i)
          setIsDragging(true)
          setDragType('cp2')
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

    if (dragType === 'point') {
      point.x = Math.max(0, Math.min(360, x))
      point.y = Math.max(0, Math.min(280, y))
    } else if (dragType === 'cp1') {
      point.cp1x = Math.max(0, Math.min(360, x))
      point.cp1y = Math.max(0, Math.min(280, y))
    } else if (dragType === 'cp2') {
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
      // Add point at start position
      onChange([newPoint, ...currentPath])
      setSelectedPoint(0) // Keep the newly added start point selected
    } else {
      // Add point at end
      onChange([...currentPath, newPoint])
      setSelectedPoint(currentPath.length) // Select the newly added end point
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

  const canAddPoint =
    selectedPoint !== null &&
    (selectedPoint === 0 || selectedPoint === currentPath.length - 1)
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
        <Button
          size="sm"
          variant="outline"
          onClick={addPoint}
          disabled={!canAddPoint}>
          Add Point
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={removePoint}
          disabled={!canRemovePoint}>
          Remove Point
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Click and drag path points or control points to edit curves. You can
        add/remove points when start or end points are selected.
      </div>
    </div>
  )
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.strokeStyle = '#f3f4f6'
  ctx.lineWidth = 0.2

  // Vertical lines
  for (let x = 0; x <= width; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function drawAllBezierPaths(
  ctx: CanvasRenderingContext2D,
  allPaths: BezierPath[],
  currentPathIndex: number,
  selectedPoint: number | null
) {
  // First draw all non-current paths (grayed out)
  allPaths.forEach((path, pathIndex) => {
    if (pathIndex !== currentPathIndex) {
      drawBezierPath(ctx, path.points, null, true) // Display grayed out
    }
  })

  // Finally draw current path (normal display)
  if (allPaths[currentPathIndex]) {
    drawBezierPath(ctx, allPaths[currentPathIndex].points, selectedPoint, false)
  }
}

function drawBezierPath(
  ctx: CanvasRenderingContext2D,
  path: BezierPoint[],
  selectedPoint: number | null,
  isGrayed = false
) {
  if (path.length < 2) return

  const pathColor = isGrayed ? '#d1d5db' : '#dc2626'
  const pointColor = isGrayed ? '#d1d5db' : '#dc2626'
  const selectedPointColor = isGrayed ? '#d1d5db' : '#f59e0b'
  const controlLineColor = isGrayed ? '#e5e7eb' : '#9ca3af'
  const controlPointColor = isGrayed ? '#e5e7eb' : '#fbbf24'

  // Draw path
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
      ctx.bezierCurveTo(
        prevPoint.cp2x,
        prevPoint.cp2y!,
        point.cp1x,
        point.cp1y!,
        point.x,
        point.y
      )
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }

  ctx.stroke()

  // Draw all main points
  path.forEach((point, index) => {
    ctx.fillStyle =
      !isGrayed && index === selectedPoint ? selectedPointColor : pointColor
    ctx.beginPath()
    ctx.arc(point.x, point.y, isGrayed ? 3 : 4, 0, Math.PI * 2)
    ctx.fill()
  })

  if (!isGrayed && selectedPoint !== null && selectedPoint < path.length) {
    const point = path[selectedPoint]

    // Draw control point lines
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

    // Draw control points
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

function drawEyeBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pupilSize: number
) {
  // Center point in Bezier editor corresponds to the center position in preview area
  const centerX = EDITOR_CONFIG.CENTER_X
  const centerY = EDITOR_CONFIG.CENTER_Y
  const radius = EDITOR_CONFIG.REFERENCE_RADIUS // Same proportional radius as preview area, will overflow

  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.stroke()

  const pupilDisplayRadius = radius * pupilSize
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(centerX, centerY, pupilDisplayRadius, 0, Math.PI * 2) // Pupil area displayed according to configured size
  ctx.stroke()

  // Add center point marker
  ctx.fillStyle = '#9ca3af'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
  ctx.fill()
}
