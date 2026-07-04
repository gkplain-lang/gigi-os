import type { PreparedAction, PreparedActionType } from "@/modules/preparedActions/types";
import type { ExecutionReview } from "@/modules/executionReviews/types";
import { PREPARED_VALIDATION_DEFAULTS } from "@/modules/preparedActions";
import { generateFollowUpProposals } from "./followUpActionEngine";
import {
  formatAllFollowUpProposalsForCopy,
  formatFollowUpProposalForCopy,
} from "./followUpActionFormatter";
import {
  getProposalsByReviewId,
  listAllFollowUpProposals,
  replaceProposalsForReview,
  updateProposalInStore,
} from "./followUpActionStore";
import type {
  FollowUpActionIntent,
  FollowUpActionProposal,
  FollowUpActionStatus,
} from "./types";
import { FOLLOW_UP_DISCLAIMER } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectId(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const FOLLOW_UP_KEYWORDS = [
  "cree la suite",
  "crée la suite",
  "propose une action corrective",
  "qu est ce qu on fait apres",
  "qu'est-ce qu'on fait après",
  "apres cette review",
  "après cette review",
  "transforme cette review",
  "prepare la correction",
  "prépare la correction",
  "cree une action de suivi",
  "crée une action de suivi",
  "follow up",
  "follow-up",
  "action de suite",
  "prochaine action",
];

export function detectFollowUpActionIntent(objective: string): FollowUpActionIntent {
  const norm = normalize(objective);
  const isFollowUpAction = FOLLOW_UP_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isFollowUpAction, projectId: detectProjectId(norm) };
}

export function createFollowUpProposalsFromReview(review: ExecutionReview): FollowUpActionProposal[] {
  const generated = generateFollowUpProposals(review);
  return replaceProposalsForReview(review.id, generated);
}

export function regenerateFollowUpProposals(review: ExecutionReview): FollowUpActionProposal[] {
  return createFollowUpProposalsFromReview(review);
}

export function getFollowUpProposalsForReview(reviewId: string): FollowUpActionProposal[] {
  return getProposalsByReviewId(reviewId);
}

export function updateFollowUpProposalStatus(
  proposalId: string,
  status: FollowUpActionStatus
): FollowUpActionProposal | undefined {
  return updateProposalInStore(proposalId, { status });
}

const TYPE_TO_PREPARED: Record<FollowUpActionProposal["type"], PreparedActionType> = {
  fix: "manual_task",
  retry: "checklist",
  new_action: "manual_task",
  finalize: "checklist",
  document: "file_draft",
  archive: "manual_task",
  clarify: "checklist",
  abandon: "manual_task",
};

export function proposalToPreparedAction(proposal: FollowUpActionProposal): PreparedAction {
  const projectId = proposal.metadata?.projectId ?? "gigi-os";
  const body = [
    `Objectif : ${proposal.objective}`,
    "",
    "Pourquoi :",
    proposal.rationale,
    "",
    "Étapes suggérées :",
    ...proposal.suggestedSteps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "Checklist :",
    ...proposal.validationChecklist.map((c) => `- [ ] ${c}`),
    "",
    "Résultat attendu :",
    proposal.expectedOutcome,
    "",
    "— Proposition V2.3 générée depuis review. Aucune exécution automatique.",
  ].join("\n");

  return {
    id: `followup-prep-${proposal.id}`,
    projectId,
    sourceActionId: proposal.sourceActionId,
    type: TYPE_TO_PREPARED[proposal.type],
    title: proposal.title,
    summary: proposal.objective,
    body,
    copyLabel: "Copier la proposition",
    target: proposal.expectedOutcome,
    safetyNotes: [
      "Proposition V2.3 — follow-up depuis review",
      "Ajout manuel à la file — statut pending_review uniquement",
      FOLLOW_UP_DISCLAIMER,
    ],
    validationRequired: [...PREPARED_VALIDATION_DEFAULTS],
    dryRunOnly: true,
    requiresConfirmation: true,
  };
}

export function getCopyableFollowUpText(proposal: FollowUpActionProposal): string {
  return formatFollowUpProposalForCopy(proposal);
}

export function getCopyableAllFollowUpText(proposals: FollowUpActionProposal[]): string {
  return formatAllFollowUpProposalsForCopy(proposals);
}

export function buildFollowUpGuidanceHints(objective: string): string[] {
  const norm = objective.toLowerCase();
  const hints = [
    "Ouvre /actions → plan d'exécution → review V2.2.",
    "Section « Actions de suivi » : génère les propositions depuis la review.",
    "Choisis une proposition et clique « Ajouter à valider » si tu veux l'envoyer à la file.",
  ];
  if (/correct|fix|corrige/.test(norm)) {
    hints.push("Pour une correction, retiens la proposition « Action corrective ».");
  }
  if (/suite|suivi|follow/.test(norm)) {
    hints.push("Les propositions restent locales jusqu'à ajout manuel à la file.");
  }
  return hints;
}

export { listAllFollowUpProposals, FOLLOW_UP_DISCLAIMER };
