import CanvasItem from "./CanvasItem";

export default class CanvasGroup implements CanvasItem {
  protected children: CanvasItem[];
  constructor() {
    this.children = [];
  }
  addChild(element: CanvasItem) {
    this.children.push(element);
  }
  draw(context: CanvasRenderingContext2D) {
    this.children.forEach((element) => element.draw(context));
  }
}
