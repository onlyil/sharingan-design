import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface PresetSelectorProps {
  currentPreset: string
  presets: Array<{ name: string; image: string }>
  onLoadPreset: (presetName: string) => void
}

export function PresetSelector({
  currentPreset,
  presets,
  onLoadPreset,
}: PresetSelectorProps) {
  return (
    <Card className="p-3 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex justify-center gap-4">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onLoadPreset(preset.name)}
            className={`p-2 rounded-full transition-all hover:scale-110 group ${
              currentPreset === preset.name 
                ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' 
                : 'hover:ring-2 hover:ring-muted-foreground hover:ring-offset-1 hover:bg-muted/50'
            }`}
            title={preset.name}
          >
            <Avatar className="h-16 w-16 shadow-lg">
              <AvatarImage src={preset.image} alt={preset.name} className="object-cover" />
              <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary/20 to-primary/10">
                {preset.name}
              </AvatarFallback>
            </Avatar>
            <div className={`text-xs mt-1 transition-colors ${
              currentPreset === preset.name ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'
            }`}>
              {preset.name}
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}