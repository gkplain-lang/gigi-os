import {
  MISSION_CATALOG,
  PROJECT_NAMES,
  PROJECT_STATUS,
  type CatalogMission,
} from "@/modules/conversation/missionCatalog";
import { listAllFollowUpProposals } from "@/modules/followUpActions/followUpActionStore";
import {
  getMissionRecommendationScore,
  listMissionFeedbackSignals,
  regenerateMissionFeedbackFromHistory,
} from "@/modules/missionFeedback";
import { listHistoryEntries } from "@/modules/historyLearning/historyLearningStore";
import type {
  MissionDecisionCandidate,
  MissionDecisionCandidateSource,
  MissionDecisionReason,
  MissionDecisionRisk,
} from "./types";
import { scoreDecisionCandidate } from "./missionDecisionScoring";

function nowIso(): string {
  return new Date().toISOString();
}

function candId(prefix: string): string {
  return `mcand-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export interface CollectCandidatesInput {
  completedMissionIds?: string[];
  currentMissionId?: string;
  currentProjectId?: string;
  projectIdFilter?: string;
  maxCandidates?: number;
}

function catalogToCandidate(
  mission: CatalogMission,
  source: MissionDecisionCandidateSource
): MissionDecisionCandidate {
  const scored = scoreDecisionCandidate({
    missionId: mission.id,
    projectId: mission.projectId,
    title: mission.title,
    description: mission.reason,
    source,
    catalogImpact: mission.impact,
    catalogClarity: mission.clarity,
    subtasks: mission.subtasks,
  });

  return {
    id: candId(mission.id),
    title: mission.title,
    description: mission.reason,
    projectId: mission.projectId,
    missionId: mission.id,
    source,
    score: scored.score,
    confidence: scored.confidence,
    reasons: scored.reasons,
    risks: scored.risks,
    expectedImpact: mission.impact >= 8 ? "Élevé" : mission.impact >= 6 ? "Moyen" : "Modéré",
    suggestedScope: mission.estimatedTime,
    validationChecklist: scored.validationChecklist,
    feedbackScoreId: scored.feedbackScoreId,
    createdAt: nowIso(),
    metadata: {
      projectName: PROJECT_NAMES[mission.projectId] ?? mission.projectId,
      catalogScore: String(mission.score),
    },
  };
}

function followUpToCandidate(
  proposal: ReturnType<typeof listAllFollowUpProposals>[number]
): MissionDecisionCandidate {
  const projectId = proposal.metadata?.projectId ?? "gigi-os";
  const scored = scoreDecisionCandidate({
    missionId: proposal.id,
    projectId,
    title: proposal.title,
    description: proposal.objective,
    source: "follow_up_action",
    isFollowUp: true,
    subtasks: proposal.suggestedSteps,
  });

  return {
    id: candId(proposal.id),
    title: proposal.title,
    description: proposal.objective,
    projectId,
    missionId: proposal.id,
    source: "follow_up_action",
    score: scored.score,
    confidence: scored.confidence,
    reasons: scored.reasons,
    risks: scored.risks,
    expectedImpact: "Suivi",
    suggestedScope: proposal.suggestedSteps[0],
    validationChecklist: scored.validationChecklist,
    createdAt: nowIso(),
    metadata: {
      followUpType: proposal.type,
      projectName: proposal.metadata?.projectName ?? projectId,
    },
  };
}

export function collectMissionCandidates(
  input: CollectCandidatesInput = {}
): MissionDecisionCandidate[] {
  const completed = new Set(input.completedMissionIds ?? []);
  const max = input.maxCandidates ?? 8;

  if (listHistoryEntries().length > 0) {
    regenerateMissionFeedbackFromHistory();
  }

  const pool = MISSION_CATALOG.filter((m) => {
    if (completed.has(m.id)) return false;
    if (input.projectIdFilter && m.projectId !== input.projectIdFilter) return false;
    return true;
  });

  const activeFirst = [...pool].sort((a, b) => {
    const aActive = PROJECT_STATUS[a.projectId] === "active" ? 1 : 0;
    const bActive = PROJECT_STATUS[b.projectId] === "active" ? 1 : 0;
    if (bActive !== aActive) return bActive - aActive;
    return b.score - a.score;
  });

  const candidates: MissionDecisionCandidate[] = [];
  const seen = new Set<string>();

  if (input.currentMissionId && input.currentProjectId) {
    const current = MISSION_CATALOG.find((m) => m.id === input.currentMissionId);
    if (current && !completed.has(current.id)) {
      const c = catalogToCandidate(current, "recommended_mission");
      candidates.push(c);
      seen.add(current.id);
    }
  }

  for (const mission of activeFirst) {
    if (seen.has(mission.id)) continue;
    if (candidates.length >= max) break;
    candidates.push(catalogToCandidate(mission, "project_mission"));
    seen.add(mission.id);
  }

  const followUps = listAllFollowUpProposals()
    .filter((p) => p.status !== "dismissed" && p.status !== "added_to_queue")
    .slice(0, 2);

  for (const proposal of followUps) {
    if (candidates.length >= max + 2) break;
    candidates.push(followUpToCandidate(proposal));
  }

  return candidates.sort((a, b) => b.score - a.score);
}

export function buildRecommendationSummary(
  candidates: MissionDecisionCandidate[]
): string {
  if (candidates.length === 0) {
    return "Aucune mission candidate disponible — complète l'historique ou explore les projets.";
  }
  const top = candidates[0];
  const projectName = top.metadata?.projectName ?? top.projectId ?? "projet";
  return `Gigi recommande « ${top.title} » (${top.score}/100) pour ${projectName} — score indicatif basé sur l'historique local.`;
}

export function shouldNeedClarification(candidate: MissionDecisionCandidate): boolean {
  return (
    candidate.score < 40 ||
    candidate.risks.some((r) => r.severity === "critical") ||
    candidate.reasons.some((r) => r.type === "too_vague") ||
    candidate.validationChecklist.length === 0
  );
}

export function createDecisionId(dateStr?: string): string {
  const date = dateStr ?? new Date().toISOString().slice(0, 10);
  return `mdec-${date}-${Date.now()}`;
}

export function enrichCandidateWithSignals(
  candidate: MissionDecisionCandidate
): MissionDecisionCandidate {
  const signals = listMissionFeedbackSignals(
    candidate.projectId ? { projectId: candidate.projectId } : undefined
  );
  if (signals.length === 0) return candidate;

  const extraReasons: MissionDecisionReason[] = [...candidate.reasons];
  const extraRisks: MissionDecisionRisk[] = [...candidate.risks];

  for (const sig of signals.slice(0, 3)) {
    if (sig.type === "unblocker" && !extraReasons.some((r) => r.type === "unblocker")) {
      extraReasons.push({
        id: `mreason-${sig.id}`,
        type: "unblocker",
        label: sig.label,
        description: sig.description,
        weight: 15,
        severity: "positive",
        relatedSignalId: sig.id,
      });
    }
    if (sig.type === "recurring_blocker" && !extraRisks.some((r) => r.label.includes("Blocage"))) {
      extraRisks.push({
        id: `mrisk-${sig.id}`,
        label: "Blocage récurrent",
        description: sig.description,
        severity: "critical",
        mitigation: "Clarifier le critère de déblocage avant de lancer.",
      });
    }
  }

  const feedback = candidate.missionId
    ? getMissionRecommendationScore(candidate.missionId)
    : undefined;

  return {
    ...candidate,
    reasons: extraReasons,
    risks: extraRisks,
    confidence: feedback?.confidence ?? candidate.confidence,
    feedbackScoreId: feedback?.missionId,
  };
}
