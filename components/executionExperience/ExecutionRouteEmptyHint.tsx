"use client";

import Link from "next/link";

interface ExecutionRouteEmptyHintProps {
  message: string;
  nextSteps: { label: string; href: string }[];
  securityNote?: string;
}

export function ExecutionRouteEmptyHint({
  message,
  nextSteps,
  securityNote = "Aucune exécution réelle — validation humaine obligatoire.",
}: ExecutionRouteEmptyHintProps) {
  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-surface-2/10 px-4 py-4">
      <p className="text-[13px] text-text-secondary">{message}</p>
      <ul className="mt-3 space-y-1.5">
        {nextSteps.map((step) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className="gigi-focus text-[12.5px] font-medium text-accent-soft hover:underline"
            >
              {step.label} →
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-text-muted">{securityNote}</p>
    </div>
  );
}
