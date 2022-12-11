import express, { json } from "express";
import twoBody from "./Routes/twoBody";

const app = express();
app.use(json());
app.use("/two-body", twoBody);

const host = process.env.KINEMATICS_HOST || "localhost";
const port = 3001;
app.listen(port, host, () => {
  console.log(`kinematics server listening on ${host}:${port}`);
});
