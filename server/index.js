import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import http from "http"
import {Server} from "socket.io"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json({
    limit:"30mb",
    extended:true
}))
app.use(bodyParser.urlencoded({
    limit:"30mb",
    extended:true
}))

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

io.on("connection",(socket) => {
    console.log(" User Connected ",socket.id)

    socket.on("join_room",(data) => {
        socket.join(data)
        console.log(` user connected by ${data} `)
    })

    socket.on("send_message",(data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message",data)
    })
})


server.listen(PORT,() => console.log(`Server is running on Port: ${PORT}`))
