import { Suspense } from "react";
import { ConversationPageContent } from "@/components/conversation/ConversationPageContent";

export default function ConversationPage() {
  return (
    <Suspense fallback={null}>
      <ConversationPageContent />
    </Suspense>
  );
}
