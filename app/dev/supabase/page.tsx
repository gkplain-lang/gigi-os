"use client";

import { DevPageLayout } from "@/components/dev/DevPageLayout";
import { DevSupabaseStatus } from "./DevSupabaseStatus";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevSupabasePage() {
  if (IS_PROD) {
    return (
      <div className="p-8 text-text-secondary">Page de développement indisponible en production.</div>
    );
  }

  return (
    <DevPageLayout
      label="Dev · Supabase"
      title="Vérification Supabase & Auth"
    >
      <DevSupabaseStatus />
      <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
        V0.4.3 ajoute l&apos;auth, mais Aegis utilise encore localStorage comme source principale (
        <code className="text-accent-soft">gigi-os-v03-state</code>).
      </p>
    </DevPageLayout>
  );
}
