import { EXECUTION_READINESS_STORAGE_KEY, EXECUTION_READINESS_VERSION } from "./types";
import { loadExecutionReadinessState } from "./executionReadinessStore";
import { getSandboxConnectorRegistry } from "./manualBridgeRegistry";
import { getManualBridgeDisclaimer } from "./manualBridgePolicy";
import type { ManualExecutionPacket } from "./manualBridgeTypes";

export interface ManualBridgeExportPayload {
  schemaVersion: "4.2";
  exportedAt: string;
  source: "gigi-manual-bridge-export";
  storageKey: typeof EXECUTION_READINESS_STORAGE_KEY;
  version: number;
  disclaimer: string;
  connectors: ReturnType<typeof getSandboxConnectorRegistry>;
  packets: ManualExecutionPacket[];
  auditEntries: Array<{
    packetId: string;
    packetTitle: string;
    entryId: string;
    at: string;
    type: string;
    message: string;
  }>;
}

export function buildManualBridgeExport(): ManualBridgeExportPayload {
  const state = loadExecutionReadinessState();
  const packets = state.manualBridgePackets ?? [];
  const auditEntries = packets.flatMap((packet) =>
    packet.auditTrail.map((entry) => ({
      packetId: packet.id,
      packetTitle: packet.title,
      entryId: entry.id,
      at: entry.at,
      type: entry.type,
      message: entry.message,
    }))
  );

  return {
    schemaVersion: "4.2",
    exportedAt: new Date().toISOString(),
    source: "gigi-manual-bridge-export",
    storageKey: EXECUTION_READINESS_STORAGE_KEY,
    version: EXECUTION_READINESS_VERSION,
    disclaimer: getManualBridgeDisclaimer(),
    connectors: getSandboxConnectorRegistry(),
    packets,
    auditEntries: auditEntries.sort((a, b) => b.at.localeCompare(a.at)),
  };
}

export function serializeManualBridgeExport(pretty = true): string {
  return JSON.stringify(buildManualBridgeExport(), null, pretty ? 2 : 0);
}

export function exportManualBridgeState(): ManualBridgeExportPayload {
  return buildManualBridgeExport();
}

export function exportManualBridgePacket(packetId: string): string | null {
  const packet = (loadExecutionReadinessState().manualBridgePackets ?? []).find(
    (p) => p.id === packetId
  );
  if (!packet) return null;
  return JSON.stringify(
    {
      schemaVersion: "4.2" as const,
      exportedAt: new Date().toISOString(),
      disclaimer: getManualBridgeDisclaimer(),
      packet,
    },
    null,
    2
  );
}

export function downloadManualBridgeExport(): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  try {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date();
    const filename = `gigi-manual-bridge-v4-2-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
    const json = serializeManualBridgeExport(true);
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

export function downloadManualBridgePacketExport(
  packetId: string
): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }
  const json = exportManualBridgePacket(packetId);
  if (!json) return { ok: false, filename: "", error: "Paquet introuvable." };
  try {
    const filename = `gigi-manual-packet-${packetId.slice(0, 12)}.json`;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    return { ok: true, filename };
  } catch {
    return { ok: false, filename: "", error: "Export impossible." };
  }
}
