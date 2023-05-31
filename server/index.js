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

let messages = []

io.on("connection",(socket) => {
    socket.on("join_room",(connection) => {
        socket.join(connection.room)
        io.to(connection.room).emit("user_connected",{connection,messages})
    })

    socket.on("send_message",(data) => {
        messages.push(data)
        socket.to(data.room).emit("receive_message",messages)
    })
})

app.get("/",(req,res) => res.send(" Hello World "))

server.listen(PORT,() => console.log(`Server is running on Port: ${PORT}`))
