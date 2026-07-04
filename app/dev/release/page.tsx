"use client";

import { DevPageLayout } from "@/components/dev/DevPageLayout";
import { ReleaseDevPanel } from "./ReleaseDevPanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevReleasePage() {
  if (IS_PROD) {
    return (
      <div className="p-8 text-text-secondary">Page de développement indisponible en production.</div>
    );
  }

  return (
    <DevPageLayout
      label="Dev · Release"
      title="V1.0 Daily Use Release"
      description="Checklist usage quotidien — garde-fous dry-run conservés, aucune action externe automatique."
    >
      <ReleaseDevPanel />
    </DevPageLayout>
  );
}
