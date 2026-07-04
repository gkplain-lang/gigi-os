import type { FollowUpActionProposal } from "./types";
import { FOLLOW_UP_DISCLAIMER, FOLLOW_UP_TYPE_LABELS } from "./types";

export function formatFollowUpProposalForCopy(proposal: FollowUpActionProposal): string {
  const lines = [
    "# Follow-up Action — Gigi V2.3",
    "",
    `Type : ${FOLLOW_UP_TYPE_LABELS[proposal.type]}`,
    `Risque : ${proposal.riskLevel}`,
    `Titre : ${proposal.title}`,
    "",
    "Objectif :",
    proposal.objective,
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
    "Limite :",
    FOLLOW_UP_DISCLAIMER,
  ];
  return lines.join("\n");
}

export function formatAllFollowUpProposalsForCopy(proposals: FollowUpActionProposal[]): string {
  return proposals.map((p) => formatFollowUpProposalForCopy(p)).join("\n\n---\n\n");
}
