import React, { useRef, useState, useEffect } from "react";

const CanvasDraw = ({ width = 400, height = 400 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [context, setContext] = useState(null);

  const BACKGROUND_COLOR = "#FFFFFF"; 
  const PEN_COLOR = "#000000";

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    // Set basic context props
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = PEN_COLOR;

    // Fill background
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, width, height);

    setContext(ctx);
  }, [width, height]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = isErasing ? BACKGROUND_COLOR : PEN_COLOR;
    }
  }, [isErasing, context]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, width, height);

    // Reset stroke style
    context.strokeStyle = isErasing ? BACKGROUND_COLOR : PEN_COLOR;
  };

  const toggleEraser = () => {
    setIsErasing((prev) => !prev);
  };

  return (
    <div className="text-center">
      <div className="mb-3">
        <button
          onClick={clearCanvas}
          className="mr-2 rounded bg-gray-700 hover:bg-gray-600 text-white px-4 py-2"
        >
          Clear
        </button>
        <button
          onClick={toggleEraser}
          className="rounded bg-gray-700 hover:bg-gray-600 text-white px-4 py-2"
        >
          {isErasing ? "Use Pen" : "Use Eraser"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #444",
          cursor: isErasing ? "crosshair" : "default",
          backgroundColor: BACKGROUND_COLOR,
        }}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={endDrawing}
        onTouchMove={draw}
      />
    </div>
  );
};

export default CanvasDraw;