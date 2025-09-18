'use client'

import { useEffect, useState, useRef } from 'react'
import { Shape, BezierPoint } from '@/models/types'
import { BaseShapeEditor } from './base-shape-editor'

interface BezierEditorProps {
  pupilSize: number
  shapes: Shape[]
  currentShapeIndex: number
  onChange: (path: BezierPoint[]) => void
  selectedPoint: number | null
  onSelectedPointChange?: (point: number | null) => void
}

export function BezierEditor({
  pupilSize,
  shapes,
  currentShapeIndex,
  onChange,
  selectedPoint,
  onSelectedPointChange,
}: BezierEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<'point' | 'cp1' | 'cp2'>('point')

  const currentShape = shapes[currentShapeIndex]
  const currentPath = currentShape?.type === 'bezier' ? currentShape.points : []

  // 事件处理函数
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentShape?.type !== 'bezier') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = 0; i < currentPath.length; i++) {
      const point = currentPath[i]

      // Check main point
      if (Math.abs(x - point.x) < 8 && Math.abs(y - point.y) < 8) {
        onSelectedPointChange?.(i)
        setIsDragging(true)
        setDragType('point')
        return
      }

      // Check control points
      if (point.cp1x !== undefined && point.cp1y !== undefined) {
        if (Math.abs(x - point.cp1x) < 6 && Math.abs(y - point.cp1y) < 6) {
          onSelectedPointChange?.(i)
          setIsDragging(true)
          setDragType('cp1')
          return
        }
      }

      if (point.cp2x !== undefined && point.cp2y !== undefined) {
        if (Math.abs(x - point.cp2x) < 6 && Math.abs(y - point.cp2y) < 6) {
          onSelectedPointChange?.(i)
          setIsDragging(true)
          setDragType('cp2')
          return
        }
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedPoint === null || currentShape?.type !== 'bezier') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPath = [...currentPath]
    const originalPoint = newPath[selectedPoint]
    
    // 创建新的点对象，保持不可变性
    const newPoint = { ...originalPoint }
    
    if (dragType === 'point') {
      newPoint.x = Math.max(0, Math.min(360, x))
      newPoint.y = Math.max(0, Math.min(280, y))
    } else if (dragType === 'cp1') {
      newPoint.cp1x = Math.max(0, Math.min(360, x))
      newPoint.cp1y = Math.max(0, Math.min(280, y))
    } else if (dragType === 'cp2') {
      newPoint.cp2x = Math.max(0, Math.min(360, x))
      newPoint.cp2y = Math.max(0, Math.min(280, y))
    }

    newPath[selectedPoint] = newPoint
    onChange(newPath)
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
  }, [canvasRef, currentShape, selectedPoint, isDragging, dragType])

  return (
    <BaseShapeEditor
      pupilSize={pupilSize}
      shapes={shapes}
      currentShapeIndex={currentShapeIndex}
      onShapeChange={(shape) => {
        if (shape.type === 'bezier') {
          onChange(shape.points)
        }
      }}
      selectedElement={selectedPoint?.toString() || null}
      onSelectedElementChange={(element) => {
        onSelectedPointChange?.(element ? parseInt(element) : null)
      }}
      canvasRef={canvasRef}
    />
  )
}
