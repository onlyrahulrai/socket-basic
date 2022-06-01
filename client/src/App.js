import React,{useState,useEffect} from "react";
import io from "socket.io-client"

const socket = io.connect("http://127.0.0.1:5000")

function App() {
  const [message,setMessage] = useState("")
  const [room,setRoom] = useState("")
  const [messageReceived, setMessageReceived] = useState("");


  const onJoinRoom = (e) => {
    e.preventDefault()
    if(!room) {
      return
    }
    socket.emit("join_room",room)
  }

  const onSendMessage = (e) => {
    e.preventDefault()

    socket.emit("send_message",{message,room})
  }


  console.log(" hello world ")

  useEffect(() => {
    socket.on("receive_message",(data) => {
      console.log(data)
      setMessageReceived(data.message)
    })
  },[])

  return (
    <div style={{textAlign:"center"}}>
      <p>Message: {messageReceived}</p>
      <form onSubmit={onJoinRoom}>
        <div style={{display:"flex",justifyContent:"center"}}>
          <input 
            type="text" 
            placeholder="your messages: " 
            value={room}
            onChange={(e) => setRoom(e.target.value)} 
            style={{padding:"8px"}}
          />
          <input 
            type="submit" 
            value="Join Room" 
            style={{cursor:"pointer"}}
          />
        </div>
      </form>
      <form onSubmit={onSendMessage}>
        <div style={{display:"flex",justifyContent:"center"}}>
          <input 
            type="text" 
            placeholder="your messages: " 
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
            style={{padding:"8px"}}
          />
          <input 
            type="submit" 
            value="Send Message" 
            style={{cursor:"pointer"}}
          />
        </div>
      </form>
    </div>
  );
}

export default App;
