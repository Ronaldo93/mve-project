// 1. KANBAN BOARD

import { KanbanBoardType } from "@/components/storybook/kanbanboard";

// ================================
export const kanbanBoard: KanbanBoardType[] = [{
  id: 'board-1',
  name: 'Board 1',
  tasks: [
    { id: 'task-1', name: 'Task 1' },
    { id: 'task-2', name: 'Task 2' },
  ]
},
{
  id: 'board-2',
  name: 'Board 2',
  tasks: [
    { id: 'task-3', name: 'Task 3' },
    { id: 'task-4', name: 'Task 4' },
  ]
}]
