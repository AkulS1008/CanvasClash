"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

const socket = io("http://localhost:8080");

export function GameLobby() {
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [inRoom, setInRoom] = useState(false);
  const router = useRouter(); // <-- for navigation

  useEffect(() => {
    socket.on("roomCreated", (newRoomCode) => {
      setRoomCode(newRoomCode);
      setInRoom(true);
    });

    socket.on("roomUpdated", (room) => {
      setPlayers(room.players.map((p: any) => p.name));
    });

    socket.on("error", (message) => alert(message));

    return () => {
      socket.off("roomCreated");
      socket.off("roomUpdated");
      socket.off("error");
    };
  }, []);

  const createRoom = () => {
    if (displayName) {
      socket.emit("create-room", displayName);
    }
  };

  const joinRoom = () => {
    if (displayName && roomCode.length === 6) {
      socket.emit("join-room", { roomCode, displayName });
      setInRoom(true);
    } else if (!displayName) {
      alert("Please enter your display name");
    } else {
      alert("Please enter a valid 6-character room code");
    }
  };

  const leaveRoom = () => {
    socket.emit("leave-room", roomCode);
    setRoomCode("");
    setPlayers([]);
    setInRoom(false);
  };

  // NEW: Start Game handler
  const startGame = () => {
    // You could also emit a "start-game" event if the server needs to know
    // socket.emit("start-game", { roomCode });

    // Then navigate to the canvas page
    router.push("/canvas");
  };

  return (
    <Card className="max-w-md mx-auto bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {inRoom ? `Room: ${roomCode}` : "Join or Create a Room"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!inRoom ? (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-700 text-white"
            />
            <Button onClick={createRoom} className="w-full" disabled={!displayName}>
              Create Room
            </Button>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="bg-gray-700 text-white"
              />
              <Button onClick={joinRoom} disabled={!displayName}>
                Join Room
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold">Players in Room:</h3>
            <ul className="list-disc list-inside">
              {players.map((player, index) => (
                <li key={index}>{player}</li>
              ))}
            </ul>

            <Button onClick={startGame} variant="default" className="w-full">
              Start Game
            </Button>

            <Button onClick={leaveRoom} variant="destructive" className="w-full">
              Leave Room
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
