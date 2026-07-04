"use client";

import { useEffect, useState } from "react";
import { fetchAiAvailability } from "./aiProvider";
import type { AiAvailability } from "./types";

export function useAiAvailability() {
  const [availability, setAvailability] = useState<AiAvailability>("not_configured");
  const [provider, setProvider] = useState<string>("none");
  const [model, setModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void fetchAiAvailability().then((status) => {
      if (cancelled) return;
      setAvailability(status.availability);
      setProvider(status.provider);
      setModel(status.model);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    availability,
    provider,
    model,
    loading,
    isAiConfigured: availability === "available",
  };
}
