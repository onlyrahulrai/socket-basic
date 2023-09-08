import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

function Chat() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [messages, setMessages] = useState([]);

  let socket = io.connect("http://127.0.0.1:5000");

  const onJoinRoom = (e) => {
    e.preventDefault();
    if (!room) {
      return;
    }
    socket.emit("join_room", { room, user });
  };

  const onSendMessage = (e) => {
    e.preventDefault();

    socket.emit("send_message", { message, room, user });
  };

  useEffect(() => {
    socket.on("user_connected", (data) => {
      console.log(" User Connected ")
      
      setMessages(data.messages);

      if (data.connection.user !== user) {
        toast.success(`${data.connection.user} is connected to the room`);
      }
    });

    socket.on("receive_message", (data) => {
      console.log(" Received Data ", data);
      setReceivedMessage(data[data.length - 1].message);
      setMessages(data);
    });
  }, [socket]);

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div>
        <form onSubmit={onJoinRoom}>
          <h3>Chat Room</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "18px",
            }}
          >
            <input
              type="text"
              placeholder="Username..."
              value={user}
              onChange={(e) => setUser(e.target.value)}
              style={{ padding: "8px" }}
            />
            <input
              type="text"
              placeholder="Room Name..."
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={{ padding: "8px" }}
            />
            <input
              type="submit"
              value="Join Room"
              style={{ cursor: "pointer" }}
            />
          </div>
        </form>
      </div>
      <div>
        <p>Message: {receivedMessage}</p>
        <form onSubmit={onSendMessage}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              type="text"
              placeholder="your messages: "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ padding: "8px" }}
            />
            <input
              type="submit"
              value="Send Message"
              style={{ cursor: "pointer" }}
            />
          </div>
        </form>
      </div>

      {messages.map((data, key) => (
        <div
          style={{
            width: "50%",
            backgroundColor: "rgb(226 232 240)",
            padding: "8px 12px",
            marginTop: "16px",
            borderRadius: "12px",
          }}
          key={key}
        >
          {console.log("Data", data, user)}
          <div
            style={{
              display: "flex",
              justifyContent: data.user === user ? "flex-end" : "flex-start",
            }}
          >
            <div style={{display:"flex",alignItems: "center",flexDirection:data.user === user ? "row-reverse" : "row"}}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "rgb(209 250 229)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                }}
              >
                {data.user.charAt(0)}
              </div>{" "}
              &nbsp;
              <span>{data.message}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chat;
