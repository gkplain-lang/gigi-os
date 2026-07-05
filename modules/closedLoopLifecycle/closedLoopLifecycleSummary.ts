import type { ClosedLoopLifecycleGlobalSummary } from "./types";

export const CLOSED_LOOP_LIFECYCLE_EMPTY_SUMMARY: ClosedLoopLifecycleGlobalSummary = {
  totalLifecycles: 0,
  activeCount: 0,
  closedCount: 0,
  blockedCount: 0,
  summaryText: "Aucun cycle d'action — ouvre une action sur /actions pour voir le cycle complet.",
};

export const CLOSED_LOOP_LIFECYCLE_GUIDANCE: string[] = [
  "Le cycle relie mission → plan → action → workspace → handoff → rapport → log → review.",
  "Toutes les données sont locales et déclaratives — Gigi ne vérifie pas le repo.",
  "Chaque étape suivante nécessite une action manuelle de ta part.",
  "Recalcule le cycle après chaque mise à jour locale.",
  "Ferme ou archive le cycle uniquement quand tu es prêt.",
];

export function buildClosedLoopLifecycleGuidanceHints(objective: string): string[] {
  const norm = objective.toLowerCase();
  const hints = [...CLOSED_LOOP_LIFECYCLE_GUIDANCE];
  if (/ferm|clos|archive/.test(norm)) {
    hints.push("La fermeture et l'archivage sont manuels — aucun auto-close.");
  }
  if (/appris|learning/.test(norm)) {
    hints.push("Les apprentissages proviennent de l'historique et du feedback mission locaux.");
  }
  return hints.slice(0, 6);
}
