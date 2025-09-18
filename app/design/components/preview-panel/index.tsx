import { SharinganPreview } from './sharingan-preview'
import { PresetSelector } from '../preset-selector'
import {
  Shape,
  SymmetrySettings,
  ColorSettings,
} from '@/models/types'

interface PreviewPanelProps {
  shapes: Shape[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number
  colorSettings: ColorSettings
  currentPreset: string
  presets: Array<{ name: string; image: string }>
  onLoadPreset: (presetName: string) => void
  onNewCanvas: () => void
}

export function PreviewPanel({
  shapes,
  symmetrySettings,
  animationSpeed,
  colorSettings,
  currentPreset,
  presets,
  onLoadPreset,
  onNewCanvas,
}: PreviewPanelProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-muted">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <SharinganPreview
            shapes={shapes}
            symmetrySettings={symmetrySettings}
            animationSpeed={animationSpeed}
            colorSettings={colorSettings}
          />
        </div>

        <PresetSelector
          currentPreset={currentPreset}
          presets={presets}
          onLoadPreset={onLoadPreset}
          onNewCanvas={onNewCanvas}
        />
      </div>
    </div>
  )
}
