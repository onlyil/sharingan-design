'use client'

import { useEffect, useState, useRef } from 'react'
import { Shape, ShapeType } from '@/models/types'
import { BaseShapeEditor } from './base-shape-editor'

interface CircleShapeEditorProps {
  pupilSize: number
  shapes: Shape[]
  currentShapeIndex: number
  onShapeChange: (shape: Shape) => void
  selectedElement: string | null
  onSelectedElementChange?: (element: string | null) => void
}

export function CircleShapeEditor({
  pupilSize,
  shapes,
  currentShapeIndex,
  onShapeChange,
  selectedElement,
  onSelectedElementChange,
}: CircleShapeEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<'center' | 'edge'>('center')

  const currentShape = shapes[currentShapeIndex]

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentShape?.type !== ShapeType.CIRCLE) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on center point
    const centerDist = Math.sqrt(
      Math.pow(x - currentShape.center.x, 2) + Math.pow(y - currentShape.center.y, 2)
    )
    if (centerDist < 8) {
      onSelectedElementChange?.('center')
      setIsDragging(true)
      setDragType('center')
      return
    }

    // Check if clicking on edge point
    const edgeX = currentShape.center.x + currentShape.radius
    const edgeY = currentShape.center.y
    const edgeDist = Math.sqrt(Math.pow(x - edgeX, 2) + Math.pow(y - edgeY, 2))
    if (edgeDist < 8) {
      onSelectedElementChange?.('edge')
      setIsDragging(true)
      setDragType('edge')
      return
    }

    // Check if clicking on circle circumference
    const circumferenceDist = Math.abs(
      Math.sqrt(Math.pow(x - currentShape.center.x, 2) + Math.pow(y - currentShape.center.y, 2)) - currentShape.radius
    )
    if (circumferenceDist < 8) {
      onSelectedElementChange?.('edge')
      setIsDragging(true)
      setDragType('edge')
      return
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || currentShape?.type !== ShapeType.CIRCLE) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (dragType === 'center') {
      // Move the circle center
      const newShape = {
        ...currentShape,
        center: {
          x: Math.max(0, Math.min(360, x)),
          y: Math.max(0, Math.min(280, y)),
        },
      }
      onShapeChange(newShape)
    } else if (dragType === 'edge') {
      // Resize the circle radius
      const dx = x - currentShape.center.x
      const dy = y - currentShape.center.y
      const newRadius = Math.max(10, Math.min(150, Math.sqrt(dx * dx + dy * dy)))
      
      const newShape = {
        ...currentShape,
        radius: newRadius,
      }
      onShapeChange(newShape)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
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