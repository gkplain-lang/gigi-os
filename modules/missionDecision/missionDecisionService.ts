import {
  buildRecommendationSummary,
  collectMissionCandidates,
  createDecisionId,
  enrichCandidateWithSignals,
  shouldNeedClarification,
  type CollectCandidatesInput,
} from "./missionDecisionEngine";
import {
  formatMissionDecisionForCopy,
  formatMissionDecisionHistoryForCopy,
} from "./missionDecisionFormatter";
import {
  MISSION_DECISION_EMPTY_SUMMARY,
  MISSION_DECISION_GUIDANCE,
} from "./missionDecisionSummary";
import {
  archiveMissionDecision,
  getCurrentMissionDecision,
  getMissionDecisionById,
  getTodayMissionDecision,
  listMissionDecisions,
  upsertMissionDecision,
} from "./missionDecisionStore";
import type {
  MissionDecision,
  MissionDecisionGlobalSummary,
  MissionDecisionIntent,
  MissionDecisionStatus,
} from "./types";
import { MISSION_DECISION_DISCLAIMER } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectId(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const MISSION_DECISION_KEYWORDS = [
  "quelle mission je fais aujourd hui",
  "quelle mission aujourd hui",
  "choisis la mission du jour",
  "compare les missions",
  "je valide cette mission",
  "je refuse cette mission",
  "reporte cette mission",
  "centre de decision",
  "centre de décision",
  "mission decision",
  "decision du jour",
  "decision mission",
  "cette mission est trop floue",
];

export function detectMissionDecisionIntent(objective: string): MissionDecisionIntent {
  const norm = normalize(objective);
  const isMissionDecision = MISSION_DECISION_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isMissionDecision, projectId: detectProjectId(norm) };
}

export function generateDailyMissionDecision(
  input: CollectCandidatesInput = {},
  forceRegenerate = false
): MissionDecision {
  const today = new Date().toISOString().slice(0, 10);
  const existing = getTodayMissionDecision(today);

  if (existing && !forceRegenerate && existing.status !== "draft") {
    return existing;
  }

  const rawCandidates = collectMissionCandidates(input);
  const candidates = rawCandidates.map(enrichCandidateWithSignals);
  const top = candidates[0];
  const timestamp = new Date().toISOString();

  let status: MissionDecisionStatus = "recommended";
  if (top && shouldNeedClarification(top)) {
    status = "needs_clarification";
  }
  if (candidates.length === 0) {
    status = "draft";
  }

  const decision: MissionDecision = {
    id: existing?.id ?? createDecisionId(today),
    date: today,
    status,
    candidates,
    selectedCandidateId: top?.id,
    recommendationSummary: buildRecommendationSummary(candidates),
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    userNote: existing?.userNote,
  };

  return upsertMissionDecision(decision);
}

function updateDecisionChoice(
  decisionId: string,
  status: MissionDecisionStatus,
  candidateId?: string,
  userNote?: string
): MissionDecision | undefined {
  const decision = getMissionDecisionById(decisionId);
  if (!decision) return undefined;

  const candidate = candidateId
    ? decision.candidates.find((c) => c.id === candidateId)
    : decision.candidates.find((c) => c.id === decision.selectedCandidateId);

  const timestamp = new Date().toISOString();
  return upsertMissionDecision({
    ...decision,
    status,
    selectedCandidateId: candidate?.id ?? decision.selectedCandidateId,
    finalUserChoice: candidate?.title,
    userNote: userNote ?? decision.userNote,
    updatedAt: timestamp,
    decidedAt: timestamp,
  });
}

export function acceptMissionCandidate(
  decisionId: string,
  candidateId: string,
  userNote?: string
): MissionDecision | undefined {
  return updateDecisionChoice(decisionId, "accepted", candidateId, userNote);
}

export function rejectMissionCandidate(
  decisionId: string,
  candidateId?: string,
  userNote?: string
): MissionDecision | undefined {
  return updateDecisionChoice(decisionId, "rejected", candidateId, userNote);
}

export function postponeMissionCandidate(
  decisionId: string,
  candidateId?: string,
  userNote?: string
): MissionDecision | undefined {
  return updateDecisionChoice(decisionId, "postponed", candidateId, userNote);
}

export function clarifyMissionCandidate(
  decisionId: string,
  candidateId?: string,
  userNote?: string
): MissionDecision | undefined {
  return updateDecisionChoice(decisionId, "needs_clarification", candidateId, userNote);
}

export function markDecisionConvertedToPlan(decisionId: string): MissionDecision | undefined {
  const decision = getMissionDecisionById(decisionId);
  if (!decision) return undefined;
  const timestamp = new Date().toISOString();
  return upsertMissionDecision({
    ...decision,
    status: "converted_to_plan",
    updatedAt: timestamp,
  });
}

export function addUserNoteToDecision(
  decisionId: string,
  note: string
): MissionDecision | undefined {
  const decision = getMissionDecisionById(decisionId);
  if (!decision) return undefined;
  return upsertMissionDecision({
    ...decision,
    userNote: note,
    updatedAt: new Date().toISOString(),
  });
}

export function generateGlobalDecisionSummary(): MissionDecisionGlobalSummary {
  const decisions = listMissionDecisions();
  if (decisions.length === 0) {
    return {
      totalDecisions: 0,
      acceptedCount: 0,
      summaryText: MISSION_DECISION_EMPTY_SUMMARY,
    };
  }

  const acceptedCount = decisions.filter((d) => d.status === "accepted").length;
  const latest = decisions[0];
  const recentChoice =
    latest.finalUserChoice ??
    latest.candidates.find((c) => c.id === latest.selectedCandidateId)?.title;

  return {
    totalDecisions: decisions.length,
    acceptedCount,
    recentChoice,
    summaryText: `${decisions.length} décision(s), ${acceptedCount} acceptée(s)${recentChoice ? ` — dernière : ${recentChoice}` : ""}.`,
  };
}

export function getCopyableDecisionText(decision: MissionDecision): string {
  return formatMissionDecisionForCopy(decision);
}

export function getCopyableDecisionHistoryText(): string {
  return formatMissionDecisionHistoryForCopy(listMissionDecisions(10));
}

export function buildMissionDecisionGuidanceHints(objective: string): string[] {
  const hints = [...MISSION_DECISION_GUIDANCE];
  if (/compare|choix|candidate/.test(objective.toLowerCase())) {
    hints.push("Ouvre la page Mission (/) pour comparer les candidates côte à côte.");
  }
  if (/plan|action|transforme/.test(objective.toLowerCase())) {
    hints.push("« Transformer en plan » deep-link vers le projet — aucune exécution auto.");
  }
  return hints;
}

export function getRecommendedCandidateTitle(decision: MissionDecision): string | undefined {
  const id = decision.selectedCandidateId ?? decision.candidates[0]?.id;
  return decision.candidates.find((c) => c.id === id)?.title;
}

export {
  getCurrentMissionDecision,
  getTodayMissionDecision,
  listMissionDecisions,
  archiveMissionDecision,
  MISSION_DECISION_DISCLAIMER,
  MISSION_DECISION_GUIDANCE,
};
