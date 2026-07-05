"use client";

import { useCallback, useState } from "react";
import {
  downloadPermissionAuditExport,
  serializePermissionAuditExport,
} from "@/modules/executionReadiness";

export function PermissionAuditExportPanel() {
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handlePrepare = useCallback(() => {
    const json = serializePermissionAuditExport(true);
    setPreview(json);
    setStatus("Export JSON préparé — copie ou téléchargement local uniquement.");
  }, []);

  const handleDownload = useCallback(() => {
    const result = downloadPermissionAuditExport();
    setStatus(result.ok ? `Téléchargé : ${result.filename}` : result.error ?? "Échec");
  }, []);

  const handleCopy = useCallback(async () => {
    if (!preview) return;
    try {
      await navigator.clipboard.writeText(preview);
      setStatus("Journal copié dans le presse-papiers.");
    } catch {
      setStatus("Copie impossible — sélectionne le texte manuellement.");
    }
  }, [preview]);

  return (
    <section className="gigi-panel rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Export journal d&apos;audit
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Export JSON manuel — aucun envoi externe, aucune sync cloud.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={handlePrepare} className="gigi-btn-primary rounded-lg px-4 py-2 text-[13px]">
          Préparer export JSON
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="gigi-focus rounded-lg border border-border px-4 py-2 text-[13px] text-text-secondary"
        >
          Télécharger le fichier
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleCopy}
            className="gigi-focus rounded-lg border border-border px-4 py-2 text-[13px] text-text-secondary"
          >
            Copier
          </button>
        )}
      </div>
      {status && <p className="mt-2 text-[12px] text-accent-soft">{status}</p>}
      {preview && (
        <textarea
          readOnly
          value={preview}
          className="mt-3 h-32 w-full resize-y rounded-lg border border-border/60 bg-surface-2/20 p-3 font-mono text-[10px] text-text-muted"
          aria-label="Aperçu export audit"
        />
      )}
    </section>
  );
}
