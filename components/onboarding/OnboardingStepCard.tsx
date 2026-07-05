interface OnboardingStepCardProps {
  stepNumber: number;
  title: string;
  body: string;
  bullets?: readonly string[];
  children?: React.ReactNode;
}

export function OnboardingStepCard({
  stepNumber,
  title,
  body,
  bullets = [],
  children,
}: OnboardingStepCardProps) {
  return (
    <div className="gigi-wizard-card">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="gigi-wizard-step-badge">{stepNumber}</span>
        <p className="text-[14px] font-semibold text-text-primary">{title}</p>
      </div>
      <p className="text-[13.5px] leading-relaxed text-text-secondary">{body}</p>
      {bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-[13px] text-text-secondary">
              <span className="text-accent-soft" aria-hidden>
                ·
              </span>
              {b}
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}
