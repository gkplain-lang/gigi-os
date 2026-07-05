import { Suspense } from "react";
import { GuidedActionFlowPanel } from "@/components/guidedActionFlow/GuidedActionFlowPanel";

export default function GuidedActionsPage() {
  return (
    <Suspense fallback={null}>
      <GuidedActionFlowPanel />
    </Suspense>
  );
}
