"use client";

import { useState } from "react";
import { downloadManualBridgeExport } from "@/modules/executionReadiness";

export function ManualBridgeExportPanel() {
  const [message, setMessage] = useState<string | null>(null);

  function handleExport() {
    const result = downloadManualBridgeExport();
    setMessage(
      result.ok
        ? `Journal exporté localement : ${result.filename}`
        : result.error ?? "Export impossible."
    );
  }

  return (
    <section className="gigi-panel rounded-xl border border-border/40 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Export local du pont manuel
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Télécharge un JSON avec les paquets, connecteurs sandbox et journal — aucun envoi réseau,
        aucun secret.
      </p>
      <button
        type="button"
        onClick={handleExport}
        className="gigi-btn-secondary gigi-focus mt-4 rounded-lg px-4 py-2 text-[13px] font-medium"
      >
        Exporter le journal JSON
      </button>
      {message && <p className="mt-2 text-[12px] text-text-muted">{message}</p>}
    </section>
  );
}
