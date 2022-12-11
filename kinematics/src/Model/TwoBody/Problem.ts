import Particle from "../Particle";

export default interface Problem {
  parent: Particle;
  centreOfMassDecayAngle: number;
  daughterA: Particle;
  daughterB: Particle;
}
