export type {
  ActionQueueFilter,
  ActionQueueState,
  EnqueuePreparedActionInput,
  QueuedAction,
  QueuedActionStatus,
} from "./types";

export {
  ACTION_QUEUE_STORAGE_KEY,
  QUEUED_STATUS_LABELS,
} from "./types";

export {
  createEmptyQueueState,
  loadActionQueueState,
  saveActionQueueState,
  clearActionQueueState,
} from "./actionQueueStore";

export {
  filterQueuedActions,
  sortQueuedActions,
  countByStatus,
  uniqueProjectIds,
} from "./actionQueueFilters";

export {
  enqueuePreparedAction,
  enqueueManyPreparedActions,
  updateQueuedActionStatus,
  removeQueuedAction,
} from "./actionQueueService";

export const VALIDATION_CENTER_NOTE =
  "Valider ne lance aucune action. Cela marque seulement l'action comme approuvée localement.";

export const QUEUE_DRY_RUN_NOTE =
  "File locale — aucune exécution automatique, aucun Git, aucun appel externe. Valider = approbation locale uniquement.";
