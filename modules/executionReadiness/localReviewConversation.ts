import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { generateLocalReviewSummary } from "./localReviewSummary";
import {
  getLocalReviewDisclaimer,
  localReviewPolicyNotes,
} from "./localReviewPolicy";
import {
  createEmptyReviewSession,
  listLocalReviewSessions,
  saveReviewInput,
  updateReviewSessionStatus,
} from "./localReviewBuilder";
import { generateCommandPackSummary } from "./commandPackSummary";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const LOCAL_REVIEW_KEYWORDS = [
  "revue locale",
  "local review",
  "analyse ce log",
  "analyse ce resultat",
  "analyse ce résultat",
  "voila le resultat",
  "voilà le résultat",
  "j'ai lance la commande",
  "j'ai lancé la commande",
  "est-ce que ca a marche",
  "est-ce que ça a marché",
  "j'ai une erreur",
  "voici la sortie terminal",
  "sortie terminal",
  "cree une revue locale",
  "crée une revue locale",
  "verifie ce resultat",
  "vérifie ce résultat",
  "j'ai colle le resultat",
  "j'ai collé le résultat",
  "est-ce que je peux continuer",
  "analyse locale",
  "resultat colle",
  "résultat collé",
];

export interface LocalReviewIntent {
  isLocalReview: boolean;
}

export function detectLocalReviewIntent(objective: string): LocalReviewIntent {
  const norm = normalize(objective);
  const isLocalReview = LOCAL_REVIEW_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isLocalReview };
}

export function buildLocalReviewConversationResponse(objective: string): GigiConversationResponse {
  const norm = normalize(objective);
  const summary = generateLocalReviewSummary();
  const packSummary = generateCommandPackSummary();
  const hints = [
    ...localReviewPolicyNotes(),
    "Ouvre /local-review pour le panel complet.",
  ];

  if (/colle|resultat|résultat|sortie|log/.test(norm) && objective.length > 80) {
    const session = createEmptyReviewSession("Revue depuis conversation");
    saveReviewInput(session.id, objective.slice(0, 4000), "Résultat collé via conversation");
    return {
      intent: "execution_readiness",
      intentLabel: "Revue locale · V4.4",
      listen:
        "J'ai analysé localement le texte que tu as fourni — statut probable uniquement, aucune vérification réelle.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getLocalReviewDisclaimer(),
      finalMessage: "Consulte /local-review pour le détail et confirme humainement.",
    };
  }

  if (/continuer|marche|marche pas|erreur/.test(norm)) {
    const latest = listLocalReviewSessions(1)[0];
    return {
      intent: "execution_readiness",
      intentLabel: "Revue locale · V4.4",
      listen: latest
        ? `Dernière revue « ${latest.title} » — statut probable : ${latest.status}. Je ne vérifie pas le système réellement.`
        : "Aucune revue — crée-en une sur /local-review et colle ton résultat.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getLocalReviewDisclaimer(),
      finalMessage: "Confirme humainement avant de continuer.",
    };
  }

  if (/inconclus|pas sur/.test(norm) && latestSession()) {
    const latest = latestSession()!;
    updateReviewSessionStatus(latest.id, "inconclusive", "Marqué inconclusif via conversation.");
  }

  const session = createEmptyReviewSession();
  return {
    intent: "execution_readiness",
    intentLabel: "Revue locale · V4.4",
    listen:
      "Je peux analyser localement un résultat que tu colles — Gigi ne lit pas ton terminal, n'inspecte pas tes fichiers, ne vérifie pas GitHub/n8n.",
    needsClarification: false,
    executionReadinessSummaryText: `${summary.summaryText} · ${packSummary.summaryText}`,
    executionReadinessRequestTitle: session.title,
    executionReadinessGuidance: hints,
    executionReadinessBlockedMessage: getLocalReviewDisclaimer(),
    finalMessage: "Colle ta sortie sur /local-review — statut probable, contrôle humain obligatoire.",
  };
}

function latestSession() {
  return listLocalReviewSessions(1)[0];
}
