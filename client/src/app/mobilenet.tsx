"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as tf from "@tensorflow/tfjs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/context/SocketContext"; // Import the global socket hook

// Dynamically load the CanvasDraw component so it doesn’t break on server-side
const CanvasDraw = dynamic(() => import("../components/canvas.js"), { ssr: false });

interface MobilenetProps {
  playerName: string;
  roomCode: string;
  playerId: string;
}

function cleanLabel(label: string) {
  return label.replace(/[_-]/g, " ");
}

export default function DoodleNetClassifier({ playerName, roomCode }: MobilenetProps) {
  const [targetWord, setTargetWord] = useState<string>("");
  const [previousWord, setPreviousWord] = useState<string>("");
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const modelRef = useRef<tf.LayersModel | null>(null);
  const router = useRouter();
  const socket = useSocket(); // Use the global socket
  const playerID = typeof window !== "undefined"
    ? localStorage.getItem("playerId") || ""
    : "";

  const labels: string[] = [
    "flashlight", "belt", "mushroom", "pond", "strawberry", "pineapple", "sun", "cow", "ear", "bush",
    "pliers", "watermelon", "apple", "baseball", "feather", "shoe", "leaf", "lollipop", "crown", "ocean",
    "horse", "mountain", "mosquito", "mug", "hospital", "saw", "castle", "angel", "underwear", "traffic_light",
    "cruise_ship", "marker", "blueberry", "flamingo", "face", "hockey_stick", "bucket", "campfire", "asparagus",
    "skateboard", "door", "suitcase", "skull", "cloud", "paint_can", "hockey_puck", "steak", "house_plant",
    "sleeping_bag", "bench", "snowman", "arm", "crayon", "fan", "shovel", "leg", "washing_machine", "harp",
    "toothbrush", "tree", "bear", "rake", "megaphone", "knee", "guitar", "calculator", "hurricane", "grapes",
    "paintbrush", "couch", "nose", "square", "wristwatch", "penguin", "bridge", "octagon", "submarine",
    "screwdriver", "rollerskates", "ladder", "wine_bottle", "cake", "bracelet", "broom", "yoga", "finger",
    "fish", "line", "truck", "snake", "bus", "stitches", "snorkel", "shorts", "bowtie", "pickup_truck", "tooth",
    "snail", "foot", "crab", "school_bus", "train", "dresser", "sock", "tractor", "map", "hedgehog", "coffee_cup",
    "computer", "matches", "beard", "frog", "crocodile", "bathtub", "rain", "moon", "bee", "knife", "boomerang",
    "lighthouse", "chandelier", "jail", "pool", "stethoscope", "frying_pan", "cell_phone", "binoculars", "purse",
    "lantern", "birthday_cake", "clarinet", "palm_tree", "aircraft_carrier", "vase", "eraser", "shark", "skyscraper",
    "bicycle", "sink", "teapot", "circle", "tornado", "bird", "stereo", "mouth", "key", "hot_dog", "spoon", "laptop",
    "cup", "bottlecap", "The_Great_Wall_of_China", "The_Mona_Lisa", "smiley_face", "waterslide", "eyeglasses",
    "ceiling_fan", "lobster", "moustache", "carrot", "garden", "police_car", "postcard", "necklace", "helmet",
    "blackberry", "beach", "golf_club", "car", "panda", "alarm_clock", "t-shirt", "dog", "bread", "wine_glass",
    "lighter", "flower", "bandage", "drill", "butterfly", "swan", "owl", "raccoon", "squiggle", "calendar", "giraffe",
    "elephant", "trumpet", "rabbit", "trombone", "sheep", "onion", "church", "flip_flops", "spreadsheet", "pear",
    "clock", "roller_coaster", "parachute", "kangaroo", "duck", "remote_control", "compass", "monkey", "rainbow",
    "tennis_racquet", "lion", "pencil", "string_bean", "oven", "star", "cat", "pizza", "soccer_ball", "syringe",
    "flying_saucer", "eye", "cookie", "floor_lamp", "mouse", "toilet", "toaster", "The_Eiffel_Tower", "airplane",
    "stove", "cello", "stop_sign", "tent", "diving_board", "light_bulb", "hammer", "scorpion", "headphones", "basket",
    "spider", "paper_clip", "sweater", "ice_cream", "envelope", "sea_turtle", "donut", "hat", "hourglass", "broccoli",
    "jacket", "backpack", "book", "lightning", "drums", "snowflake", "radio", "banana", "camel", "canoe", "toothpaste",
    "chair", "picture_frame", "parrot", "sandwich", "lipstick", "pants", "violin", "brain", "power_outlet", "triangle",
    "hamburger", "dragon", "bulldozer", "cannon", "dolphin", "zebra", "animal_migration", "camouflage", "scissors",
    "basketball", "elbow", "umbrella", "windmill", "table", "rifle", "hexagon", "potato", "anvil", "sword", "peanut",
    "axe", "television", "rhinoceros", "baseball_bat", "speedboat", "sailboat", "zigzag", "garden_hose", "river",
    "house", "pillow", "ant", "tiger", "stairs", "cooler", "see_saw", "piano", "fireplace", "popsicle", "dumbbell",
    "mailbox", "barn", "hot_tub", "teddy-bear", "fork", "dishwasher", "peas", "hot_air_balloon", "keyboard", "microwave",
    "wheel", "fire_hydrant", "van", "camera", "whale", "candle", "octopus", "pig", "swing_set", "helicopter", "saxophone",
    "passport", "bat", "ambulance", "diamond", "goatee", "fence", "grass", "mermaid", "motorbike", "microphone", "toe",
    "cactus", "nail", "telephone", "hand", "squirrel", "streetlight", "bed", "firetruck"
  ];

  // Load model and set an initial random target word
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const model = await tf.loadLayersModel("/models/model.json");
        modelRef.current = model;
        console.log("✅ DoodleNet model loaded");
      } catch (error) {
        console.error("Failed to load model", error);
      }
    };
    loadModel();

    // Pick initial random target word
    setTargetWord(pickRandomLabel());

    // End the game after 60 seconds
    const gameTimer = setTimeout(() => {
      setGameOver(true);
      router.push(`/gameEnd?roomCode=${roomCode}`);
    }, 60000);

    // Countdown
    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up
    return () => {
      clearTimeout(gameTimer);
      clearInterval(countdownInterval);
    };
  }, [roomCode, router]);

  // Utility to pick a random word from the labels array
  function pickRandomLabel() {
    const randomIndex = Math.floor(Math.random() * labels.length);
    return labels[randomIndex];
  }

  // Function to handle predictions
  const handlePredict = async () => {
    if (!modelRef.current || gameOver) {
      console.error("Model not loaded or game is over.");
      return;
    }
    const canvasEl = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvasEl) {
      console.error("Canvas element not found");
      return;
    }

    try {
      // Preprocess the image
      let imgTensor = tf.browser.fromPixels(canvasEl) as tf.Tensor3D;
      imgTensor = tf.image.resizeBilinear(imgTensor, [28, 28]) as tf.Tensor3D;
      imgTensor = imgTensor.toFloat().div(tf.scalar(255)) as tf.Tensor3D;
      imgTensor = tf.image.rgbToGrayscale(imgTensor) as tf.Tensor3D;
      imgTensor = tf.sub(tf.scalar(1), imgTensor) as tf.Tensor3D;
      const finalTensor = imgTensor.expandDims(0); // shape [1, 28, 28, 1]

      // If canvas is essentially empty, set score to 0
      const sumInk = (await finalTensor.sum().array()) as number;
      const emptyThreshold = 1.0;
      if (sumInk < emptyThreshold) {
        setRoundScore(0);
        setTotalScore((prev) => prev + 0);
        clearCanvas(canvasEl);
        // Notice we do NOT set previousWord here because user didn't draw anything
        // (Optional, but you might want to handle it differently)
        setTargetWord(pickRandomLabel());
        tf.dispose([imgTensor, finalTensor]);
        return;
      }

      const predictionTensor = modelRef.current.predict(finalTensor) as tf.Tensor<tf.Rank>;
      const probabilities = predictionTensor.dataSync() as Float32Array;

      // Sort probabilities to find top 5
      const sorted = Array.from(probabilities)
        .map((prob, i) => [prob, i] as [number, number])
        .sort((a, b) => b[0] - a[0]);
      const top5 = sorted.slice(0, 5);

      // Scoring logic
      const targetIndex = labels.indexOf(targetWord);
      const targetInTop5 = top5.some(([, idx]) => idx === targetIndex);
      const highestProb = top5.length > 0 ? top5[0][0] : 0;
      const epsilon = 0.001;
      let roundScoreValue = 0;

      if (targetInTop5) {
        // If our target is in the top 5
        const rawProb = probabilities[targetIndex];
        const targetProb = rawProb === 0 ? epsilon : rawProb;
        roundScoreValue = (targetProb + targetProb / highestProb) / 2; 
      } else {
        roundScoreValue = highestProb;
      }

      // Convert to points
      const newRoundScore = Math.ceil(roundScoreValue * 100);

      // Update states and notify server
      setRoundScore(newRoundScore);
      setTotalScore((prev) => prev + newRoundScore);
      socket?.emit("update-score", {
        roomCode,
        playerId: playerID,
        score: newRoundScore,
      });

      // 1) Save the current word as "previousWord"
      setPreviousWord(targetWord);

      // 2) Pick new word immediately for next round
      setTargetWord(pickRandomLabel());

      // Clear canvas and dispose of Tensors
      clearCanvas(canvasEl);
      tf.dispose([imgTensor, finalTensor, predictionTensor]);

    } catch (error) {
      console.error("Error during prediction", error);
    }
  };

  function clearCanvas(canvasEl: HTMLCanvasElement) {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  }

  const leaveGame = () => {
    socket?.emit("leave-room", roomCode);
    router.push("/");
  };

  const displayWord = cleanLabel(targetWord);
  const timePercent = (timeLeft / 60) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <style jsx>{`
        .timer-bar-container {
          width: 100%;
          height: 12px;
          background-color: #444;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .timer-bar {
          height: 100%;
          background-color: #ff4d4f;
          transition: width 1s linear;
        }
      `}</style>

      <Card className="max-w-xl mx-auto bg-gray-800 text-white border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{playerName}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Timer bar */}
          <div className="timer-bar-container">
            <div className="timer-bar" style={{ width: `${timePercent}%` }} />
          </div>

          {/* Time left & current word */}
          <div className="flex justify-between items-center">
            <p className="font-semibold text-xl">Time Left: {timeLeft}s</p>
            <p className="font-semibold text-xl">Draw: {displayWord}</p>
          </div>

          {/* Drawing Canvas */}
          <div className="flex justify-center">
            <CanvasDraw width={400} height={400} />
          </div>

          {/* Submit Drawing Button */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <button
                onClick={handlePredict}
                className="rounded bg-black hover:bg-gray-700 text-white px-4 py-2 mt-4"
              >
                Submit Drawing
              </button>
            ) : (
              <p className="mt-4 font-bold text-xl">Time's up!</p>
            )}
          </div>

          {/* Display Round Score for the *previous* word */}
          <div className="text-center">
            {roundScore !== null && previousWord && (
              <p className="mt-2 font-semibold">
                Round Score for {cleanLabel(previousWord)}: {roundScore.toFixed(3)} points
              </p>
            )}
          </div>

          {/* Display Total Score */}
          <div className="text-center">
            <p className="mt-2 font-semibold">Total Score: {totalScore.toFixed(3)} points</p>
          </div>

          {/* Leave Game */}
          <div className="text-center pt-4">
            <button
              onClick={leaveGame}
              className="rounded bg-red-600 hover:bg-red-500 text-white px-4 py-2"
            >
              Leave Game
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
