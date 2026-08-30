/**
 * 「いま飼養している犬」パネル。台帳区分の内訳を積み上げバー＋凡例で見せる。
 */

import { Panel, PanelHeader } from "@/components/domain/page-parts";
import { cn } from "@/lib/utils";
import type { ledgerCounts, forSaleBreakdown } from "@/lib/mock/data";

const legend = [
  { key: "breeding", label: "繁殖犬（母犬・父犬）", dot: "bg-[#23262a]" },
  { key: "for_sale", label: "販売用の子犬", dot: "bg-primary" },
  { key: "retired", label: "繁殖引退", dot: "bg-muted-foreground/30" },
] as const;

export function AnimalSummaryPanel({
  counts,
  breakdown,
}: {
  counts: typeof ledgerCounts;
  breakdown: typeof forSaleBreakdown;
}) {
  const total = counts.breeding + counts.for_sale + counts.retired;
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);

  return (
    <Panel>
      <PanelHeader title="いま飼養している犬" />
      <div className="px-4 py-4 md:px-5">
        <p className="flex items-baseline gap-1">
          <span className="tabular text-[30px] leading-none font-semibold">
            {counts.all}
          </span>
          <span className="text-[12px] text-muted-foreground">頭</span>
        </p>

        <div className="mt-3.5 flex h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-[#23262a]"
            style={{ width: `${pct(counts.breeding)}%` }}
          />
          <div
            className="h-full bg-primary"
            style={{ width: `${pct(counts.for_sale)}%` }}
          />
          <div
            className="h-full bg-muted-foreground/30"
            style={{ width: `${pct(counts.retired)}%` }}
          />
        </div>

        <ul className="mt-3.5 space-y-2">
          {legend.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-2 text-[13px]"
            >
              <span className={cn("size-2 shrink-0 rounded-full", item.dot)} />
              <span className="min-w-0 flex-1 text-foreground">
                {item.label}
              </span>
              <span className="tabular font-medium">{counts[item.key]}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-3.5">
          <p className="text-[12px] text-muted-foreground">
            販売用{counts.for_sale}頭の内訳
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-[5px] bg-[#eaf2ec] px-2.5 py-1 text-[12px] font-medium text-[#356a48]">
              すぐ引き渡せる <span className="tabular ml-1">{breakdown.ready}</span>
            </span>
            <span className="inline-flex items-center rounded-[5px] bg-muted px-2.5 py-1 text-[12px] font-medium text-muted-foreground">
              予約済 <span className="tabular ml-1">{breakdown.reserved}</span>
            </span>
            <span className="inline-flex items-center rounded-[5px] bg-[#fbeae7] px-2.5 py-1 text-[12px] font-medium text-[#8a4235]">
              8週齢待ち <span className="tabular ml-1">{breakdown.waiting}</span>
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}
