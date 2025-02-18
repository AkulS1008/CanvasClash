"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GameLobby() {
  const [roomCode, setRoomCode] = useState("")
  const [players, setPlayers] = useState<string[]>([])
  const [inRoom, setInRoom] = useState(false)

  const createRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(newRoomCode)
    setPlayers(["You (Host)"])
    setInRoom(true)
  }

  const joinRoom = () => {
    if (roomCode.length === 6) {
      setPlayers(["You", "Player 2", "Player 3"]) // Simulated players
      setInRoom(true)
    } else {
      alert("Please enter a valid 6-character room code")
    }
  }

  const leaveRoom = () => {
    setRoomCode("")
    setPlayers([])
    setInRoom(false)
  }

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
            <Button onClick={createRoom} className="w-full">
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
              <Button onClick={joinRoom}>Join Room</Button>
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
            <Button onClick={leaveRoom} variant="destructive" className="w-full">
              Leave Room
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

