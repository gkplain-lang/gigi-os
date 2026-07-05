import type { MissionOSViewModel } from "./types";
import type { MissionOSNextActionKind } from "./types";

export type ActionFlowStepId =
  | "decision"
  | "validation"
  | "preparation"
  | "handoff"
  | "report"
  | "cycle";

export type ActionFlowStage =
  | "decide"
  | "validate"
  | "prepare"
  | "handoff"
  | "report"
  | "cycle"
  | "done";

export type ActionFlowItemStatus =
  | "waiting_decision"
  | "waiting_validation"
  | "ready_to_prepare"
  | "ready_for_handoff"
  | "waiting_report"
  | "report_to_review"
  | "cycle_to_close"
  | "completed"
  | "unclear";

export const ACTION_FLOW_STAGES: ActionFlowStage[] = [
  "decide",
  "validate",
  "prepare",
  "handoff",
  "report",
  "cycle",
  "done",
];

export const ACTION_FLOW_STAGE_LABELS: Record<ActionFlowStage, string> = {
  decide: "Décision",
  validate: "Validation",
  prepare: "Préparation",
  handoff: "Passation",
  report: "Rapport",
  cycle: "Cycle",
  done: "Terminé",
};

export const ACTION_FLOW_STATUS_LABELS: Record<ActionFlowItemStatus, string> = {
  waiting_decision: "À décider",
  waiting_validation: "À valider",
  ready_to_prepare: "À préparer",
  ready_for_handoff: "En passation",
  waiting_report: "Rapport attendu",
  report_to_review: "Rapport à traiter",
  cycle_to_close: "Cycle à finaliser",
  completed: "Terminé",
  unclear: "Statut à clarifier",
};

export function mapStageToFlowStepId(stage: ActionFlowStage): ActionFlowStepId {
  switch (stage) {
    case "decide":
      return "decision";
    case "validate":
      return "validation";
    case "prepare":
      return "preparation";
    case "handoff":
      return "handoff";
    case "report":
      return "report";
    case "cycle":
    case "done":
      return "cycle";
    default:
      return "decision";
  }
}

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
