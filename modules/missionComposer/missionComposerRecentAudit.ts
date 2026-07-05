import { loadExecutionReadinessState } from "@/modules/executionReadiness/executionReadinessStore";
import { listProjectMissionCandidates } from "./missionComposerBuilder";
import type { MissionComposerAuditType } from "./missionComposerTypes";

export const MISSION_COMPOSER_AUDIT_LABELS: Record<MissionComposerAuditType, string> = {
  mission_candidate_created: "Candidate créée",
  daily_priority_selected: "Mission du jour choisie",
  mission_converted_to_guided_flow: "→ Parcours guidé",
  daily_priority_completed_by_human: "Terminée (humain)",
  daily_priority_cancelled: "Annulée",
  mission_candidate_status_change: "Statut candidate",
};

export interface MissionComposerAuditEvent {
  entryId: string;
  at: string;
  type: MissionComposerAuditType;
  message: string;
  title: string;
  projectName?: string;
}

export function getRecentMissionComposerAudit(limit = 8): MissionComposerAuditEvent[] {
  const candidates = listProjectMissionCandidates();
  const daily = loadExecutionReadinessState().dailyPriorityMissions ?? [];

  const events: MissionComposerAuditEvent[] = [];

  for (const c of candidates) {
    for (const e of c.auditTrail) {
      events.push({
        entryId: e.id,
        at: e.at,
        type: e.type,
        message: e.message,
        title: c.title,
        projectName: c.projectName,
      });
    }
  }

  for (const d of daily) {
    for (const e of d.auditTrail) {
      events.push({
        entryId: e.id,
        at: e.at,
        type: e.type,
        message: e.message,
        title: d.title,
        projectName: d.projectName,
      });
    }
  }

  return events
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}
