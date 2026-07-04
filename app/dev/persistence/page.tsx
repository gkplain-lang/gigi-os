"use client";

import { DevPageLayout } from "@/components/dev/DevPageLayout";
import { DevPersistencePanel } from "./DevPersistencePanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevPersistencePage() {
  if (IS_PROD) {
    return (
      <div className="p-8 text-text-secondary">Page de développement indisponible en production.</div>
    );
  }

  return (
    <DevPageLayout
      label="Dev · Persistence"
      title="Stratégie de persistance"
    >
      <DevPersistencePanel />
      <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
        V0.4.5 analyse la stratégie de persistance. Aucune donnée n&apos;est restaurée ou écrasée
        automatiquement. localStorage reste la source principale (
        <code className="text-accent-soft">gigi-os-v03-state</code>).
      </p>
    </DevPageLayout>
  );
}
