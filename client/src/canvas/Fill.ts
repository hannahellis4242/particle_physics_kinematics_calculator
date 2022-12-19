import CanvasItem from "./CanvasItem";

export default class Fill implements CanvasItem {
  constructor(private colour: string, private item: CanvasItem) {}
  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.colour;
    this.item.draw(context);
  }
}
