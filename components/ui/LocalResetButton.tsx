"use client";

interface LocalResetButtonProps {
  onReset: () => void;
}

export function LocalResetButton({ onReset }: LocalResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="text-[11px] text-text-muted/50 transition-colors hover:text-text-muted"
    >
      Réinitialiser les données locales
    </button>
  );
}
