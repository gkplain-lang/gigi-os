import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
}

export function SecondaryButton({
  children,
  className,
  href,
  ...props
}: SecondaryButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-[20px] bg-[rgba(20,28,26,0.6)] px-5 py-3 text-[15px] text-text-secondary transition-colors hover:bg-[rgba(26,34,32,0.7)] hover:text-text-primary",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
