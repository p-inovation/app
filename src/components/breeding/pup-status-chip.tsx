/**
 * 産次一覧の子犬状態チップ（予=予約済 / 売=販売済 / 保=保有中 / 死=死亡）。
 * 要件 §9.5 に従い、色に加えて文字（予/売/保/死）自体をラベルとして出す。
 */

import { cn } from "@/lib/utils";

export type PupStatus = "予" | "売" | "保" | "死";

const styles: Record<PupStatus, string> = {
  予: "bg-[#eaf2ec] text-[#356a48]",
  売: "bg-[#356a48] text-white",
  保: "bg-muted text-muted-foreground",
  死: "bg-[#fbeae7] text-[#8a4235]",
};

export function PupStatusChip({ status }: { status: PupStatus }) {
  return (
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-[5px] text-[11.5px] font-medium",
        styles[status],
      )}
      title={pupStatusTitle[status]}
    >
      {status}
    </span>
  );
}

const pupStatusTitle: Record<PupStatus, string> = {
  予: "予約済",
  売: "販売済",
  保: "保有中",
  死: "死亡",
};
