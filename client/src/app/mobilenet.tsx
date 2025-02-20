import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import io, { Socket } from "socket.io-client";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs"; // Required for mobilenet to run

// Dynamically import the CanvasDraw so Next.js won't SSR it
const CanvasDraw = dynamic(() => import("../components/canvas.js"), {
  ssr: false,
});

interface MobileNetPrediction {
  className: string;
  probability: number;
}

export default function MobileNet() {
  const [predictions, setPredictions] = useState<MobileNetPrediction[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const modelRef = useRef<mobilenet.MobileNet | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:8080"); 

    // Load the MobileNet model
    const loadModel = async () => {
      const model = await mobilenet.load();
      modelRef.current = model;
      console.log("MobileNet model loaded");
    };
    loadModel();

    // Cleanup socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handlePredict = async () => {
    if (!modelRef.current) {
      console.log("Model not loaded yet");
      return;
    }

    // Grab the <canvas> element from the DOM
    // Using querySelector in this example, but you could 
    // also forward a ref from CanvasDraw
    const canvasEl = document.querySelector("canvas");
    if (!canvasEl) {
      console.error("Canvas element not found");
      return;
    }

    // Classify the canvas image
    const results = await modelRef.current.classify(canvasEl as HTMLCanvasElement);
    setPredictions(results);

    // Emit predictions to server via Socket.IO
    socketRef.current?.emit("drawing-prediction", results);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Draw Something!</h1>
      <CanvasDraw width={400} height={400} />
      
      <br />
      <button onClick={handlePredict}>Predict Drawing</button>

      <div style={{ marginTop: 20 }}>
        <h2>Predictions:</h2>
        {predictions.length > 0 ? (
          predictions.map((p, idx) => (
            <div key={idx}>
              {p.className} - {(p.probability * 100).toFixed(2)}%
            </div>
          ))
        ) : (
          <p>No predictions yet.</p>
        )}
      </div>
    </div>
  );
}