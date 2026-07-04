import type { HistoryEvent } from "@/modules/history/historyTypes";
import type { Mission, MissionStatus } from "@/modules/missions/missionTypes";
import type { Project, ProjectStatus } from "@/modules/projects/projectTypes";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import {
  MISSION_CATALOG,
  catalogToMission,
} from "@/modules/conversation/missionCatalog";
import type {
  HistoryEventRow,
  HistoryEventTypeRow,
  MissionRow,
  MissionStatusRow,
  ProjectRow,
  ProjectStatusRow,
} from "../types";
import { stableRowId } from "./stableId";

const PROJECT_STATUS_MAP: Record<ProjectStatus, ProjectStatusRow> = {
  active: "active",
  paused: "paused",
  completed: "completed",
  future: "future",
  archived: "archived",
  postponed: "paused",
};

const MISSION_STATUS_MAP: Record<MissionStatus, MissionStatusRow> = {
  recommended: "recommended",
  in_progress: "in_progress",
  completed: "completed",
  postponed: "postponed",
  rejected_for_now: "rejected_for_now",
};

const HISTORY_TYPE_MAP: Partial<Record<HistoryEvent["type"], HistoryEventTypeRow>> = {
  mission_completed: "mission_completed",
  mission_started: "mission_started",
  mission_postponed: "mission_postponed",
  mission_rejected: "mission_rejected",
  decision_created: "decision_made",
  project_updated: "project_updated",
  data_reset: "local_data_imported",
};

function catalogEntryForMission(missionId: string) {
  return MISSION_CATALOG.find((m) => m.id === missionId);
}

export function mapLocalProjectToProjectRow(
  userId: string,
  project: Project
): Partial<ProjectRow> {
  const rowId = stableRowId(project.id, userId, "project");
  const mappedStatus = PROJECT_STATUS_MAP[project.status] ?? "active";

  return {
    id: rowId,
    user_id: userId,
    name: project.name,
    description: project.description ?? null,
    status: mappedStatus,
    priority: project.priority,
    strategic_value: project.strategicValue,
    business_impact: project.businessPotential,
    completion_proximity: project.progress,
    urgency: project.urgency,
    clarity: project.clarity,
    effort_efficiency: project.estimatedEffort,
    risk_of_delay: null,
  };
}

export function mapLocalMissionToMissionRow(
  userId: string,
  mission: Mission,
  projectRowId: string | null
): Partial<MissionRow> {
  const catalog = catalogEntryForMission(mission.id);
  const rowId = stableRowId(mission.id, userId, "mission");
  const mappedStatus = MISSION_STATUS_MAP[mission.status] ?? "available";

  return {
    id: rowId,
    user_id: userId,
    project_id: projectRowId,
    title: mission.title,
    reason: mission.reason ?? null,
    status: mappedStatus,
    score: catalog?.score ?? Math.round(mission.confidence * 10),
    estimated_time: mission.estimatedDuration ?? catalog?.estimatedTime ?? null,
    impact: catalog?.impact ?? null,
    clarity: catalog?.clarity ?? null,
    effort: catalog?.effort ?? null,
    tags: catalog?.tags ?? null,
    completed_at: mission.status === "completed" ? new Date().toISOString() : null,
  };
}

export function mapLocalHistoryEventToHistoryEventRow(
  userId: string,
  event: HistoryEvent
): Partial<HistoryEventRow> {
  const rowId = stableRowId(event.id, userId, "history");
  const mappedType = HISTORY_TYPE_MAP[event.type] ?? "local_data_imported";

  return {
    id: rowId,
    user_id: userId,
    project_id: null,
    mission_id: null,
    type: mappedType,
    title: event.title,
    description: event.description ?? null,
    metadata: {
      local_id: event.id,
      local_type: event.type,
      local_group: event.group,
      local_date: event.date,
    },
    created_at: event.date.includes("T") ? event.date : `${event.date}T12:00:00.000Z`,
  };
}

/** Collects missions worth syncing from local state (active + tracked lists). */
export function collectLocalMissions(state: GigiLocalState): Mission[] {
  const missions: Mission[] = [];
  const seen = new Set<string>();

  const add = (mission: Mission | undefined) => {
    if (!mission || seen.has(mission.id)) return;
    seen.add(mission.id);
    missions.push(mission);
  };

  add(state.mission);

  const trackedIds = [
    ...state.completedMissionIds,
    ...state.postponedMissionIds,
    ...state.rejectedMissionIds,
  ];

  for (const id of trackedIds) {
    const catalog = catalogEntryForMission(id);
    if (catalog) {
      const base = catalogToMission(catalog);
      if (state.completedMissionIds.includes(id)) {
        add({ ...base, status: "completed" });
      } else if (state.postponedMissionIds.includes(id)) {
        add({ ...base, status: "postponed" });
      } else if (state.rejectedMissionIds.includes(id)) {
        add({ ...base, status: "rejected_for_now" });
      } else {
        add(base);
      }
    }
  }

  return missions;
}

export function projectRowIdForLocalProject(localProjectId: string, userId: string): string {
  return stableRowId(localProjectId, userId, "project");
}
