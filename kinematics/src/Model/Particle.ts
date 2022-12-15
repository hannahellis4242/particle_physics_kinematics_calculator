import Momentum from "./Momentum";

export default interface Particle {
  mass: number;
  energy?: number;
  momentum?: Momentum;
}

export const isParticle = (obj: any): boolean => "mass" in obj;
export const isParticleWithEnergy = (obj: any): boolean =>
  isParticle(obj) && "energy" in obj;
