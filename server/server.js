const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
//const { v4: uuidv4 } = require('uuid'); // Import uuid
const PORT = 8080;

const app = express();
const server = http.createServer(app);

const rooms = {};

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("create-room", (displayName) => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        rooms[roomCode] = { players: [{ id: socket.id, name: `${displayName} (Host)` }] };
        socket.emit("roomCreated", roomCode);
        socket.join(roomCode);
        io.to(roomCode).emit("roomUpdated", rooms[roomCode]);
        console.log(`Room created: ${roomCode}`);
    });

    socket.on("join-room", ({ roomCode, displayName }) => {
        if (rooms[roomCode]) {
            rooms[roomCode].players.push({ id: socket.id, name: displayName });
            socket.join(roomCode);
            io.to(roomCode).emit("roomUpdated", rooms[roomCode]);
            console.log(`User joined room: ${roomCode}`);
        } else {
            socket.emit("room-not-found");
        }
    });

    socket.on("leave-room", (roomCode) => {
        leaveRooms(socket, roomCode);
    });

    function leaveRooms(socket, roomCode = null) {
        for (const [code, room] of Object.entries(rooms)) {
            if (!roomCode || code === roomCode) {
                const playerIndex = room.players.findIndex(player => player.id === socket.id);
                if (playerIndex !== -1) {
                    room.players.splice(playerIndex, 1);
                    console.log(`User left room: ${code}`);
                    if (room.players.length === 0) {
                        delete rooms[code]; // Delete empty room
                    } else {
                        io.to(code).emit("roomUpdated", room); // Notify remaining players
                    }
                }
            }
        }
    }

    socket.on("drawing-prediction", (data) => {
        console.log("Received prediction:", data);
        // Here you can broadcast to other clients or store the prediction in a DB
        // For example, broadcast to all clients:
        io.emit("new-prediction", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        leaveRooms(socket);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});