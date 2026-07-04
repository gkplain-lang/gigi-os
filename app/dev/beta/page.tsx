"use client";

import { DevPageLayout } from "@/components/dev/DevPageLayout";
import { BetaDevPanel } from "./BetaDevPanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevBetaPage() {
  if (IS_PROD) {
    return (
      <div className="p-8 text-text-secondary">Page de développement indisponible en production.</div>
    );
  }

  return (
    <DevPageLayout
      label="Dev · Beta"
      title="Préparation bêta privée V0.9"
      description="Checklist, garde-fous et feedback local — aucune action externe automatique."
    >
      <BetaDevPanel />
    </DevPageLayout>
  );
}
