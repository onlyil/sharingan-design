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
import { BezierEditor } from '@/components/bezier-editor'
import { BezierPoint } from './types'

interface DrawingTabProps {
  bezierPaths: BezierPoint[][]
  currentPathIndex: number
  pupilSize: number
  onPathChange: (newPath: BezierPoint[]) => void
  onPathIndexChange: (index: number) => void
  onAddNewPath: () => void
  onDeletePath: () => void
}

export function DrawingTab({
  bezierPaths,
  currentPathIndex,
  pupilSize,
  onPathChange,
  onPathIndexChange,
  onAddNewPath,
  onDeletePath,
}: DrawingTabProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">贝塞尔路径编辑器</Label>
          <div className="flex items-center gap-2">
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
                    路径 {index + 1}
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
              删除
            </Button>
          </div>
        </div>
        <BezierEditor
          pupilSize={pupilSize}
          allPaths={bezierPaths}
          currentPathIndex={currentPathIndex}
          onChange={onPathChange}
        />
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onAddNewPath}
            className="w-full bg-transparent">
            添加路径
          </Button>
        </div>
      </Card>
    </div>
  )
}