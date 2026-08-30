/**
 * ダッシュボード最上部の法令チェック帯。4分割で、左2つは赤/黄の淡色背景で注意を引く。
 */

import { StatBlock } from "@/components/domain/page-parts";
import { cn } from "@/lib/utils";
import type { complianceSummary } from "@/lib/mock/data";

export function ComplianceStrip({
  summary,
  lastCheckedAt,
}: {
  summary: typeof complianceSummary;
  lastCheckedAt: string;
}) {
  return (
    <section className="rounded-lg border border-border bg-card shadow-[0_1px_2px_rgba(16,18,20,0.04)]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3.5 md:px-5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#b2402f]" />
        <h2 className="text-[14.5px] font-semibold tracking-tight">
          法令チェック
        </h2>
        <p className="text-[12.5px] text-muted-foreground">
          8週齢規制・マイクロチップ義務・数値規制・登録更新を毎朝自動判定
        </p>
        <p className="ml-auto text-[12px] text-muted-foreground">
          最終判定 <span className="tabular">{lastCheckedAt}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className={cn(
            "border-b border-border px-4 py-4 sm:border-r md:px-5",
            "bg-[#fbeae7]",
          )}
        >
          <StatBlock
            label="まだ引き渡せない"
            value={summary.notSellableCount}
            unit="頭"
            note={summary.notSellableNote}
            tone="danger"
          />
        </div>
        <div
          className={cn(
            "border-b border-border px-4 py-4 lg:border-r md:px-5",
            "bg-[#fdf6ea]",
          )}
        >
          <StatBlock
            label="チップ未登録"
            value={summary.chipUnregisteredCount}
            unit="頭"
            note={summary.chipUnregisteredNote}
            tone="warning"
          />
        </div>
        <div className="border-b border-border px-4 py-4 sm:border-r sm:border-b-0 md:px-5">
          <p className="text-[12px] text-muted-foreground">
            従業員1人あたり飼養頭数
          </p>
          <p className="mt-1.5 flex items-baseline gap-1">
            <span className="tabular text-[30px] leading-none">
              {summary.perStaffCount}
            </span>
            <span className="text-[12px] text-muted-foreground">
              / {summary.perStaffLimit}
            </span>
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min(100, (summary.perStaffCount / summary.perStaffLimit) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            {summary.perStaffNote}
          </p>
        </div>
        <div className="px-4 py-4 md:px-5">
          <StatBlock
            label="登録の有効期限"
            value={summary.licenseExpiryDays}
            unit="日"
            note={summary.licenseExpiryNote}
          />
        </div>
      </div>
    </section>
  );
}
