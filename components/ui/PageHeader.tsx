import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  meta?: string;
  right?: ReactNode;
}

export function PageHeader({ title, meta, right }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <h1 className="text-[20px] font-semibold tracking-tight text-text-primary md:text-[22px]">
          {title}
        </h1>
        {meta && <p className="mt-1 text-[13.5px] text-text-muted">{meta}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
