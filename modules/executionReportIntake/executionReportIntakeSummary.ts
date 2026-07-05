import type { ExecutionReportIntakeGlobalSummary } from "./types";

export const EXECUTION_REPORT_INTAKE_EMPTY_SUMMARY: ExecutionReportIntakeGlobalSummary = {
  totalIntakes: 0,
  parsedCount: 0,
  appliedCount: 0,
  reviewGeneratedCount: 0,
  summaryText: "Aucun rapport d'exécution reçu — colle un rapport après un handoff V2.9.",
};

export const EXECUTION_REPORT_INTAKE_GUIDANCE: string[] = [
  "Colle le rapport reçu de Cursor, d'un humain ou de toi-même.",
  "Gigi parse le texte localement — aucune vérification du repo.",
  "Vérifie le résumé parsé, les warnings et les entrées de log proposées.",
  "Applique au journal V2.1 uniquement si tu cliques « Appliquer au log ».",
  "Génère une review V2.2 proposée seulement après validation manuelle.",
  "Marque le handoff « rapport reçu » uniquement par clic explicite.",
];

export function buildExecutionReportIntakeGuidanceHints(objective: string): string[] {
  const norm = objective.toLowerCase();
  const hints = [...EXECUTION_REPORT_INTAKE_GUIDANCE];
  if (/review/.test(norm)) {
    hints.push("La review proposée reste locale et déclarative — pas de vérif repo.");
  }
  if (/log|journal/.test(norm)) {
    hints.push("Les entrées de log sont proposées d'abord — application manuelle requise.");
  }
  return hints.slice(0, 6);
}
