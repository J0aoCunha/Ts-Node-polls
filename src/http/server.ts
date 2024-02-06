import fastify from "fastify"
import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll"
import { voteOnPoll } from "./routes/vote-on-poll"

const app = fastify()

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.listen({
  host: "0.0.0.0",
  port: 3333
}).then(()=>{
  console.log("💻 server is running")
})