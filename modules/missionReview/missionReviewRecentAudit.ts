import { listDailyMissionReviews } from "./missionReviewBuilder";
import type { MissionReviewAuditType } from "./missionReviewTypes";

export const MISSION_REVIEW_AUDIT_LABELS: Record<MissionReviewAuditType, string> = {
  mission_review_created: "Revue créée",
  mission_review_updated: "Revue mise à jour",
  mission_review_completed_by_human: "Terminée (humain)",
  mission_review_continued: "Continuer",
  mission_review_pivoted: "Pivoter",
  mission_review_cancelled: "Annulée",
};

export interface MissionReviewAuditEvent {
  entryId: string;
  at: string;
  type: MissionReviewAuditType;
  message: string;
  title: string;
  missionTitle: string;
}

export function getRecentMissionReviewAudit(limit = 8): MissionReviewAuditEvent[] {
  const reviews = listDailyMissionReviews();
  const events: MissionReviewAuditEvent[] = [];

  for (const r of reviews) {
    for (const e of r.auditTrail) {
      events.push({
        entryId: e.id,
        at: e.at,
        type: e.type,
        message: e.message,
        title: r.title,
        missionTitle: r.missionTitle,
      });
    }
  }

  return events.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}