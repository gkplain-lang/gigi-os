"use client";

type PillTone = "neutral" | "accent" | "success" | "warn" | "muted";

const TONE_CLASSES: Record<PillTone, string> = {
  neutral: "border-border/50 text-text-secondary",
  accent: "border-[rgba(124,140,255,0.45)] bg-[rgba(124,140,255,0.15)] text-accent-soft",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  warn: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  muted: "border-border/40 text-text-muted",
};

interface MVPStatusPillProps {
  label: string;
  tone?: PillTone;
}

export function MVPStatusPill({ label, tone = "neutral" }: MVPStatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
