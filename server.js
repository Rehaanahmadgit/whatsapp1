const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow multiple origins
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle joining a room
  socket.on("join_room", (data) => {
    const { room, username } = data;
    socket.join(room);
    console.log(`${username} joined room: ${room}`);

    // Notify all users in the room
    io.to(room).emit("user_joined", `${username} joined the room`);
  });

  // Handle sending a message
  socket.on("send_message", (data) => {
    const { room, username, message } = data;
    const timestamp = new Date().toLocaleTimeString();

    console.log(`${username} sent a message in room ${room}: ${message}`);

    // Broadcast the message to the room
    io.to(room).emit("receive_message", { username, message, timestamp });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});