import type { Meta, StoryObj } from '@storybook/react-vite'

import { KanbanTask } from './kanbantask'

const meta = {
  title: 'Kanban/task',
  component: KanbanTask,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KanbanTask>

// export default meta
export default meta

// create a story type
type Story = StoryObj<typeof meta>

// Below are list of stories that will be used to test the KanbanTask component
export const Default: Story = {
  args: {
    task: {
      id: '1',
      name: 'Task 1',
    },
  },
}

// export const WithFooter: Story = {
//   args: {
//     title: 'Confirm Action',
//     children: (
//       <div className="space-y-4">
//         <p className="text-gray-700 dark:text-gray-300">
//           Are you sure you want to proceed with this action?
//         </p>
//       </div>
//     ),
//     footer: (
//       <div className="flex gap-3 justify-end">
//         <Button variant="secondary" size="medium">
//           Cancel
//         </Button>
//         <Button variant="primary" size="medium">
//           Confirm
//         </Button>
//       </div>
//     ),
//   },
// }

// export const Form: Story = {
//   args: {
//     title: 'Create Account',
//     children: (
//       <div className="space-y-4 min-w-80">
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//             Email
//           </label>
//           <input
//             type="email"
//             placeholder="you@example.com"
//             className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
//             Password
//           </label>
//           <input
//             type="password"
//             placeholder="••••••••"
//             className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//           />
//         </div>
//       </div>
//     ),
//     footer: (
//       <div className="flex gap-3 justify-end">
//         <Button variant="secondary" size="medium">
//           Cancel
//         </Button>
//         <Button variant="primary" size="medium">
//           Create Account
//         </Button>
//       </div>
//     ),
//   },
// }
