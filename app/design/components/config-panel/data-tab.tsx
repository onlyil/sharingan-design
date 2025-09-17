import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'

interface DataTabProps {
  designName: string
  isSaveDialogOpen: boolean
  savedDesigns: any[]
  isHistoryOpen: boolean
  onOpenSaveDialog: () => void
  onCloseSaveDialog: () => void
  onCloseHistoryDialog: () => void
  onSaveDesign: () => void
  onDesignNameChange: (name: string) => void
  onReset: () => void
  onLoadDesign: (design: any) => void
  onDeleteDesign: (index: number) => void
  onCopyConfig: () => void
  onLoadSavedDesigns: () => void
}

export function DataTab({
  designName,
  isSaveDialogOpen,
  savedDesigns,
  isHistoryOpen,
  onOpenSaveDialog,
  onCloseSaveDialog,
  onCloseHistoryDialog,
  onSaveDesign,
  onDesignNameChange,
  onReset,
  onLoadDesign,
  onDeleteDesign,
  onCopyConfig,
  onLoadSavedDesigns,
}: DataTabProps) {
  return (
    <div className="space-y-2">
      <Button className="w-full" onClick={onReset}>
        Reset to Default
      </Button>
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={onOpenSaveDialog}>
        Save Current Design
      </Button>

      <Dialog open={isSaveDialogOpen} onOpenChange={onCloseSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="design-name" className="text-sm font-medium">
                Design Name
              </Label>
              <input
                id="design-name"
                type="text"
                value={designName}
                onChange={(e) => onDesignNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter design name"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCloseSaveDialog}>
                Cancel
              </Button>
              <Button onClick={onSaveDesign}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isHistoryOpen}
        onOpenChange={(open) => !open && onCloseHistoryDialog()}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onLoadSavedDesigns}>
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Design History</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {savedDesigns.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No saved designs</p>
              ) : (
                savedDesigns.map((design, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{design.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(design.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Rotation: {design.rotation}°</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onLoadDesign(design)}
                          className="text-xs h-6">
                           Load
                         </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteDesign(index)}
                          className="text-xs h-6">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={onCopyConfig}>
        Copy Current Config
      </Button>
    </div>
  )
}
