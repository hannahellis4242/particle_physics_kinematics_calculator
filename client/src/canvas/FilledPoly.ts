import CanvasItem from "./CanvasItem";
import Point from "./Point";

export default class FilledPoly implements CanvasItem {
  constructor(private points: Point[]) {}
  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    this.points.forEach(({ x, y }, index) => {
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.closePath();
    context.fill();
  }
}
