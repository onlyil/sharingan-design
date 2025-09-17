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
  const [animationSpeed, setAnimationSpeed] = useState([0.2])
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

  // Initialize data
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

  // Save current state to local storage
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

  // Load preset
  const loadPreset = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName)
    if (preset) {
      // Convert preset data to new structure
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

  // Reset to default
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

  // Add new path
  const addNewPath = () => {
    const newPathPoints = createNewPath()
    const newPath: BezierPath = {
      points: newPathPoints,
      color: '#000000', // New path defaults to black
    }
    const newPaths = [...bezierPaths, newPath]
    setBezierPaths(newPaths)
    setCurrentPathIndex(newPaths.length - 1)

    toast.success(`Added path ${newPaths.length}`, {
      description: 'Path added',
    })
  }

  // Delete current path
  const deleteCurrentPath = () => {
    if (bezierPaths.length <= 1) {
      toast.error('At least one path must be kept', {
        description: 'Cannot delete',
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

    toast.success(`Deleted path ${currentPathIndex + 1}`, {
      description: 'Path deleted',
    })
  }

  // Update current path
  const updateCurrentPath = (newPath: BezierPoint[]) => {
    const newPaths = [...bezierPaths]
    newPaths[currentPathIndex] = {
      ...newPaths[currentPathIndex],
      points: newPath,
    }
    setBezierPaths(newPaths)
  }

  // Save design
  const confirmSaveDesign = () => {
    if (!designName.trim()) {
      toast.error('Please enter design name', {
        description: 'Input error',
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

    // Reload saved designs list
    const updatedDesigns = loadDesignsFromLocalStorage(SAVED_DESIGNS_KEY)
    setSavedDesigns(updatedDesigns)

    toast.success(`Design saved as: ${designName}`, {
      description: 'Save successful',
    })
  }

  // Open save dialog
  const handleOpenSaveDialog = () => {
    setDesignName(generateDefaultDesignName())
    setIsSaveDialogOpen(true)
  }

  // Load saved designs list
  const loadSavedDesigns = () => {
    const designs = loadDesignsFromLocalStorage(SAVED_DESIGNS_KEY)
    setSavedDesigns(designs)
    setIsHistoryOpen(true)
  }

  // Load design from history
  const loadDesignFromHistory = (design: SavedDesign) => {
    const loadedData = loadDesignData(design)
    setBezierPaths(loadedData.bezierPaths)
    setCurrentPathIndex(0)
    setSymmetrySettings(loadedData.symmetrySettings)
    setColorSettings(loadedData.colorSettings)
    setIsHistoryOpen(false)
  }

  // Delete design
  const deleteDesign = (index: number) => {
    const updatedDesigns = deleteDesignFromLocalStorage(
      index,
      SAVED_DESIGNS_KEY
    )
    setSavedDesigns(updatedDesigns)
  }

  // Copy current configuration
  const copyCurrentConfig = async () => {
    const currentConfig = {
      bezierPaths,
      symmetrySettings,
      animationSpeed,
      colorSettings,
    }

    try {
      await copyConfigToClipboard(currentConfig)
      toast.success('Configuration copied to clipboard', {
        description: 'Copy successful',
      })
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Copy failed, please check browser permissions', {
        description: 'Copy failed',
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
