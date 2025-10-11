import { http, HttpResponse } from 'msw'

import { kanbanBoard } from './fakedata'

export const handlers = [
  // get boards
  http.get('http://localhost:4321/api/boards', () => {
    return HttpResponse.json({
      kanbanBoard,
    })
  })
]