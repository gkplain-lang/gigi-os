interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-9">
      <h1 className="font-display text-[1.75rem] font-medium tracking-tight text-text-primary md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
