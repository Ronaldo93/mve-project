import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard, KanbanBoardType } from '../components/storybook/kanbanboard'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { 
  DndContext, 
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { KanbanTask, TaskType } from '../components/storybook/kanbantask'
// import { worker } from '../mocks/browser'

export const Route = createFileRoute('/kanban')({
  component: RouteComponent,
})


function RouteComponent() {
  let { data, isLoading, error } = useQuery<
    | KanbanBoardType[]
    | { kanbanBoard: KanbanBoardType[] }
  >({
    queryKey: ['kanbanBoard'],
    // the mock returns an object shaped like { kanbanBoard: [...] }
    queryFn: () => fetch('/api/boards').then((res) => res.json()),
  })
  
  // normalize to an array whether the API returned
  // KanbanBoardType[] or { kanbanBoard: KanbanBoardType[] }
  const initialBoards: KanbanBoardType[] | undefined = Array.isArray(data)
    ? data
    : (data as { kanbanBoard: KanbanBoardType[] } | undefined)?.kanbanBoard
  
  // state for the boards
  const [boards, setBoards] = useState<KanbanBoardType[] | undefined>(initialBoards)
  // state for the active task (being hovered over)
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)
  
  // Update boards when data changes
  if (initialBoards && boards !== initialBoards && !activeTask) {
    setBoards(initialBoards)
  }
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = boards?.flatMap(b => b.tasks).find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id  
    
    if (activeId === overId) return
    
    setBoards((boards) => {
      if (!boards) return boards
      
      // find the board that the active task is in
      const activeBoard = boards.find(b => b.tasks.some(t => t.id === activeId))
      // find the board that the over task is in
      const overBoard = boards.find(b => b.id === overId || b.tasks.some(t => t.id === overId))
      
      // if the active task is not in a board or the over task is not in a board, return the boards
      if (!activeBoard || !overBoard) return boards
      
      // find the task that is being dragged
      const activeTask = activeBoard.tasks.find(t => t.id === activeId)
      if (!activeTask) return boards
      
      // remove the active task from the active board
      return boards.map(board => {
        if (board.id === activeBoard.id) {
          return {
            ...board,
            tasks: board.tasks.filter(t => t.id !== activeId)
          }
        }
        // add the active task to the over board
        if (board.id === overBoard.id) {
          const overTaskIndex = board.tasks.findIndex(t => t.id === overId)
          const newTasks = [...board.tasks]
          if (overTaskIndex >= 0) {
            newTasks.splice(overTaskIndex, 0, activeTask)
          } else {
            newTasks.push(activeTask)
          }
          return {
            ...board,
            tasks: newTasks
          }
        }
        return board
      })
    })
  }
  
  // when drag ends, set active task to null
  const handleDragEnd = () => {
    setActiveTask(null)

    // TODO: maybe add the card to the board?
    // setBoards((boards) => {V
    //   if (!boards) return boards
    //   return boards.map(board => {
    //     if (board.id === activeTask?.id) {
    //       return { ...board, tasks: [...board.tasks, activeTask] }
    //     }
    //     return board
    //   })
    // })
  }
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='flex flex-col max-w-2xl mx-auto font-bricolage'>
        {/* list of boards */}
        <div className='mb-4 text-2xl font-bold'>
          <h1>Kanban</h1>
        </div>
        <div className='flex flex-row gap-16'>
          {boards?.map((board) => (
            <KanbanBoard key={board.id} board={board} />
          ))}
        </div>

        {/* list of tasks */}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanTask task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
