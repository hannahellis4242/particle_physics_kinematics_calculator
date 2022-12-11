import Momentum from "./Momentum";

export default interface Particle {
  mass: number;
  energy?: number;
  momentum?: Momentum;
}
