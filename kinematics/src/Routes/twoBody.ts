import { Router } from "express";
import Problem from "../Model/TwoBody/Problem";
import { v4 } from "uuid";
import Solution from "../Model/TwoBody/Solution";
import solve, { isProblem } from "../Solver/TwoBody/solve";
import { MongoClient, ObjectId } from "mongodb";

const db_host = process.env.DB_HOST || "localhost";
const url = `mongodb://${db_host}:27017`;
const client = new MongoClient(url);

const dbName = "two_body";
const problemCollectionName = "problem";
const solutionCollectionName = "solution";

interface ProblemDocument {
  time: Date;
  problem: Problem;
  solutionID?: ObjectId;
}

const addProblem = async (problem: Problem): Promise<ObjectId> => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(problemCollectionName);
  const document: ProblemDocument = { time: new Date(), problem };
  const result = await collection.insertOne(document);
  client.close();
  return result.insertedId;
};

const addSolution = async (problemID: ObjectId, solution: Solution) => {
  await client.connect();
  const db = client.db(dbName);
  const solutions = db.collection(solutionCollectionName);
  const solutionResult = await solutions.insertOne({
    problemID,
    solution,
  });
  client.close();
  return solutionResult.insertedId;
};

const updateProblem = async (problemID: ObjectId, solutionID: ObjectId) => {
  client.connect();
  const db = client.db(dbName);
  const problems = db.collection(problemCollectionName);
  const result = await problems.updateOne(
    { _id: problemID },
    { $set: { solutionID } }
  );
  client.close();
  return result.upsertedId;
};

const addSolutionToDB = async (
  problemID: ObjectId,
  solution: Solution
): Promise<ObjectId> => {
  const solutionID = await addSolution(problemID, solution);
  await updateProblem(problemID, solutionID);
  return solutionID;
};

const findProblem = async (
  problemID: ObjectId
): Promise<ProblemDocument | undefined> => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(problemCollectionName);
  const result = await collection
    .findOne({ _id: problemID })
    .then((doc) => (doc ? doc : undefined));
  client.close();
  return result as unknown as ProblemDocument;
};

const twoBody = Router();

twoBody.post("/", async (req, res) => {
  const problem: Problem = req.body;
  if (isProblem(problem)) {
    const problemID = await addProblem(problem);
    solve(problem).then((solution) => {
      addSolutionToDB(problemID, solution);
    });
    res.json({ problemID });
  } else {
    res.sendStatus(400);
  }
});

twoBody.get("/", async (req, res) => {
  const target = req.query.id;
  if (target) {
    const id = new ObjectId(target as string);
    const document = await findProblem(id);
    if (document) {
      res.json(document);
    } else {
      res.sendStatus(404);
    }
    /*
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
    }*/
  } else {
    res.status(400).json({ usage: "/two-body?id=<problem id>" });
  }
});

export default twoBody;
