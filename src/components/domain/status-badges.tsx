/**
 * ドメイン共通のバッジ・チップ。
 * 要件 §9.5「状態を色のみで伝達しない」に従い、色に加えて必ずラベル文字を出す。
 */

import { cn } from "@/lib/utils";
import {
  chipStatusLabel,
  ledgerCategoryLabel,
  type ChipStatus,
  type LedgerCategory,
  type MatingCheckResult,
} from "@/lib/domain/enums";

/** 台帳区分（繁殖犬 / 販売用 / 繁殖引退 / 販売済） */
export function CategoryBadge({
  category,
  className,
}: {
  category: LedgerCategory;
  className?: string;
}) {
  const styles: Record<LedgerCategory, string> = {
    breeding: "bg-[#23262a] text-white",
    for_sale: "bg-primary text-primary-foreground",
    retired: "bg-muted text-muted-foreground",
    sold: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
        styles[category],
        className,
      )}
    >
      {ledgerCategoryLabel[category]}
    </span>
  );
}

/** マイクロチップの登録状況。未登録・未装着は注意色で出す */
export function ChipStatusLabel({
  status,
  className,
}: {
  status: ChipStatus;
  className?: string;
}) {
  const styles: Record<ChipStatus, string> = {
    registered: "text-foreground",
    implanted_only: "text-[#b2402f] font-medium",
    none: "text-[#b2402f] font-medium",
  };
  return (
    <span className={cn("text-[12.5px]", styles[status], className)}>
      {chipStatusLabel[status]}
    </span>
  );
}

/** 交配判定（交配可 / 要確認 / 交配不可）＋妊娠中 */
export function JudgementBadge({
  judgement,
  label,
  className,
}: {
  judgement: MatingCheckResult | "pregnant";
  label: string;
  className?: string;
}) {
  const styles: Record<MatingCheckResult | "pregnant", string> = {
    ok: "bg-[#eaf2ec] text-[#356a48]",
    warning: "bg-[#fdf3e3] text-[#7d5316]",
    prohibited: "bg-[#fbeae7] text-[#8a4235]",
    pregnant: "bg-[#eef0f1] text-[#4b5054]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
        styles[judgement],
        className,
      )}
    >
      {label}
    </span>
  );
}

/** タスクの分類タグ */
export function TaskTag({ tag }: { tag: string }) {
  const styles: Record<string, string> = {
    法令: "bg-[#fbeae7] text-[#8a4235]",
    健康: "bg-[#eaf2ec] text-[#356a48]",
    記録: "bg-[#eef0f1] text-[#4b5054]",
    販売: "bg-[#fbeae7] text-[#8a4235]",
    繁殖: "bg-[#eef0f1] text-[#4b5054]",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[5px] px-2 py-0.5 text-[11.5px] font-medium",
        styles[tag] ?? "bg-muted text-muted-foreground",
      )}
    >
      {tag}
    </span>
  );
}
