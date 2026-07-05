"use client";

import { useCallback, useState } from "react";
import {
  executeLocalReset,
  formatConfirmationLevelLabel,
  LOCAL_RESET_CONFIRMATION_PHRASE,
  LOCAL_RESET_OPTIONS,
  previewUltraResetKeys,
  type LocalResetTarget,
} from "@/modules/localDataControl";

export function LocalDataResetPanel() {
  const [selected, setSelected] = useState<LocalResetTarget | null>(null);
  const [phrase, setPhrase] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const option = LOCAL_RESET_OPTIONS.find((o) => o.id === selected);

  const handleReset = useCallback(() => {
    if (!selected) return;
    const resetResult = executeLocalReset(selected, phrase.trim() || undefined);
    setResult(resetResult.message);
  }, [selected, phrase]);

  const ultraPreviewCount =
    selected === "all_known" ? previewUltraResetKeys().length : 0;

  return (
    <section className="gigi-panel mb-6 rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Reset contrôlé
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Réinitialisations ciblées uniquement — aucune suppression silencieuse. Le reset complet
        exige la phrase exacte{" "}
        <code className="text-accent-soft">{LOCAL_RESET_CONFIRMATION_PHRASE}</code>.
      </p>

      <div className="mt-4 space-y-2">
        {LOCAL_RESET_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/40 px-4 py-3 hover:bg-white/[0.02]"
          >
            <input
              type="radio"
              name="reset-target"
              checked={selected === opt.id}
              onChange={() => {
                setSelected(opt.id);
                setPhrase("");
                setResult(null);
              }}
              className="mt-1"
            />
            <span>
              <span className="block text-[13.5px] font-medium text-text-primary">{opt.label}</span>
              <span className="mt-0.5 block text-[12px] text-text-secondary">{opt.description}</span>
              <span className="mt-1 block text-[10.5px] text-text-muted">
                {formatConfirmationLevelLabel(opt.confirmationLevel)}
              </span>
            </span>
          </label>
        ))}
      </div>

      {option && (option.confirmationLevel === "strong" || option.confirmationLevel === "ultra") && (
        <div className="mt-4">
          <label className="block text-[12px] text-text-muted">
            {option.confirmationLevel === "ultra"
              ? `Phrase exacte : ${LOCAL_RESET_CONFIRMATION_PHRASE}`
              : "Confirmation textuelle (ex. : RESET ACTIONS)"}
          </label>
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border/60 bg-surface-2/20 px-3 py-2 text-[13px] text-text-primary"
            autoComplete="off"
          />
        </div>
      )}

      {selected === "all_known" && ultraPreviewCount > 0 && (
        <p className="mt-3 text-[12px] text-amber-200/90">
          {ultraPreviewCount} clé(s) seraient supprimées, dont l&apos;état principal et les backups.
        </p>
      )}

      <button
        type="button"
        onClick={handleReset}
        disabled={!selected}
        className="gigi-focus mt-4 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-2 text-[13px] text-red-200 disabled:opacity-40"
      >
        Exécuter le reset sélectionné
      </button>

      {result && <p className="mt-3 text-[12.5px] text-text-secondary">{result}</p>}
    </section>
  );
}
