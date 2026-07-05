import type { ExecutionReportIntake, ExecutionReportIntakeState } from "./types";
import {
  EXECUTION_REPORT_INTAKE_STORAGE_KEY,
  EXECUTION_REPORT_INTAKE_VERSION,
} from "./types";

export function createEmptyExecutionReportIntakeState(): ExecutionReportIntakeState {
  return { intakes: [], version: EXECUTION_REPORT_INTAKE_VERSION };
}

export function loadExecutionReportIntakeState(): ExecutionReportIntakeState {
  if (typeof window === "undefined") return createEmptyExecutionReportIntakeState();
  try {
    const raw = localStorage.getItem(EXECUTION_REPORT_INTAKE_STORAGE_KEY);
    if (!raw) return createEmptyExecutionReportIntakeState();
    const parsed = JSON.parse(raw) as ExecutionReportIntakeState;
    if (!parsed?.intakes || !Array.isArray(parsed.intakes)) {
      return createEmptyExecutionReportIntakeState();
    }
    return {
      ...createEmptyExecutionReportIntakeState(),
      ...parsed,
      version: EXECUTION_REPORT_INTAKE_VERSION,
    };
  } catch {
    return createEmptyExecutionReportIntakeState();
  }
}

export function saveExecutionReportIntakeState(state: ExecutionReportIntakeState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXECUTION_REPORT_INTAKE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertExecutionReportIntake(intake: ExecutionReportIntake): ExecutionReportIntake {
  const state = loadExecutionReportIntakeState();
  const filtered = state.intakes.filter((i) => i.id !== intake.id);
  saveExecutionReportIntakeState({
    intakes: [intake, ...filtered],
    lastUpdatedAt: intake.updatedAt,
    version: EXECUTION_REPORT_INTAKE_VERSION,
  });
  return intake;
}

export function getExecutionReportIntakeById(id: string): ExecutionReportIntake | undefined {
  return loadExecutionReportIntakeState().intakes.find((i) => i.id === id);
}

export function getIntakesBySourceHandoffId(handoffId: string): ExecutionReportIntake[] {
  return loadExecutionReportIntakeState().intakes.filter(
    (i) => i.sourceHandoffId === handoffId && i.status !== "archived"
  );
}

export function getIntakesBySourceWorkspaceId(workspaceId: string): ExecutionReportIntake[] {
  return loadExecutionReportIntakeState().intakes.filter(
    (i) => i.sourceWorkspaceId === workspaceId && i.status !== "archived"
  );
}

export function getIntakesBySourceActionId(actionId: string): ExecutionReportIntake[] {
  return loadExecutionReportIntakeState().intakes.filter(
    (i) => i.sourceActionId === actionId && i.status !== "archived"
  );
}

export function listExecutionReportIntakes(limit?: number): ExecutionReportIntake[] {
  const sorted = [...loadExecutionReportIntakeState().intakes].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function archiveExecutionReportIntake(id: string): ExecutionReportIntake | undefined {
  const intake = getExecutionReportIntakeById(id);
  if (!intake) return undefined;
  const timestamp = new Date().toISOString();
  return upsertExecutionReportIntake({
    ...intake,
    status: "archived",
    archivedAt: timestamp,
    updatedAt: timestamp,
  });
}
