import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function KanbanTask({ task, isDragging = false }: { task: TaskType; isDragging?: boolean }) {

  // display state of the task (for ui dragging)
  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingState } = useDraggable({
    id: task.id,
  })
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDraggingState ? 0.5 : 1,
  }
  
  const hover = "hover:cursor-grab active:cursor-grabbing hover:bg-slate-200 transition-all duration-200"

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col gap-2 w-72 h-24 rounded-md border-0 shadow-none ${hover} ${
        isDragging ? 'cursor-grabbing shadow-lg rotate-3' : ''
      }`}
    >
      <CardHeader>
        <CardTitle className={`pointer-events-auto`}>{task.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 pointer-events-auto">Test</p>
      </CardContent>
    </Card>
  )
}


// task type
export interface TaskType {
  id: string
  name: string
}