"use client";

import { useCallback, useState } from "react";
import {
  getDefaultLocalSettings,
  loadLocalSettings,
  patchLocalSettings,
  type LocalSettings,
  type SafetyMode,
  type UiDensity,
} from "@/modules/localDataControl";
import { useIsClient } from "./useIsClient";

export function LocalPreferencesPanel() {
  const isClient = useIsClient();
  const [revision, setRevision] = useState(0);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const settings = isClient ? loadLocalSettings() : getDefaultLocalSettings();

  const update = useCallback((patch: Partial<LocalSettings>) => {
    const next = patchLocalSettings(patch);
    setRevision((r) => r + 1);
    setSavedNote("Préférence enregistrée localement.");
    document.documentElement.dataset.gigiDensity = next.uiDensity;
    document.documentElement.dataset.gigiSafety = next.safetyMode;
  }, []);

  if (!isClient) return null;

  return (
    <section className="gigi-panel mb-6 rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Préférences locales
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Stockées dans <code className="text-accent-soft">gigi-os-v37-local-settings</code> — UI et
        affichage uniquement, jamais de données métier critiques.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2" key={revision}>
        <label className="block text-[12.5px]">
          <span className="text-text-muted">Mode prudence</span>
          <select
            value={settings.safetyMode}
            onChange={(e) => update({ safetyMode: e.target.value as SafetyMode })}
            className="mt-1.5 w-full rounded-lg border border-border/60 bg-surface-2/20 px-3 py-2 text-text-primary"
          >
            <option value="normal">Normal</option>
            <option value="strict">Strict</option>
          </select>
        </label>

        <label className="block text-[12.5px]">
          <span className="text-text-muted">Densité interface</span>
          <select
            value={settings.uiDensity}
            onChange={(e) => update({ uiDensity: e.target.value as UiDensity })}
            className="mt-1.5 w-full rounded-lg border border-border/60 bg-surface-2/20 px-3 py-2 text-text-primary"
          >
            <option value="comfortable">Confortable</option>
            <option value="compact">Compact</option>
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-2">
        <label className="flex items-center gap-2 text-[13px] text-text-secondary">
          <input
            type="checkbox"
            checked={settings.showBetaHints}
            onChange={(e) => update({ showBetaHints: e.target.checked })}
          />
          Afficher les aides bêta
        </label>
        <label className="flex items-center gap-2 text-[13px] text-text-secondary">
          <input
            type="checkbox"
            checked={settings.showSafetyReminders}
            onChange={(e) => update({ showSafetyReminders: e.target.checked })}
          />
          Rappeler les limites de sécurité
        </label>
      </div>

      {savedNote && <p className="mt-3 text-[12px] text-accent-soft">{savedNote}</p>}
    </section>
  );
}
