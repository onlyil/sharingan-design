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
        重置为默认
      </Button>
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={onOpenSaveDialog}>
        保存当前设计
      </Button>

      <Dialog open={isSaveDialogOpen} onOpenChange={onCloseSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>保存设计</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="design-name" className="text-sm font-medium">
                设计名称
              </Label>
              <input
                id="design-name"
                type="text"
                value={designName}
                onChange={(e) => onDesignNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入设计名称"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCloseSaveDialog}>
                取消
              </Button>
              <Button onClick={onSaveDesign}>保存</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isHistoryOpen}
        onOpenChange={(open) => !open && onCloseSaveDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onLoadSavedDesigns}>
            历史记录
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>历史记录</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {savedDesigns.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暂无保存的设计
                </p>
              ) : (
                savedDesigns.map((design, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{design.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(design.timestamp).toLocaleString()}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-muted px-1 rounded">
                            旋转
                          </span>
                          <span className="text-xs bg-muted px-1 rounded">
                            {design.symmetrySettings.axes}轴
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onLoadDesign(design)}
                          className="text-xs h-6">
                          加载
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteDesign(index)}
                          className="text-xs h-6">
                          删除
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
        复制当前配置
      </Button>
    </div>
  )
}
