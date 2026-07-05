import { EXECUTION_READINESS_STORAGE_KEY, EXECUTION_READINESS_VERSION } from "./types";
import { loadExecutionReadinessState } from "./executionReadinessStore";

export interface PermissionAuditExportPayload {
  schemaVersion: "4.1";
  exportedAt: string;
  source: "gigi-permission-audit-export";
  storageKey: typeof EXECUTION_READINESS_STORAGE_KEY;
  version: number;
  requests: ReturnType<typeof loadExecutionReadinessState>["requests"];
  decisions: ReturnType<typeof loadExecutionReadinessState>["decisions"];
  auditEntries: Array<{
    requestId: string;
    requestTitle: string;
    entryId: string;
    at: string;
    type: string;
    message: string;
    decision?: string;
  }>;
}

export function buildPermissionAuditExport(): PermissionAuditExportPayload {
  const state = loadExecutionReadinessState();
  const auditEntries = state.requests.flatMap((request) =>
    request.auditTrail.map((entry) => ({
      requestId: request.id,
      requestTitle: request.title,
      entryId: entry.id,
      at: entry.at,
      type: entry.type,
      message: entry.message,
      decision: entry.decision,
    }))
  );

  return {
    schemaVersion: "4.1",
    exportedAt: new Date().toISOString(),
    source: "gigi-permission-audit-export",
    storageKey: EXECUTION_READINESS_STORAGE_KEY,
    version: EXECUTION_READINESS_VERSION,
    requests: state.requests,
    decisions: state.decisions,
    auditEntries: auditEntries.sort((a, b) => b.at.localeCompare(a.at)),
  };
}

export function serializePermissionAuditExport(pretty = true): string {
  return JSON.stringify(buildPermissionAuditExport(), null, pretty ? 2 : 0);
}

export function downloadPermissionAuditExport(): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  try {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date();
    const filename = `gigi-permission-audit-v4-1-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
    const json = serializePermissionAuditExport(true);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    return { ok: true, filename };
  } catch {
    return { ok: false, filename: "", error: "Impossible de générer le fichier d'export." };
  }
}
