'use client'

import { useEffect, useRef } from 'react'
import type {
  Shape,
  SymmetrySettings,
  ColorSettings,
  BezierPoint,
} from '@/models/types'
import {
  PREVIEW_CONFIG,
  COORDINATE_TRANSFORM,
} from '@/constants/coordinate-system'

interface SharinganPreviewProps {
  shapes: Shape[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number
  colorSettings: ColorSettings
}

export function SharinganPreview({
  shapes,
  symmetrySettings,
  animationSpeed,
  colorSettings,
}: SharinganPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const rotationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = PREVIEW_CONFIG.SIZE
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * PREVIEW_CONFIG.RADIUS_RATIO

    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      drawSharinganBackground(ctx, centerX, centerY, radius)

      shapes.forEach((shape) => {
        if (shape.type === 'bezier') {
          drawSymmetricPaths(
            ctx,
            centerX,
            centerY,
            radius,
            shape.points,
            symmetrySettings,
            rotationRef.current,
            shape.color
          )
        } else if (shape.type === 'circle') {
          drawSymmetricCircle(
            ctx,
            centerX,
            centerY,
            radius,
            shape.center,
            shape.radius,
            symmetrySettings,
            rotationRef.current,
            shape.color
          )
        } else if (shape.type === 'line') {
          drawSymmetricLine(
            ctx,
            centerX,
            centerY,
            radius,
            shape.start,
            shape.end,
            symmetrySettings,
            rotationRef.current,
            shape.color
          )
        }
      })

      drawPupil(
        ctx,
        centerX,
        centerY,
        radius,
        colorSettings.pupilColor,
        colorSettings.pupilSize
      )

      // Update rotation angle
      rotationRef.current += animationSpeed * 0.02

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [shapes, symmetrySettings, animationSpeed, colorSettings])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className=""
        style={{ filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))' }}
      />
    </div>
  )
}

function drawSharinganBackground(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  // Outer circle - red background
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#B20000'
  ctx.fill()
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 6
  ctx.stroke()

  // ctx.beginPath()
  // ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2)
  // ctx.strokeStyle = '#890001'
  // ctx.lineWidth = 3
  // ctx.stroke()
}

function drawPupil(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  pupilColor: string,
  pupilSize = 0.15
) {
  // Inner circle - pupil color
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * pupilSize, 0, Math.PI * 2)
  ctx.fillStyle = pupilColor
  ctx.fill()
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
}

function drawSymmetricPaths(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  bezierPath: BezierPoint[],
  symmetrySettings: SymmetrySettings,
  rotation: number,
  pathFillColor: string
) {
  if (bezierPath.length < 2) return

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)

  ctx.fillStyle = pathFillColor

  const scale = COORDINATE_TRANSFORM.getScale(radius)

  for (let i = 0; i < symmetrySettings.axes; i++) {
    ctx.save()

    ctx.rotate((i * Math.PI * 2) / symmetrySettings.axes)

    // Draw Bezier path
    ctx.beginPath()
    const firstPoint = bezierPath[0]
    const [firstX, firstY] = COORDINATE_TRANSFORM.editorToPreview(
      firstPoint.x,
      firstPoint.y,
      scale
    )
    ctx.moveTo(firstX, firstY)

    for (let j = 1; j < bezierPath.length; j++) {
      const point = bezierPath[j]
      const prevPoint = bezierPath[j - 1]

      if (prevPoint.cp2x !== undefined && point.cp1x !== undefined) {
        const [cp2X, cp2Y] = COORDINATE_TRANSFORM.editorToPreview(
          prevPoint.cp2x,
          prevPoint.cp2y!,
          scale
        )
        const [cp1X, cp1Y] = COORDINATE_TRANSFORM.editorToPreview(
          point.cp1x,
          point.cp1y!,
          scale
        )
        const [pointX, pointY] = COORDINATE_TRANSFORM.editorToPreview(
          point.x,
          point.y,
          scale
        )

        ctx.bezierCurveTo(cp2X, cp2Y, cp1X, cp1Y, pointX, pointY)
      } else {
        const [pointX, pointY] = COORDINATE_TRANSFORM.editorToPreview(
          point.x,
          point.y,
          scale
        )
        ctx.lineTo(pointX, pointY)
      }
    }

    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}

function drawSymmetricCircle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  circleCenter: { x: number; y: number },
  circleRadius: number,
  symmetrySettings: SymmetrySettings,
  rotation: number,
  fillColor: string
) {
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)

  ctx.fillStyle = fillColor

  const scale = COORDINATE_TRANSFORM.getScale(radius)

  for (let i = 0; i < symmetrySettings.axes; i++) {
    ctx.save()

    ctx.rotate((i * Math.PI * 2) / symmetrySettings.axes)

    // Transform circle center from editor coordinates
    const [centerX, centerY] = COORDINATE_TRANSFORM.editorToPreview(
      circleCenter.x,
      circleCenter.y,
      scale
    )

    // Transform circle radius
    const scaledRadius = circleRadius * scale

    // Draw circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}

function drawSymmetricLine(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  symmetrySettings: SymmetrySettings,
  rotation: number,
  lineColor: string
) {
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)

  ctx.strokeStyle = lineColor
  ctx.lineWidth = 3

  const scale = COORDINATE_TRANSFORM.getScale(radius)

  for (let i = 0; i < symmetrySettings.axes; i++) {
    ctx.save()

    ctx.rotate((i * Math.PI * 2) / symmetrySettings.axes)

    // Transform line points from editor coordinates
    const [startX, startY] = COORDINATE_TRANSFORM.editorToPreview(
      startPoint.x,
      startPoint.y,
      scale
    )
    const [endX, endY] = COORDINATE_TRANSFORM.editorToPreview(
      endPoint.x,
      endPoint.y,
      scale
    )

    // Draw line
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.restore()
  }

  ctx.restore()
}
