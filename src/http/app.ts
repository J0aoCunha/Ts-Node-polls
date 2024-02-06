import { PrismaClient } from "@prisma/client"
import fastify from "fastify"
import {z} from "zod"

export const app = fastify()
const prisma = new  PrismaClient()
app.post("/polls", async  (req, reply)=>{

  const createPollBody = z.object({
    title: z.string(),
  })

  const { title } = createPollBody.parse(req.body)

  const poll = await prisma.poll.create({
    data:{title}
  })
  
  return reply.status(201).send({ poll })
})
