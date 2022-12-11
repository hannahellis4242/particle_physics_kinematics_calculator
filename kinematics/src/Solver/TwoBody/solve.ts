import Particle from "../../Model/Particle";
import Problem from "../../Model/TwoBody/Problem";
import RestSolution from "../../Model/TwoBody/RestSolution";
import Solution from "../../Model/TwoBody/Solution";

interface Property {
  parent(problem: Problem): number;
  daughterA(problem: Problem): number;
  daughterB(problem: Problem): number;
}

class Mass implements Property {
  parent({ parent }: Problem) {
    return parent.mass;
  }
  daughterA({ daughterA }: Problem) {
    return daughterA.mass;
  }
  daughterB({ daughterB }: Problem) {
    return daughterB.mass;
  }
}

const getProperty =
  (p: Property) => (k: keyof Property) => (problem: Problem) =>
    p[k](problem);

const solveRestFrameA = (problem: Problem): Particle => {
  const { parent, daughterA, daughterB, centreOfMassDecayAngle } = problem;
  const energy =
    (parent.mass * parent.mass +
      daughterA.mass * daughterA.mass -
      daughterB.mass * daughterB.mass) /
    (2 * parent.mass);
  const momentum = Math.sqrt(energy * energy - daughterA.mass * daughterA.mass);
  const x = momentum * Math.cos(centreOfMassDecayAngle);
  const y = momentum * Math.sin(centreOfMassDecayAngle);
  return {
    mass: daughterA.mass,
    energy,
    momentum: { magnitude: momentum, x, y, z: 0 },
  };
};

const solveRestFrameB = (problem: Problem): Particle => {
  const { parent, daughterA, daughterB, centreOfMassDecayAngle } = problem;
  const energy =
    (parent.mass * parent.mass +
      daughterB.mass * daughterB.mass -
      daughterA.mass * daughterA.mass) /
    (2 * parent.mass);
  const momentum = Math.sqrt(energy * energy - daughterB.mass * daughterB.mass);
  const x = -momentum * Math.cos(centreOfMassDecayAngle);
  const y = -momentum * Math.sin(centreOfMassDecayAngle);
  return {
    mass: daughterB.mass,
    energy,
    momentum: { magnitude: momentum, x, y, z: 0 },
  };
};

const solveRestFrame = (problem: Problem): RestSolution => {
  return {
    daughterA: solveRestFrameA(problem),
    daughterB: solveRestFrameB(problem),
  };
};

const solve = async (problem: Problem): Promise<Solution> => {
  //step 1 sovle in rest frame
  const rest = solveRestFrame(problem);
  return {};
};

export default solve;
