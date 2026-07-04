import { ACTIVE_MAX_AUTONOMY_LEVEL } from "./autonomyLevels";
import { DRY_RUN_ACTIONS, FORBIDDEN_REAL_ACTIONS } from "./actionRegistry";

/** V0.6 — single controlled agent profile: Gigi prepare-only. */
export const GIGI_AGENT_PROFILE = {
  id: "gigi_prepare_v06",
  name: "Gigi Prepare",
  version: "0.6.0",
  description: "Propose des actions en dry-run. Aucune exécution externe en V0.6.",
  activeAutonomyLevel: ACTIVE_MAX_AUTONOMY_LEVEL,
  allowedDryRunActions: DRY_RUN_ACTIONS,
  forbiddenRealActions: FORBIDDEN_REAL_ACTIONS,
  externalIntegrationsEnabled: false,
  n8nEnabled: false,
} as const;
