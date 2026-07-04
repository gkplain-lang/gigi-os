import type { ContextLimits } from "./types";

export const DEFAULT_CONTEXT_LIMITS: ContextLimits = {
  maxProjects: 8,
  maxHistoryEvents: 10,
  maxTextLength: 8000,
  maxTasks: 3,
  includeRemoteSnapshot: false,
};

export function resolveContextLimits(partial?: Partial<ContextLimits>): ContextLimits {
  return {
    ...DEFAULT_CONTEXT_LIMITS,
    ...partial,
  };
}
