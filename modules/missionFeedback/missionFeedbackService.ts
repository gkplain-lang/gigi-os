import { MISSION_CATALOG } from "@/modules/conversation/missionCatalog";
import { listHistoryEntries } from "@/modules/historyLearning/historyLearningStore";
import { buildSignalsFromHistory, createManualFeedbackId } from "./missionFeedbackEngine";
import {
  formatGlobalMissionFeedbackForCopy,
  formatMissionFeedbackForCopy,
} from "./missionFeedbackFormatter";
import {
  MISSION_FEEDBACK_EMPTY_SUMMARY,
  MISSION_FEEDBACK_GUIDANCE,
} from "./missionFeedbackSummary";
import {
  addManualMissionFeedback,
  getMissionRecommendationScore,
  listMissionFeedbackSignals,
  listMissionRecommendationScores,
  loadMissionFeedbackState,
  replaceMissionFeedbackState,
} from "./missionFeedbackStore";
import { getTopScoredMission, scoreAllMissions, scoreMissionFromSignals } from "./missionFeedbackScoring";
import type {
  ManualMissionFeedback,
  ManualMissionFeedbackSentiment,
  MissionFeedbackGlobalSummary,
  MissionFeedbackIntent,
  MissionRecommendationScore,
  ScoreableMission,
} from "./types";
import { MISSION_FEEDBACK_DISCLAIMER } from "./types";

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

const MISSION_FEEDBACK_KEYWORDS = [
  "pourquoi cette mission",
  "quelle mission je dois faire",
  "qu est ce qui debloque",
  "débloque le plus",
  "debloque le plus",
  "evite les missions floues",
  "évite les missions floues",
  "ameliore les recommandations",
  "améliore les recommandations",
  "appris pour choisir la mission",
  "quelle mission du jour",
  "mission du jour",
  "feedback mission",
  "recommandation mission",
];

export function detectMissionFeedbackIntent(objective: string): MissionFeedbackIntent {
  const norm = normalize(objective);
  const isMissionFeedback = MISSION_FEEDBACK_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isMissionFeedback, projectId: detectProjectId(norm) };
}

export function getDefaultScoreableMissions(projectId?: string): ScoreableMission[] {
  const pool = projectId
    ? MISSION_CATALOG.filter((m) => m.projectId === projectId)
    : MISSION_CATALOG;
  return pool.map((m) => ({
    missionId: m.id,
    projectId: m.projectId,
    title: m.title,
  }));
}

export function toScoreableMission(
  missionId: string,
  projectId: string,
  title: string
): ScoreableMission {
  return { missionId, projectId, title };
}

export function regenerateMissionFeedbackFromHistory(
  missions?: ScoreableMission[]
): { signals: ReturnType<typeof buildSignalsFromHistory>; scores: MissionRecommendationScore[] } {
  const state = loadMissionFeedbackState();
  const pool = missions ?? getDefaultScoreableMissions();
  const signals = buildSignalsFromHistory(pool, state.manualFeedback);
  const scores = scoreAllMissions(pool, signals);
  replaceMissionFeedbackState({ signals, scores });
  return { signals, scores };
}

export function getMissionScoreForId(
  missionId: string,
  projectId: string,
  title: string
): MissionRecommendationScore | undefined {
  const existing = getMissionRecommendationScore(missionId);
  if (existing) return existing;

  const signals = listMissionFeedbackSignals();
  if (signals.length === 0 && listHistoryEntries().length === 0) {
    return undefined;
  }
  if (signals.length === 0) {
    regenerateMissionFeedbackFromHistory(getDefaultScoreableMissions());
    return getMissionRecommendationScore(missionId);
  }

  return scoreMissionFromSignals(toScoreableMission(missionId, projectId, title), signals);
}

export function addManualMissionFeedbackNote(
  note: string,
  sentiment: ManualMissionFeedbackSentiment,
  options?: { missionId?: string; projectId?: string }
): ManualMissionFeedback {
  const feedback: ManualMissionFeedback = {
    id: createManualFeedbackId(),
    note,
    sentiment,
    missionId: options?.missionId,
    projectId: options?.projectId,
    createdAt: new Date().toISOString(),
  };
  addManualMissionFeedback(feedback);
  regenerateMissionFeedbackFromHistory();
  return feedback;
}

export function generateGlobalMissionFeedbackSummary(
  projectId?: string
): MissionFeedbackGlobalSummary {
  const signals = listMissionFeedbackSignals(projectId ? { projectId } : undefined);
  const scores = listMissionRecommendationScores(projectId ? { projectId } : undefined);

  if (signals.length === 0 && scores.length === 0) {
    return {
      totalSignals: 0,
      totalScores: 0,
      recurringBlockers: [],
      summaryText: MISSION_FEEDBACK_EMPTY_SUMMARY,
    };
  }

  const top = getTopScoredMission(scores);
  const topMission = top
    ? MISSION_CATALOG.find((m) => m.id === top.missionId)
    : undefined;
  const recurringBlockers = signals
    .filter((s) => s.type === "recurring_blocker")
    .map((s) => s.label);

  const parts = [
    `${signals.length} signal(aux) local(aux)`,
    `${scores.length} score(s) mission`,
    top ? `meilleur score : ${top.score}/100` : null,
  ].filter(Boolean);

  return {
    totalSignals: signals.length,
    totalScores: scores.length,
    topRecommendedMissionId: top?.missionId,
    topRecommendedTitle: topMission?.title,
    recurringBlockers,
    summaryText: parts.join(", ") + ".",
  };
}

export function getCopyableMissionFeedbackText(
  missionTitle: string,
  score: MissionRecommendationScore
): string {
  return formatMissionFeedbackForCopy(missionTitle, score);
}

export function getCopyableGlobalMissionFeedbackText(projectId?: string): string {
  const scores = listMissionRecommendationScores(projectId ? { projectId } : undefined);
  const summary = generateGlobalMissionFeedbackSummary(projectId);
  const titles = Object.fromEntries(MISSION_CATALOG.map((m) => [m.id, m.title]));
  return formatGlobalMissionFeedbackForCopy(summary.summaryText, scores, titles);
}

export function buildMissionFeedbackGuidanceHints(objective: string): string[] {
  const hints = [...MISSION_FEEDBACK_GUIDANCE];
  if (/flou|clarif/.test(objective.toLowerCase())) {
    hints.push("Les missions « needs_clarification » demandent un résultat attendu explicite.");
  }
  if (/debloque|débloque|prior/.test(objective.toLowerCase())) {
    hints.push("Consulte les signaux « unblocker » sur la page projet.");
  }
  return hints;
}

export function getBestDailyMissionRecommendation(
  completedMissionIds: string[] = []
): MissionRecommendationScore | undefined {
  const pool = getDefaultScoreableMissions().filter(
    (m) => !completedMissionIds.includes(m.missionId)
  );
  if (pool.length === 0) return undefined;

  const state = loadMissionFeedbackState();
  if (state.scores.length === 0) {
    regenerateMissionFeedbackFromHistory(pool);
  }

  const scores = listMissionRecommendationScores().filter(
    (s) => !completedMissionIds.includes(s.missionId)
  );
  return getTopScoredMission(scores);
}

export {
  listMissionFeedbackSignals,
  listMissionRecommendationScores,
  getMissionRecommendationScore,
  MISSION_FEEDBACK_DISCLAIMER,
  MISSION_FEEDBACK_GUIDANCE,
};
