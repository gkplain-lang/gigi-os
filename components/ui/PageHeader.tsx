import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  meta?: string;
  right?: ReactNode;
}

export function PageHeader({ title, meta, right }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-[rgba(124,140,255,0.18)] pb-4">
      <div>
        <h1 className="text-[21px] font-bold tracking-tight text-text-primary md:text-[24px]">
          {title}
        </h1>
        {meta && <p className="mt-1.5 text-[14px] text-text-secondary">{meta}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
