export type {
  ConflictType,
  DataSource,
  DataSummary,
  EvaluatePersistenceStrategyParams,
  PersistenceDiagnostic,
  PersistenceMode,
  PersistenceRecommendation,
} from "./types";

export { createLocalSnapshotSummary, summaryHasData } from "./localSnapshot";
export { createRemoteSnapshotSummary } from "./remoteSnapshot";
export { detectPersistenceConflict } from "./conflictDetection";
export type { ConflictDetectionResult } from "./conflictDetection";
export {
  evaluatePersistenceStrategy,
  PERSISTENCE_MODE_LABELS,
  RECOMMENDATION_LABELS,
} from "./persistenceStrategy";

export { usePersistenceDiagnostic } from "./usePersistenceDiagnostic";
