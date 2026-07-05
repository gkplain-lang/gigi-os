import {
  loadExecutionReadinessState,
  saveExecutionReadinessState,
} from "@/modules/executionReadiness/executionReadinessStore";
import { createGuidedFlowFromMission } from "@/modules/executionExperience/guidedActionBuilder";
import type { GuidedProjectActionFlow } from "@/modules/executionExperience/guidedActionTypes";
import { scoreMissionCandidate } from "./missionComposerScoring";
import { getMissionComposerTemplate } from "./missionComposerTemplates";
import type {
  DailyPriorityMission,
  DailyPriorityMissionStatus,
  MissionComposerAuditEntry,
  MissionComposerAuditType,
  ProjectMissionCandidate,
  MissionCandidateStatus,
} from "./missionComposerTypes";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function audit(
  type: MissionComposerAuditType,
  message: string
): MissionComposerAuditEntry {
  return { id: newId("mc-audit"), at: nowIso(), type, message };
}

function saveState(
  candidates: ProjectMissionCandidate[],
  daily: DailyPriorityMission[]
): void {
  const state = loadExecutionReadinessState();
  saveExecutionReadinessState({
    ...state,
    projectMissionCandidates: candidates,
    dailyPriorityMissions: daily,
    lastUpdatedAt: nowIso(),
  });
}

function getCandidates(): ProjectMissionCandidate[] {
  return loadExecutionReadinessState().projectMissionCandidates ?? [];
}

function getDailyMissions(): DailyPriorityMission[] {
  return loadExecutionReadinessState().dailyPriorityMissions ?? [];
}

