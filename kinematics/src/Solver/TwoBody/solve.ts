import Particle from "../../Model/Particle";
import Problem from "../../Model/TwoBody/Problem";
import RestSolution from "../../Model/TwoBody/RestSolution";
import Solution from "../../Model/TwoBody/Solution";

/*
const getMass = 

const solveRestFrameA = (problem:Problem) : Particle =>{
    const { parent , daughterA , daughterB } = problem;

    const energy =
      (parent.mass * parent.mass +
        daughterA.mass * daughterA.mass -
        daughterB.mass * daughterB.mass) /
      (2 * parent.mass);
}

const solveRestFrame = (problem: Problem): RestSolution => {
  const { parent } = problem;
  const daughterA: Particle = { mass: problem.daughterA.mass };
  let daughterB: Particle = { mass: problem.daughterB.mass };
  {
    const energy =
      (parent.mass * parent.mass +
        daughterA.mass * daughterA.mass -
        daughterB.mass * daughterB.mass) /
      (2 * parent.mass);
    daughterA = { energy, ...daughterA };
  }
  return { daughterA, daughterB };
};
*/
const solve = async (problem: Problem): Promise<Solution> => {
  //step 1 sovle in lab frame

  return {};
};

export default solve;
