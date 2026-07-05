"use client";

import { useState } from "react";
import { detectSensitivePatterns } from "@/modules/executionReadiness";

export function LocalReviewInputBox({
  onSave,
  disabled,
}: {
  onSave: (text: string, confirmedNoSecrets: boolean) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const sensitive = text.trim() ? detectSensitivePatterns(text) : [];

  function handleSave() {
    if (!text.trim()) return;
    onSave(text, confirmed || sensitive.length === 0);
    setText("");
    setConfirmed(false);
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Coller un résultat (obtenu manuellement hors Gigi)
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        rows={8}
        placeholder="Colle ici la sortie terminal, le log, la réponse GitHub/n8n, ou une note de résultat…"
        className="gigi-focus w-full rounded-lg border border-border/50 bg-surface-2/15 px-3 py-2.5 text-[12.5px] text-text-secondary placeholder:text-text-muted"
      />
      {sensitive.length > 0 && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5">
          <p className="text-[12px] font-medium text-amber-200/95">Alerte secret possible</p>
          <p className="mt-1 text-[11.5px] text-text-secondary">
            Motifs détectés : {sensitive.join(", ")} — retire les secrets avant sauvegarde si
            possible. Gigi n&apos;envoie ce contenu nulle part.
          </p>
          <label className="mt-2 flex items-center gap-2 text-[11.5px] text-text-muted">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded"
            />
            J&apos;ai retiré ou masqué les secrets sensibles
          </label>
        </div>
      )}
      <button
        type="button"
        onClick={handleSave}
        disabled={disabled || !text.trim() || (sensitive.length > 0 && !confirmed)}
        className="gigi-btn-primary gigi-focus rounded-lg px-3.5 py-2 text-[12.5px] font-medium disabled:opacity-50"
      >
        Enregistrer et analyser localement
      </button>
    </div>
  );
}
