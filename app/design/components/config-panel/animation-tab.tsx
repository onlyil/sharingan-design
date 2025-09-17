import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

interface AnimationTabProps {
  animationSpeed: number[]
  onAnimationSpeedChange: (speed: number[]) => void
}

export function AnimationTab({
  animationSpeed,
  onAnimationSpeedChange,
}: AnimationTabProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <Label className="text-sm font-medium">Animation Settings</Label>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Animation Speed: {animationSpeed[0].toFixed(1)}x
          </Label>
          <Slider
            value={animationSpeed}
            onValueChange={onAnimationSpeedChange}
            min={0}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>
      </Card>
    </div>
  )
}