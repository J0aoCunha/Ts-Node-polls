import { FastifyInstance } from 'fastify'
import { voting } from '../../utils/voting-pub-sub'
import z from 'zod'

export const pollResults = async (app: FastifyInstance) => {
  app.get('/polls/:pollId/results', { websocket: true }, (connection, req) => {
      
    const getPollBody = z.object({
      pollId: z.string().cuid()
    })
  
    const { pollId } = getPollBody.parse(req.params)

    voting.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message))
    })
  })
}