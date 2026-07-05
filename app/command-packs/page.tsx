import { Suspense } from "react";
import { CommandPacksPanel } from "@/components/commandPacks/CommandPacksPanel";

export default function CommandPacksPage() {
  return (
    <Suspense fallback={null}>
      <CommandPacksPanel />
    </Suspense>
  );
}
