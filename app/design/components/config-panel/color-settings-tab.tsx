import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ColorSettings } from './sharingan-designer/types'

interface ColorSettingsTabProps {
  colorSettings: ColorSettings
  onColorSettingsChange: (settings: ColorSettings) => void
}

export function ColorSettingsTab({
  colorSettings,
  onColorSettingsChange,
}: ColorSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <Label className="text-sm font-medium">颜色设置</Label>

        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">瞳孔颜色</Label>
          <RadioGroup
            value={colorSettings.pupilColor}
            onValueChange={(value) =>
              onColorSettingsChange({ ...colorSettings, pupilColor: value })
            }
            className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="#000000" id="pupil-black" />
              <label
                htmlFor="pupil-black"
                className="flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-black border border-border"></div>
                <span className="text-sm">黑色</span>
                <span className="text-xs text-muted-foreground font-mono">
                  #000000
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="#B20000" id="pupil-red" />
              <label
                htmlFor="pupil-red"
                className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: '#B20000' }}></div>
                <span className="text-sm">红色</span>
                <span className="text-xs text-muted-foreground font-mono">
                  #B20000
                </span>
              </label>
            </div>
          </RadioGroup>
        </div>
      </Card>
    </div>
  )
}
