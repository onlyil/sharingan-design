import { SharinganPreview } from '@/app/design/components/sharingan-preview'
import { PresetSelector } from './preset-selector'
import {
  BezierPoint,
  SymmetrySettings,
  ColorSettings,
  BezierPath,
} from '@/models/types'

interface PreviewPanelProps {
  bezierPaths: BezierPath[]
  symmetrySettings: SymmetrySettings
  animationSpeed: number
  colorSettings: ColorSettings
  currentPreset: string
  presets: Array<{ name: string; image: string }>
  onLoadPreset: (presetName: string) => void
}

export function PreviewPanel({
  bezierPaths,
  symmetrySettings,
  animationSpeed,
  colorSettings,
  currentPreset,
  presets,
  onLoadPreset,
}: PreviewPanelProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-muted">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <SharinganPreview
            bezierPaths={bezierPaths}
            symmetrySettings={symmetrySettings}
            animationSpeed={animationSpeed}
            colorSettings={colorSettings}
          />
        </div>

        <PresetSelector
          currentPreset={currentPreset}
          presets={presets}
          onLoadPreset={onLoadPreset}
        />
      </div>
    </div>
  )
}
