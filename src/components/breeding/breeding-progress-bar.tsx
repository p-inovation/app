/**
 * 交配・出産予定の進捗バー。
 * 妊娠中は主色（緑）、妊娠確認待ちは淡い茶（要件どおり色分けするが、右にラベルも添えて色だけに頼らない）。
 */

import { cn } from "@/lib/utils";

export function BreedingProgressBar({
  progress,
  tone,
}: {
  progress: number;
  tone: "pregnant" | "confirming";
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full",
          tone === "pregnant" ? "bg-primary" : "bg-[#c9a08d]",
        )}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
