import CanvasItem from "./CanvasItem";

export default class FillRect implements CanvasItem {
  private west: number;
  private south: number;
  private east: number;
  private north: number;
  constructor(w: number, s: number, e: number, n: number) {
    this.west = Math.min(w, e);
    this.east = Math.max(w, e);
    this.south = Math.max(s, n);
    this.north = Math.min(s, n);
  }
  draw(context: CanvasRenderingContext2D) {
    context.fillRect(
      this.west,
      this.north,
      this.east - this.west,
      this.south - this.north
    );
  }
}
