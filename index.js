const express=require("express")
const cors=require("cors")
const server=express()
const port=8000
const dotenv=require("dotenv")
const mongoose=require("mongoose")

const user=require("./Routers/userRouter")
const post=require("./Routers/postRouter")
const message=require("./Routers/messageRouter")

server.use(cors())
server.use(express.json())
dotenv.config()






mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("DB Connected")
}).catch(err=>{
    console.log(err)
})

server.use('/api',user)
server.use('/api',post)
server.use('/api',message)


server.listen(port,()=>{
    console.log("server connected")
})