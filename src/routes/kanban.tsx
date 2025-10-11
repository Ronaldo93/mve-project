import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard, KanbanBoardType } from '../components/storybook/kanbanboard'
import { useQuery } from '@tanstack/react-query'
// import { worker } from '../mocks/browser'

export const Route = createFileRoute('/kanban')({
  component: RouteComponent,
})


function RouteComponent() {
  const { data, isLoading, error } = useQuery<KanbanBoardType[]>({
    queryKey: ['kanbanBoard'],
    queryFn: () => fetch('/api/boards').then((res) => res.json()),
  })
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div className='flex flex-col max-w-2xl mx-auto font-bricolage'>
    {/* list of boards */}
    <div className='mb-4 text-2xl font-bold'>
      <h1>Kanban</h1>
    </div>
    {data?.map((board) => <KanbanBoard key={board.id} board={board} />)}
    {/* list of tasks */}
  </div>
}
