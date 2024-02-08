import fastify from "fastify"
import cookie from "@fastify/cookie"
import {fastifyWebsocket} from "@fastify/websocket"
import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll"
import { voteOnPoll } from "./routes/vote-on-poll"
import { pollResults } from "./ws/poll-results"

const app = fastify()

app.register(cookie,{
  secret: "my-secret",
  hook: "onRequest",
})

app.register(fastifyWebsocket)


app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(pollResults)

app.listen({
  host: "0.0.0.0",
  port: 3333
}).then(()=>{
  console.log("💻 server is running")
})