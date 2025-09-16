"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BezierEditor } from "@/components/bezier-editor"
import { SharinganPreview } from "@/components/sharingan-preview"
import { Settings, Palette, Zap, Play, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import presets from "@/contants/presets"

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
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [designName, setDesignName] = useState("")
  const { toast } = useToast()

  const [bezierPaths, setBezierPaths] = useState<BezierPoint[][]>([])
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [symmetrySettings, setSymmetrySettings] = useState<SymmetrySettings>({ axes: 3 })
  const [animationSpeed, setAnimationSpeed] = useState([0])
  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    pupilColor: "#e70808",
    pathFillColor: "#000000",
    pupilSize: 0.14,
  })
  const [currentPreset, setCurrentPreset] = useState<string>("")

  const [savedDesigns, setSavedDesigns] = useState<any[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const STORAGE_KEY = "sharingan-designer-data"
  const SAVED_DESIGNS_KEY = "sharingan-saved-designs"

  useEffect(() => {
    const savedData = window.localStorage.getItem(STORAGE_KEY)
    let shouldUseDefaults = true

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)

        if (parsed.bezierPath && Array.isArray(parsed.bezierPath)) {
          setBezierPaths([parsed.bezierPath])
          shouldUseDefaults = false
        } else if (parsed.bezierPaths && Array.isArray(parsed.bezierPaths)) {
          setBezierPaths(parsed.bezierPaths)
          shouldUseDefaults = false
        }

        if (parsed.symmetrySettings) {
          setSymmetrySettings(parsed.symmetrySettings)
          shouldUseDefaults = false
        }

        if (parsed.animationSpeed) {
          setAnimationSpeed(parsed.animationSpeed)
          shouldUseDefaults = false
        }

        if (parsed.colorSettings) {
          setColorSettings({
            pupilColor: parsed.colorSettings.pupilColor || "#e70808",
            pathFillColor: parsed.colorSettings.pathFillColor || "#000000",
            pupilSize: parsed.colorSettings.pupilSize || 0.15,
          })
          shouldUseDefaults = false
        }
      } catch (error) {
        console.error("Failed to load saved data:", error)
      }
    }

    if (shouldUseDefaults && presets[0]) {
      setBezierPaths(presets[0].bezierPaths)
      setSymmetrySettings(presets[0].symmetrySettings)
      setAnimationSpeed(presets[0].animationSpeed)
      setColorSettings(presets[0].colorSettings)
      setCurrentPreset(presets[0].name)
    }

    const designs = JSON.parse(window.localStorage.getItem(SAVED_DESIGNS_KEY) || "[]")
    setSavedDesigns(designs.sort((a: any, b: any) => b.timestamp - a.timestamp))
  }, [])

  useEffect(() => {
    const dataToSave = {
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
      timestamp: Date.now(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [bezierPaths, symmetrySettings, animationSpeed, colorSettings])

  const loadPreset = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName)
    if (preset) {
      setBezierPaths(preset.bezierPaths)
      setCurrentPathIndex(0)
      setSymmetrySettings(preset.symmetrySettings)
      setAnimationSpeed(preset.animationSpeed)
      setColorSettings(preset.colorSettings)
      setCurrentPreset(presetName)
    }
  }

  const handleReset = () => {
    const defaultPreset = presets[0]
    setBezierPaths(defaultPreset.bezierPaths)
    setCurrentPathIndex(0)
    setSymmetrySettings(defaultPreset.symmetrySettings)
    setAnimationSpeed(defaultPreset.animationSpeed)
    setColorSettings(defaultPreset.colorSettings)
    setCurrentPreset(defaultPreset.name)
  }

  const addNewPath = () => {
    const newPath: BezierPoint[] = [
      {
        x: 160 + Math.random() * 40 - 20,
        y: 120 + Math.random() * 40 - 20,
        cp1x: 140 + Math.random() * 40 - 20,
        cp1y: 100 + Math.random() * 40 - 20,
        cp2x: 180 + Math.random() * 40 - 20,
        cp2y: 140 + Math.random() * 40 - 20,
      },
      {
        x: 200 + Math.random() * 40 - 20,
        y: 160 + Math.random() * 40 - 20,
        cp1x: 180 + Math.random() * 40 - 20,
        cp1y: 140 + Math.random() * 40 - 20,
        cp2x: 220 + Math.random() * 40 - 20,
        cp2y: 180 + Math.random() * 40 - 20,
      },
    ]

    const newPaths = [...bezierPaths, newPath]
    setBezierPaths(newPaths)
    setCurrentPathIndex(newPaths.length - 1)

    toast({
      title: "路径已添加",
      description: `已添加第 ${newPaths.length} 个路径`,
    })
  }

  const deleteCurrentPath = () => {
    if (bezierPaths.length <= 1) {
      toast({
        title: "无法删除",
        description: "至少需要保留一个路径",
        variant: "destructive",
      })
      return
    }

    const newPaths = bezierPaths.filter((_, index) => index !== currentPathIndex)
    setBezierPaths(newPaths)

    // 调整当前路径索引
    if (currentPathIndex >= newPaths.length) {
      setCurrentPathIndex(newPaths.length - 1)
    }

    toast({
      title: "路径已删除",
      description: `已删除路径 ${currentPathIndex + 1}`,
    })
  }

  const updateCurrentPath = (newPath: BezierPoint[]) => {
    const newPaths = [...bezierPaths]
    newPaths[currentPathIndex] = newPath
    setBezierPaths(newPaths)
  }

  const confirmSaveDesign = () => {
    if (!designName.trim()) {
      toast({
        title: "输入错误",
        description: "请输入设计名称",
        variant: "destructive",
      })
      return
    }

    const currentDesign = {
      name: designName.trim(),
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
      timestamp: Date.now(),
    }

    const savedDesigns = JSON.parse(window.localStorage.getItem(SAVED_DESIGNS_KEY) || "[]")
    savedDesigns.push(currentDesign)
    window.localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(savedDesigns))

    setIsSaveDialogOpen(false)
    toast({
      title: "保存成功",
      description: `设计已保存为: ${designName}`,
    })
  }

  const generateDefaultDesignName = () => {
    const now = new Date()
    const timeString = now
      .toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/[/\s:]/g, "")
    return `设计_${timeString}`
  }

  const handleOpenSaveDialog = () => {
    setDesignName(generateDefaultDesignName())
    setIsSaveDialogOpen(true)
  }

  const loadSavedDesigns = () => {
    const designs = JSON.parse(window.localStorage.getItem(SAVED_DESIGNS_KEY) || "[]")
    setSavedDesigns(designs.sort((a: any, b: any) => b.timestamp - a.timestamp))
  }

  const loadDesignFromHistory = (design: any) => {
    if (design.bezierPath && Array.isArray(design.bezierPath)) {
      setBezierPaths([design.bezierPath])
    } else if (design.bezierPaths && Array.isArray(design.bezierPaths)) {
      setBezierPaths(design.bezierPaths)
    }
    setCurrentPathIndex(0)
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

  const copyCurrentConfig = async () => {
    const currentConfig = {
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
      timestamp: Date.now(),
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(currentConfig, null, 2))
      toast({
        title: "复制成功",
        description: "配置已复制到剪贴板",
      })
    } catch (error) {
      console.error("复制失败:", error)
      toast({
        title: "复制失败",
        description: "复制失败，请检查浏览器权限",
        variant: "destructive",
      })
    }
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
            <Card className="p-4">
              <Label className="text-sm font-medium">基础设置</Label>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">预设方案</Label>
                <Select onValueChange={loadPreset} value={currentPreset}>
                  <SelectTrigger className="w-[125px]">
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
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">轴数: {symmetrySettings.axes}</Label>
                <Slider
                  value={[symmetrySettings.axes]}
                  onValueChange={([value]) => setSymmetrySettings((prev) => ({ ...prev, axes: value }))}
                  min={2}
                  max={6}
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
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">贝塞尔路径编辑器</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={currentPathIndex.toString()}
                    onValueChange={(value) => setCurrentPathIndex(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bezierPaths.map((_, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          路径 {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={deleteCurrentPath}
                    disabled={bezierPaths.length <= 1}
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    删除
                  </Button>
                </div>
              </div>
              <BezierEditor
                pupilSize={colorSettings.pupilSize}
                allPaths={bezierPaths}
                currentPathIndex={currentPathIndex}
                onChange={updateCurrentPath}
              />
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={addNewPath} className="w-full bg-transparent">
                  添加路径
                </Button>
              </div>
            </Card>
          </div>
        )

      case "color":
        return (
          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <Label className="text-sm font-medium">颜色设置</Label>

              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">瞳孔颜色</Label>
                <RadioGroup
                  value={colorSettings.pupilColor}
                  onValueChange={(value) => setColorSettings((prev) => ({ ...prev, pupilColor: value }))}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="#000000" id="pupil-black" />
                    <label htmlFor="pupil-black" className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-black border border-border"></div>
                      <span className="text-sm">黑色</span>
                      <span className="text-xs text-muted-foreground font-mono">#000000</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="#B20000" id="pupil-red" />
                    <label htmlFor="pupil-red" className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#B20000" }}></div>
                      <span className="text-sm">红色</span>
                      <span className="text-xs text-muted-foreground font-mono">#B20000</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">路径填充颜色</Label>
                <RadioGroup
                  value={colorSettings.pathFillColor}
                  onValueChange={(value) => setColorSettings((prev) => ({ ...prev, pathFillColor: value }))}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="#000000" id="path-black" />
                    <label htmlFor="path-black" className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-black border border-border"></div>
                      <span className="text-sm">黑色</span>
                      <span className="text-xs text-muted-foreground font-mono">#000000</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="#B20000" id="path-red" />
                    <label htmlFor="path-red" className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#B20000" }}></div>
                      <span className="text-sm">红色</span>
                      <span className="text-xs text-muted-foreground font-mono">#B20000</span>
                    </label>
                  </div>
                </RadioGroup>
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
            <Button variant="outline" className="w-full bg-transparent" onClick={handleOpenSaveDialog}>
              保存当前设计
            </Button>

            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>保存设计</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="design-name" className="text-sm font-medium">
                      设计名称
                    </Label>
                    <input
                      id="design-name"
                      type="text"
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="请输入设计名称"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={confirmSaveDesign}>保存</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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
            <Button variant="outline" className="w-full bg-transparent" onClick={copyCurrentConfig}>
              复制当前配置
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
            bezierPaths={bezierPaths}
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
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}
