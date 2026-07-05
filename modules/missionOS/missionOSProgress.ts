import type { ClosedLoopLifecycleStageItem } from "@/modules/closedLoopLifecycle/types";
import { ESSENTIAL_STAGES } from "@/modules/closedLoopLifecycle/types";
import type { MissionOSPhase } from "./types";
import type { ClosedLoopLifecycleNextStepType } from "@/modules/closedLoopLifecycle/types";

export function computeProgressPercent(stageItems: ClosedLoopLifecycleStageItem[]): number {
  if (!stageItems.length) return 0;
  const essential = stageItems.filter((i) =>
    ESSENTIAL_STAGES.includes(i.stage)
  );
  const pool = essential.length ? essential : stageItems;
  const completed = pool.filter((i) => i.status === "completed").length;
  return Math.round((completed / pool.length) * 100);
}

export function phaseFromNextStepType(
  type: ClosedLoopLifecycleNextStepType | undefined
): MissionOSPhase {
  switch (type) {
    case "choose_mission":
      return "mission";
    case "create_plan":
    case "prepare_action":
    case "add_to_queue":
    case "approve_action":
    case "create_execution_plan":
    case "create_workspace":
      return "preparation";
    case "create_handoff":
      return "manual_execution";
    case "paste_report":
    case "apply_report_to_log":
      return "report_return";
    case "generate_review":
    case "create_follow_up":
    case "archive_learning":
    case "update_mission_feedback":
      return "learning";
    case "close_cycle":
      return "next_mission";
    default:
      return "preparation";
  }
}

export const MISSION_OS_PHASE_ORDER: MissionOSPhase[] = [
  "mission",
  "preparation",
  "manual_execution",
  "report_return",
  "learning",
  "next_mission",
];

export function phaseIndex(phase: MissionOSPhase): number {
  return MISSION_OS_PHASE_ORDER.indexOf(phase);
}
