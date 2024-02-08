import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import { redis } from "../../lib/redis"

export const getPoll = async (app: FastifyInstance) => {
  app.get("/polls/:pollId", async  (req, reply)=>{

  const getPollBody = z.object({
    pollId: z.string().cuid()
  })

  const { pollId } = getPollBody.parse(req.params)

  const poll = await prisma.poll.findUnique({
    where:{
      id: pollId,
    },
    include:{
      options:{
        select:{
          id: true,
          title: true
        }
      }
    }
  })

  if(!poll){
    return reply.status(400).send({message: 'pergunta nao encontrada'})
  }

  const results = await redis.zrange(pollId,0, -1,'WITHSCORES')

  const votes = results.reduce((obj, line, index)=>{

    if(index % 2 == 0 ){
      const score = results[index + 1]

      Object.assign(obj, {[line]: Number(score)})
    }

    return obj

  }, {} as Record<string, number>)
  
  return reply.send({ 
    poll:{
      id: poll.id,
      title: poll.title,
      options: poll.options.map(option =>{
        return {
          id: option.id,
          title: option.title,
          score: (option.id in votes) ? votes[option.id] : 0
        }
      })
    } 
  })
})}