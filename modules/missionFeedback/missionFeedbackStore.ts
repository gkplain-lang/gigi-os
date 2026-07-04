import type {
  ManualMissionFeedback,
  MissionFeedbackSignal,
  MissionFeedbackState,
  MissionRecommendationScore,
} from "./types";
import { MISSION_FEEDBACK_STORAGE_KEY, MISSION_FEEDBACK_VERSION } from "./types";

export function createEmptyMissionFeedbackState(): MissionFeedbackState {
  return {
    signals: [],
    scores: [],
    manualFeedback: [],
    version: MISSION_FEEDBACK_VERSION,
  };
}

export function loadMissionFeedbackState(): MissionFeedbackState {
  if (typeof window === "undefined") return createEmptyMissionFeedbackState();
  try {
    const raw = localStorage.getItem(MISSION_FEEDBACK_STORAGE_KEY);
    if (!raw) return createEmptyMissionFeedbackState();
    const parsed = JSON.parse(raw) as MissionFeedbackState;
    if (!parsed || !Array.isArray(parsed.signals) || !Array.isArray(parsed.scores)) {
      return createEmptyMissionFeedbackState();
    }
    return {
      ...createEmptyMissionFeedbackState(),
      ...parsed,
      manualFeedback: Array.isArray(parsed.manualFeedback) ? parsed.manualFeedback : [],
      version: MISSION_FEEDBACK_VERSION,
    };
  } catch {
    return createEmptyMissionFeedbackState();
  }
}

export function saveMissionFeedbackState(state: MissionFeedbackState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MISSION_FEEDBACK_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function listMissionFeedbackSignals(filters?: {
  projectId?: string;
  missionId?: string;
}): MissionFeedbackSignal[] {
  let signals = loadMissionFeedbackState().signals;
  if (filters?.projectId) {
    signals = signals.filter((s) => s.projectId === filters.projectId);
  }
  if (filters?.missionId) {
    signals = signals.filter((s) => s.missionId === filters.missionId);
  }
  return signals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listMissionRecommendationScores(filters?: {
  projectId?: string;
}): MissionRecommendationScore[] {
  let scores = loadMissionFeedbackState().scores;
  if (filters?.projectId) {
    scores = scores.filter((s) => s.projectId === filters.projectId);
  }
  return scores.sort((a, b) => b.score - a.score);
}

export function getMissionRecommendationScore(
  missionId: string
): MissionRecommendationScore | undefined {
  return loadMissionFeedbackState().scores.find((s) => s.missionId === missionId);
}

export function addManualMissionFeedback(feedback: ManualMissionFeedback): ManualMissionFeedback {
  const state = loadMissionFeedbackState();
  const next: MissionFeedbackState = {
    ...state,
    manualFeedback: [feedback, ...state.manualFeedback],
  };
  saveMissionFeedbackState(next);
  return feedback;
}

export function replaceMissionFeedbackState(partial: {
  signals: MissionFeedbackSignal[];
  scores: MissionRecommendationScore[];
}): MissionFeedbackState {
  const state = loadMissionFeedbackState();
  const next: MissionFeedbackState = {
    ...state,
    signals: partial.signals,
    scores: partial.scores,
    generatedAt: new Date().toISOString(),
    version: MISSION_FEEDBACK_VERSION,
  };
  saveMissionFeedbackState(next);
  return next;
}
