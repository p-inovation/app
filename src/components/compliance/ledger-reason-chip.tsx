/**
 * 帳簿の「事由」チップ。販売・死亡は注意色、その他は中立色。
 */

import { cn } from "@/lib/utils";
import type { LedgerEntry } from "@/lib/mock/data";

const REASON_STYLE: Record<LedgerEntry["reason"], string> = {
  販売: "bg-[#fbeae7] text-[#8a4235]",
  出生: "bg-muted text-muted-foreground",
  譲渡: "bg-muted text-muted-foreground",
  死亡: "bg-[#fbeae7] text-[#8a4235]",
  取得: "bg-muted text-muted-foreground",
};

export function LedgerReasonChip({
  reason,
  className,
}: {
  reason: LedgerEntry["reason"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
        REASON_STYLE[reason],
        className,
      )}
    >
      {reason}
    </span>
  );
}
