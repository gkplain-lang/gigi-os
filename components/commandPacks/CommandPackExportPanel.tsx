"use client";

import { useState } from "react";
import { downloadAllCommandPacks } from "@/modules/executionReadiness";

export function CommandPackExportPanel() {
  const [msg, setMsg] = useState<string | null>(null);

  function handleExportAll() {
    const result = downloadAllCommandPacks();
    setMsg(result.ok ? `Export global : ${result.filename}` : result.error ?? "Erreur");
  }

  return (
    <section className="gigi-panel rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Export local · V4.3
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Exporte tous les packs en JSON — aucun envoi réseau, aucun secret inclus.
      </p>
      <button
        type="button"
        onClick={handleExportAll}
        className="gigi-btn-secondary gigi-focus mt-4 rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
      >
        Exporter tous les packs (JSON)
      </button>
      {msg && <p className="mt-2 text-[11px] text-text-muted">{msg}</p>}
    </section>
  );
}
