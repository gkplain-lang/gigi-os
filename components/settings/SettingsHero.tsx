"use client";

import { PRODUCT_TAGLINE } from "@/lib/branding";

export function SettingsHero() {
  return (
    <header className="gigi-panel-raised mb-6 rounded-xl border border-indigo-500/20 p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
        Centre de contrôle local
      </p>
      <h1 className="mt-2 text-[22px] font-semibold text-text-primary">
        Réglages &amp; données locales
      </h1>
      <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary">
        Gigi reste local, manuel et sous ton contrôle. Ici tu vois ce qui est stocké sur cet
        appareil, tu exportes, tu prévisualises un import, et tu réinitialises avec confirmation.
      </p>
      <p className="mt-3 text-[12px] text-text-muted italic">{PRODUCT_TAGLINE}</p>
    </header>
  );
}
