import type { ExecutionReview } from "@/modules/executionReviews/types";
import type {
  FollowUpActionProposal,
  FollowUpActionType,
  FollowUpRiskLevel,
} from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function proposalId(reviewId: string, type: FollowUpActionType, index: number): string {
  return `fup-${reviewId}-${type}-${index}`;
}

function findingSummary(review: ExecutionReview): string {
  const parts = review.findings
    .filter((f) => ["failed_test", "blocker", "fix_required", "missing_report"].includes(f.type))
    .map((f) => `${f.title}${f.description ? `: ${f.description}` : ""}`);
  return parts.length ? parts.join(" · ") : review.summary;
}

function baseProposal(
  review: ExecutionReview,
  type: FollowUpActionType,
  index: number,
  data: Omit<
    FollowUpActionProposal,
    "id" | "sourceReviewId" | "type" | "status" | "createdAt" | "updatedAt" | "metadata"
  >
): FollowUpActionProposal {
  const timestamp = nowIso();
  return {
    id: proposalId(review.id, type, index),
    sourceReviewId: review.id,
    sourceExecutionLogId: review.executionLogId,
    sourceExecutionPlanId: review.executionPlanId,
    sourceActionId: review.actionId,
    type,
    status: "proposed",
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
    metadata: {
      projectId: review.metadata?.projectId,
      projectName: review.metadata?.projectName,
      reviewDecision: review.decision,
    },
  };
}

function proposalsForCompleted(review: ExecutionReview): FollowUpActionProposal[] {
  const project = review.metadata?.projectName ?? "le projet";
  return [
    baseProposal(review, "document", 0, {
      title: `Documenter le résultat — ${project}`,
      objective: "Capitaliser le résultat et garder une trace claire de ce qui a été fait.",
      rationale: `Review ${review.decision} — ${review.summary}`,
      suggestedSteps: [
        "Rédiger un résumé en 3 bullets de ce qui a été accompli.",
        "Lister les fichiers modifiés (déclaration manuelle).",
        "Noter les tests passés et le parcours validé.",
        "Copier le rapport dans tes notes ou l'historique.",
      ],
      validationChecklist: [
        "Résumé rédigé",
        "Fichiers listés",
        "Tests documentés",
      ],
      expectedOutcome: "Trace durable pour l'historique et les prochaines missions.",
      riskLevel: "low",
    }),
    baseProposal(review, "archive", 1, {
      title: `Archiver mentalement l'action — ${project}`,
      objective: "Clôturer proprement pour réduire le bruit mental.",
      rationale: "L'exécution semble confirmée — éviter de rouvrir sans raison.",
      suggestedSteps: [
        "Vérifier une dernière fois la checklist de la review.",
        "Marquer l'action comme traitée dans tes notes.",
        "Passer à la mission suivante dans Gigi.",
      ],
      validationChecklist: ["Checklist review OK", "Prochaine mission choisie"],
      expectedOutcome: "Action sortie de la liste des priorités actives.",
      riskLevel: "low",
    }),
  ];
}

function proposalsForNeedsFix(review: ExecutionReview): FollowUpActionProposal[] {
  const context = findingSummary(review);
  const risk: FollowUpRiskLevel = review.findings.some((f) => f.severity === "critical")
    ? "high"
    : "medium";
  return [
    baseProposal(review, "fix", 0, {
      title: "Corriger le problème signalé",
      objective: "Résoudre le blocage ou l'échec identifié dans la review d'exécution.",
      rationale: context,
      suggestedSteps: [
        "Relire les constats de la review (tests échoués, blocages).",
        "Ouvrir les fichiers concernés manuellement.",
        "Appliquer la correction.",
        "Relancer npm run build manuellement.",
        "Ajouter le résultat au journal d'exécution.",
        "Régénérer la review.",
      ],
      validationChecklist: [
        "Erreur corrigée",
        "Build relancé manuellement",
        "Résultat ajouté au log",
        "Review mise à jour",
      ],
      expectedOutcome: "Blocage levé — prêt pour une nouvelle tentative ou clôture.",
      riskLevel: risk,
    }),
  ];
}

