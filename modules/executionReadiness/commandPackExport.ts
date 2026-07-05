import { EXECUTION_READINESS_STORAGE_KEY, EXECUTION_READINESS_VERSION } from "./types";
import { loadExecutionReadinessState } from "./executionReadinessStore";
import { getCommandPackDisclaimer } from "./commandPackPolicy";
import type { CommandPack } from "./commandPackTypes";
import { getCommandPackById } from "./commandPackBuilder";

export function exportCommandPackAsJson(packId: string): string | null {
  const pack = getCommandPackById(packId);
  if (!pack) return null;
  return JSON.stringify(
    {
      schemaVersion: "4.3" as const,
      exportedAt: new Date().toISOString(),
      disclaimer: getCommandPackDisclaimer(),
      pack,
    },
    null,
    2
  );
}

export function exportCommandPackAsMarkdown(pack: CommandPack): string {
  const lines = [
    `# ${pack.title}`,
    "",
    pack.description,
    "",
    `> ${pack.disclaimer}`,
    "",
    "## Objectif humain",
    pack.humanGoal,
    "",
    "## Prérequis",
    ...pack.prerequisites.map((p) => `- ${p}`),
    "",
    "## Checklist avant lancement",
    ...pack.preflightChecklist.map((p) => `- [ ] ${p}`),
    "",
    "## Commandes à copier",
  ];

  for (const cmd of pack.commands) {
    lines.push(
      "",
      `### ${cmd.label}`,
      "",
      "```",
      cmd.commandText,
      "```",
      "",
      cmd.explanation,
      cmd.placeholders.length ? `Placeholders : ${cmd.placeholders.join(", ")}` : "",
      cmd.failureSigns ? `Signes d'échec : ${cmd.failureSigns}` : ""
    );
  }

  lines.push(
    "",
    "## Rollback manuel",
    ...pack.rollbackCommands.map(
      (c) => `\n### ${c.label}\n\`\`\`\n${c.commandText}\n\`\`\`\n${c.explanation}`
    ),
    "",
    "## Checklist après lancement",
    ...pack.postRunChecklist.map((p) => `- [ ] ${p}`),
    "",
    "## Résultat attendu",
    pack.expectedOutcome,
    "",
    "---",
    "*Export Gigi V4.3 — aucune exécution réelle.*"
  );

  return lines.filter(Boolean).join("\n");
}

export function exportAllCommandPacks(): string {
  const state = loadExecutionReadinessState();
  return JSON.stringify(
    {
      schemaVersion: "4.3" as const,
      exportedAt: new Date().toISOString(),
      source: "gigi-command-packs-export",
      storageKey: EXECUTION_READINESS_STORAGE_KEY,
      version: EXECUTION_READINESS_VERSION,
      disclaimer: getCommandPackDisclaimer(),
      packs: state.commandPacks ?? [],
    },
    null,
    2
  );
}

export function downloadCommandPackJson(
  packId: string
): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  const json = exportCommandPackAsJson(packId);
  if (!json) return { ok: false, filename: "", error: "Pack introuvable." };
  try {
    const filename = `gigi-command-pack-${packId.slice(0, 12)}.json`;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return { ok: true, filename };
  } catch {
    return { ok: false, filename: "", error: "Export impossible." };
  }
}

export function downloadCommandPackMarkdown(
  packId: string
): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  const pack = getCommandPackById(packId);
  if (!pack) return { ok: false, filename: "", error: "Pack introuvable." };
  try {
    const md = exportCommandPackAsMarkdown(pack);
    const filename = `gigi-command-pack-${packId.slice(0, 12)}.md`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return { ok: true, filename };
  } catch {
    return { ok: false, filename: "", error: "Export impossible." };
  }
}

export function downloadAllCommandPacks(): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  try {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date();
    const filename = `gigi-command-packs-v4-3-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
    const blob = new Blob([exportAllCommandPacks()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return { ok: true, filename };
  } catch {
    return { ok: false, filename: "", error: "Export impossible." };
  }
}
