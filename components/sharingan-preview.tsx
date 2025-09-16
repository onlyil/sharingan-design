"use client"

import { useEffect, useRef } from "react"
import type { BezierPoint, SymmetrySettings, ColorSettings } from "./sharingan-designer"

interface SharinganPreviewProps {
  bezierPath: BezierPoint[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number
  colorSettings: ColorSettings
}

export function SharinganPreview({
  bezierPath,
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

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 400
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4

    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      drawSharinganBackground(ctx, centerX, centerY, radius, colorSettings.pupilColor, false)

      // 绘制对称路径
      drawSymmetricPaths(
        ctx,
        centerX,
        centerY,
        radius,
        bezierPath,
        symmetrySettings,
        rotationRef.current,
        colorSettings.pathFillColor,
      )

      drawPupil(ctx, centerX, centerY, radius, colorSettings.pupilColor, colorSettings.pupilSize)

      // 更新旋转角度
      rotationRef.current += animationSpeed * 0.02

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [bezierPath, symmetrySettings, animationSpeed, colorSettings])

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="" style={{ filter: "drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))" }} />
    </div>
  )
}

function drawSharinganBackground(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  pupilColor: string,
  drawPupil = true, // 添加参数控制是否绘制瞳孔
) {
  // 外圆 - 红色背景
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = "#dc2626"
  ctx.fill()

  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2)
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawPupil(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  pupilColor: string,
  pupilSize = 0.15,
) {
  // 内圆 - 瞳孔颜色
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * pupilSize, 0, Math.PI * 2)
  ctx.fillStyle = pupilColor
  ctx.fill()
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawSymmetricPaths(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  bezierPath: BezierPoint[],
  symmetrySettings: SymmetrySettings,
  rotation: number,
  pathFillColor: string,
) {
  if (bezierPath.length < 2) return

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)

  ctx.strokeStyle = "#000000"
  ctx.fillStyle = pathFillColor
  ctx.lineWidth = 2
  ctx.shadowColor = "#000000"
  ctx.shadowBlur = 3

  const scale = radius / 200 // 缩放因子

  for (let i = 0; i < symmetrySettings.axes; i++) {
    ctx.save()

    ctx.rotate((i * Math.PI * 2) / symmetrySettings.axes)

    // 绘制贝塞尔路径
    ctx.beginPath()
    const firstPoint = bezierPath[0]
    ctx.moveTo((firstPoint.x - 100) * scale, (firstPoint.y - 100) * scale)

    for (let j = 1; j < bezierPath.length; j++) {
      const point = bezierPath[j]
      const prevPoint = bezierPath[j - 1]

      if (prevPoint.cp2x !== undefined && point.cp1x !== undefined) {
        ctx.bezierCurveTo(
          (prevPoint.cp2x - 100) * scale,
          (prevPoint.cp2y! - 100) * scale,
          (point.cp1x - 100) * scale,
          (point.cp1y! - 100) * scale,
          (point.x - 100) * scale,
          (point.y - 100) * scale,
        )
      } else {
        ctx.lineTo((point.x - 100) * scale, (point.y - 100) * scale)
      }
    }

    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  ctx.restore()
}
