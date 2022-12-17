import { Router } from "express";
import Problem from "../Model/TwoBody/Problem";
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
  time: number;
  problem: Problem;
  solutionID?: ObjectId;
}

interface SolutionDocument {
  problemID: ObjectId;
  time: number;
  solution: Solution;
}

const addProblem = async (problem: Problem): Promise<ObjectId> => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(problemCollectionName);
  const document: ProblemDocument = { time: Date.now(), problem };
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
    time: Date.now(),
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

const findSolution = async (
  solutionID: ObjectId
): Promise<SolutionDocument | undefined> => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(solutionCollectionName);
  const result = await collection
    .findOne({ _id: solutionID })
    .then((doc) => (doc ? doc : undefined));
  client.close();
  return result as unknown as SolutionDocument;
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

twoBody.get("/problem", async (req, res) => {
  const target = req.query.id;
  if (target) {
    const id = new ObjectId(target as string);
    const problem = await findProblem(id);
    if (problem) {
      res.json({ status: "processing", problem });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.status(400).json({ usage: "/two-body/problem?id=<problem id>" });
  }
});

twoBody.get("/solution", async (req, res) => {
  const target = req.query.id;
  if (target) {
    const id = new ObjectId(target as string);
    const problem = await findSolution(id);
    if (problem) {
      res.json({ status: "processing", problem });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.status(400).json({ usage: "/two-body/solution?id=<solution id>" });
  }
});

twoBody.get("/", async (req, res) => {
  const target = req.query.id;
  if (!target) {
    res.status(400).json({ usage: "/two-body?id=<problem id>" });
    return;
  }
  const id = new ObjectId(target as string);
  const problem = await findProblem(id);
  if (!problem) {
    res.status(404).json({ message: "could not find problem" });
    return;
  }
  const { solutionID } = problem;
  if (!solutionID) {
    res.json({ status: "processing", problem });
    return;
  }
  const solution = await findSolution(solutionID);
  if (!solution) {
    res.status(404).json({ message: "could not find solution" });
    return;
  }
  res.json({ problem, solution });
});

export default twoBody;
