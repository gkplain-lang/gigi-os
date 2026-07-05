import { EXECUTION_READINESS_STORAGE_KEY, EXECUTION_READINESS_VERSION } from "./types";
import { loadExecutionReadinessState } from "./executionReadinessStore";
import { getLocalReviewDisclaimer } from "./localReviewPolicy";
import type { LocalReviewSession } from "./localReviewTypes";
import { getLocalReviewSessionById } from "./localReviewBuilder";

export function exportLocalReviewAsJson(sessionId: string): string | null {
  const session = getLocalReviewSessionById(sessionId);
  if (!session) return null;
  return JSON.stringify(
    {
      schemaVersion: "4.4" as const,
      exportedAt: new Date().toISOString(),
      disclaimer: getLocalReviewDisclaimer(),
      session,
    },
    null,
    2
  );
}

export function exportLocalReviewAsMarkdown(session: LocalReviewSession): string {
  const lines = [
    `# ${session.title}`,
    "",
    `> ${session.disclaimer}`,
    "",
    "## Statut probable",
    `- Statut : ${session.status}`,
    `- Confiance : ${session.confidence}`,
    `- Risque : ${session.riskLevel}`,
    "",
  ];

  if (session.sourceCommandPackId) {
    lines.push(`Source pack : ${session.sourceCommandPackId}`, "");
  }

  if (session.userProvidedInput) {
    lines.push(
      "## Résultat collé (fourni par l'utilisateur)",
      "",
      "```",
      session.sanitizedPreview || session.userProvidedInput.slice(0, 500),
      "```",
      ""
    );
  }

  if (session.successSignals.length) {
    lines.push("## Signaux succès", ...session.successSignals.map((s) => `- ${s}`), "");
  }
  if (session.warningSignals.length) {
    lines.push("## Signaux attention", ...session.warningSignals.map((s) => `- ${s}`), "");
  }
  if (session.errorSignals.length) {
    lines.push("## Signaux erreur", ...session.errorSignals.map((s) => `- ${s}`), "");
  }

  lines.push(
    "## Vérifications humaines",
    ...session.humanChecks.map((c) => `- [ ] ${c}`),
    "",
    "## Prochaines étapes recommandées",
    ...session.recommendedNextSteps.map((s) => `- ${s}`),
    "",
    "---",
    "*Export Gigi V4.4 — analyse locale, aucune vérification réelle.*"
  );

  return lines.join("\n");
}

export function exportAllLocalReviews(): string {
  const state = loadExecutionReadinessState();
  return JSON.stringify(
    {
      schemaVersion: "4.4" as const,
      exportedAt: new Date().toISOString(),
      source: "gigi-local-review-export",
      storageKey: EXECUTION_READINESS_STORAGE_KEY,
      version: EXECUTION_READINESS_VERSION,
      disclaimer: getLocalReviewDisclaimer(),
      sessions: state.localReviewSessions ?? [],
    },
    null,
    2
  );
}

export function downloadLocalReviewJson(
  sessionId: string
): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  const json = exportLocalReviewAsJson(sessionId);
  if (!json) return { ok: false, filename: "", error: "Session introuvable." };
  try {
    const filename = `gigi-local-review-${sessionId.slice(0, 12)}.json`;
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

export function downloadLocalReviewMarkdown(
  sessionId: string
): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  const session = getLocalReviewSessionById(sessionId);
  if (!session) return { ok: false, filename: "", error: "Session introuvable." };
  try {
    const md = exportLocalReviewAsMarkdown(session);
    const filename = `gigi-local-review-${sessionId.slice(0, 12)}.md`;
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

export function downloadAllLocalReviews(): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  try {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date();
    const filename = `gigi-local-reviews-v4-4-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
    const blob = new Blob([exportAllLocalReviews()], { type: "application/json" });
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
