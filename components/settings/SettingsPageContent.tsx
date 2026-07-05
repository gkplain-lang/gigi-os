"use client";

import { useEffect, useMemo } from "react";
import {
  buildLocalDataSnapshot,
  formatBytes,
  loadLocalSettings,
  patchLocalSettings,
} from "@/modules/localDataControl";
import { SettingsHero } from "./SettingsHero";
import { SettingsVersionCard } from "./SettingsVersionCard";
import { LocalDataOverview } from "./LocalDataOverview";
import { LocalDataExportPanel } from "./LocalDataExportPanel";
import { LocalDataImportPanel } from "./LocalDataImportPanel";
import { LocalDataResetPanel } from "./LocalDataResetPanel";
import { LocalPreferencesPanel } from "./LocalPreferencesPanel";
import { SettingsExecutionReadinessSection } from "./SettingsExecutionReadinessSection";
import { SettingsSafetyNote } from "./SettingsSafetyNote";
import { useIsClient } from "./useIsClient";

export function SettingsPageContent() {
  const isClient = useIsClient();

  const snapshot = useMemo(
    () => (isClient ? buildLocalDataSnapshot() : null),
    [isClient]
  );

  useEffect(() => {
    if (!isClient) return;
    const settings = loadLocalSettings();
    document.documentElement.dataset.gigiDensity = settings.uiDensity;
    document.documentElement.dataset.gigiSafety = settings.safetyMode;
    patchLocalSettings({ lastOpenedSection: "overview" });
  }, [isClient]);

  if (!isClient) return null;

  const totalSizeLabel = snapshot ? formatBytes(snapshot.totalSizeBytes) : "—";

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <SettingsHero />

        <SettingsVersionCard
          snapshotGeneratedAt={snapshot?.generatedAt ?? null}
          presentCount={snapshot?.presentCount ?? 0}
          totalSizeLabel={totalSizeLabel}
        />

        <LocalDataOverview snapshot={snapshot} />

        <LocalDataExportPanel />

        <LocalDataImportPanel />

        <LocalDataResetPanel />

        <LocalPreferencesPanel />

        <SettingsExecutionReadinessSection />

        <SettingsSafetyNote />
      </div>
    </div>
  );
}
