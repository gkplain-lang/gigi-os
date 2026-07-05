"use client";

import { LOCAL_DATA_SAFETY_LIMITS } from "@/modules/localDataControl";

export function SettingsSafetyNote() {
  return (
    <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
        Limites &amp; sécurité
      </p>
      <ul className="mt-3 space-y-1.5 text-[13px] text-text-secondary">
        {LOCAL_DATA_SAFETY_LIMITS.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </section>
  );
}