export function listProjectMissionCandidates(limit?: number): ProjectMissionCandidate[] {
  const sorted = [...getCandidates()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function listActiveMissionCandidates(limit?: number): ProjectMissionCandidate[] {
  const active = listProjectMissionCandidates().filter(
    (c) => !["dismissed", "archived", "converted_to_guided_flow"].includes(c.status)
  );
  return limit ? active.slice(0, limit) : active;
}

export function listMissionCandidatesByProject(projectId: string): ProjectMissionCandidate[] {
  return listActiveMissionCandidates().filter((c) => c.projectId === projectId);
}

export function getMissionCandidateById(id: string): ProjectMissionCandidate | undefined {
  return getCandidates().find((c) => c.id === id);
}

export function getDailyPriorityMissionById(id: string): DailyPriorityMission | undefined {
  return getDailyMissions().find((d) => d.id === id);
}

export function getActiveDailyPriorityMission(): DailyPriorityMission | undefined {
  return getDailyMissions().find(
    (d) => !["completed_by_human", "cancelled"].includes(d.status)
  );
}

export interface CreateMissionCandidateInput {
  projectId: string;
  projectName: string;
  templateId: string;
}

export function createMissionCandidateFromProject(
  input: CreateMissionCandidateInput
): ProjectMissionCandidate {
  const template = getMissionComposerTemplate(input.templateId);
  if (!template) {
    throw new Error(`Unknown mission template: ${input.templateId}`);
  }

  const now = nowIso();
  const priorityScore = scoreMissionCandidate({
    urgency: template.urgency,
    impact: template.impact,
    effort: template.effort,
  });

  const candidate: ProjectMissionCandidate = {
    id: newId("mc-candidate"),
    projectId: input.projectId,
    projectName: input.projectName,
    title: template.title,
    description: template.description,
    outcome: template.outcome,
    reason: template.reason,
    priorityScore,
    urgency: template.urgency,
    impact: template.impact,
    effort: template.effort,
    riskLevel: template.riskLevel,
    category: template.category,
    suggestedGuidedActionTemplateId: template.suggestedGuidedActionTemplateId,
    suggestedRoute: template.suggestedRoute,
    createdAt: now,
    updatedAt: now,
    source: "template",
    status: "suggested",
    auditTrail: [
      audit(
        "mission_candidate_created",
        `Mission candidate créée depuis « ${template.title} » pour ${input.projectName} — action explicite.`
      ),
    ],
  };

  const candidates = [candidate, ...getCandidates()];
  saveState(candidates, getDailyMissions());
  return candidate;
}

export function createMissionCandidatesFromProjects(
  projects: Array<{ id: string; name: string }>,
  templateId: string
): ProjectMissionCandidate[] {
  return projects.map((p) =>
    createMissionCandidateFromProject({
      projectId: p.id,
      projectName: p.name,
      templateId,
    })
  );
}

export function updateMissionCandidateStatus(
  candidateId: string,
  status: MissionCandidateStatus
): ProjectMissionCandidate | undefined {
  const candidates = getCandidates();
  const idx = candidates.findIndex((c) => c.id === candidateId);
  if (idx === -1) return undefined;

  const now = nowIso();
  const updated: ProjectMissionCandidate = {
    ...candidates[idx],
    status,
    updatedAt: now,
    auditTrail: [
      ...candidates[idx].auditTrail,
      audit("mission_candidate_status_change", `Statut → ${status}`),
    ],
  };
  candidates[idx] = updated;
  saveState(candidates, getDailyMissions());
  return updated;
}

export function selectDailyPriorityMission(candidateId: string): DailyPriorityMission | undefined {
  const candidate = getMissionCandidateById(candidateId);
  if (!candidate) return undefined;

  const now = nowIso();
  const dailyMissions = getDailyMissions().map((d) => {
    if (["completed_by_human", "cancelled"].includes(d.status)) return d;
    return {
      ...d,
      status: "cancelled" as DailyPriorityMissionStatus,
      auditTrail: [
        ...d.auditTrail,
        audit("daily_priority_cancelled", "Remplacée par une nouvelle mission du jour."),
      ],
    };
  });

  const daily: DailyPriorityMission = {
    id: newId("mc-daily"),
    missionCandidateId: candidate.id,
    projectId: candidate.projectId,
    projectName: candidate.projectName,
    title: candidate.title,
    description: candidate.description,
    outcome: candidate.outcome,
    selectedReason: candidate.reason,
    selectedAt: now,
    status: "selected",
    auditTrail: [
      audit(
        "daily_priority_selected",
        `Mission du jour choisie : « ${candidate.title} » — ${candidate.projectName}.`
      ),
    ],
  };

  const candidates = getCandidates().map((c) => {
    if (c.id === candidateId) {
      return {
        ...c,
        status: "selected_for_today" as MissionCandidateStatus,
        updatedAt: now,
        auditTrail: [
          ...c.auditTrail,
          audit("mission_candidate_status_change", "Statut → selected_for_today"),
        ],
      };
    }
    if (c.status === "selected_for_today") {
      return {
        ...c,
        status: "shortlisted" as MissionCandidateStatus,
        updatedAt: now,
        auditTrail: [
          ...c.auditTrail,
          audit("mission_candidate_status_change", "Statut → shortlisted"),
        ],
      };
    }
    return c;
  });

  saveState(candidates, [daily, ...dailyMissions]);
  return daily;
}

export function updateDailyPriorityMissionStatus(
  dailyId: string,
  status: DailyPriorityMissionStatus
): DailyPriorityMission | undefined {
  const dailyMissions = getDailyMissions();
  const idx = dailyMissions.findIndex((d) => d.id === dailyId);
  if (idx === -1) return undefined;

  const auditType: MissionComposerAuditType =
    status === "completed_by_human"
      ? "daily_priority_completed_by_human"
      : status === "cancelled"
        ? "daily_priority_cancelled"
        : status === "converted_to_guided_flow"
          ? "mission_converted_to_guided_flow"
          : "daily_priority_selected";

  const updated: DailyPriorityMission = {
    ...dailyMissions[idx],
    status,
    auditTrail: [
      ...dailyMissions[idx].auditTrail,
      audit(auditType, `Statut mission du jour → ${status}`),
    ],
  };
  dailyMissions[idx] = updated;
  saveState(getCandidates(), dailyMissions);
  return updated;
}

export interface ConvertMissionResult {
  flow: GuidedProjectActionFlow;
  daily?: DailyPriorityMission;
  candidate?: ProjectMissionCandidate;
}

export function convertMissionToGuidedActionFlow(
  candidateId?: string,
  dailyId?: string
): ConvertMissionResult | undefined {
  const candidate = candidateId ? getMissionCandidateById(candidateId) : undefined;
  const daily = dailyId
    ? getDailyPriorityMissionById(dailyId)
    : candidate
      ? getActiveDailyPriorityMission()
      : getActiveDailyPriorityMission();

  const missionId = daily?.missionCandidateId ?? candidate?.id ?? daily?.id;
  const title = daily?.title ?? candidate?.title;
  if (!missionId || !title) return undefined;

  const projectId = daily?.projectId ?? candidate?.projectId;
  const projectName = daily?.projectName ?? candidate?.projectName;
  const templateId =
    candidate?.suggestedGuidedActionTemplateId ?? undefined;

  const flow = createGuidedFlowFromMission(
    missionId,
    title,
    projectId,
    projectName,
    templateId
  );

  const now = nowIso();
  let updatedCandidate = candidate;
  let updatedDaily = daily;

  const candidates = getCandidates().map((c) => {
    if (c.id === (candidate?.id ?? daily?.missionCandidateId)) {
      updatedCandidate = {
        ...c,
        status: "converted_to_guided_flow",
        updatedAt: now,
        auditTrail: [
          ...c.auditTrail,
          audit(
            "mission_converted_to_guided_flow",
            `Convertie en parcours guidé ${flow.id} — local V4.6.`
          ),
        ],
      };
      return updatedCandidate;
    }
    return c;
  });

  const dailyMissions = getDailyMissions().map((d) => {
    if (d.id === daily?.id || d.missionCandidateId === candidate?.id) {
      updatedDaily = {
        ...d,
        status: "converted_to_guided_flow",
        linkedGuidedFlowId: flow.id,
        auditTrail: [
          ...d.auditTrail,
          audit(
            "mission_converted_to_guided_flow",
            `Parcours guidé ${flow.id} créé — aucune exécution réelle.`
          ),
        ],
      };
      return updatedDaily;
    }
    return d;
  });

  saveState(candidates, dailyMissions);
  return { flow, daily: updatedDaily, candidate: updatedCandidate };
}
