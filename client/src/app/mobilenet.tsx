"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const CanvasDraw = dynamic(() => import("../components/canvas.js"), {
  ssr: false,
});

interface MobilenetProps {
  playerName: string;
  roomCode: string;
}

interface MobileNetPrediction {
  className: string;
  probability: number;
}

export default function MobileNet({ playerName, roomCode }: MobilenetProps) {
  const [predictions, setPredictions] = useState<MobileNetPrediction[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const modelRef = useRef<mobilenet.MobileNet | null>(null);
  const router = useRouter();

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");

    const loadModel = async () => {
      const model = await mobilenet.load();
      modelRef.current = model;
      console.log("MobileNet model loaded");
    };
    loadModel();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handlePredict = async () => {
    if (!modelRef.current) {
      console.log("Model not loaded yet");
      return;
    }

    const canvasEl = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvasEl) {
      console.error("Canvas element not found");
      return;
    }

    const results = await modelRef.current.classify(canvasEl);
    const sorted = results.sort((a, b) => b.probability - a.probability);
    setPredictions(sorted);

    socketRef.current?.emit("drawing-prediction", sorted);
  };

  // To display the top (highest‐probability) prediction
  const topPrediction = predictions[0];

  const leaveGame = () => {
    socketRef.current?.emit("leave-room", roomCode);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* We removed the extra heading outside the card, 
          so there's no "Canvas Page" text in white anymore. */}
      
      <Card className="max-w-xl mx-auto bg-gray-800 text-white border-0 shadow-none">
        <CardHeader>
          {/* Replace "Canvas Page" with the player's name */}
          <CardTitle className="text-2xl font-bold text-center">
            {playerName}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center font-semibold">Draw Something!</p>

          <div className="flex justify-center">
            <CanvasDraw width={400} height={400} />
          </div>

          <div className="text-center">
            <button
              onClick={handlePredict}
              className="rounded bg-black hover:bg-gray-700 text-white px-4 py-2"
            >
              Predict Drawing
            </button>
          </div>

          <div className="text-center">
            {topPrediction ? (
              <p className="mt-2">
                <span className="font-semibold">Prediction:</span> {topPrediction.className} -{" "}
                {(topPrediction.probability * 100).toFixed(2)}%
              </p>
            ) : (
              <p className="mt-2">No predictions yet.</p>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={leaveGame}
              className="rounded bg-red-600 hover:bg-red-500 text-white px-4 py-2"
              style={{ width: "auto" }}
            >
              Leave Game
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
