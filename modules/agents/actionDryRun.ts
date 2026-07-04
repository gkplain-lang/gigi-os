import { DRY_RUN_ACTION_LABELS } from "./actionRegistry";
import type { ActionProposal, DryRunResult } from "./types";
import { assertNoExternalExecution } from "./actionSafety";

const DRY_RUN_STEPS: Partial<Record<string, string[]>> = {
  prepare_buildy_crafts_library_update: [
    "Lister les assets Buildy Crafts à mettre à jour",
    "Proposer un ordre de priorité (textures, modèles, docs)",
    "Rédiger une checklist de validation locale",
  ],
  prepare_n8n_agent_plan: [
    "Définir le déclencheur (manuel uniquement en V0.6)",
    "Lister les étapes du workflow sans connexion n8n",
    "Documenter les garde-fous requis avant V0.7+",
  ],
  prepare_github_commit: [
    "Lister les fichiers modifiés (simulation)",
    "Proposer un message de commit",
    "Vérifier qu'aucun push automatique n'est lancé",
  ],
  prepare_github_branch: [
    "Proposer un nom de branche depuis main",
    "Lister les fichiers concernés (simulation)",
    "Aucune commande git exécutée",
  ],
  prepare_supabase_backup_plan: [
    "Décrire les tables à sauvegarder",
    "Proposer un export manuel (sans sync auto)",
    "Rappeler : pas de restore automatique en V0.6",
  ],
  prepare_tomorrow_mission: [
    "Analyser la mission du jour (local)",
    "Proposer une mission unique pour demain",
    "Enregistrer comme suggestion dry-run uniquement",
  ],
  prepare_project_review: [
    "Synthétiser l'état des projets (local)",
    "Identifier blocages et priorités",
    "Produire un plan de revue sans action externe",
  ],
};

/**
 * Simulates an action — never calls Gmail, Calendar, GitHub, n8n, Supabase, or APIs.
 */
export function executeActionDryRun(proposal: ActionProposal): DryRunResult {
  assertNoExternalExecution(proposal.actionType);

  const label = DRY_RUN_ACTION_LABELS[proposal.actionType as keyof typeof DRY_RUN_ACTION_LABELS];
  const steps =
    DRY_RUN_STEPS[proposal.actionType] ?? [
      "Analyser la demande localement",
      "Produire un plan d'action sans effet réel",
      "Attendre confirmation utilisateur (V0.7+)",
    ];

  return {
    proposalId: proposal.id,
    actionType: proposal.actionType,
    dryRun: true,
    executed: false,
    simulatedSteps: steps,
    summary: `[Dry-run] ${label ?? proposal.title} — aucune action externe exécutée.`,
  };
}
