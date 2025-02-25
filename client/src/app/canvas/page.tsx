"use client";
import React from "react";
import Mobilenet from "../mobilenet";
import CanvasDraw from "@/components/canvas.js";

export default function CanvasPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Canvas Page</h1>
      <Mobilenet />
    </div>
  );
}
