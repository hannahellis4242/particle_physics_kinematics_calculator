import CanvasGroup from "./CanvasGroup";
import CanvasItem from "./CanvasItem";
import Line from "./Line";
import Point, { add, difference, length, mult, perp, unit } from "./Point";

export interface HeadStyle {
  type: "line";
  length: number;
  width: number;
}

export class Head extends CanvasGroup {
  constructor(start: Point, end: Point, style: HeadStyle) {
    super();
    if (style.type === "line") {
      const u = difference(end, start);
      const unit_u = unit(u);
      const unit_v = perp(unit_u);
      const c = add(start, mult(1 - style.length / length(u), u));
      const d = add(c, mult(style.width / 2, unit_v));
      const e = add(c, mult(-style.width / 2, unit_v));
      this.addChild(new Line(end, d));
      this.addChild(new Line(end, e));
    }
  }
}

export default class Arrow extends Line {
  private head: Head;
  constructor(start: Point, end: Point, style: HeadStyle) {
    super(start, end);
    this.head = new Head(start, end, style);
  }
  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    this.head.draw(context);
  }
}
