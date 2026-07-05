"use client";

interface MVPSectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function MVPSectionHeader({ eyebrow, title, subtitle, className }: MVPSectionHeaderProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-0.5 text-[15px] font-semibold text-text-primary">{title}</h2>
      {subtitle && <p className="mt-1 text-[12.5px] text-text-secondary">{subtitle}</p>}
    </div>
  );
}
