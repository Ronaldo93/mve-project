import { KanbanTask, TaskType } from "./kanbantask"

// possible board types
// qq refactor: rename to KanbanBoardType
export interface KanbanBoardType {
  id: string
  name: string
  tasks: TaskType[]
}

/**
 * KanbanBoard component
 * @param param0 { board: KanbanBoardType }
 * @returns 
 */
export function KanbanBoard({ board }: { board: KanbanBoardType }) {

  return <div className='flex flex-col gap-4 h-full w-64 bg-slate-100 rounded-lg p-4 w-84'>
    {/* board header */}
    <Header board={board} />
    {/* list of tasks */}
    <div className='self-center'>
    <ListOfTasks board={board} />
    </div>
  </div>
}


/**
 * Header component
 * @param param0 { board: KanbanBoardType }
 * @returns 
 */
function Header({ board }: { board: KanbanBoardType }) {
  return <div className='flex flex-row gap-4'>
    <h1 className='ml-2 text-xl font-bold'>{board.name}</h1>
  </div>
}

/**
 * List of tasks component
 * @param param0 { board: KanbanBoardType }
 * @returns 
 */
function ListOfTasks({ board }: { board: KanbanBoardType }) {
  return <div className='flex flex-col gap-4'>
    {board.tasks.map((task) => <KanbanTask key={task.id} task={task} />)}
  </div>
}