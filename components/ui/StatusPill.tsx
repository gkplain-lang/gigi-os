import { cn } from "@/lib/utils";

type PillVariant = "warm" | "muted";

interface StatusPillProps {
  label: string;
  variant?: PillVariant;
  className?: string;
}

const variants: Record<PillVariant, string> = {
  warm: "bg-accent-dim text-accent-soft ring-1 ring-inset ring-[rgba(124,140,255,0.28)]",
  muted: "bg-white/[0.04] text-text-muted ring-1 ring-inset ring-white/[0.05]",
};

export function StatusPill({ label, variant = "warm", className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium",
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
