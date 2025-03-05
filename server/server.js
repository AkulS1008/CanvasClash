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
        rooms[roomCode] = {
            players: [{ id: socket.id, name: `${displayName} (Host)`, score: 0 }],
            hostId: socket.id
        };
        socket.emit("roomCreated", roomCode);
        socket.join(roomCode);
        io.to(roomCode).emit("roomUpdated", rooms[roomCode]);
        console.log(`Room created: ${roomCode}`);
    });

    socket.on("join-room", ({ roomCode, displayName }) => {
        if (rooms[roomCode]) {
            rooms[roomCode].players.push({ id: socket.id, name: displayName, score: 0 });
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

    socket.on("start-game", (roomCode) => {
        // Check if the current socket is the host (you may have saved this earlier when creating the room)
        const room = rooms[roomCode];
        if (room && room.hostId === socket.id) { // Assuming the first player is the host
            // Broadcast "gameStarted" to all players in the room
            io.to(roomCode).emit("gameStarted", roomCode);

            console.log(`Game started in room: ${roomCode}`);
        } else {
            socket.emit("error", "Only the host can start the game.");
        }
    });

    socket.on("update-score", ({ roomCode, playerId, score }) => {
        console.log("Received update-score event:", { roomCode, playerId, score });
        console.log("Checking room existence:", roomCode, rooms[roomCode]);

        if (rooms[roomCode]) {
            const player = rooms[roomCode].players.find(p => p.id === playerId);
            if (player) {
                player.score = (player.score || 0) + score; // Accumulate score instead of overwriting
                io.to(roomCode).emit("scoreUpdated", rooms[roomCode].players);
                console.log(`Updated score for ${player.name}: ${player.score}`);
            }
        }
    });

    socket.on("get-leaderboard", (roomCode) => {
        const room = rooms[roomCode];
        if (room && room.players) {
            const leaderboard = room.players
                .sort((a, b) => b.score - a.score)  // Sort players by score in descending order
                .map(player => ({ name: player.name, score: player.score }));

            socket.emit("leaderboard", leaderboard);  // Emit leaderboard to the requesting client
        }
    });


});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});