import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { BezierEditor } from './bezier-editor'
import { BezierPoint, BezierPath } from '@/models/types'

interface DrawingTabProps {
  bezierPaths: BezierPath[]
  currentPathIndex: number
  pupilSize: number
  onPathChange: (newPath: BezierPoint[]) => void
  onPathIndexChange: (index: number) => void
  onPathColorChange: (index: number, color: string) => void
  onAddNewPath: () => void
  onDeletePath: () => void
}

export function DrawingTab({
  bezierPaths,
  currentPathIndex,
  pupilSize,
  onPathChange,
  onPathIndexChange,
  onPathColorChange,
  onAddNewPath,
  onDeletePath,
}: DrawingTabProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-3">
          <Label className="text-sm font-medium">Bezier Path Editor</Label>
        </div>
        <BezierEditor
          pupilSize={pupilSize}
          allPaths={bezierPaths}
          currentPathIndex={currentPathIndex}
          onChange={onPathChange}
        />
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Select
              value={currentPathIndex.toString()}
              onValueChange={(value) =>
                onPathIndexChange(Number.parseInt(value))
              }>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bezierPaths.map((_, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Path {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={onDeletePath}
              disabled={bezierPaths.length <= 1}
              className="text-destructive hover:text-destructive bg-transparent">
              Delete
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Path Fill Color
            </Label>
            <RadioGroup
              value={bezierPaths[currentPathIndex]?.color || '#000000'}
              onValueChange={(value) =>
                onPathColorChange(currentPathIndex, value)
              }
              className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="#000000" id="path-black" />
                <label
                  htmlFor="path-black"
                  className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-black border border-border"></div>
                  <span className="text-sm">Black</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    #000000
                  </span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="#B20000" id="path-red" />
                <label
                  htmlFor="path-red"
                  className="flex items-center gap-2 cursor-pointer">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: '#B20000' }}></div>
                  <span className="text-sm">Red</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    #B20000
                  </span>
                </label>
              </div>
            </RadioGroup>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onAddNewPath}
            className="mt-3 w-full bg-transparent">
            Add Path
          </Button>
        </div>
      </Card>
    </div>
  )
}
