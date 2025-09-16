import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SymmetrySettings, ColorSettings } from './types'

interface BasicSettingsTabProps {
  currentPreset: string
  symmetrySettings: SymmetrySettings
  colorSettings: ColorSettings
  onLoadPreset: (presetName: string) => void
  onSymmetryChange: (settings: SymmetrySettings) => void
  onColorSettingsChange: (settings: ColorSettings) => void
  presets: Array<{ name: string }>
}

export function BasicSettingsTab({
  currentPreset,
  symmetrySettings,
  colorSettings,
  onLoadPreset,
  onSymmetryChange,
  onColorSettingsChange,
  presets,
}: BasicSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="text-sm font-medium">基础设置</Label>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            预设方案
          </Label>
          <Select onValueChange={onLoadPreset} value={currentPreset}>
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
          <Label className="text-xs text-muted-foreground">
            轴数: {symmetrySettings.axes}
          </Label>
          <Slider
            value={[symmetrySettings.axes]}
            onValueChange={([value]) =>
              onSymmetryChange({ ...symmetrySettings, axes: value })
            }
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
            onValueChange={([value]) =>
              onColorSettingsChange({ ...colorSettings, pupilSize: value })
            }
            min={0.05}
            max={0.3}
            step={0.01}
            className="w-full"
          />
        </div>
      </Card>
    </div>
  )
}