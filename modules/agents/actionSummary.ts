import { GIGI_AGENT_PROFILE } from "./agentRegistry";
import { ACTIVE_MAX_AUTONOMY_LEVEL, AUTONOMY_LEVEL_LABELS } from "./autonomyLevels";
import { DRY_RUN_ACTION_LABELS, FORBIDDEN_ACTION_LABELS } from "./actionRegistry";
import { executeActionDryRun } from "./actionDryRun";
import { detectActionProposals } from "./actionProposal";
import type { ActionProposal, AgentFoundationSummary } from "./types";

export function buildExampleProposal(): ActionProposal {
  const detection = detectActionProposals("Gigi, update la bibliothèque Buildy Crafts");
  return (
    detection.proposals[0] ?? {
      id: "example",
      title: "Préparer une mise à jour bibliothèque Buildy Crafts",
      description: "Exemple dry-run V0.6",
      projectId: "buildy-crafts",
      actionType: "prepare_buildy_crafts_library_update",
      riskLevel: "low",
      autonomyLevelRequired: ACTIVE_MAX_AUTONOMY_LEVEL,
      dryRunOnly: true,
      confirmationRequired: false,
      expectedOutcome: "[Dry-run] Aucune modification externe.",
      createdAt: new Date().toISOString(),
    }
  );
}

export function summarizeAgentFoundation(userMessage?: string): AgentFoundationSummary {
  const example = buildExampleProposal();
  const dryRunPreview = executeActionDryRun(example);

  const detection = userMessage
    ? detectActionProposals(userMessage)
    : { proposals: [example], hasForbiddenIntent: false };

  const proposal = detection.proposals[0] ?? example;

  return {
    activeAutonomyLevel: GIGI_AGENT_PROFILE.activeAutonomyLevel,
    maxAutonomyLevel: ACTIVE_MAX_AUTONOMY_LEVEL,
    allowedDryRunActions: [...GIGI_AGENT_PROFILE.allowedDryRunActions],
    forbiddenRealActions: [...GIGI_AGENT_PROFILE.forbiddenRealActions],
    exampleProposal: {
      ...proposal,
      expectedOutcome: dryRunPreview.summary,
    },
    dryRunOnly: true,
    externalExecutionBlocked: true,
  };
}

export function formatAutonomyLabel(): string {
  return AUTONOMY_LEVEL_LABELS[ACTIVE_MAX_AUTONOMY_LEVEL];
}

export function listAllowedActionLabels(): string[] {
  return GIGI_AGENT_PROFILE.allowedDryRunActions.map((a) => DRY_RUN_ACTION_LABELS[a]);
}

export function listForbiddenActionLabels(): string[] {
  return GIGI_AGENT_PROFILE.forbiddenRealActions.map((a) => FORBIDDEN_ACTION_LABELS[a]);
}
