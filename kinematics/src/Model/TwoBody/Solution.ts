import LabSolution from "./LabSolution";
import RestSolution from "./RestSolution";

export default interface Solution {
  rest: RestSolution;
  lab?: LabSolution;
}
