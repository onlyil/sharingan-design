import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { SymmetrySettings, ColorSettings } from '@/models/types'

interface BasicSettingsTabProps {
  symmetrySettings: SymmetrySettings
  colorSettings: ColorSettings
  onSymmetryChange: (settings: SymmetrySettings) => void
  onColorSettingsChange: (settings: ColorSettings) => void
}

export function BasicSettingsTab({
  symmetrySettings,
  colorSettings,
  onSymmetryChange,
  onColorSettingsChange,
}: BasicSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="text-sm font-medium">Basic Settings</Label>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Rotational Symmetry Axes: {symmetrySettings.axes}
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
            Pupil Size: {(colorSettings.pupilSize * 100).toFixed(0)}%
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
