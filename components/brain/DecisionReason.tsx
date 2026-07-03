interface DecisionReasonProps {
  reasoning: string;
  missionTitle: string;
  projectName: string;
}

export function DecisionReason({ reasoning, missionTitle, projectName }: DecisionReasonProps) {
  return (
    <section className="relative">
      <div className="gigi-halo" aria-hidden />
      <div className="relative z-10 max-w-2xl">
        <p className="text-[13px] font-medium uppercase tracking-wide text-copper-soft">
          Pourquoi cette mission ?
        </p>
        <h2 className="mt-4 font-display text-[1.9rem] font-medium leading-tight tracking-tight text-text-primary md:text-4xl">
          {missionTitle}
        </h2>
        <p className="mt-2 text-sm text-text-muted">{projectName}</p>

        <p className="mt-7 text-lg leading-relaxed text-text-secondary">
          Gigi a choisi Buildy Clear parce que c&apos;est le chemin le plus court vers le revenu.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{reasoning}</p>

        <p className="mt-7 text-base text-text-muted">
          C&apos;est une décision de focus, pas une todo list.
        </p>
      </div>
    </section>
  );
}
