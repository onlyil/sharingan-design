'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import presets from '@/constants/presets'

import {
  BezierPoint,
  BezierPath,
  SymmetrySettings,
  ColorSettings,
  SavedDesign,
} from '@/models/types'
import { PreviewPanel } from './preview-panel'
import { ConfigPanel } from './config-panel'
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
  const [activeTab, setActiveTab] = useState('draw')
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [designName, setDesignName] = useState('')
  
  const [bezierPaths, setBezierPaths] = useState<BezierPath[]>([])
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [symmetrySettings, setSymmetrySettings] = useState<SymmetrySettings>({
    axes: 3,
  })
  const [animationSpeed, setAnimationSpeed] = useState([0])
  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    pupilColor: '#e70808',
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

        if (parsed.bezierPaths && Array.isArray(parsed.bezierPaths)) {
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
      setColorSettings({
        pupilColor: presets[0].colorSettings.pupilColor,
        pupilSize: presets[0].colorSettings.pupilSize,
      })
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
  }, [
    bezierPaths,
    symmetrySettings,
    animationSpeed,
    colorSettings,
    isDataInitialized,
  ])

  // 加载预设
  const loadPreset = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName)
    if (preset) {
      // 转换预设数据为新结构
      const convertedPaths = preset.bezierPaths.map((path: BezierPath) => ({
        points: path.points,
        color: path.color || '#000000',
      }))
      setBezierPaths(convertedPaths)
      setCurrentPathIndex(0)
      setSymmetrySettings(preset.symmetrySettings)
      setColorSettings({
        pupilColor: preset.colorSettings.pupilColor,
        pupilSize: preset.colorSettings.pupilSize,
      })
      setCurrentPreset(presetName)
    }
  }

  // 重置为默认
  const handleReset = () => {
    const defaultPreset = presets[0]
    const convertedPaths = defaultPreset.bezierPaths.map(
      (path: BezierPath) => ({
        points: path.points,
        color: path.color || '#000000',
      })
    )
    setBezierPaths(convertedPaths)
    setCurrentPathIndex(0)
    setSymmetrySettings(defaultPreset.symmetrySettings)
    setColorSettings({
      pupilColor: defaultPreset.colorSettings.pupilColor,
      pupilSize: defaultPreset.colorSettings.pupilSize,
    })
    setCurrentPreset(defaultPreset.name)
  }

  // 添加新路径
  const addNewPath = () => {
    const newPathPoints = createNewPath()
    const newPath: BezierPath = {
      points: newPathPoints,
      color: '#000000', // 新路径默认黑色
    }
    const newPaths = [...bezierPaths, newPath]
    setBezierPaths(newPaths)
    setCurrentPathIndex(newPaths.length - 1)

    toast.success(`已添加第 ${newPaths.length} 个路径`, {
      description: '路径已添加',
    })
  }

  // 删除当前路径
  const deleteCurrentPath = () => {
    if (bezierPaths.length <= 1) {
      toast.error('至少需要保留一个路径', {
        description: '无法删除',
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

    toast.success(`已删除路径 ${currentPathIndex + 1}`, {
      description: '路径已删除',
    })
  }

  // 更新当前路径
  const updateCurrentPath = (newPath: BezierPoint[]) => {
    const newPaths = [...bezierPaths]
    newPaths[currentPathIndex] = {
      ...newPaths[currentPathIndex],
      points: newPath,
    }
    setBezierPaths(newPaths)
  }

  // 保存设计
  const confirmSaveDesign = () => {
    if (!designName.trim()) {
      toast.error('请输入设计名称', {
        description: '输入错误',
      })
      return
    }

    const currentConfig = {
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
    }

    saveDesignToLocalStorage(
      designName.trim(),
      currentConfig,
      SAVED_DESIGNS_KEY
    )
    setIsSaveDialogOpen(false)

    // 重新加载保存的设计列表
    const updatedDesigns = loadDesignsFromLocalStorage(SAVED_DESIGNS_KEY)
    setSavedDesigns(updatedDesigns)

    toast.success(`设计已保存为: ${designName}`, {
      description: '保存成功',
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
    setIsHistoryOpen(true)
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
    const updatedDesigns = deleteDesignFromLocalStorage(
      index,
      SAVED_DESIGNS_KEY
    )
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
      toast.success('配置已复制到剪贴板', {
        description: '复制成功',
      })
    } catch (error) {
      console.error('复制失败:', error)
      toast.error('复制失败，请检查浏览器权限', {
        description: '复制失败',
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <PreviewPanel
        bezierPaths={bezierPaths}
        symmetrySettings={symmetrySettings}
        animationSpeed={animationSpeed[0]}
        colorSettings={colorSettings}
        currentPreset={currentPreset}
        presets={presets}
        onLoadPreset={loadPreset}
      />

      <ConfigPanel
        activeTab={activeTab}
        bezierPaths={bezierPaths}
        currentPathIndex={currentPathIndex}
        symmetrySettings={symmetrySettings}
        animationSpeed={animationSpeed}
        colorSettings={colorSettings}
        currentPreset={currentPreset}
        savedDesigns={savedDesigns}
        isSaveDialogOpen={isSaveDialogOpen}
        designName={designName}
        isHistoryOpen={isHistoryOpen}
        onTabChange={setActiveTab}
        onBezierPathsChange={setBezierPaths}
        onCurrentPathIndexChange={setCurrentPathIndex}
        onSymmetryChange={setSymmetrySettings}
        onAnimationSpeedChange={setAnimationSpeed}
        onColorSettingsChange={setColorSettings}
        onAddNewPath={addNewPath}
        onDeletePath={deleteCurrentPath}
        onOpenSaveDialog={handleOpenSaveDialog}
        onCloseSaveDialog={() => setIsSaveDialogOpen(false)}
        onCloseHistoryDialog={() => setIsHistoryOpen(false)}
        onSaveDesign={confirmSaveDesign}
        onDesignNameChange={setDesignName}
        onReset={handleReset}
        onLoadDesign={loadDesignFromHistory}
        onDeleteDesign={deleteDesign}
        onCopyConfig={copyCurrentConfig}
        onLoadSavedDesigns={loadSavedDesigns}
      />
    </div>
  )
}
