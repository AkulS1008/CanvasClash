const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid
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

const joinRoom = (socket, room) => {
    room.sockets.push(socket);
    socket.join(room.id, () => {
        // store the room id in the socket for future use
        socket.roomId = room.id;
        console.log(socket.id, "Joined", room.id);
    });
};

const leaveRooms = (socket) => {
    const roomsToDelete = [];
    for (const id in rooms) {
        const room = rooms[id];
        // check to see if the socket is in the current room
        if (room.sockets.includes(socket)) {
            socket.leave(id);
            // remove the socket from the room object
            room.sockets = room.sockets.filter((item) => item !== socket);
        }
        // Prepare to delete any rooms that are now empty
        if (room.sockets.length == 0) {
            roomsToDelete.push(room);
        }
    }

    // Delete all the empty rooms that we found earlier
    for (const room of roomsToDelete) {
        delete rooms[room.id];
    }
};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("createRoom", (roomName, callback) => {
        const room = {
            id: uuidv4(), // generate a unique id for the new room
            name: roomName,
            sockets: []
        };

        rooms[room.id] = room;
        joinRoom(socket, room);
        callback({ message: `Room ${roomName} created` });
    });

    socket.on("joinRoom", (roomId, callback) => {
        const room = rooms[roomId];
        if (room) {
            joinRoom(socket, room);
            callback({ message: `Joined room ${room.name}`, roomId: room.id });
        } else {
            callback({ message: "Room not found" });
        }
    });

    socket.on('leaveRoom', () => {
        leaveRooms(socket);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        leaveRooms(socket);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});