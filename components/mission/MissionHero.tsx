interface MissionHeroProps {
  dateLabel: string;
}

export function MissionHero({ dateLabel }: MissionHeroProps) {
  return (
    <header className="mb-10 animate-fade-in md:mb-12">
      <p className="text-sm capitalize text-text-muted">{dateLabel}</p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-snug tracking-tight text-text-primary md:text-4xl">
        Today, Gigi chose one mission for you.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
        Not everything matters today. One mission. No noise.
      </p>
    </header>
  );
}
