'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import presets from '@/constants/presets'

import {
  BezierPoint,
  BezierPath,
  Shape,
  ShapeType,
  SymmetrySettings,
  ColorSettings,
  SavedDesign,
} from '@/models/types'
import { PreviewPanel } from './preview-panel'
import { ConfigPanel } from './config-panel'
import {
  generateDefaultDesignName,
  copyConfigToClipboard,
  createBezierShape,
  createCircleShape,
  createLineShape,
  bezierPathToShape,
  shapeToBezierPath,
  saveDesignToLocalStorage,
  loadDesignsFromLocalStorage,
  deleteDesignFromLocalStorage,
  loadDesignData,
} from './utils'

export function SharinganDesigner() {
  const [activeTab, setActiveTab] = useState('draw')
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [designName, setDesignName] = useState('')

  const [shapes, setShapes] = useState<Shape[]>([])
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0)
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

        if (parsed.shapes && Array.isArray(parsed.shapes)) {
          // New format - use shapes directly
          setShapes(parsed.shapes)
          shouldUseDefaults = false
        } else if (parsed.bezierPaths && Array.isArray(parsed.bezierPaths)) {
          // Legacy format - convert bezierPaths to shapes
          const convertedShapes = parsed.bezierPaths.map(bezierPathToShape)
          setShapes(convertedShapes)
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
      const defaultShapes = presets[0].bezierPaths.map(bezierPathToShape)
      setShapes(defaultShapes)
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
      shapes,
      symmetrySettings,
      animationSpeed,
      colorSettings,
      timestamp: Date.now(),
    }
    isDataInitialized &&
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [
    shapes,
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
      const convertedShapes = preset.bezierPaths.map(bezierPathToShape)
      setShapes(convertedShapes)
      setCurrentShapeIndex(0)
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
    const convertedShapes = defaultPreset.bezierPaths.map(bezierPathToShape)
    setShapes(convertedShapes)
    setCurrentShapeIndex(0)
    setSymmetrySettings(defaultPreset.symmetrySettings)
    setColorSettings({
      pupilColor: defaultPreset.colorSettings.pupilColor,
      pupilSize: defaultPreset.colorSettings.pupilSize,
    })
    setCurrentPreset(defaultPreset.name)
  }

  // Add new shape (default to bezier for compatibility)
  const addNewShape = (shapeType: ShapeType = ShapeType.BEZIER) => {
    let newShape: Shape

    switch (shapeType) {
      case ShapeType.CIRCLE:
        newShape = createCircleShape()
        break
      case ShapeType.LINE:
        newShape = createLineShape()
        break
      default:
        newShape = createBezierShape()
    }

    const newShapes = [...shapes, newShape]
    setShapes(newShapes)
    setCurrentShapeIndex(newShapes.length - 1)

    const shapeName = shapeType.charAt(0).toUpperCase() + shapeType.slice(1)
    toast.success(`Added ${shapeName} ${newShapes.length}`, {
      description: 'Shape added',
    })
  }

  // Delete current shape
  const deleteCurrentShape = () => {
    if (shapes.length <= 1) {
      toast.error('At least one shape must be kept', {
        description: 'Cannot delete',
      })
      return
    }

    const newShapes = shapes.filter((_, index) => index !== currentShapeIndex)
    setShapes(newShapes)

    if (currentShapeIndex >= newShapes.length) {
      setCurrentShapeIndex(newShapes.length - 1)
    }

    toast.success(`Deleted shape ${currentShapeIndex + 1}`, {
      description: 'Shape deleted',
    })
  }

  // Update current shape (for bezier compatibility)
  const updateCurrentShape = (newPath: BezierPoint[]) => {
    const newShapes = [...shapes]
    const currentShape = newShapes[currentShapeIndex]

    if (currentShape.type === ShapeType.BEZIER) {
      newShapes[currentShapeIndex] = {
        ...currentShape,
        points: newPath,
      }
      setShapes(newShapes)
    }
  }

  // Update shape color
  const updateShapeColor = (index: number, color: string) => {
    const newShapes = [...shapes]
    newShapes[index] = { ...newShapes[index], color }
    setShapes(newShapes)
  }

  // Save design
  const confirmSaveDesign = () => {
    if (!designName.trim()) {
      toast.error('Please enter design name', {
        description: 'Input error',
      })
      return
    }

    // Convert shapes to legacy bezierPaths for backward compatibility
    const legacyBezierPaths = shapes
      .map(shapeToBezierPath)
      .filter((path): path is BezierPath => path !== null)

    const currentConfig = {
      bezierPaths: legacyBezierPaths,
      shapes, // Include new format for future use
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

    // Try to load new format first, fall back to legacy format
    let loadedShapes: Shape[]
    if (design.shapes && Array.isArray(design.shapes)) {
      loadedShapes = design.shapes
    } else {
      // Convert legacy bezierPaths to shapes
      loadedShapes = loadedData.bezierPaths.map(bezierPathToShape)
    }

    setShapes(loadedShapes)
    setCurrentShapeIndex(0)
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
    // Convert shapes to legacy bezierPaths for backward compatibility
    const legacyBezierPaths = shapes
      .map(shapeToBezierPath)
      .filter((path): path is BezierPath => path !== null)

    const currentConfig = {
      bezierPaths: legacyBezierPaths,
      shapes, // Include new format for future use
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
        shapes={shapes}
        symmetrySettings={symmetrySettings}
        animationSpeed={animationSpeed[0]}
        colorSettings={colorSettings}
        currentPreset={currentPreset}
        presets={presets}
        onLoadPreset={loadPreset}
      />

      <ConfigPanel
        activeTab={activeTab}
        shapes={shapes}
        currentShapeIndex={currentShapeIndex}
        symmetrySettings={symmetrySettings}
        animationSpeed={animationSpeed}
        colorSettings={colorSettings}
        currentPreset={currentPreset}
        savedDesigns={savedDesigns}
        isSaveDialogOpen={isSaveDialogOpen}
        designName={designName}
        isHistoryOpen={isHistoryOpen}
        onTabChange={setActiveTab}
        onShapesChange={setShapes}
        onCurrentShapeIndexChange={setCurrentShapeIndex}
        onSymmetryChange={setSymmetrySettings}
        onAnimationSpeedChange={setAnimationSpeed}
        onColorSettingsChange={setColorSettings}
        onAddNewShape={addNewShape}
        onDeleteShape={deleteCurrentShape}
        onShapeColorChange={updateShapeColor}
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
