/**
 * 一覧上部のフィルタタブ。件数は `ledgerCounts`（固定値）をそのまま出す。
 * 区分タブは色ドット＋ラベルで表す（要件 §9.5：色だけで状態を伝えない）。
 */

import { cn } from "@/lib/utils";
import { ledgerCategoryLabel, type LedgerCategory } from "@/lib/domain/enums";
import { ledgerCounts } from "@/lib/mock/data";

export type LedgerFilter = "all" | LedgerCategory;

const DOT_COLOR: Record<LedgerCategory, string> = {
  breeding: "bg-[#23262a]",
  for_sale: "bg-primary",
  retired: "bg-muted-foreground/50",
  sold: "bg-muted-foreground/50",
};

const TABS: { key: LedgerFilter; label: string; count: number; dot?: string }[] = [
  { key: "all", label: "全て", count: ledgerCounts.all },
  {
    key: "breeding",
    label: ledgerCategoryLabel.breeding,
    count: ledgerCounts.breeding,
    dot: DOT_COLOR.breeding,
  },
  {
    key: "for_sale",
    label: ledgerCategoryLabel.for_sale,
    count: ledgerCounts.for_sale,
    dot: DOT_COLOR.for_sale,
  },
  {
    key: "retired",
    label: ledgerCategoryLabel.retired,
    count: ledgerCounts.retired,
    dot: DOT_COLOR.retired,
  },
  { key: "sold", label: ledgerCategoryLabel.sold, count: ledgerCounts.sold },
];

export function FilterTabs({
  value,
  onChange,
}: {
  value: LedgerFilter;
  onChange: (v: LedgerFilter) => void;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      {TABS.map((tab) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            aria-pressed={active}
            className={cn(
              "flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors",
              active
                ? "bg-[#23262a] text-white"
                : "bg-muted text-foreground hover:bg-muted/70",
            )}
          >
            {tab.dot ? (
              <span
                aria-hidden
                className={cn("size-1.5 shrink-0 rounded-full", tab.dot)}
              />
            ) : null}
            {tab.label}
            <span
              className={cn(
                "tabular",
                active ? "text-white/80" : "text-muted-foreground",
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
