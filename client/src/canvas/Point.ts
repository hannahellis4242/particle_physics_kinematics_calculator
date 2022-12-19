export default interface Point {
  x: number;
  y: number;
}
type Vector = Point;
export const dot = (a: Vector, b: Vector): number => a.x * b.x + a.y * b.y;
export const add = (a: Vector, b: Vector): Vector => {
  return { x: a.x + b.x, y: a.y + b.y };
};
export const neg = ({ x, y }: Vector): Vector => {
  return { x: -x, y: -x };
};
export const difference = (a: Vector, b: Vector): Vector => add(a, neg(b));
export const length = (a: Vector): number => Math.sqrt(dot(a, a));
export const mult = (a: number, { x, y }: Vector): Point => {
  return { x: a * x, y: a * y };
};
export const unit = (a: Vector): Vector => {
  const l = length(a);
  return { x: a.x / l, y: a.y / l };
};
export const perp = ({ x, y }: Vector): Vector => {
  return { x: -y, y: x };
};
