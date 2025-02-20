import React, { useRef, useState, useEffect } from "react";

const CanvasDraw = ({ width = 400, height = 400 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    setContext(ctx);
  }, [width, height]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e); // Draw a dot
  };

  const endDrawing = () => {
    setIsDrawing(false);
    context.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;

    // For a touch event vs. mouse event
    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - canvas.offsetLeft;
      y = e.touches[0].clientY - canvas.offsetTop;
    } else {
      x = e.clientX - canvas.offsetLeft;
      y = e.clientY - canvas.offsetTop;
    }

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #000" }}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={draw}
      onTouchStart={startDrawing}
      onTouchEnd={endDrawing}
      onTouchMove={draw}
    />
  );
};

export default CanvasDraw;
