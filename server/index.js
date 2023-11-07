const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const messageRouter = require('./routes/messageRouter');
const app = express();
const socket = require("socket.io");
require ('dotenv').config();

mongoose.connect(process.env.MONGO_URL,{
    useUnifiedTopology: true,
    useNewUrlParser : true,
}).then(()=>{
    console.log("DB connected sucsessfully");
}).catch((err)=>{
    console.log(err.message);
});

app.use(cors());    
app.use(express.json());
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);
const port = process.env .PORT || 4000;
const server = app.listen(port, ()=>{
    console.log(`your server is running on port ${port}`);
});
  
const io = socket(server, {
    cors: {
      origin: 'http://127.0.0.1:5173', // Update this with your actual frontend URL
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      console.log(data);
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });

  });
