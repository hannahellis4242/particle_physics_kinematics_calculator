const canvas = document.querySelector("canvas");
console.log(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
let start = { x: undefined, y: undefined };
let end = { x: undefined, y: undefined };
const drawFn = (event) => {
  start = end;
  end = event;
  draw();
};
window.addEventListener("mousedown", () => {
  window.addEventListener("mousemove", drawFn);
});
window.addEventListener("mouseup", () => {
  window.removeEventListener("mousemove", drawFn);
  start = { x: undefined, y: undefined };
  end = { x: undefined, y: undefined };
});

const draw = () => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = "black";
  context.closePath();
  context.stroke();
};
