import { PROJECT_NAMES } from "@/modules/conversation/missionCatalog";
import { isForbiddenRealAction } from "../actionRegistry";
import { V06_BLOCKED_MESSAGE } from "../actionSafety";
import type { ActionProposal } from "../types";
import type { ConfirmationStatus, ConfirmationViewModel } from "./types";

export const V062_NO_EXTERNAL_MESSAGE =
  "Aucune action externe ne sera exécutée.";

export const V062_REAL_BLOCKED_MESSAGE =
  "En V0.6.2, l'exécution réelle reste désactivée — seule la préparation dry-run est possible.";

export const CONFIRMATION_STATUS_LABELS: Record<ConfirmationStatus, string> = {
  pending_confirmation: "En attente de confirmation",
  confirmed_dry_run: "Confirmé en dry-run",
  blocked: "Bloqué — plan préparatoire uniquement",
  expired: "Expiré",
  cancelled: "Annulé",
};

function resolveStatus(proposal: ActionProposal, override?: ConfirmationStatus): ConfirmationStatus {
  if (override) return override;
  if (proposal.confirmationStatus) return proposal.confirmationStatus;
  if (proposal.blockedReason) return "blocked";
  return "pending_confirmation";
}

const WILL_NOT_DO_DEFAULT = [
  "Aucun appel Gmail, Calendar ou GitHub API",
  "Aucune sync ou restore Supabase",
  "Aucun workflow n8n lancé",
  "Aucune modification externe automatique",
];

export function buildConfirmationViewModel(
  proposal: ActionProposal,
  statusOverride?: ConfirmationStatus
): ConfirmationViewModel {
  const status = resolveStatus(proposal, statusOverride);
  const projectLabel = proposal.projectId
    ? (PROJECT_NAMES[proposal.projectId] ?? proposal.projectId)
    : "—";
  const forbidden = isForbiddenRealAction(proposal.actionType);

  return {
    proposal,
    status,
    projectLabel,
    why: proposal.description,
    willDo: [
      "Analyser la demande localement",
      "Produire un plan d'action structuré",
      proposal.expectedOutcome,
    ],
    willNotDo: forbidden
      ? [...WILL_NOT_DO_DEFAULT, `Exécution réelle : ${proposal.actionType}`]
      : WILL_NOT_DO_DEFAULT,
    dryRunLabel: proposal.dryRunOnly ? "Dry-run uniquement" : "Simulation locale",
    confirmationRequired: proposal.confirmationRequired,
    realExecutionBlocked: true,
    blockedReason: proposal.blockedReason ?? (forbidden ? V06_BLOCKED_MESSAGE : undefined),
    footerMessage: V062_NO_EXTERNAL_MESSAGE,
  };
}

export function confirmationStatusLabel(status: ConfirmationStatus): string {
  return CONFIRMATION_STATUS_LABELS[status];
}
