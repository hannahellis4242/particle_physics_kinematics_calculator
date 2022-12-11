import { Router } from "express";
import Problem from "../Model/TwoBody/Problem";
import { v4 } from "uuid";
import Solution from "../Model/TwoBody/Solution";
import solve from "../Solver/TwoBody/solve";

interface DBElement {
  id: string;
  problem: Problem;
  solution: Solution;
}

const db: DBElement[] = [];
let queued: string[] = [];

const twoBody = Router();

twoBody.post("/", async (req, res) => {
  const problem: Problem = req.body;
  const id = v4();
  //will eventually be backed by a database, so won't need ids, just use the database id, for now use an array
  //step 1 queue id
  queued.push(id);
  solve(problem).then((solution) => {
    //once the solution comes in
    //add it to the "db"
    db.push({ id, problem, solution });
    //remove it from the queued list
    queued = queued.filter((value) => id !== value);
  });
  res.json({ id });
});

twoBody.get("/", async (req, res) => {
  const target = req.query.id;
  if (target) {
    //check if it's queued
    const item = queued.find((value) => value === target);
    if (item) {
      res.json({ status: "queued" });
    } else {
      //if it's not queued then maybe it's solved
      const element = db.find(({ id }) => id === target);
      if (element) {
        res.json({ status: "done", solution: element });
      } else {
        res.status(404).json({ status: "not queued" });
      }
    }
  } else {
    res.status(400).json({ usage: "/two-body?id=<problem id>" });
  }
});

export default twoBody;
