import CanvasItem from "./CanvasItem";
import Point from "./Point";

export default class Line implements CanvasItem {
  constructor(protected start: Point, protected end: Point) {}
  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.end.x, this.end.y);
    context.closePath();
    context.stroke();
  }
}
