const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const messageRouter = require('./routes/messageRouter');
const app = express();
const socket = require("socket.io");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log("DB connected successfully");
}).catch((err) => {
    console.log(err.message);
});

// CORS configuration
const corsOptions = {
    origin: 'https://mern-chat-app-front-end.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));    
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Your server is running on port ${port}`);
});

// Socket.io configuration
const io = socket(server, {
    cors: {
        origin: 'https://mern-chat-app-front-end.vercel.app',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log('New socket connection:', socket.id);
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log('User added:', userId);
    });

    socket.on("send-msg", (data) => {
        console.log('Message received:', data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
            console.log('Message sent to:', data.to);
        } else {
            console.log('User not found:', data.to);
        }
    });
});
