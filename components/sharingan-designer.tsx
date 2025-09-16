"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BezierEditor } from "@/components/bezier-editor"
import { SharinganPreview } from "@/components/sharingan-preview"
import { Settings, Palette, Zap, Play, Archive } from "lucide-react"

export interface BezierPoint {
  x: number
  y: number
  cp1x?: number
  cp1y?: number
  cp2x?: number
  cp2y?: number
}

export interface SymmetrySettings {
  axes: number
}

export interface ColorSettings {
  pupilColor: string
  pathFillColor: string
  pupilSize: number
}

export function SharinganDesigner() {
  const [activeTab, setActiveTab] = useState("basic")

  const presets = [
    {
      name: "宇智波鼬",
      bezierPath: [
        { x: 50, y: 80, cp1x: 20, cp1y: 60, cp2x: 82, cp2y: 50 },
        { x: 271, y: 90, cp1x: 140, cp1y: 13, cp2x: 187, cp2y: 55 },
        {
          x: 121,
          y: 103,
          cp1x: 123.78794181160859,
          cp1y: 83.0438115329938,
          cp2x: 175.5256886798903,
          cp2y: 136.67516519541942,
        },
      ],
      symmetrySettings: { axes: 3 },
      animationSpeed: [0.2],
      colorSettings: { pupilColor: "#e70808", pathFillColor: "#000000", pupilSize: 0.15 },
    },
    {
      name: "基础模式",
      bezierPath: [
        { x: 50, y: 80, cp1x: 20, cp1y: 60, cp2x: 80, cp2y: 60 },
        { x: 150, y: 50, cp1x: 120, cp1y: 30, cp2x: 180, cp2y: 30 },
      ],
      symmetrySettings: { axes: 3 },
      animationSpeed: [0.2],
      colorSettings: { pupilColor: "#000000", pathFillColor: "#000000", pupilSize: 0.15 },
    },
  ]

  const [bezierPath, setBezierPath] = useState<BezierPoint[]>(presets[0].bezierPath)

  const [symmetrySettings, setSymmetrySettings] = useState<SymmetrySettings>(presets[0].symmetrySettings)

  const [animationSpeed, setAnimationSpeed] = useState(presets[0].animationSpeed)

  const [colorSettings, setColorSettings] = useState<ColorSettings>(presets[0].colorSettings)

  const [savedDesigns, setSavedDesigns] = useState<any[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const STORAGE_KEY = "sharingan-designer-data"
  const SAVED_DESIGNS_KEY = "sharingan-saved-designs"

  useEffect(() => {
    const savedData = window.localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed.bezierPath) setBezierPath(parsed.bezierPath)
        if (parsed.symmetrySettings) setSymmetrySettings(parsed.symmetrySettings)
        if (parsed.animationSpeed) setAnimationSpeed(parsed.animationSpeed)
        // Ensure colorSettings contains pupilSize's default value
        if (parsed.colorSettings) {
          setColorSettings({
            pupilColor: parsed.colorSettings.pupilColor || "#e70808",
            pathFillColor: parsed.colorSettings.pathFillColor || "#000000",
            pupilSize: parsed.colorSettings.pupilSize || 0.15,
          })
        }
      } catch (error) {
        console.error("Failed to load saved data:", error)
      }
    }

    const designs = JSON.parse(window.localStorage.getItem(SAVED_DESIGNS_KEY) || "[]")
    setSavedDesigns(designs.sort((a: any, b: any) => b.timestamp - a.timestamp))
  }, [])

  useEffect(() => {
    const dataToSave = {
      bezierPath,
      symmetrySettings,
      animationSpeed,
      colorSettings,
      timestamp: Date.now(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [bezierPath, symmetrySettings, animationSpeed, colorSettings])

  const loadPreset = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName)
    if (preset) {
      setBezierPath(preset.bezierPath)
      setSymmetrySettings(preset.symmetrySettings)
      setAnimationSpeed(preset.animationSpeed)
      setColorSettings(preset.colorSettings)
    }
  }

  const handleReset = () => {
    const defaultPreset = presets[0]
    setBezierPath(defaultPreset.bezierPath)
    setSymmetrySettings(defaultPreset.symmetrySettings)
    setAnimationSpeed(defaultPreset.animationSpeed)
    setColorSettings(defaultPreset.colorSettings)
  }

  const handleSaveDesign = () => {
    const designName = `设计_${new Date().toLocaleString()}`
    const currentDesign = {
      name: designName,
      bezierPath,
      symmetrySettings,
      animationSpeed,
      colorSettings,
      timestamp: Date.now(),
    }

    const savedDesigns = JSON.parse(window.localStorage.getItem(SAVED_DESIGNS_KEY) || "[]")
    savedDesigns.push(currentDesign)
    window.localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(savedDesigns))

    alert(`设计已保存为: ${designName}`)
  }

  const loadSavedDesigns = () => {
    const designs = JSON.parse(window.localStorage.getItem(SAVED_DESIGNS_KEY) || "[]")
    setSavedDesigns(designs.sort((a: any, b: any) => b.timestamp - a.timestamp))
  }

  const loadDesignFromHistory = (design: any) => {
    setBezierPath(design.bezierPath)
    setSymmetrySettings(design.symmetrySettings)
    setAnimationSpeed(design.animationSpeed)
    setColorSettings(design.colorSettings)
    setIsHistoryOpen(false)
  }

  const deleteDesign = (index: number) => {
    const updatedDesigns = savedDesigns.filter((_, i) => i !== index)
    setSavedDesigns(updatedDesigns)
    window.localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(updatedDesigns))
  }

  const tabs = [
    { id: "basic", label: "基础", icon: Settings },
    { id: "draw", label: "绘制", icon: Zap },
    { id: "color", label: "颜色", icon: Palette },
    { id: "animation", label: "动画", icon: Play },
    { id: "data", label: "数据", icon: Archive },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <Label className="text-sm font-medium">预设方案</Label>
              <Select onValueChange={loadPreset}>
                <SelectTrigger>
                  <SelectValue placeholder="选择预设方案" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-4 space-y-4">
              <Label className="text-sm font-medium">对称设置</Label>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">轴数: {symmetrySettings.axes}</Label>
                <Slider
                  value={[symmetrySettings.axes]}
                  onValueChange={([value]) => setSymmetrySettings((prev) => ({ ...prev, axes: value }))}
                  min={2}
                  max={12}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  瞳孔大小: {(colorSettings.pupilSize * 100).toFixed(0)}%
                </Label>
                <Slider
                  value={[colorSettings.pupilSize]}
                  onValueChange={([value]) => setColorSettings((prev) => ({ ...prev, pupilSize: value }))}
                  min={0.05}
                  max={0.3}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </Card>
          </div>
        )

      case "draw":
        return (
          <div className="space-y-4">
            <Card className="p-4">
              <Label className="text-sm font-medium mb-3 block">贝塞尔路径编辑器</Label>
              <BezierEditor path={bezierPath} onChange={setBezierPath} />
            </Card>
          </div>
        )

      case "color":
        return (
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <Label className="text-sm font-medium">颜色设置</Label>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">瞳孔颜色</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorSettings.pupilColor}
                    onChange={(e) => setColorSettings((prev) => ({ ...prev, pupilColor: e.target.value }))}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground font-mono">{colorSettings.pupilColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">路径填充颜色</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorSettings.pathFillColor}
                    onChange={(e) => setColorSettings((prev) => ({ ...prev, pathFillColor: e.target.value }))}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground font-mono">{colorSettings.pathFillColor}</span>
                </div>
              </div>
            </Card>
          </div>
        )

      case "animation":
        return (
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <Label className="text-sm font-medium">动画设置</Label>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">旋转速度: {animationSpeed[0].toFixed(1)}x</Label>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  min={0}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </Card>
          </div>
        )

      case "data":
        return (
          <div className="space-y-2">
            <Button className="w-full" onClick={handleReset}>
              重置为默认
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleSaveDesign}>
              保存当前设计
            </Button>
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent" onClick={loadSavedDesigns}>
                  历史记录
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>历史记录</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="space-y-2">
                    {savedDesigns.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">暂无保存的设计</p>
                    ) : (
                      savedDesigns.map((design, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{design.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(design.timestamp).toLocaleString()}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-muted px-1 rounded">旋转</span>
                                <span className="text-xs bg-muted px-1 rounded">{design.symmetrySettings.axes}轴</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => loadDesignFromHistory(design)}
                                className="text-xs h-6"
                              >
                                加载
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteDesign(index)}
                                className="text-xs h-6"
                              >
                                删除
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="w-full bg-transparent">
              导出设计
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted">
        <div className="relative">
          <SharinganPreview
            bezierPath={bezierPath}
            symmetrySettings={symmetrySettings}
            animationSpeed={animationSpeed[0]}
            colorSettings={colorSettings}
          />
        </div>
      </div>

      <div className="flex bg-card border-l border-border">
        <div className="w-16 bg-muted/30 border-r border-border flex flex-col">
          <div className="p-2 border-b border-border">
            <h2 className="text-xs font-bold text-center text-primary">设置</h2>
          </div>
          <div className="flex-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-3 flex flex-col items-center gap-1 transition-colors hover:bg-muted ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-foreground border-r-2 border-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-xs">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="w-96 overflow-y-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
