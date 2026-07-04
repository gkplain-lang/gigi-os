import { MISSION_CATALOG, PROJECT_NAMES } from "../conversation/missionCatalog";
import { buildExecutionSnapshot } from "../missionExecution/executionState";
import type { GigiLocalState } from "../storage/gigiStateTypes";
import type { HistoryEvent } from "../history/historyTypes";
import {
  filterRecentEvents,
  filterTodayEvents,
  filterYesterdayEvents,
} from "./reviewWindow";
import type { DailyReviewMissionRef } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

const DAILY_REVIEW_KEYWORDS = [
  "revue du jour",
  "daily review",
  "fais ma revue",
  "fait ma revue",
  "mon bilan",
  "bilan",
  "review",
  "ou j en suis",
  "où j'en suis",
  "point sur",
  "recap",
  "récap",
];

const TODAY_FOCUS_KEYWORDS = [
  "qu est ce que je dois faire aujourd hui",
  "que faire aujourd hui",
  "quoi faire aujourd hui",
  "je fais quoi aujourd hui",
  "prioritaire aujourd hui",
];

export function isDailyReviewRequest(message: string): boolean {
  const norm = normalize(message);
  return (
    DAILY_REVIEW_KEYWORDS.some((k) => norm.includes(normalize(k))) ||
    TODAY_FOCUS_KEYWORDS.some((k) => norm.includes(normalize(k)))
  );
}

export function isExplicitDailyReviewRequest(message: string): boolean {
  const norm = normalize(message);
  return DAILY_REVIEW_KEYWORDS.some((k) => norm.includes(normalize(k)));
}

function missionRefFromCatalog(missionId: string): DailyReviewMissionRef | null {
  const catalog = MISSION_CATALOG.find((m) => m.id === missionId);
  if (!catalog) return null;
  return {
    missionId: catalog.id,
    title: catalog.title,
    projectId: catalog.projectId,
    projectName: PROJECT_NAMES[catalog.projectId] ?? catalog.projectId,
  };
}

function missionRefFromEvent(event: HistoryEvent): DailyReviewMissionRef | null {
  if (event.meta?.missionId) {
    const fromCatalog = missionRefFromCatalog(event.meta.missionId);
    if (fromCatalog) return fromCatalog;
  }
  if (event.meta?.projectId) {
    return {
      missionId: event.meta.missionId ?? event.id,
      title: event.title.replace(/^Mission (terminée|démarrée|reportée|refusée)\s*:\s*/i, ""),
      projectId: event.meta.projectId,
      projectName: event.meta.projectName ?? PROJECT_NAMES[event.meta.projectId] ?? event.meta.projectId,
    };
  }
  return null;
}

export function collectCompletedRecent(state: GigiLocalState): DailyReviewMissionRef[] {
  const recent = filterRecentEvents(state.history ?? []);
  const seen = new Set<string>();
  const result: DailyReviewMissionRef[] = [];

  for (const event of recent) {
    if (event.type !== "mission_completed") continue;
    const ref = missionRefFromEvent(event);
    if (!ref || seen.has(ref.missionId)) continue;
    seen.add(ref.missionId);
    result.push(ref);
  }

  for (const id of state.completedMissionIds ?? []) {
    if (seen.has(id)) continue;
    const ref = missionRefFromCatalog(id);
    if (ref) {
      seen.add(id);
      result.push(ref);
    }
  }

  return result.slice(0, 5);
}

export function collectPostponedRecent(state: GigiLocalState): DailyReviewMissionRef[] {
  const ids = new Set(state.postponedMissionIds ?? []);
  const fromHistory = filterRecentEvents(state.history ?? [])
    .filter((e) => e.type === "mission_postponed")
    .map(missionRefFromEvent)
    .filter((r): r is DailyReviewMissionRef => r !== null);

  const merged = new Map<string, DailyReviewMissionRef>();
  for (const id of ids) {
    const ref = missionRefFromCatalog(id);
    if (ref) merged.set(ref.missionId, ref);
  }
  for (const ref of fromHistory) merged.set(ref.missionId, ref);
  return [...merged.values()].slice(0, 5);
}

export function collectDismissedRecent(state: GigiLocalState): DailyReviewMissionRef[] {
  const ids = new Set(state.rejectedMissionIds ?? []);
  const fromHistory = filterRecentEvents(state.history ?? [])
    .filter((e) => e.type === "mission_rejected")
    .map(missionRefFromEvent)
    .filter((r): r is DailyReviewMissionRef => r !== null);

  const merged = new Map<string, DailyReviewMissionRef>();
  for (const id of ids) {
    const ref = missionRefFromCatalog(id);
    if (ref) merged.set(ref.missionId, ref);
  }
  for (const ref of fromHistory) merged.set(ref.missionId, ref);
  return [...merged.values()].slice(0, 5);
}

export function countProjectSwitches(events: HistoryEvent[]): number {
  const recent = filterRecentEvents(events);
  const projectIds = new Set<string>();
  for (const event of recent) {
    if (event.meta?.projectId) projectIds.add(event.meta.projectId);
  }
  return projectIds.size;
}

export function hasRecentCompletion(state: GigiLocalState): boolean {
  const today = filterTodayEvents(state.history ?? []);
  const yesterday = filterYesterdayEvents(state.history ?? []);
  return (
    today.some((e) => e.type === "mission_completed") ||
    yesterday.some((e) => e.type === "mission_completed") ||
    collectCompletedRecent(state).length > 0
  );
}

export function getActiveMissionRef(state: GigiLocalState): DailyReviewMissionRef | null {
  const snapshot = buildExecutionSnapshot(state);
  if (snapshot.phase !== "active") return null;
  return {
    missionId: snapshot.missionId,
    title: snapshot.missionTitle,
    projectId: snapshot.projectId,
    projectName: snapshot.projectName,
  };
}

export function inferProjectIdFromEvent(event: HistoryEvent): string | null {
  if (event.meta?.projectId) return event.meta.projectId;
  const norm = normalize(event.title);
  for (const [id, name] of Object.entries(PROJECT_NAMES)) {
    if (norm.includes(normalize(name))) return id;
  }
  return null;
}
