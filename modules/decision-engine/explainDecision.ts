import type { GigiLocalState } from "../storage/gigiStateTypes";
import { explainDecisionFromProjects } from "./runDecisionEngine";

export function explainDecision(state: GigiLocalState) {
  return explainDecisionFromProjects(state.projects);
}
