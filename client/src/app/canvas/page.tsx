"use client";
import React from "react";
import Mobilenet from "../mobilenet";

export default function CanvasPage() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <main className="container mx-auto px-4 py-8">
          <Mobilenet />
        </main>
      </div>
    );
}