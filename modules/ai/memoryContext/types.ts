export interface ContextLimits {
  maxProjects: number;
  maxHistoryEvents: number;
  maxTextLength: number;
  maxTasks: number;
  includeRemoteSnapshot: boolean;
}

export interface AiCurrentMissionSummary {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: string;
}

export interface AiProjectSummary {
  id: string;
  name: string;
  status: string;
  priority: string;
  currentMissionTitle?: string;
  nextAction?: string;
}

export interface AiHistorySummary {
  id: string;
  type: string;
  projectId?: string;
  missionId?: string;
  label: string;
  createdAt: string;
}

export interface AiMemoryStatusSummary {
  mode: string;
  lastBackupAt?: string | null;
  hasRemoteBackup: boolean;
  conflictDetected?: boolean;
  message: string;
}

export interface AiRemoteSnapshotSummary {
  projectsCount: number;
  missionsCount: number;
  historyEventsCount: number;
  lastActivityAt: string | null;
}

export interface AiDecisionSummary {
  topProjectId?: string;
  topProjectName?: string;
  headline: string;
}

export interface AiMemoryContext {
  currentMission: AiCurrentMissionSummary;
  projectsSummary: AiProjectSummary[];
  recentHistory: AiHistorySummary[];
  completedMissionIds: string[];
  postponedMissionIds: string[];
  rejectedMissionIds: string[];
  memoryStatusSummary?: AiMemoryStatusSummary;
  remoteSnapshotSummary?: AiRemoteSnapshotSummary;
  decisionSummary?: AiDecisionSummary;
  limits: ContextLimits;
  warnings: string[];
}

export interface BuildAiMemoryContextParams {
  localState: import("@/modules/storage/gigiStateTypes").GigiLocalState;
  memoryStatus?: import("@/modules/memory/types").MemoryStatus | null;
  remoteSnapshot?: import("@/modules/persistence/types").DataSummary | null;
  includeRemoteSnapshot?: boolean;
  limits?: Partial<ContextLimits>;
}

export interface AiMemoryContextStats {
  hasContext: boolean;
  projectsCount: number;
  historyCount: number;
  hasCurrentMission: boolean;
  completedCount: number;
  approximateSizeChars: number;
  warnings: string[];
  includeRemoteSnapshot: boolean;
}
