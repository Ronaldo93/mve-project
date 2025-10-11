import { http, HttpResponse } from 'msw'

import { kanbanBoard } from './fakedata'

export const handlers = [
  // get boards
  http.get('/api/boards', () => {
    return HttpResponse.json({
      kanbanBoard,
    })
  })
]