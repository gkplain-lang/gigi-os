import type { ExecutionLog } from "./types";
import { EXECUTION_LOG_ENTRY_LABELS, EXECUTION_LOG_STATUS_LABELS } from "./types";

export function formatExecutionLogForCopy(log: ExecutionLog): string {
  const lines = [
    `# Journal d'exécution — ${log.projectName}`,
    "",
    `Statut : ${EXECUTION_LOG_STATUS_LABELS[log.status]}`,
    log.startedAt ? `Démarré : ${log.startedAt}` : "",
    log.completedAt ? `Terminé : ${log.completedAt}` : "",
    "",
    "## Timeline",
    ...log.entries.map(
      (e) =>
        `- [${e.createdAt}] ${EXECUTION_LOG_ENTRY_LABELS[e.type]} — ${e.title}${e.description ? `: ${e.description}` : ""}`
    ),
    "",
    log.finalReport ? `## Rapport final\n${log.finalReport}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}
