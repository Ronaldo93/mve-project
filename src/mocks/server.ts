import { setupServer } from 'msw/node'
import { handlers } from './main'

export const server = setupServer(...handlers)