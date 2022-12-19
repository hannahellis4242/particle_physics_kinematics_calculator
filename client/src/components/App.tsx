import Arrow from "../canvas/Arrow";
import Stroke from "../canvas/Stroke";
import classes from "./App.module.css";
import Canvas from "./Canvas";
const App = () => {
  return (
    <Canvas
      item={
        new Stroke(
          "red",
          new Arrow(
            { x: 100, y: 100 },
            { x: 300, y: 400 },
            { type: "line", width: 50, length: 70 }
          )
        )
      }
    />
  );
};
export default App;
