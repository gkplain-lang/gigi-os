interface ExecutionSafetyChecklistProps {
  items: string[];
  title?: string;
}

export function ExecutionSafetyChecklist({
  items,
  title = "Checklist sécurité",
}: ExecutionSafetyChecklistProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-[12px] text-text-secondary">
            <span className="text-accent-soft" aria-hidden>
              □
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
