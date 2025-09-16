'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { BezierEditor } from '@/components/bezier-editor'
import { SharinganPreview } from '@/components/sharingan-preview'
import { Settings, Palette, Zap, Play, Archive } from 'lucide-react'
import presets from '@/constants/presets'

import { BezierPoint, SymmetrySettings, ColorSettings, SavedDesign } from './types'
import { BasicSettingsTab } from './basic-settings-tab'
import { DrawingTab } from './drawing-tab'
import { ColorSettingsTab } from './color-settings-tab'
import { AnimationTab } from './animation-tab'
import { DataTab } from './data-tab'
import {
  generateDefaultDesignName,
  copyConfigToClipboard,
  createNewPath,
  saveDesignToLocalStorage,
  loadDesignsFromLocalStorage,
  deleteDesignFromLocalStorage,
  loadDesignData,
} from './utils'

export function SharinganDesigner() {
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [designName, setDesignName] = useState('')
  const { toast } = useToast()

  const [bezierPaths, setBezierPaths] = useState<BezierPoint[][]>([])
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [symmetrySettings, setSymmetrySettings] = useState<SymmetrySettings>({
    axes: 3,
  })
  const [animationSpeed, setAnimationSpeed] = useState([0])
  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    pupilColor: '#e70808',
    pathFillColor: '#000000',
    pupilSize: 0.14,
  })
  const [currentPreset, setCurrentPreset] = useState<string>('')
  const [isDataInitialized, setIsDataInitialized] = useState(false)

  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const STORAGE_KEY = 'sharingan-designer-data'
  const SAVED_DESIGNS_KEY = 'sharingan-saved-designs'

  // 初始化数据
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
            pupilColor: parsed.colorSettings.pupilColor || '#e70808',
            pathFillColor: parsed.colorSettings.pathFillColor || '#000000',
            pupilSize: parsed.colorSettings.pupilSize || 0.15,
          })
          shouldUseDefaults = false
        }
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }

    if (shouldUseDefaults && presets[0]) {
      setBezierPaths(presets[0].bezierPaths)
      setSymmetrySettings(presets[0].symmetrySettings)
      setAnimationSpeed(presets[0].animationSpeed)
      setColorSettings(presets[0].colorSettings)
      setCurrentPreset(presets[0].name)
    }

    const designs = loadDesignsFromLocalStorage(SAVED_DESIGNS_KEY)
    setSavedDesigns(designs)
    setIsDataInitialized(true)
  }, [])

  // 保存当前状态到本地存储
  useEffect(() => {
    const dataToSave = {
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
      timestamp: Date.now(),
    }
    isDataInitialized &&
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [bezierPaths, symmetrySettings, animationSpeed, colorSettings, isDataInitialized])

  // 加载预设
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

  // 重置为默认
  const handleReset = () => {
    const defaultPreset = presets[0]
    setBezierPaths(defaultPreset.bezierPaths)
    setCurrentPathIndex(0)
    setSymmetrySettings(defaultPreset.symmetrySettings)
    setAnimationSpeed(defaultPreset.animationSpeed)
    setColorSettings(defaultPreset.colorSettings)
    setCurrentPreset(defaultPreset.name)
  }

  // 添加新路径
  const addNewPath = () => {
    const newPath = createNewPath()
    const newPaths = [...bezierPaths, newPath]
    setBezierPaths(newPaths)
    setCurrentPathIndex(newPaths.length - 1)

    toast({
      title: '路径已添加',
      description: `已添加第 ${newPaths.length} 个路径`,
    })
  }

  // 删除当前路径
  const deleteCurrentPath = () => {
    if (bezierPaths.length <= 1) {
      toast({
        title: '无法删除',
        description: '至少需要保留一个路径',
        variant: 'destructive',
      })
      return
    }

    const newPaths = bezierPaths.filter(
      (_, index) => index !== currentPathIndex
    )
    setBezierPaths(newPaths)

    if (currentPathIndex >= newPaths.length) {
      setCurrentPathIndex(newPaths.length - 1)
    }

    toast({
      title: '路径已删除',
      description: `已删除路径 ${currentPathIndex + 1}`,
    })
  }

  // 更新当前路径
  const updateCurrentPath = (newPath: BezierPoint[]) => {
    const newPaths = [...bezierPaths]
    newPaths[currentPathIndex] = newPath
    setBezierPaths(newPaths)
  }

  // 保存设计
  const confirmSaveDesign = () => {
    if (!designName.trim()) {
      toast({
        title: '输入错误',
        description: '请输入设计名称',
        variant: 'destructive',
      })
      return
    }

    const currentConfig = {
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
    }

    saveDesignToLocalStorage(designName.trim(), currentConfig, SAVED_DESIGNS_KEY)
    setIsSaveDialogOpen(false)
    
    // 重新加载保存的设计列表
    const updatedDesigns = loadDesignsFromLocalStorage(SAVED_DESIGNS_KEY)
    setSavedDesigns(updatedDesigns)

    toast({
      title: '保存成功',
      description: `设计已保存为: ${designName}`,
    })
  }

  // 打开保存对话框
  const handleOpenSaveDialog = () => {
    setDesignName(generateDefaultDesignName())
    setIsSaveDialogOpen(true)
  }

  // 加载保存的设计列表
  const loadSavedDesigns = () => {
    const designs = loadDesignsFromLocalStorage(SAVED_DESIGNS_KEY)
    setSavedDesigns(designs)
  }

  // 从历史记录加载设计
  const loadDesignFromHistory = (design: SavedDesign) => {
    const loadedData = loadDesignData(design)
    setBezierPaths(loadedData.bezierPaths)
    setCurrentPathIndex(0)
    setSymmetrySettings(loadedData.symmetrySettings)
    setAnimationSpeed(loadedData.animationSpeed)
    setColorSettings(loadedData.colorSettings)
    setIsHistoryOpen(false)
  }

  // 删除设计
  const deleteDesign = (index: number) => {
    const updatedDesigns = deleteDesignFromLocalStorage(index, SAVED_DESIGNS_KEY)
    setSavedDesigns(updatedDesigns)
  }

  // 复制当前配置
  const copyCurrentConfig = async () => {
    const currentConfig = {
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
    }

    try {
      await copyConfigToClipboard(currentConfig)
      toast({
        title: '复制成功',
        description: '配置已复制到剪贴板',
      })
    } catch (error) {
      console.error('复制失败:', error)
      toast({
        title: '复制失败',
        description: '复制失败，请检查浏览器权限',
        variant: 'destructive',
      })
    }
  }

  const tabs = [
    { id: 'basic', label: '基础', icon: Settings },
    { id: 'draw', label: '绘制', icon: Zap },
    { id: 'color', label: '颜色', icon: Palette },
    { id: 'animation', label: '动画', icon: Play },
    { id: 'data', label: '数据', icon: Archive },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicSettingsTab
            currentPreset={currentPreset}
            symmetrySettings={symmetrySettings}
            colorSettings={colorSettings}
            onLoadPreset={loadPreset}
            onSymmetryChange={setSymmetrySettings}
            onColorSettingsChange={setColorSettings}
            presets={presets}
          />
        )

      case 'draw':
        return (
          <DrawingTab
            bezierPaths={bezierPaths}
            currentPathIndex={currentPathIndex}
            pupilSize={colorSettings.pupilSize}
            onPathChange={updateCurrentPath}
            onPathIndexChange={setCurrentPathIndex}
            onAddNewPath={addNewPath}
            onDeletePath={deleteCurrentPath}
          />
        )

      case 'color':
        return (
          <ColorSettingsTab
            colorSettings={colorSettings}
            onColorSettingsChange={setColorSettings}
          />
        )

      case 'animation':
        return (
          <AnimationTab
            animationSpeed={animationSpeed}
            onAnimationSpeedChange={setAnimationSpeed}
          />
        )

      case 'data':
        return (
          <DataTab
            designName={designName}
            isSaveDialogOpen={isSaveDialogOpen}
            savedDesigns={savedDesigns}
            isHistoryOpen={isHistoryOpen}
            onOpenSaveDialog={handleOpenSaveDialog}
            onCloseSaveDialog={() => setIsSaveDialogOpen(false)}
            onSaveDesign={confirmSaveDesign}
            onDesignNameChange={setDesignName}
            onReset={handleReset}
            onLoadDesign={loadDesignFromHistory}
            onDeleteDesign={deleteDesign}
            onCopyConfig={copyCurrentConfig}
            onLoadSavedDesigns={loadSavedDesigns}
          />
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
                      ? 'bg-primary/10 text-foreground border-r-2 border-primary'
                      : 'text-muted-foreground'
                  }`}>
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