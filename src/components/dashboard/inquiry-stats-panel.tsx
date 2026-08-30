/**
 * 「引合いの状況」パネル。横バーで件数を見せる。
 */

import { Panel, PanelHeader } from "@/components/domain/page-parts";
import { cn } from "@/lib/utils";
import type { inquiryStats } from "@/lib/mock/data";

const barTone: Record<(typeof inquiryStats)[number]["tone"], string> = {
  muted: "bg-muted-foreground/25",
  accent: "bg-[#c99a76]",
  primary: "bg-primary",
};

export function InquiryStatsPanel({
  stats,
}: {
  stats: typeof inquiryStats;
}) {
  const max = Math.max(...stats.map((s) => s.count), 1);

  return (
    <Panel>
      <PanelHeader title="引合いの状況" />
      <div className="space-y-3 px-4 py-4 md:px-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-[12.5px] text-muted-foreground">
              {stat.label}
            </span>
            <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", barTone[stat.tone])}
                style={{ width: `${(stat.count / max) * 100}%` }}
              />
            </div>
            <span className="tabular w-6 shrink-0 text-right text-[13px] font-medium">
              {stat.count}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
