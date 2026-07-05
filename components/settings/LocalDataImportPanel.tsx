"use client";

import { useCallback, useRef, useState } from "react";
import {
  applyLocalDataImport,
  previewLocalDataImport,
  type LocalImportPreview,
} from "@/modules/localDataControl";

export function LocalDataImportPanel() {
  const [rawInput, setRawInput] = useState("");
  const [preview, setPreview] = useState<LocalImportPreview | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreview = useCallback(() => {
    const next = previewLocalDataImport(rawInput);
    setPreview(next);
    setConfirmImport(false);
    setResultMessage(null);
  }, [rawInput]);

  const handleFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setRawInput(text);
      setPreview(previewLocalDataImport(text));
      setConfirmImport(false);
      setResultMessage(null);
    };
    reader.readAsText(file);
    event.target.value = "";
  }, []);

  const handleApply = useCallback(() => {
    if (!confirmImport) {
      setResultMessage("Coche la confirmation explicite avant d'importer.");
      return;
    }
    const result = applyLocalDataImport(rawInput, { allowOverwrite: confirmOverwrite });
    setResultMessage(result.message);
  }, [rawInput, confirmImport, confirmOverwrite]);

  return (
    <section className="gigi-panel mb-6 rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Import manuel sécurisé
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Colle un JSON exporté ou sélectionne un fichier. Gigi analyse localement et affiche un
        aperçu — jamais d&apos;import automatique au chargement.
      </p>

      <textarea
        value={rawInput}
        onChange={(e) => {
          setRawInput(e.target.value);
          setPreview(null);
          setResultMessage(null);
        }}
        placeholder='{"schemaVersion":"3.7", ...}'
        className="mt-4 h-32 w-full resize-y rounded-lg border border-border/60 bg-surface-2/20 p-3 font-mono text-[11px] text-text-secondary"
        aria-label="JSON à importer"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={handlePreview} className="gigi-btn-primary rounded-lg px-4 py-2 text-[13px]">
          Analyser / prévisualiser
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="gigi-focus rounded-lg border border-border px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary"
        >
          Choisir un fichier JSON
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFile} />
      </div>

      {preview && (
        <div className="mt-4 rounded-lg border border-border/50 bg-surface-2/10 p-4 text-[12.5px]">
          <p className="font-medium text-text-primary">
            Aperçu import — {preview.valid ? "prêt avec confirmation" : "bloqué"}
          </p>
          {preview.sourceVersion && (
            <p className="mt-1 text-text-muted">Version source : v{preview.sourceVersion}</p>
          )}
          <ul className="mt-3 space-y-1 text-text-secondary">
            <li>Clés trouvées : {preview.keysFound.length}</li>
            <li>Clés connues : {preview.keysKnown.length}</li>
            <li>Clés inconnues : {preview.keysUnknown.length}</li>
            <li>Clés qui changeraient : {preview.keysThatWouldChange.length}</li>
          </ul>
          {preview.keysUnknown.length > 0 && (
            <ul className="mt-2 font-mono text-[10.5px] text-amber-200">
              {preview.keysUnknown.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          )}
          {preview.warnings.map((w) => (
            <p key={w} className="mt-2 text-amber-200/90">
              · {w}
            </p>
          ))}
          {preview.blockedReasons.map((b) => (
            <p key={b} className="mt-2 text-red-300/90">
              · {b}
            </p>
          ))}

          {preview.valid && (
            <div className="mt-4 space-y-2 border-t border-border/40 pt-4">
              <label className="flex items-start gap-2 text-[12.5px] text-text-secondary">
                <input
                  type="checkbox"
                  checked={confirmOverwrite}
                  onChange={(e) => setConfirmOverwrite(e.target.checked)}
                  className="mt-0.5"
                />
                J&apos;accepte d&apos;écraser les clés existantes listées dans l&apos;aperçu.
              </label>
              <label className="flex items-start gap-2 text-[12.5px] text-text-secondary">
                <input
                  type="checkbox"
                  checked={confirmImport}
                  onChange={(e) => setConfirmImport(e.target.checked)}
                  className="mt-0.5"
                />
                Je confirme l&apos;import manuel sur cet appareil.
              </label>
              <button
                type="button"
                onClick={handleApply}
                className="gigi-focus rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-[13px] text-amber-100 hover:bg-amber-500/15"
              >
                Appliquer l&apos;import (confirmation requise)
              </button>
            </div>
          )}
        </div>
      )}

      {resultMessage && <p className="mt-3 text-[12.5px] text-accent-soft">{resultMessage}</p>}
    </section>
  );
}
