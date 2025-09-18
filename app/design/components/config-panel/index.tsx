import { useState } from 'react'
import { Settings, Palette, Zap, Play, Archive } from 'lucide-react'
import { BasicSettingsTab } from './basic-settings-tab'
import { DrawingTab } from './drawing-tab'
import { ColorSettingsTab } from './color-settings-tab'
import { AnimationTab } from './animation-tab'
import { DataTab } from './data-tab'
import {
  Shape,
  ShapeType,
  BezierPoint,
  SymmetrySettings,
  ColorSettings,
  SavedDesign,
} from '@/models/types'

interface ConfigPanelProps {
  // Core state
  activeTab: string
  shapes: Shape[]
  currentShapeIndex: number
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
  currentPreset: string
  savedDesigns: SavedDesign[]
  isSaveDialogOpen: boolean
  designName: string
  isHistoryOpen: boolean

  // Callback functions
  onTabChange: (tabId: string) => void
  onShapesChange: (shapes: Shape[]) => void
  onCurrentShapeIndexChange: (index: number) => void
  onSymmetryChange: (settings: SymmetrySettings) => void
  onAnimationSpeedChange: (speed: number[]) => void
  onColorSettingsChange: (settings: ColorSettings) => void
  onAddNewShape: (shapeType: ShapeType) => void
  onDeleteShape: () => void
  onShapeColorChange: (index: number, color: string) => void
  onOpenSaveDialog: () => void
  onCloseSaveDialog: () => void
  onCloseHistoryDialog: () => void
  onSaveDesign: () => void
  onDesignNameChange: (name: string) => void
  onReset: () => void
  onLoadDesign: (design: SavedDesign) => void
  onDeleteDesign: (index: number) => void
  onCopyConfig: () => void
  onLoadSavedDesigns: () => void
}

export function ConfigPanel({
  activeTab,
  shapes,
  currentShapeIndex,
  symmetrySettings,
  animationSpeed,
  colorSettings,
  currentPreset,
  savedDesigns,
  isSaveDialogOpen,
  designName,
  isHistoryOpen,
  onTabChange,
  onShapesChange,
  onCurrentShapeIndexChange,
  onSymmetryChange,
  onAnimationSpeedChange,
  onColorSettingsChange,
  onAddNewShape,
  onDeleteShape,
  onShapeColorChange,
  onOpenSaveDialog,
  onCloseSaveDialog,
  onCloseHistoryDialog,
  onSaveDesign,
  onDesignNameChange,
  onReset,
  onLoadDesign,
  onDeleteDesign,
  onCopyConfig,
  onLoadSavedDesigns,
}: ConfigPanelProps) {
  const tabs = [
    { id: 'draw', label: 'Draw', icon: Zap },
    { id: 'basic', label: 'Basic', icon: Settings },
    { id: 'color', label: 'Color', icon: Palette },
    { id: 'animation', label: 'Animation', icon: Play },
    { id: 'data', label: 'Data', icon: Archive },
  ]

  const updateCurrentPath = (newPath: BezierPoint[]) => {
    const newShapes = [...shapes]
    const currentShape = newShapes[currentShapeIndex]
    
    if (currentShape.type === ShapeType.BEZIER) {
      newShapes[currentShapeIndex] = {
        ...currentShape,
        points: newPath,
      }
      onShapesChange(newShapes)
    }
  }

  const updateCurrentShape = (newShape: Shape) => {
    const newShapes = [...shapes]
    newShapes[currentShapeIndex] = newShape
    onShapesChange(newShapes)
  }

  const updatePathColor = (index: number, color: string) => {
    onShapeColorChange(index, color)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicSettingsTab
            symmetrySettings={symmetrySettings}
            colorSettings={colorSettings}
            onSymmetryChange={onSymmetryChange}
            onColorSettingsChange={onColorSettingsChange}
          />
        )

      case 'draw':
        return (
          <DrawingTab
            shapes={shapes}
            currentShapeIndex={currentShapeIndex}
            pupilSize={colorSettings.pupilSize}
            onPathChange={updateCurrentPath}
            onShapeChange={updateCurrentShape}
            onShapeIndexChange={onCurrentShapeIndexChange}
            onShapeColorChange={updatePathColor}
            onAddNewShape={onAddNewShape}
            onDeleteShape={onDeleteShape}
          />
        )

      case 'color':
        return (
          <ColorSettingsTab
            colorSettings={colorSettings}
            onColorSettingsChange={onColorSettingsChange}
          />
        )

      case 'animation':
        return (
          <AnimationTab
            animationSpeed={animationSpeed}
            onAnimationSpeedChange={onAnimationSpeedChange}
          />
        )

      case 'data':
        return (
          <DataTab
            designName={designName}
            isSaveDialogOpen={isSaveDialogOpen}
            savedDesigns={savedDesigns}
            isHistoryOpen={isHistoryOpen}
            onOpenSaveDialog={onOpenSaveDialog}
            onCloseSaveDialog={onCloseSaveDialog}
            onCloseHistoryDialog={onCloseHistoryDialog}
            onSaveDesign={onSaveDesign}
            onDesignNameChange={onDesignNameChange}
            onReset={onReset}
            onLoadDesign={onLoadDesign}
            onDeleteDesign={onDeleteDesign}
            onCopyConfig={onCopyConfig}
            onLoadSavedDesigns={onLoadSavedDesigns}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="flex bg-card border-l border-border">
      <div className="w-16 bg-muted/30 border-r border-border flex flex-col">
        <div className="p-2 border-b border-border">
          <h2 className="text-xs font-bold text-center text-primary">Settings</h2>
        </div>
        <div className="flex-1 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
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
  )
}
