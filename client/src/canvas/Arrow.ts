import CanvasGroup from "./CanvasGroup";
import FilledPoly from "./FilledPoly";
import Line from "./Line";
import Point, { add, difference, length, mult, perp, unit } from "./Point";

interface LineHead {
  type: "line";
  length: number;
  width: number;
}

interface FilledHead {
  type: "filled";
  length: number;
  width: number;
}

interface FlairedHead {
  type: "flaired";
  length: number;
  width: number;
  flair: number;
}

export type HeadStyle = LineHead | FilledHead | FlairedHead;

export default class Arrow extends CanvasGroup {
  constructor(start: Point, end: Point, style: HeadStyle) {
    super();
    const u = difference(end, start);
    const unit_u = unit(u);
    const unit_v = perp(unit_u);
    const c = add(start, mult(1 - style.length / length(u), u));
    const d = add(c, mult(style.width / 2, unit_v));
    const e = add(c, mult(-style.width / 2, unit_v));
    if (style.type === "line") {
      this.addChild(new Line(start, end));
      this.addChild(new Line(end, d));
      this.addChild(new Line(end, e));
    }
    if (style.type === "filled") {
      this.addChild(new Line(start, c));
      this.addChild(new FilledPoly([end, d, e]));
    }
    if (style.type === "flaired") {
      const f = add(d, mult(-style.flair, unit_u));
      const g = add(e, mult(-style.flair, unit_u));
      this.addChild(new Line(start, c));
      this.addChild(new FilledPoly([end, f, c, g]));
    }
  }
}
