'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Shape, ShapeType } from '@/models/types'
import { BaseShapeEditor } from './base-shape-editor'

interface LineShapeEditorProps {
  pupilSize: number
  shapes: Shape[]
  currentShapeIndex: number
  onShapeChange: (shape: Shape) => void
  selectedElement: string | null
  onSelectedElementChange?: (element: string | null) => void
}

export function LineShapeEditor({
  pupilSize,
  shapes,
  currentShapeIndex,
  onShapeChange,
  selectedElement,
  onSelectedElementChange,
}: LineShapeEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<'start' | 'end'>('start')

  const currentShape = shapes[currentShapeIndex]

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentShape?.type !== ShapeType.LINE) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on start point
    const startDist = Math.sqrt(
      Math.pow(x - currentShape.start.x, 2) + Math.pow(y - currentShape.start.y, 2)
    )
    if (startDist < 8) {
      onSelectedElementChange?.('start')
      setIsDragging(true)
      setDragType('start')
      return
    }

    // Check if clicking on end point
    const endDist = Math.sqrt(
      Math.pow(x - currentShape.end.x, 2) + Math.pow(y - currentShape.end.y, 2)
    )
    if (endDist < 8) {
      onSelectedElementChange?.('end')
      setIsDragging(true)
      setDragType('end')
      return
    }

    // Check if clicking on the line itself (for line dragging)
    const lineDistance = pointToLineDistance(
      x, y,
      currentShape.start.x, currentShape.start.y,
      currentShape.end.x, currentShape.end.y
    )
    if (lineDistance < 8) {
      onSelectedElementChange?.('line')
      setIsDragging(true)
      // Calculate which point is closer to determine drag type
      if (startDist < endDist) {
        setDragType('start')
      } else {
        setDragType('end')
      }
      return
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || currentShape?.type !== ShapeType.LINE) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (dragType === 'start') {
      // Move the start point
      const newShape = {
        ...currentShape,
        start: {
          x: Math.max(0, Math.min(360, x)),
          y: Math.max(0, Math.min(280, y)),
        },
      }
      onShapeChange(newShape)
    } else if (dragType === 'end') {
      // Move the end point
      const newShape = {
        ...currentShape,
        end: {
          x: Math.max(0, Math.min(360, x)),
          y: Math.max(0, Math.min(280, y)),
        },
      }
      onShapeChange(newShape)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Calculate distance from point to line segment
  function pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1
    const B = py - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1

    if (lenSq !== 0) {
      param = dot / lenSq
    }

    let xx, yy

    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = px - xx
    const dy = py - yy

    return Math.sqrt(dx * dx + dy * dy)
  }

  // 添加事件监听器到父组件的canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDownWrapper = (e: MouseEvent) => {
      handleMouseDown(e as unknown as React.MouseEvent<HTMLCanvasElement>)
    }

    const handleMouseMoveWrapper = (e: MouseEvent) => {
      handleMouseMove(e as unknown as React.MouseEvent<HTMLCanvasElement>)
    }

    canvas.addEventListener('mousedown', handleMouseDownWrapper)
    canvas.addEventListener('mousemove', handleMouseMoveWrapper)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDownWrapper)
      canvas.removeEventListener('mousemove', handleMouseMoveWrapper)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [canvasRef, currentShape, selectedElement, isDragging, dragType])

  return (
    <BaseShapeEditor
      pupilSize={pupilSize}
      shapes={shapes}
      currentShapeIndex={currentShapeIndex}
      onShapeChange={onShapeChange}
      selectedElement={selectedElement}
      onSelectedElementChange={onSelectedElementChange}
      canvasRef={canvasRef}
    />
  )
}