import { SectionHeader } from "@/components/ui/SectionHeader";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import { mockHistory } from "@/data/mockHistory";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader
        title="Historique"
        subtitle="Gigi garde en mémoire ce qui a compté — les décisions, et ce qui a été mis en pause."
      />
      <HistoryTimeline events={mockHistory} />
    </div>
  );
}
