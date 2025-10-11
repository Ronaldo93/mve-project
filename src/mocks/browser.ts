import { setupWorker } from 'msw/browser'
import { handlers } from './main'

// qq initiate the mock worker
export const worker = setupWorker(...handlers)