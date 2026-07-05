import type { ClosedLoopLifecycleNextStepType } from "@/modules/closedLoopLifecycle/types";
import type { MissionOSNextActionKind, MissionOSReadiness } from "./types";

export function mapNextStepTypeToKind(
  type: ClosedLoopLifecycleNextStepType | undefined
): MissionOSNextActionKind {
  switch (type) {
    case "choose_mission":
      return "decide_mission";
    case "create_plan":
      return "prepare_plan";
    case "approve_action":
      return "validate_action";
    case "create_workspace":
      return "open_workspace";
    case "create_handoff":
      return "create_handoff";
    case "paste_report":
      return "paste_report";
    case "apply_report_to_log":
      return "apply_report";
    case "generate_review":
      return "generate_review";
    case "create_follow_up":
      return "create_follow_up";
    case "archive_learning":
    case "update_mission_feedback":
      return "archive_learning";
    case "close_cycle":
      return "choose_next_mission";
    case "prepare_action":
    case "add_to_queue":
    case "create_execution_plan":
      return "prepare_plan";
    default:
      return "clarify";
  }
}

export function readinessFromLifecycleStatus(
  status: string | undefined,
  nextType: ClosedLoopLifecycleNextStepType | undefined
): MissionOSReadiness {
  if (nextType === "choose_mission") return "needs_user_decision";
  if (nextType === "approve_action" || nextType === "add_to_queue") return "needs_preparation";
  if (nextType === "create_handoff") return "waiting_for_manual_execution";
  if (nextType === "paste_report") return "waiting_for_report";
  if (nextType === "generate_review") return "needs_review";
  if (nextType === "create_follow_up") return "needs_follow_up";
  if (nextType === "archive_learning" || nextType === "update_mission_feedback") {
    return "learning_ready";
  }
  if (nextType === "close_cycle") return "ready";

  switch (status) {
    case "waiting_for_report":
      return "waiting_for_report";
    case "waiting_for_execution":
      return "waiting_for_manual_execution";
    case "needs_review":
      return "needs_review";
    case "needs_follow_up":
      return "needs_follow_up";
    case "learning_ready":
      return "learning_ready";
    case "blocked":
    case "unclear":
      return "unclear";
    default:
      return "needs_preparation";
  }
}
