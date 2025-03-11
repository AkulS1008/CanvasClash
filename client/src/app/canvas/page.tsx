"use client";
import React, { Suspense, useEffect, useState } from "react";
import Mobilenet from "../mobilenet";
import { useSearchParams } from "next/navigation";

// Create a separate component for the main content
function CanvasContent() {
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName") || "";
  const roomCode = searchParams.get("roomCode") || "";
  const playerID = searchParams.get("playerId") || "";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client side
  }, []);

  if (!isClient) {
    return <div>Loading...</div>; // Render loading state until the component mounts on the client
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-8">
        <Mobilenet
          playerName={playerName as string}
          roomCode={roomCode as string}
          playerId={playerID as string}
        />
      </main>
    </div>
  );
}

// Main page component
export default function CanvasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CanvasContent />
    </Suspense>
  );
}