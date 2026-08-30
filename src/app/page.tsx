import { PageBody, Panel, PanelHeader } from "@/components/domain/page-parts";
import { ComplianceStrip } from "@/components/dashboard/compliance-strip";
import { TaskList } from "@/components/dashboard/task-list";
import { AnimalSummaryPanel } from "@/components/dashboard/animal-summary-panel";
import { InquiryStatsPanel } from "@/components/dashboard/inquiry-stats-panel";
import {
  complianceSummary,
  forSaleBreakdown,
  inquiryStats,
  ledgerCounts,
  tasks,
} from "@/lib/mock/data";

export default function Home() {
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <PageBody className="space-y-4">
      <ComplianceStrip summary={complianceSummary} lastCheckedAt="09:02" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Panel>
          <PanelHeader
            title="今日やること"
            action={
              <span className="text-[12.5px] text-muted-foreground">
                <span className="tabular">{doneCount}</span> /{" "}
                <span className="tabular">{tasks.length}</span> 完了
              </span>
            }
          />
          <TaskList tasks={tasks} />
        </Panel>

        <div className="space-y-4">
          <AnimalSummaryPanel counts={ledgerCounts} breakdown={forSaleBreakdown} />
          <InquiryStatsPanel stats={inquiryStats} />
        </div>
      </div>
    </PageBody>
  );
}
