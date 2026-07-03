import type { GigiLocalState } from "../storage/gigiStateTypes";

export function selectMission(state: GigiLocalState) {
  return state.mission;
}
