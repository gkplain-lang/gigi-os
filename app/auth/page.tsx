"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { ASSISTANT_NAME, PRODUCT_NAME } from "@/lib/branding";

export default function AuthPage() {
  const { status, user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await signIn(email);
    setSubmitting(false);

    if (result.ok) {
      setSuccess(true);
    } else {
      setError(result.error ?? "Une erreur est survenue.");
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-md">
      <PageHeader
        title={`Connexion à ${PRODUCT_NAME}`}
        meta={`La connexion servira bientôt à synchroniser ta mémoire ${ASSISTANT_NAME}. Pour l'instant, ${PRODUCT_NAME} reste utilisable en local.`}
      />

      {status === "not_configured" && (
        <div className="gigi-panel mb-4 rounded-xl p-4">
          <p className="text-[14px] text-text-secondary">
            Supabase n&apos;est pas configuré. L&apos;app fonctionne entièrement en local.
          </p>
        </div>
      )}

      {status === "authenticated" && user?.email && (
        <div className="gigi-panel mb-4 rounded-xl p-4">
          <p className="text-[14px] text-text-secondary">
            Tu es déjà connecté en tant que{" "}
            <span className="text-text-primary">{user.email}</span>.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-[13px] text-accent transition-colors hover:text-accent-soft"
          >
            Retour à Mission
          </Link>
        </div>
      )}

      {(status === "anonymous" || status === "error") && (
        <form onSubmit={handleSubmit} className="gigi-panel space-y-4 rounded-xl p-5">
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-[13px] text-text-secondary">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="gigi-focus w-full rounded-lg border border-border bg-bg-base px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted/50"
            />
          </div>

          {success && (
            <p className="text-[13.5px] text-ok" role="status">
              Lien envoyé. Vérifie tes emails.
            </p>
          )}

          {error && (
            <p className="text-[13.5px] text-[#c98f8f]" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="gigi-btn-primary gigi-focus w-full rounded-lg px-4 py-2.5 text-[14px] font-medium disabled:opacity-40"
          >
            {submitting ? "Envoi…" : "Recevoir le lien de connexion"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center">
        <Link
          href="/"
          className="text-[13px] text-text-muted transition-colors hover:text-text-secondary"
        >
          ← Retour à Mission
        </Link>
      </p>
    </div>
  );
}
