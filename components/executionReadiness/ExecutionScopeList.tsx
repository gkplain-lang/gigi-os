import type { ExecutionScope } from "@/modules/executionReadiness";
import { EXECUTION_CAPABILITY_LABELS } from "@/modules/executionReadiness";

interface ExecutionScopeListProps {
  scopes: ExecutionScope[];
}

export function ExecutionScopeList({ scopes }: ExecutionScopeListProps) {
  if (scopes.length === 0) return null;

  return (
    <ul className="space-y-3">
      {scopes.map((scope) => (
        <li
          key={scope.id}
          className="rounded-lg border border-border/50 bg-surface-2/20 px-3 py-2.5"
        >
          <p className="text-[12px] font-medium text-text-primary">
            {EXECUTION_CAPABILITY_LABELS[scope.capability]} — {scope.label}
          </p>
          <p className="mt-1 text-[11.5px] text-text-muted">{scope.description}</p>
          {scope.allowedTargets.length > 0 && (
            <p className="mt-2 text-[11px] text-text-secondary">
              <span className="font-medium text-emerald-200/90">Autorisé : </span>
              {scope.allowedTargets.join(" · ")}
            </p>
          )}
          {scope.forbiddenTargets.length > 0 && (
            <p className="mt-1 text-[11px] text-text-secondary">
              <span className="font-medium text-red-200/90">Interdit : </span>
              {scope.forbiddenTargets.join(" · ")}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
