// import { Draggable } from "@dnd-kit/core"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function KanbanTask({ task }: { task: TaskType }) {
  const hover = "hover:cursor-pointer hover:bg-slate-200 transition-all duration-200"

  return (
    <Card className={`w-72 rounded-md border-0 shadow-none ${hover}`}>
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