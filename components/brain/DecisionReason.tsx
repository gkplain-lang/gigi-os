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
        <p className="animate-rise text-[13px] font-medium uppercase tracking-wide text-copper-soft">
          Pourquoi cette mission ?
        </p>
        <h2 className="animate-rise animate-rise-1 mt-4 font-display text-[1.8rem] font-medium leading-[1.12] tracking-tight text-text-primary md:text-[2.4rem]">
          {missionTitle}
        </h2>
        <p className="animate-rise animate-rise-1 mt-2 text-sm text-text-muted">{projectName}</p>

        <p className="animate-rise animate-rise-2 mt-8 text-lg leading-relaxed text-text-secondary">
          Gigi a choisi Buildy Clear parce que c&apos;est le chemin le plus court vers le revenu.
        </p>
        <p className="animate-rise animate-rise-3 mt-4 text-lg leading-relaxed text-text-muted">
          {reasoning}
        </p>

        <p className="animate-rise animate-rise-4 mt-8 text-base text-text-muted">
          C&apos;est une décision de focus, pas une todo list.
        </p>
      </div>
    </section>
  );
}
