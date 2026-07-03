import { GigiOrb } from "./GigiOrb";

interface GigiPresenceProps {
  message?: string;
}

export function GigiPresence({ message = "Gigi est prêt." }: GigiPresenceProps) {
  return (
    <div className="flex items-center gap-2.5">
      <GigiOrb size="sm" />
      <span className="text-sm text-text-secondary">{message}</span>
    </div>
  );
}
