export type AutonomyLevel =
  | "level_0_manual_only"
  | "level_1_prepare_only"
  | "level_2_confirmed_action"
  | "level_3_supervised_agent"
  | "level_4_autonomous_agent";

/** Maximum autonomy level active in V0.6 — prepare only, no real execution. */
export const ACTIVE_MAX_AUTONOMY_LEVEL: AutonomyLevel = "level_1_prepare_only";

export const AUTONOMY_LEVEL_LABELS: Record<AutonomyLevel, string> = {
  level_0_manual_only: "Conseil uniquement",
  level_1_prepare_only: "Préparation sans effet réel",
  level_2_confirmed_action: "Action après confirmation (réservé)",
  level_3_supervised_agent: "Agent supervisé (réservé)",
  level_4_autonomous_agent: "Agent autonome (réservé)",
};

export const AUTONOMY_LEVEL_ORDER: AutonomyLevel[] = [
  "level_0_manual_only",
  "level_1_prepare_only",
  "level_2_confirmed_action",
  "level_3_supervised_agent",
  "level_4_autonomous_agent",
];

export function isAutonomyLevelAllowed(required: AutonomyLevel, active: AutonomyLevel): boolean {
  const reqIdx = AUTONOMY_LEVEL_ORDER.indexOf(required);
  const activeIdx = AUTONOMY_LEVEL_ORDER.indexOf(active);
  return reqIdx <= activeIdx;
}
