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
import { useState } from 'react'

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
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)

  const currentPath = bezierPaths[currentPathIndex]?.points || []

  const canAddPoint =
    selectedPoint !== null &&
    (selectedPoint === 0 || selectedPoint === currentPath.length - 1)
  const canRemovePoint =
    currentPath.length > 2 &&
    selectedPoint !== null &&
    (selectedPoint === 0 || selectedPoint === currentPath.length - 1)

  const handleAddPoint = () => {
    if (selectedPoint === null) return

    const isStartPoint = selectedPoint === 0
    const isEndPoint = selectedPoint === currentPath.length - 1

    if (!isStartPoint && !isEndPoint) return

    const newPoint: BezierPoint = {
      x: 180 + Math.random() * 40 - 20,
      y: 140 + Math.random() * 40 - 20,
      cp1x: 160 + Math.random() * 40 - 20,
      cp1y: 120 + Math.random() * 40 - 20,
      cp2x: 200 + Math.random() * 40 - 20,
      cp2y: 160 + Math.random() * 40 - 20,
    }

    if (isStartPoint) {
      // Add point at start position
      onPathChange([newPoint, ...currentPath])
      setSelectedPoint(0) // Keep the newly added start point selected
    } else {
      // Add point at end
      onPathChange([...currentPath, newPoint])
      setSelectedPoint(currentPath.length) // Select the newly added end point
    }
  }

  const handleRemovePoint = () => {
    if (currentPath.length <= 2 || selectedPoint === null) return

    const isStartPoint = selectedPoint === 0
    const isEndPoint = selectedPoint === currentPath.length - 1

    if (!isStartPoint && !isEndPoint) return

    const newPath = currentPath.filter((_, index) => index !== selectedPoint)
    onPathChange(newPath)
    setSelectedPoint(null)
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="text-sm font-medium">Shape Editor</Label>
        <BezierEditor
          pupilSize={pupilSize}
          allPaths={bezierPaths}
          currentPathIndex={currentPathIndex}
          onChange={onPathChange}
          selectedPoint={selectedPoint}
          onSelectedPointChange={setSelectedPoint}
        />
      </Card>

      <Card className="p-4">
        <Label className="text-sm font-medium">Shape Setting</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Select
              value={currentPathIndex.toString()}
              onValueChange={(value) =>
                onPathIndexChange(Number.parseInt(value))
              }>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bezierPaths.map((_, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Shape {index + 1}
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
              Shape Fill Color
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
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Point Operations
            </Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddPoint}
                disabled={!canAddPoint}
                className="flex-1 bg-transparent">
                Add Point
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemovePoint}
                disabled={!canRemovePoint}
                className="flex-1 bg-transparent">
                Remove Point
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Select start or end points to add/remove points
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <Label className="text-sm font-medium">Add New Shape</Label>
        <div>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddNewPath}
            className="w-full bg-transparent">
            Add Shape
          </Button>
        </div>
      </Card>
    </div>
  )
}
