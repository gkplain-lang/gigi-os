"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeAuthCallback } from "@/modules/supabase/auth";

type CallbackState = "loading" | "success" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [state, setState] = useState<CallbackState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const result = await completeAuthCallback();
      if (cancelled) return;

      if (result.ok) {
        setState("success");
        router.replace("/");
        return;
      }

      setState("error");
      setError(result.error ?? "Impossible de finaliser la connexion.");
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="animate-fade-in mx-auto max-w-md pt-8 text-center">
      {state === "loading" && (
        <>
          <p className="text-[15px] font-medium text-text-primary">Connexion en cours…</p>
          <p className="mt-2 text-[13.5px] text-text-muted">
            Vérification de ta session et préparation du profil.
          </p>
        </>
      )}

      {state === "success" && (
        <p className="text-[14px] text-text-secondary">Redirection vers Mission…</p>
      )}

      {state === "error" && (
        <div className="gigi-panel rounded-xl p-5 text-left">
          <p className="text-[15px] font-medium text-text-primary">Échec de la connexion</p>
          <p className="mt-2 text-[13.5px] text-[#c98f8f]" role="alert">
            {error}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/auth"
              className="gigi-btn-primary gigi-focus inline-flex justify-center rounded-lg px-4 py-2.5 text-[14px] font-medium"
            >
              Réessayer
            </Link>
            <Link
              href="/"
              className="text-center text-[13px] text-text-muted transition-colors hover:text-text-secondary"
            >
              Retour à Mission
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
