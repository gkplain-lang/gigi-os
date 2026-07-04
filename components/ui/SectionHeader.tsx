interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="animate-rise mb-11">
      <h1 className="font-display text-[2rem] font-medium tracking-tight text-text-primary md:text-[2.6rem]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3.5 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
