import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  muted?: boolean;
}

export function ProgressBar({ value, className, muted }: ProgressBarProps) {
  const width = `${Math.min(100, Math.max(0, value))}%`;
  return (
    <div className={cn("gigi-progress-track", className)}>
      <div
        className={cn("gigi-progress-fill", muted && "gigi-progress-fill-muted")}
        style={{ width }}
      />
    </div>
  );
}
