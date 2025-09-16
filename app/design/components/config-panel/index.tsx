import { useState } from 'react'
import { Settings, Palette, Zap, Play, Archive } from 'lucide-react'
import { BasicSettingsTab } from './basic-settings-tab'
import { DrawingTab } from './drawing-tab'
import { ColorSettingsTab } from './color-settings-tab'
import { AnimationTab } from './animation-tab'
import { DataTab } from './data-tab'
import {
  BezierPoint,
  BezierPath,
  SymmetrySettings,
  ColorSettings,
  SavedDesign,
} from '@/models/types'

interface ConfigPanelProps {
  // 核心状态
  activeTab: string
  bezierPaths: BezierPath[]
  currentPathIndex: number
  symmetrySettings: SymmetrySettings
  animationSpeed: number[]
  colorSettings: ColorSettings
  currentPreset: string
  savedDesigns: SavedDesign[]
  isSaveDialogOpen: boolean
  designName: string
  isHistoryOpen: boolean

  // 回调函数
  onTabChange: (tabId: string) => void
  onBezierPathsChange: (paths: BezierPath[]) => void
  onCurrentPathIndexChange: (index: number) => void
  onSymmetryChange: (settings: SymmetrySettings) => void
  onAnimationSpeedChange: (speed: number[]) => void
  onColorSettingsChange: (settings: ColorSettings) => void
  onAddNewPath: () => void
  onDeletePath: () => void
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
  bezierPaths,
  currentPathIndex,
  symmetrySettings,
  animationSpeed,
  colorSettings,
  currentPreset,
  savedDesigns,
  isSaveDialogOpen,
  designName,
  isHistoryOpen,
  onTabChange,
  onBezierPathsChange,
  onCurrentPathIndexChange,
  onSymmetryChange,
  onAnimationSpeedChange,
  onColorSettingsChange,
  onAddNewPath,
  onDeletePath,
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
    { id: 'draw', label: '绘制', icon: Zap },
    { id: 'basic', label: '基础', icon: Settings },
    { id: 'color', label: '颜色', icon: Palette },
    { id: 'animation', label: '动画', icon: Play },
    { id: 'data', label: '数据', icon: Archive },
  ]

  const updateCurrentPath = (newPath: BezierPoint[]) => {
    const newPaths = [...bezierPaths]
    newPaths[currentPathIndex] = {
      ...newPaths[currentPathIndex],
      points: newPath,
    }
    onBezierPathsChange(newPaths)
  }

  const updatePathColor = (index: number, color: string) => {
    const newPaths = [...bezierPaths]
    newPaths[index] = { ...newPaths[index], color }
    onBezierPathsChange(newPaths)
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
            bezierPaths={bezierPaths}
            currentPathIndex={currentPathIndex}
            pupilSize={colorSettings.pupilSize}
            onPathChange={updateCurrentPath}
            onPathIndexChange={onCurrentPathIndexChange}
            onPathColorChange={updatePathColor}
            onAddNewPath={onAddNewPath}
            onDeletePath={onDeletePath}
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
          <h2 className="text-xs font-bold text-center text-primary">设置</h2>
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
