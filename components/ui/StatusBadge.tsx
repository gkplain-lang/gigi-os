import { cn } from "@/lib/utils";

type StatusVariant =
  | "active"
  | "paused"
  | "future"
  | "archived"
  | "completed"
  | "critical"
  | "high"
  | "medium"
  | "low";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  future: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  archived: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  medium: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  low: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
};

export function StatusBadge({ label, variant = "active", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
