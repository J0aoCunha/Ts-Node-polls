import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export const getPoll = async (app: FastifyInstance) => {
  app.get("/polls/:pollId", async  (req, reply)=>{

  const getPollBody = z.object({
    pollId: z.string().cuid()
  })

  const { pollId } = getPollBody.parse(req.params)

  const poll = await prisma.poll.findUniqueOrThrow({
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

  
  return reply.send({ poll })
})}