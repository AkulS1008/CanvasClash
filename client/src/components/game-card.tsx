"use client"

import { Users } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Game {
  id: number
  name: string
  players: number
  maxPlayers: number
}

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const [joined, setJoined] = useState(false)

  const handleJoin = () => {
    setJoined(true)
    // Here you would typically make an API call to join the game
    console.log(`Joined game: ${game.name}`)
  }

  return (
    <Card className="bg-gray-700 text-white">
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>
            {game.players} / {game.maxPlayers} players
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleJoin} disabled={joined || game.players >= game.maxPlayers}>
          {joined ? "Joined" : game.players >= game.maxPlayers ? "Full" : "Join Game"}
        </Button>
      </CardFooter>
    </Card>
  )
}

