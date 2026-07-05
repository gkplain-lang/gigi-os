"use client";

import { useCallback, useState } from "react";
import {
  downloadLocalDataExport,
  formatExportFilename,
  serializeLocalDataExport,
} from "@/modules/localDataControl";

export function LocalDataExportPanel() {
  const [exportJson, setExportJson] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePrepare = useCallback(() => {
    const json = serializeLocalDataExport(true);
    setExportJson(json);
    setStatus(`Export préparé — ${formatExportFilename()}`);
    setCopied(false);
  }, []);

  const handleDownload = useCallback(() => {
    const result = downloadLocalDataExport();
    if (result.ok) {
      setStatus(`Fichier téléchargé : ${result.filename}`);
    } else {
      setStatus(result.error ?? "Échec du téléchargement.");
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!exportJson) return;
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopied(true);
      setStatus("JSON copié dans le presse-papiers.");
    } catch {
      setStatus("Copie impossible — sélectionne le texte manuellement.");
    }
  }, [exportJson]);

  return (
    <section className="gigi-panel mb-6 rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Export manuel
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Génère un JSON local avec les clés exportables connues. Aucun envoi réseau — tu gardes le
        fichier sur ton appareil.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={handlePrepare} className="gigi-btn-primary rounded-lg px-4 py-2 text-[13px]">
          Préparer export JSON
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="gigi-focus rounded-lg border border-border px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary"
        >
          Télécharger le fichier
        </button>
        {exportJson && (
          <button
            type="button"
            onClick={handleCopy}
            className="gigi-focus rounded-lg border border-border px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary"
          >
            {copied ? "Copié ✓" : "Copier le JSON"}
          </button>
        )}
      </div>

      {status && <p className="mt-3 text-[12.5px] text-accent-soft">{status}</p>}

      {exportJson && (
        <textarea
          readOnly
          value={exportJson}
          className="mt-4 h-48 w-full resize-y rounded-lg border border-border/60 bg-surface-2/20 p-3 font-mono text-[11px] text-text-secondary"
          aria-label="Aperçu export JSON"
        />
      )}
    </section>
  );
}
