"use client";

import { DevPageLayout } from "@/components/dev/DevPageLayout";
import { DevSyncPanel } from "./DevSyncPanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevSyncPage() {
  if (IS_PROD) {
    return (
      <div className="p-8 text-text-secondary">Page de développement indisponible en production.</div>
    );
  }

  return (
    <DevPageLayout
      label="Dev · Sync"
      title="Synchronisation Supabase"
      links={[
        { href: "/dev/persistence", label: "Dev · Persistence" },
        { href: "/dev/controls", label: "Dev · Controls" },
      ]}
    >
      <DevSyncPanel />
      <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
        V0.4.4 prépare la synchronisation. localStorage reste la source principale (
        <code className="text-accent-soft">gigi-os-v03-state</code>).
      </p>
    </DevPageLayout>
  );
}
