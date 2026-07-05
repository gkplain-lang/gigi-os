interface ExecutionRollbackPlanProps {
  steps: string[];
}

export function ExecutionRollbackPlan({ steps }: ExecutionRollbackPlanProps) {
  if (steps.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Plan de rollback
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12px] text-text-secondary">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
