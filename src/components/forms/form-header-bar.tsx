"use client";

/**
 * 入力画面カード上部の共通ヘッダー。
 * 丸い戻る矢印 + 画面名 + パンくず（「ダッシュボード から ／ …」）。
 */

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FormHeaderBar({
  title,
  breadcrumbFrom,
  breadcrumbTo,
  backHref = "/",
}: {
  title: string;
  breadcrumbFrom: string;
  breadcrumbTo: string;
  backHref?: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
      <Button
        // Link は <a> を描画するため、Base UI に native button ではないと伝える
        nativeButton={false}
        render={<Link href={backHref} />}
        variant="outline"
        size="icon"
        className="size-9 shrink-0 rounded-full bg-card"
        aria-label="戻る"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <div className="min-w-0">
        <h1 className="text-[14.5px] font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-[12px] text-muted-foreground">
          {breadcrumbFrom} から ／ {breadcrumbTo}
        </p>
      </div>
    </div>
  );
}
