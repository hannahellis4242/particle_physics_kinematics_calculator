import { useEffect, useRef } from "react";
import CanvasItem from "../canvas/CanvasItem";
const draw = (canvas: HTMLCanvasElement, item: CanvasItem) => {
  const context = canvas.getContext("2d");
  if (context) {
    item.draw(context);
  }
};

const Canvas = (props: { item: CanvasItem }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(canvas);
    if (canvas) {
      canvas.width = window.innerWidth * 0.45;
      canvas.height = window.innerHeight * 0.5;
      draw(canvas, props.item);
    }
  }, []);
  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
