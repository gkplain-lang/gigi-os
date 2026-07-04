import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  muted?: boolean;
}

export function ProgressBar({ value, className, muted }: ProgressBarProps) {
  const width = `${Math.min(100, Math.max(0, value))}%`;
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]", className)}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width,
          background: muted
            ? "rgba(255,255,255,0.12)"
            : "linear-gradient(90deg, var(--accent), var(--accent-2))",
          boxShadow: muted ? undefined : "0 0 10px -3px rgba(124,140,255,0.55)",
        }}
      />
    </div>
  );
}
