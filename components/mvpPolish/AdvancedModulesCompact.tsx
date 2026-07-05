"use client";

import type { ReactNode } from "react";

interface AdvancedModulesCompactProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function AdvancedModulesCompact({
  children,
  className,
  defaultOpen = false,
}: AdvancedModulesCompactProps) {
  return (
    <details
      className={`group rounded-xl border border-border/30 bg-surface-2/10 ${className ?? ""}`}
      open={defaultOpen}
    >
      <summary className="gigi-focus flex cursor-pointer list-none items-center justify-between px-5 py-3.5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Modules avancés
          </p>
          <p className="mt-0.5 text-[12.5px] text-text-secondary">
            Visibilité V4, parcours guidé et capacités — local uniquement, aucune exécution réelle.
          </p>
        </div>
        <span className="ml-3 shrink-0 text-[12px] text-text-muted transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="space-y-6 px-5 pb-5 pt-1">{children}</div>
    </details>
  );
}
