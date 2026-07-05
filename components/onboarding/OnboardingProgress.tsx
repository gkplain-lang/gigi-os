import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function OnboardingProgress({ current, total, className }: OnboardingProgressProps) {
  return (
    <div
      className={cn("gigi-wizard-progress", className)}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "gigi-wizard-progress-seg",
            i < current && "gigi-wizard-progress-seg-active"
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}
