import type { PreparedAction } from "./types";

export function formatPreparedActionForCopy(action: PreparedAction): string {
  const lines = [
    `# ${action.title}`,
    "",
    action.summary,
    "",
    "---",
    "",
    action.body,
  ];
  if (action.relatedFiles?.length) {
    lines.push("", "## Fichiers probables", ...action.relatedFiles.map((f) => `- ${f}`));
  }
  if (action.commands?.length) {
    lines.push("", "## Commandes suggérées (à lancer manuellement)", ...action.commands.map((c) => `- \`${c}\``));
  }
  if (action.safetyNotes.length) {
    lines.push("", "## Garde-fous", ...action.safetyNotes.map((n) => `- ${n}`));
  }
  return lines.join("\n");
}
