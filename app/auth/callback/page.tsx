"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeAuthCallback, ensureUserProfile } from "@/modules/supabase/auth";

type CallbackState = "loading" | "success" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [state, setState] = useState<CallbackState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const runCallback = useCallback(async () => {
    setState("loading");
    setError(null);

    const result = await completeAuthCallback();

    if (result.ok) {
      setState("success");
      router.replace("/");
      return;
    }

    setState("error");
    setError(result.error ?? "Impossible de finaliser la connexion.");
  }, [router]);

  const retryProfile = useCallback(async () => {
    setRetrying(true);
    setState("loading");
    setError(null);

    const result = await ensureUserProfile({ retries: 5 });

    setRetrying(false);

    if (result.ok) {
      setState("success");
      router.replace("/");
      return;
    }

    setState("error");
    setError(result.error ?? "Impossible de récupérer le profil.");
  }, [router]);

  useEffect(() => {
    void runCallback();
  }, [runCallback]);

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
            <button
              type="button"
              onClick={() => void retryProfile()}
              disabled={retrying}
              className="gigi-btn-primary gigi-focus inline-flex justify-center rounded-lg px-4 py-2.5 text-[14px] font-medium disabled:opacity-40"
            >
              {retrying ? "Nouvelle tentative…" : "Réessayer"}
            </button>
            <Link
              href="/auth"
              className="text-center text-[13px] text-text-muted transition-colors hover:text-text-secondary"
            >
              Retour à la connexion
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
