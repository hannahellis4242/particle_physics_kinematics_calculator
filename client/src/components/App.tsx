import Arrow from "../canvas/Arrow";
import Fill from "../canvas/Fill";
import Stroke from "../canvas/Stroke";
import classes from "./App.module.css";
import Canvas from "./Canvas";
const App = () => {
  return (
    <section id={classes.app}>
      <section id={classes.control}>
        <header>Two Body Decay</header>
      </section>
      <section id={classes.diagrams}>
        <section>
          <header>Parent Particle Rest Frame</header>
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
        </section>
        <section>
          <header>Lab Frame</header>
          <Canvas
            item={
              new Arrow(
                { x: 50, y: 50 },
                { x: 10, y: 10 },
                { type: "line", width: 20, length: 30 }
              )
            }
          />
        </section>
      </section>
      <section id={classes.output}>output information here</section>
    </section>
  );
};
export default App;
