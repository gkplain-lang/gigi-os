import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  muted?: boolean;
}

export function ProgressBar({ value, className, muted }: ProgressBarProps) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700",
          muted ? "bg-white/15" : "bg-gradient-to-r from-copper to-copper-soft"
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
