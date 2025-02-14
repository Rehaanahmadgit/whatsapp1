import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle login
  const handleLogin = () => {
    if (username.trim()) {
      socket.emit("login", username);
      setIsLoggedIn(true);
    }
  };

  // Handle joining a room
  const joinRoom = () => {
    if (room.trim()) {
      socket.emit("join_room", { room, username });
    }
  };

  // Handle sending a message
  const sendMessage = () => {
    if (message.trim() && room.trim()) {
      socket.emit("send_message", { room, username, message });
      setMessage("");
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("user_joined", (data) => {
      console.log("User joined:", data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: "System", message: data, timestamp: new Date().toLocaleTimeString() },
      ]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_joined");
    };
  }, []);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="login">
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="chat">
          <h1>Chat Room</h1>
          <div className="room-selection">
            <input
              type="text"
              placeholder="Enter room name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.username}: </strong>
                {msg.message} <em>({msg.timestamp})</em>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;