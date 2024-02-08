import z, { number } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import { randomUUID } from "crypto"
import { redis } from "../../lib/redis"
import { voting } from "../../utils/voting-pub-sub"

export const voteOnPoll = async (app: FastifyInstance) => {
  app.post("/polls/:pollId/votes", async  (req, reply)=>{

  const voteOnPollBody = z.object({
    pollOptionId: z.string().cuid()
  })

  const voteOnPollParams = z.object({
    pollId: z.string().cuid()
  })

  const { pollOptionId } = voteOnPollBody.parse(req.body)
  const { pollId } = voteOnPollParams.parse(req.params)


  let { sessionId } = req.cookies

  if(sessionId){
    const userPreviousVoteOnPoll = await prisma.vote.findUnique({
      where:{
        sessionId_pollId:{
          sessionId,
          pollId
        }
      }
    })

    if(userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId ){
      
      await prisma.vote.delete({
        where: {
          id: userPreviousVoteOnPoll.id
        }
      })

     const vote =  await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)

      voting.publish(pollId, {
        pollOptionId: userPreviousVoteOnPoll.pollOptionId,
        votes: Number(vote)
       })

    } else if (userPreviousVoteOnPoll){
      return reply.status(400).send({message: "voce ja votou nessa enquete"})
    }
  }

  if(!sessionId){
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 dias,
        signed: true,
        httpOnly: true
      })
  }


   await prisma.vote.create({
      data:{
        sessionId, 
        pollId, 
        pollOptionId
      }
    })

  const vote = await redis.zincrby(pollId, 1, pollOptionId)
   
  voting.publish(pollId, {
    pollOptionId,
    votes: Number(vote)
   })

  return reply.status(201).send()
})}