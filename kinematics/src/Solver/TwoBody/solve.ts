import Particle from "../../Model/Particle";
import LabSolution from "../../Model/TwoBody/LabSolution";
import Problem from "../../Model/TwoBody/Problem";
import RestSolution from "../../Model/TwoBody/RestSolution";
import Solution from "../../Model/TwoBody/Solution";
/*
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
*/

const getMomentum = (energy: number, mass: number): number =>
  Math.sqrt(energy * energy - mass * mass);

const solveRestFrameA = (problem: Problem): Particle => {
  const { parent, daughterA, daughterB, centreOfMassDecayAngle } = problem;
  const energy =
    (parent.mass * parent.mass +
      daughterA.mass * daughterA.mass -
      daughterB.mass * daughterB.mass) /
    (2 * parent.mass);
  const momentum = getMomentum(energy, daughterA.mass);
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
  const momentum = getMomentum(energy, daughterB.mass);
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

const solveLabParent = (problem: Problem): Particle => {
  const mass = problem.parent.mass;
  const energy = problem.parent.energy;
  const momentum = energy ? getMomentum(energy, mass) : undefined;
  return {
    mass,
    energy,
    momentum: momentum
      ? { magnitude: momentum, x: momentum, y: 0, z: 0 }
      : undefined,
  };
};

const transformToLab =
  (gamma: number, betagamma: number) => (particle: Particle) => {
    if (particle.energy && particle.momentum) {
      const energy = gamma * particle.energy + betagamma * particle.momentum.x;
      const x = betagamma * particle.energy + gamma * particle.momentum.x;
      const y = particle.momentum.y;
      const magnitude = Math.sqrt(x * x + y * y);
      return {
        mass: particle.mass,
        energy,
        momentum: { magnitude, x, y, z: 0 },
      };
    }
  };
const solveLabFrame = (
  rest: RestSolution,
  problem: Problem
): LabSolution | undefined => {
  const parent = solveLabParent(problem);
  if (parent.energy && parent.momentum) {
    const transform = transformToLab(
      parent.energy / problem.parent.mass,
      parent.momentum.magnitude / problem.parent.mass
    );
    const daughterA = transform(rest.daughterA);
    const daughterB = transform(rest.daughterB);
    if (daughterA && daughterB) {
      return { parent, daughterA, daughterB };
    }
  }
  return undefined;
};

const solve = async (problem: Problem): Promise<Solution> => {
  //step 1 sovle in rest frame
  const rest = solveRestFrame(problem);
  const lab = solveLabFrame(rest, problem);
  return { rest, lab };
};

export default solve;
