/**
 * マイクロチップの登録状況チップ。要件 §9.5 に従い色に加えてラベル文字を出す。
 */

import { cn } from "@/lib/utils";
import type { ChipRow } from "@/lib/mock/data";

const CHIP_STATUS_STYLE: Record<ChipRow["status"], string> = {
  registered: "bg-[#eaf2ec] text-[#356a48]",
  implanted_only: "bg-[#fdf6ea] text-[#7d5316]",
  none: "bg-[#fbeae7] text-[#8a4235]",
};

export function ChipStatusChip({
  status,
  label,
  className,
}: {
  status: ChipRow["status"];
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
        CHIP_STATUS_STYLE[status],
        className,
      )}
    >
      {label}
    </span>
  );
}
