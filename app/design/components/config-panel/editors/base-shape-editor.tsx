'use client'

import type React from 'react'
import { EDITOR_CONFIG } from '@/constants/coordinate-system'
import { useRef, useEffect } from 'react'
import { Shape, ShapeType } from '@/models/types'

interface BaseShapeEditorProps {
  pupilSize: number
  shapes: Shape[]
  currentShapeIndex: number
  onShapeChange: (shape: Shape) => void
  selectedElement: string | null
  onSelectedElementChange?: (element: string | null) => void
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function BaseShapeEditor({
  pupilSize,
  shapes,
  currentShapeIndex,
  onShapeChange,
  selectedElement,
  onSelectedElementChange,
  canvasRef,
}: BaseShapeEditorProps) {
  const currentShape = shapes[currentShapeIndex]

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

    // Draw all shapes (grayed out except current)
    drawAllShapes(ctx, shapes, currentShapeIndex, selectedElement)
  }, [shapes, currentShapeIndex, selectedElement])

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="border border-border rounded cursor-crosshair bg-muted/30"
      />

      <div className="text-xs text-muted-foreground">
        {currentShape?.type === ShapeType.BEZIER &&
          'Click and drag path points or control points to edit curves. You can add/remove points when start or end points are selected.'}
        {currentShape?.type === ShapeType.CIRCLE &&
          'Click and drag the center point or circle edge to resize.'}
        {currentShape?.type === ShapeType.LINE &&
          'Click and drag the start or end points to adjust the line.'}
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

function drawEyeBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pupilSize: number
) {
  const centerX = EDITOR_CONFIG.CENTER_X
  const centerY = EDITOR_CONFIG.CENTER_Y
  const radius = EDITOR_CONFIG.REFERENCE_RADIUS

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
  ctx.arc(centerX, centerY, pupilDisplayRadius, 0, Math.PI * 2)
  ctx.stroke()

  // Add center point marker
  ctx.fillStyle = '#9ca3af'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
  ctx.fill()
}

function drawAllShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  currentShapeIndex: number,
  selectedElement: string | null
) {
  // Draw all non-current shapes (grayed out)
  shapes.forEach((shape, index) => {
    if (index !== currentShapeIndex) {
      drawShape(ctx, shape, null, true)
    }
  })

  // Draw current shape (normal display)
  if (shapes[currentShapeIndex]) {
    drawShape(ctx, shapes[currentShapeIndex], selectedElement, false)
  }
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  selectedElement: string | null,
  isGrayed = false
) {
  const color = isGrayed ? '#404040' : shape.color

  switch (shape.type) {
    case ShapeType.BEZIER:
      drawBezierShape(ctx, shape, selectedElement, isGrayed)
      break
    case ShapeType.CIRCLE:
      drawCircleShape(ctx, shape, selectedElement, isGrayed)
      break
    case ShapeType.LINE:
      drawLineShape(ctx, shape, selectedElement, isGrayed)
      break
  }
}

function drawBezierShape(
  ctx: CanvasRenderingContext2D,
  shape: any,
  selectedElement: string | null,
  isGrayed = false
) {
  if (!shape.points || shape.points.length < 2) return

  const pathColor = isGrayed ? '#404040' : '#dc2626'
  const pointColor = isGrayed ? '#404040' : '#dc2626'
  const selectedPointColor = isGrayed ? '#404040' : '#f59e0b'
  const controlLineColor = isGrayed ? '#404040' : '#9ca3af'
  const controlPointColor = isGrayed ? '#404040' : '#fbbf24'

  const selectedPointIndex = selectedElement ? parseInt(selectedElement) : null

  // Draw path
  ctx.strokeStyle = pathColor
  ctx.lineWidth = isGrayed ? 1 : 2
  ctx.setLineDash([])
  ctx.beginPath()

  const firstPoint = shape.points[0]
  ctx.moveTo(firstPoint.x, firstPoint.y)

  for (let i = 1; i < shape.points.length; i++) {
    const point = shape.points[i]
    const prevPoint = shape.points[i - 1]

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
  shape.points.forEach((point: any, index: number) => {
    ctx.fillStyle =
      !isGrayed && index === selectedPointIndex
        ? selectedPointColor
        : pointColor
    ctx.beginPath()
    ctx.arc(point.x, point.y, isGrayed ? 3 : 4, 0, Math.PI * 2)
    ctx.fill()
  })

  if (
    !isGrayed &&
    selectedPointIndex !== null &&
    selectedPointIndex < shape.points.length
  ) {
    const point = shape.points[selectedPointIndex]

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

function drawCircleShape(
  ctx: CanvasRenderingContext2D,
  shape: any,
  selectedElement: string | null,
  isGrayed = false
) {
  ctx.strokeStyle = isGrayed ? '#404040' : '#dc2626'
  ctx.lineWidth = isGrayed ? 1 : 2
  ctx.beginPath()
  ctx.arc(shape.center.x, shape.center.y, shape.radius, 0, Math.PI * 2)
  ctx.stroke()

  // Draw center point
  ctx.fillStyle = isGrayed ? '#404040' : '#dc2626'
  ctx.beginPath()
  ctx.arc(shape.center.x, shape.center.y, 4, 0, Math.PI * 2)
  ctx.fill()

  // Draw edge point (for resizing)
  ctx.fillStyle = isGrayed ? '#404040' : '#f59e0b'
  ctx.beginPath()
  ctx.arc(shape.center.x + shape.radius, shape.center.y, 3, 0, Math.PI * 2)
  ctx.fill()
}

function drawLineShape(
  ctx: CanvasRenderingContext2D,
  shape: any,
  selectedElement: string | null,
  isGrayed = false
) {
  ctx.strokeStyle = isGrayed ? '#404040' : '#dc2626'
  ctx.lineWidth = isGrayed ? 1 : 2
  ctx.beginPath()
  ctx.moveTo(shape.start.x, shape.start.y)
  ctx.lineTo(shape.end.x, shape.end.y)
  ctx.stroke()

  // Draw start point
  ctx.fillStyle = isGrayed ? '#404040' : '#dc2626'
  ctx.beginPath()
  ctx.arc(shape.start.x, shape.start.y, 4, 0, Math.PI * 2)
  ctx.fill()

  // Draw end point
  ctx.fillStyle = isGrayed ? '#404040' : '#f59e0b'
  ctx.beginPath()
  ctx.arc(shape.end.x, shape.end.y, 4, 0, Math.PI * 2)
  ctx.fill()
}
