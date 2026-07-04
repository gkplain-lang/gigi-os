import { cn } from "@/lib/utils";

type PillVariant = "warm" | "muted";

interface StatusPillProps {
  label: string;
  variant?: PillVariant;
  className?: string;
}

const variants: Record<PillVariant, string> = {
  warm: "bg-white/[0.05] text-accent-soft",
  muted: "bg-[rgba(20,28,26,0.7)] text-text-muted",
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
