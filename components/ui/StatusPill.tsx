import { cn } from "@/lib/utils";

type PillVariant = "warm" | "muted";

interface StatusPillProps {
  label: string;
  variant?: PillVariant;
  className?: string;
}

const variants: Record<PillVariant, string> = {
  warm: "bg-[rgba(124,140,255,0.25)] text-white ring-1 ring-inset ring-[rgba(165,180,252,0.55)] shadow-[0_0_20px_-4px_rgba(124,140,255,0.7)]",
  muted: "bg-white/[0.05] text-text-secondary ring-1 ring-inset ring-white/[0.08]",
};

export function StatusPill({ label, variant = "warm", className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold",
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