function proposalsForNeedsRetry(review: ExecutionReview): FollowUpActionProposal[] {
  return [
    baseProposal(review, "retry", 0, {
      title: "Relancer l'exécution manuelle",
      objective: "Reprendre le plan d'exécution après correction ou clarification.",
      rationale: findingSummary(review),
      suggestedSteps: [
        "Relire le plan d'exécution original dans /actions.",
        "Vérifier que les corrections sont en place.",
        "Marquer à nouveau « commencé » dans le journal.",
        "Reprendre les étapes non validées.",
        "Mettre à jour le journal et régénérer la review.",
      ],
      validationChecklist: [
        "Corrections appliquées ou clarifiées",
        "Journal mis à jour",
        "Tests OK déclarés",
      ],
      expectedOutcome: "Deuxième passage d'exécution documenté.",
      riskLevel: "medium",
    }),
  ];
}

function proposalsForNewAction(review: ExecutionReview): FollowUpActionProposal[] {
  const project = review.metadata?.projectName ?? "le projet";
  return [
    baseProposal(review, "new_action", 0, {
      title: `Créer une suite logique — ${project}`,
      objective: "Définir une nouvelle action indépendante pour la prochaine étape.",
      rationale: review.summary,
      suggestedSteps: [
        "Formuler la prochaine intention en une phrase.",
        "Préparer une action via Gigi (plan ou prompt).",
        "Ajouter à la file de validation.",
        "Valider avant exécution.",
      ],
      validationChecklist: ["Intention claire", "Action ajoutée à /actions"],
      expectedOutcome: "Nouvelle action prête à valider.",
      riskLevel: "medium",
    }),
  ];
}

function proposalsForAbandoned(review: ExecutionReview): FollowUpActionProposal[] {
  return [
    baseProposal(review, "abandon", 0, {
      title: "Documenter l'abandon",
      objective: "Expliciter pourquoi l'action a été abandonnée.",
      rationale: review.summary,
      suggestedSteps: [
        "Ajouter une note dans le journal avec la raison.",
        "Décider si une action de remplacement est nécessaire.",
        "Ne pas laisser l'action en statut ambigu.",
      ],
      validationChecklist: ["Raison documentée", "Décision prise sur la suite"],
      expectedOutcome: "Abandon clair — pas de bruit mental résiduel.",
      riskLevel: "low",
    }),
    baseProposal(review, "archive", 1, {
      title: "Archiver l'action abandonnée",
      objective: "Retirer l'action de la liste active.",
      rationale: "Review abandoned_confirmed — clôturer le cycle.",
      suggestedSteps: [
        "Relire la review une dernière fois.",
        "Passer à une autre mission dans Gigi.",
      ],
      validationChecklist: ["Review relue", "Prochaine mission choisie"],
      expectedOutcome: "Cycle fermé localement.",
      riskLevel: "low",
    }),
  ];
}

function proposalsForUnclear(review: ExecutionReview): FollowUpActionProposal[] {
  return [
    baseProposal(review, "clarify", 0, {
      title: "Compléter le rapport d'exécution",
      objective: "Clarifier le statut réel en enrichissant le journal manuel.",
      rationale: findingSummary(review),
      suggestedSteps: [
        "Ouvrir le suivi manuel dans /actions.",
        "Ajouter des notes sur ce qui a été fait ou bloqué.",
        "Marquer les tests OK/KO manquants.",
        "Remplir le rapport final si terminé.",
        "Régénérer la review.",
      ],
      validationChecklist: [
        "Notes ajoutées",
        "Tests déclarés",
        "Rapport final si applicable",
        "Review régénérée",
      ],
      expectedOutcome: "Statut suffisamment clair pour décider de la suite.",
      riskLevel: "medium",
    }),
  ];
}

export function generateFollowUpProposals(review: ExecutionReview): FollowUpActionProposal[] {
  switch (review.decision) {
    case "completed_confirmed":
      return proposalsForCompleted(review);
    case "needs_fix":
      return proposalsForNeedsFix(review);
    case "needs_retry":
      return proposalsForNeedsRetry(review);
    case "needs_new_action":
      return proposalsForNewAction(review);
    case "abandoned_confirmed":
      return proposalsForAbandoned(review);
    case "unclear":
    default:
      return proposalsForUnclear(review);
  }
}
