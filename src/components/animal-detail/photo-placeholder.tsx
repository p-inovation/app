/**
 * 写真プレースホルダ。実画像の代わりに薄い斜線パターンで枠を示す。
 */

import { cn } from "@/lib/utils";

export function PhotoPlaceholder({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden rounded-md border border-border bg-[repeating-linear-gradient(135deg,var(--muted)_0px,var(--muted)_8px,transparent_8px,transparent_16px)] bg-muted/40",
        className,
      )}
    >
      {label ? (
        <span className="w-full truncate bg-gradient-to-t from-black/45 to-transparent px-2 py-1.5 text-[10.5px] font-medium text-white">
          {label}
        </span>
      ) : null}
    </div>
  );
}
