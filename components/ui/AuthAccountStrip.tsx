"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

function shortEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return email.slice(0, 18);
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length <= 10) return email;
  return `${local.slice(0, 8)}…@${domain}`;
}

export function AuthAccountStrip() {
  const { status, user, signOut } = useAuth();

  if (status === "loading") {
    return (
      <p className="text-[11px] text-text-muted/60" aria-live="polite">
        Compte…
      </p>
    );
  }

  if (status === "not_configured") {
    return <p className="text-[11px] text-text-muted/60">Mode local</p>;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] text-text-muted/60">Erreur auth</p>
        <Link
          href="/auth"
          className="text-[11px] text-text-muted transition-colors hover:text-text-secondary"
        >
          Connexion
        </Link>
      </div>
    );
  }

  if (status === "authenticated" && user?.email) {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="truncate text-[11px] text-text-muted" title={user.email}>
          {shortEmail(user.email)}
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-left text-[11px] text-text-secondary transition-colors hover:text-accent-soft"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-text-muted/60">Local</span>
      <Link
        href="/auth"
        className="text-text-secondary transition-colors hover:text-accent-soft"
      >
        Connexion
      </Link>
    </div>
  );
}

/** Discreet mobile link — only when Supabase is configured and user is anonymous. */
export function AuthMobileLink() {
  const { status } = useAuth();

  if (status !== "anonymous") return null;

  return (
    <Link
      href="/auth"
      className="ml-auto text-[12px] text-text-muted transition-colors hover:text-text-secondary"
    >
      Connexion
    </Link>
  );
}
