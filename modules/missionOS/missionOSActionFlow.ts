import type { MissionOSViewModel } from "./types";
import type { MissionOSNextActionKind } from "./types";

export type ActionFlowStepId =
  | "decision"
  | "validation"
  | "preparation"
  | "handoff"
  | "report"
  | "cycle";

export function mapViewModelToActionFlowStep(viewModel: MissionOSViewModel): ActionFlowStepId {
  const kind: MissionOSNextActionKind = viewModel.nextActionKind;

  switch (kind) {
    case "decide_mission":
    case "choose_next_mission":
      return "decision";
    case "validate_action":
      return "validation";
    case "prepare_plan":
    case "open_workspace":
    case "create_follow_up":
    case "generate_review":
    case "apply_report":
      return "preparation";
    case "create_handoff":
      return "handoff";
    case "paste_report":
      return "report";
    case "archive_learning":
    case "clarify":
    default:
      if (viewModel.hasActiveCycle && viewModel.progressPercent >= 70) return "cycle";
      if (viewModel.currentPhase === "report_return") return "report";
      if (viewModel.currentPhase === "manual_execution") return "handoff";
      if (viewModel.currentPhase === "preparation") return "preparation";
      return "decision";
  }
}
