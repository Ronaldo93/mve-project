import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard, KanbanBoardType } from '../components/storybook/kanbanboard'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { KanbanTask, TaskType } from '../components/storybook/kanbantask'
// import { worker } from '../mocks/browser'

export const Route = createFileRoute('/kanban')({
  component: RouteComponent,
})

/**
 * Create a deep-enough copy so we can safely mutate the arrays during drag operations.
 * We avoid JSON cloning so references and types stay intact.
 */
function cloneBoards(boards: KanbanBoardType[]): KanbanBoardType[] {
  return boards.map((board) => ({
    ...board,
    tasks: [...board.tasks],
  }))
}

/**
 * Locate the board that owns a task and return both the board and task index.
 * Returns null when the task is not present in the supplied boards.
 */
function locateTask(boards: KanbanBoardType[], taskId: string) {
  for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
    const taskIndex = boards[boardIndex].tasks.findIndex(
      (task) => task.id === taskId
    )
    if (taskIndex >= 0) {
      return { boardIndex, taskIndex }
    }
  }
  return null
}

function RouteComponent() {
  let { data, isLoading, error } = useQuery<
    | KanbanBoardType[]
    | { kanbanBoard: KanbanBoardType[] }
  >({
    queryKey: ['kanbanBoard'],
    // the mock returns an object shaped like { kanbanBoard: [...] }
    queryFn: () => fetch('/api/boards').then((res) => res.json()),
  })

  // Normalize to an array whether the API returned KanbanBoardType[] or { kanbanBoard: KanbanBoardType[] }.
  const initialBoards: KanbanBoardType[] | undefined = Array.isArray(data)
    ? data
    : (data as { kanbanBoard: KanbanBoardType[] } | undefined)?.kanbanBoard

  // Local copy of the boards we can freely mutate during drag and drop.
  const [boards, setBoards] = useState<KanbanBoardType[] | undefined>(undefined)
  // The task currently being dragged so the overlay can mirror it.
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)
  // Snapshot of the boards taken when a drag starts; we restore it if the drop is cancelled.
  const dragSnapshot = useRef<KanbanBoardType[] | null>(null)

  /**
   * Sync server data into local state while preserving optimistic drag updates.
   * We only overwrite local state when the board identities change (fresh query).
   */
  useEffect(() => {
    if (!initialBoards) return
    setBoards((current) => {
      if (!current) return initialBoards
      const currentIds = current.map((board) => board.id).join('|')
      const initialIds = initialBoards.map((board) => board.id).join('|')
      return currentIds !== initialIds ? initialBoards : current
    })
  }, [initialBoards])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  /**
   * Prepare drag state: remember the active task for the overlay and capture a snapshot.
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = boards?.flatMap((board) => board.tasks).find((t) => t.id === active.id)
    if (task) {
      setActiveTask(task)
      dragSnapshot.current = boards ? cloneBoards(boards) : null
    }
  }

  /**
   * Give instant feedback while the task hovers another board.
   * This performs an optimistic move so the UI feels responsive.
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    setBoards((prevBoards) => {
      if (!prevBoards) return prevBoards

      const activeBoard = prevBoards.find((board) =>
        board.tasks.some((task) => task.id === activeId)
      )
      const overBoard = prevBoards.find(
        (board) => board.id === overId || board.tasks.some((task) => task.id === overId)
      )

      // No matches means we do nothing and keep the optimistic state untouched.
      if (!activeBoard || !overBoard) return prevBoards
      // When hovering the original board there is nothing to preview.
      if (activeBoard.id === overBoard.id) {
        return prevBoards
      }

      const activeTask = activeBoard.tasks.find((task) => task.id === activeId)
      if (!activeTask) return prevBoards

      // Build a new array structure so React sees the change.
      const updatedBoards = cloneBoards(prevBoards)

      const source = updatedBoards.find((board) => board.id === activeBoard.id)
      const target = updatedBoards.find((board) => board.id === overBoard.id)
      if (!source || !target) return prevBoards

      source.tasks = source.tasks.filter((task) => task.id !== activeId)

      const overTaskIndex = target.tasks.findIndex((task) => task.id === overId)
      if (overTaskIndex >= 0) {
        target.tasks.splice(overTaskIndex, 0, activeTask)
      } else {
        target.tasks.push(activeTask)
      }

      return updatedBoards
    })
  }

  /**
   * Finalize the drag. We either commit the optimistic move or roll back to the snapshot.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event

    if (!over) {
      if (dragSnapshot.current) {
        setBoards(dragSnapshot.current)
      }
      dragSnapshot.current = null
      return
    }

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) {
      dragSnapshot.current = null
      return
    }

    setBoards((prevBoards) => {
      if (!prevBoards) return prevBoards

      const location = locateTask(prevBoards, activeId)
      const overBoardIndex = prevBoards.findIndex((board) => board.id === overId)

      if (!location || overBoardIndex === -1) {
        return dragSnapshot.current ?? prevBoards
      }

      const { boardIndex: activeBoardIndex, taskIndex: activeTaskIndex } = location

      if (activeBoardIndex === overBoardIndex) {
        return prevBoards
      }

      const updatedBoards = cloneBoards(prevBoards)

      const [movedTask] = updatedBoards[activeBoardIndex].tasks.splice(activeTaskIndex, 1)
      updatedBoards[overBoardIndex].tasks.push(movedTask)

      return updatedBoards
    })

    dragSnapshot.current = null
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
        <div className='mb-4 text-2xl font-bold'>
          <h1>Kanban</h1>
        </div>
        <div className='flex flex-row gap-16'>
          {boards?.map((board) => (
            <KanbanBoard key={board.id} board={board} />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <KanbanTask task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
