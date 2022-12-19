import Arrow from "../canvas/Arrow";
import Fill from "../canvas/Fill";
import Stroke from "../canvas/Stroke";
import classes from "./App.module.css";
import Canvas from "./Canvas";
const App = () => {
  return (
    <Canvas
      item={
        new Fill(
          "red",
          new Stroke(
            "red",
            new Arrow(
              { x: 100, y: 100 },
              { x: 300, y: 400 },
              { type: "flaired", width: 50, length: 50, flair: 20 }
            )
          )
        )
      }
    />
  );
};
export default App;
