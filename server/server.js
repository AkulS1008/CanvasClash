const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const PORT = 8080;

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log("Message received: ", data);
        io.emit("receive_message", data); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// app.get('/api/home', (req, res) => {
//     res.send({ message: 'Hello World!' });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });