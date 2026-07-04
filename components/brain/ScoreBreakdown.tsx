import type { ScoreCriterion } from "@/modules/decision-engine/decisionTypes";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ScoreBreakdownProps {
  criteria: ScoreCriterion[];
  finalScore: number;
}

export function ScoreBreakdown({ criteria, finalScore }: ScoreBreakdownProps) {
  return (
    <section>
      <div className="flex items-baseline gap-3.5">
        <p className="font-display text-[2.75rem] font-medium leading-none text-copper-soft">
          {finalScore}%
        </p>
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
            Confiance de Gigi
          </p>
          <p className="text-sm text-text-muted">Ce qui pèse dans le choix</p>
        </div>
      </div>

      <div className="mt-9 space-y-5">
        {criteria.map((criterion) => (
          <div key={criterion.key} className="flex items-center gap-5">
            <span className="w-40 shrink-0 text-sm text-text-secondary md:w-48">
              {criterion.label}
            </span>
            <ProgressBar value={criterion.score * 10} className="flex-1" />
          </div>
        ))}
      </div>
    </section>
  );
}
