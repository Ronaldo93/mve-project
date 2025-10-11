import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard } from '../components/storybook/kanbanboard'

export const Route = createFileRoute('/kanban')({
  component: RouteComponent,
})

function RouteComponent() {
  // fake data for testing
  const board = {
    id: '1',
    name: 'Board 1',
    tasks: [
      { id: '1', name: 'Task 1' },
      { id: '2', name: 'Task 2' },
    ]
  }
  
  return <div className='flex flex-row gap-4 max-w-2xl mx-auto'>
    {/* list of boards */}
    <KanbanBoard board={board} />
    {/* list of tasks */}
  </div>
}
