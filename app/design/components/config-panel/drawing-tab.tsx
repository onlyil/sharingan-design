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
import { Plus } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { BezierEditor } from './editors/bezier-editor'
import { CircleShapeEditor } from './editors/circle-shape-editor'
import { LineShapeEditor } from './editors/line-shape-editor'
import { Shape, ShapeType, BezierPoint } from '@/models/types'
import { useState } from 'react'

interface DrawingTabProps {
  shapes: Shape[]
  currentShapeIndex: number
  pupilSize: number
  onPathChange: (newPath: BezierPoint[]) => void
  onShapeChange: (shape: Shape) => void
  onShapeIndexChange: (index: number) => void
  onShapeColorChange: (index: number, color: string) => void
  onAddNewShape: (shapeType: ShapeType) => void
  onDeleteShape: () => void
}

export function DrawingTab({
  shapes,
  currentShapeIndex,
  pupilSize,
  onPathChange,
  onShapeChange,
  onShapeIndexChange,
  onShapeColorChange,
  onAddNewShape,
  onDeleteShape,
}: DrawingTabProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [selectedShapeType, setSelectedShapeType] = useState<ShapeType>(
    ShapeType.BEZIER
  )
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const currentShape = shapes[currentShapeIndex]
  const currentPath =
    currentShape?.type === ShapeType.BEZIER ? currentShape.points : []

  const canAddPoint =
    currentShape?.type === ShapeType.BEZIER &&
    selectedPoint !== null &&
    (selectedPoint === 0 || selectedPoint === currentPath.length - 1)
  const canRemovePoint =
    currentShape?.type === ShapeType.BEZIER &&
    currentPath.length > 2 &&
    selectedPoint !== null &&
    (selectedPoint === 0 || selectedPoint === currentPath.length - 1)

  const handleAddShape = () => {
    onAddNewShape(selectedShapeType)
  }

  const handleAddPoint = () => {
    if (selectedPoint === null || currentShape?.type !== ShapeType.BEZIER)
      return

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
    if (
      currentPath.length <= 2 ||
      selectedPoint === null ||
      currentShape?.type !== ShapeType.BEZIER
    )
      return

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
        {/* Shape Editor based on current shape type */}
        {currentShape?.type === ShapeType.BEZIER && (
          <BezierEditor
            pupilSize={pupilSize}
            shapes={shapes}
            currentShapeIndex={currentShapeIndex}
            onChange={onPathChange}
            selectedPoint={selectedPoint}
            onSelectedPointChange={(point) => {
              setSelectedPoint(point)
              setSelectedElement(point?.toString() || null)
            }}
          />
        )}
        {currentShape?.type === ShapeType.CIRCLE && (
          <CircleShapeEditor
            pupilSize={pupilSize}
            shapes={shapes}
            currentShapeIndex={currentShapeIndex}
            onShapeChange={onShapeChange}
            selectedElement={selectedElement}
            onSelectedElementChange={setSelectedElement}
          />
        )}
        {currentShape?.type === ShapeType.LINE && (
          <LineShapeEditor
            pupilSize={pupilSize}
            shapes={shapes}
            currentShapeIndex={currentShapeIndex}
            onShapeChange={onShapeChange}
            selectedElement={selectedElement}
            onSelectedElementChange={setSelectedElement}
          />
        )}
      </Card>

      <Card className="p-4">
        <Label className="text-sm font-medium">Shape Setting</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Select
              value={currentShapeIndex.toString()}
              onValueChange={(value) =>
                onShapeIndexChange(Number.parseInt(value))
              }>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {shapes.map((shape, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}{' '}
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={onDeleteShape}
              disabled={shapes.length <= 1}
              className="text-destructive hover:text-destructive bg-transparent">
              Delete
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Shape Fill Color
            </Label>
            <RadioGroup
              value={shapes[currentShapeIndex]?.color || '#000000'}
              onValueChange={(value) =>
                onShapeColorChange(currentShapeIndex, value)
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

          {/* Point Operations - only show for bezier shapes */}
          {currentShape?.type === ShapeType.BEZIER && (
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
          )}
        </div>
      </Card>

      <Card className="p-4">
        <Label className="text-sm font-medium">Add New Shape</Label>
        <div className="space-y-2">
          <Select
            value={selectedShapeType}
            onValueChange={(value: ShapeType) => setSelectedShapeType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select shape type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ShapeType.BEZIER}>Bezier Curve</SelectItem>
              <SelectItem value={ShapeType.CIRCLE}>Circle</SelectItem>
              <SelectItem value={ShapeType.LINE}>Line</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddShape}
            className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Add Shape
          </Button>
        </div>
      </Card>
    </div>
  )
}
