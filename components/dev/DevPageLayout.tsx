import Link from "next/link";
import type { ReactNode } from "react";

interface DevPageLayoutProps {
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  links?: { href: string; label: string }[];
}

export function DevPageLayout({ label, title, description, children, links }: DevPageLayoutProps) {
  return (
    <main className="gigi-dev-page">
      <div className="mx-auto max-w-[560px]">
        <p className="gigi-dev-label">{label}</p>
        <h1 className="mt-1.5 text-[22px] font-bold tracking-tight text-text-primary">{title}</h1>
        {description && (
          <p className="mt-2.5 text-[13px] leading-relaxed text-text-secondary">{description}</p>
        )}
        {children}
        {links && links.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-text-secondary transition-colors hover:text-accent-soft"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
