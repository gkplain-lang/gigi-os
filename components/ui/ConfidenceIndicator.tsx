import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  value: number;
  className?: string;
}

export function ConfidenceIndicator({ value, className }: ConfidenceIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-11 w-11">
        <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="rgba(255,235,210,0.08)"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#c4894a"
            strokeWidth="2"
            strokeDasharray={`${value} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-accent-gold">
          {value}%
        </span>
      </div>
      <div>
        <p className="text-sm text-text-secondary">Gigi is sure</p>
        <p className="text-xs text-text-muted">Strong recommendation</p>
      </div>
    </div>
  );
}
