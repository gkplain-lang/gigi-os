import { Check } from "lucide-react";

interface TaskChecklistProps {
  tasks: string[];
  done?: boolean;
  title?: string;
}

export function TaskChecklist({ tasks, done = false, title = "Tes 3 tâches" }: TaskChecklistProps) {
  if (!tasks.length) return null;

  return (
    <div className="gigi-panel rounded-xl p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{title}</p>
      <ul className="mt-3.5 space-y-2.5">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={
                done
                  ? "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border border-[rgba(155,181,159,0.5)] bg-[rgba(155,181,159,0.18)]"
                  : "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border border-border bg-surface-2"
              }
              style={{ height: "18px", width: "18px" }}
              aria-hidden
            >
              {done && <Check className="h-3 w-3 text-ok" strokeWidth={2.5} />}
            </span>
            <span
              className={
                done
                  ? "text-[14px] leading-relaxed text-text-muted line-through"
                  : "text-[14px] leading-relaxed text-text-secondary"
              }
            >
              {task}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
