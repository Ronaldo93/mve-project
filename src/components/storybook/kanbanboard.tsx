import { KanbanTask, TaskType } from "./kanbantask"

// possible board types
interface BoardType {
  id: string
  name: string
  tasks: TaskType[]
}

export function KanbanBoard({ board }: { board: BoardType }) {
  return <div className='flex flex-col gap-4 h-full w-64 bg-slate-100 rounded-lg p-4 w-84 items-center'>
    {/* board header */}
    <Header board={board} />
    {/* list of tasks */}
    <ListOfTasks board={board} />
  </div>
}


// header
function Header({ board }: { board: BoardType }) {
  return <div className='flex flex-row gap-4'>
    <h1 className='text-2xl font-bold'>{board.name}</h1>
  </div>
}

// list of tasks - map through tasks and display each task
function ListOfTasks({ board }: { board: BoardType }) {
  return <div className='flex flex-col gap-4'>
    {board.tasks.map((task) => <KanbanTask key={task.id} task={task} />)}
  </div>
}