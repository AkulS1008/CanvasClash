"use client"
import { GameLobby } from '@/components/game-lobby';
import React from 'react';
import MobileNet from './mobilenet';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Game Lobby</h1>
        <GameLobby />
        <MobileNet />
      </main>
    </div>
  );
}