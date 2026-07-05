"use client";

import Link from "next/link";

interface MVPEmptyStateProps {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}

export function MVPEmptyState({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: MVPEmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-border/50 bg-surface-2/10 p-6 text-center ${className ?? ""}`}
    >
      <h3 className="text-[14px] font-semibold text-text-primary">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-[12.5px] text-text-secondary">{description}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primaryHref}
          className="gigi-focus inline-flex rounded-lg bg-[rgba(124,140,255,0.18)] px-4 py-2 text-[12.5px] font-medium text-accent-soft hover:bg-[rgba(124,140,255,0.28)]"
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="gigi-focus text-[12.5px] font-medium text-text-muted underline-offset-2 hover:text-text-secondary hover:underline"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
