"use client";

import Link from "next/link";

interface QuickLink {
  href: string;
  label: string;
}

interface MVPQuickLinksProps {
  links: QuickLink[];
  className?: string;
}

export function MVPQuickLinks({ links, className }: MVPQuickLinksProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="gigi-focus text-[12.5px] font-medium text-accent-soft underline-offset-2 hover:underline"
        >
          {l.label} →
        </Link>
      ))}
    </div>
  );
}
