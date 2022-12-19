import CanvasItem from "./CanvasItem";

export default class Stroke implements CanvasItem {
  constructor(private colour: string, private item: CanvasItem) {}
  draw(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.colour;
    this.item.draw(context);
  }
}
