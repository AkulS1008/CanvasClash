"use client";
import React, { Suspense } from "react";
import Mobilenet from "../mobilenet";
import { useSearchParams } from "next/navigation";

export default function CanvasPage() {
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName") || "";
  const roomCode = searchParams.get("roomCode") || "";
  const playerID = searchParams.get("playerId") || "";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <main className="container mx-auto px-4 py-8">

          <Mobilenet playerName={playerName as string} roomCode={roomCode as string} playerId={playerID as string} />
        </main>
      </div>
    </Suspense>
  );
}