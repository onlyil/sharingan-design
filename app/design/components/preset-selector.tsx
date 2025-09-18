import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface PresetSelectorProps {
  currentPreset: string
  presets: Array<{ name: string; image: string }>
  onLoadPreset: (presetName: string) => void
  onNewCanvas: () => void
}

export function PresetSelector({
  currentPreset,
  presets,
  onLoadPreset,
  onNewCanvas,
}: PresetSelectorProps) {
  return (
    <Card className="p-2 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex justify-center gap-3">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onLoadPreset(preset.name)}
            className={`p-1 rounded-full transition-all hover:scale-110 group ${
              currentPreset === preset.name
                ? 'ring-2 ring-primary ring-offset-2 bg-primary/5'
                : 'hover:ring-2 hover:ring-muted-foreground hover:ring-offset-1 hover:bg-muted/50'
            }`}
            title={preset.name}>
            <Avatar className="h-12 w-12 shadow-md">
              <AvatarImage
                src={preset.image}
                alt={preset.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-primary/10">
                {preset.name}
              </AvatarFallback>
            </Avatar>
            <div
              className={`text-[10px] mt-1 transition-colors ${
                currentPreset === preset.name
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}>
              {preset.name}
            </div>
          </button>
        ))}

        {/* 新建按钮 */}
        <button
          onClick={onNewCanvas}
          className="p-1 rounded-full transition-all hover:scale-110 group hover:ring-2 hover:ring-muted-foreground hover:ring-offset-1 hover:bg-muted/50"
          title="New Canvas">
          <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center shadow-md">
            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
          </div>
          <div className="text-[10px] mt-1 text-muted-foreground group-hover:text-foreground">
            New
          </div>
        </button>
      </div>
    </Card>
  )
}
