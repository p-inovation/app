/**
 * 画面共通の枠組み。モックアップの余白・カード・注意帯の型をここに集約する。
 */

import Link from "next/link";
import { ChevronLeft, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** ページ本体の余白。PC 24-26px / モバイルは下部の操作バーぶん余白を足す */
export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 pt-4 pb-24 md:px-6 md:pt-6 md:pb-10", className)}>
      {children}
    </div>
  );
}

/** 白カード */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card shadow-[0_1px_2px_rgba(16,18,20,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** カード見出し。右側にアクションを置ける */
export function PanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-3.5 md:px-5",
        className,
      )}
    >
      <h2 className="text-[14.5px] font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="text-[12.5px] text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
  );
}

/** 「‹ ダッシュボード」の戻り導線 */
export function BackLink({
  href = "/",
  label = "ダッシュボード",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Button
      // Link は <a> を描画するため、Base UI に native button ではないと伝える
      nativeButton={false}
      render={<Link href={href} />}
      variant="outline"
      size="sm"
      className="mb-4 h-9 bg-card"
    >
      <ChevronLeft className="size-4" />
      {label}
    </Button>
  );
}

/**
 * 注意帯。法令違反は destructive、期限や注意は warning。
 * 要件 §9.5 に従い、色だけでなくアイコンと文言で状態を伝える。
 */
export function NoticeBar({
  tone = "warning",
  title,
  description,
  action,
}: {
  tone?: "warning" | "destructive" | "info";
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const styles = {
    warning: {
      wrap: "border-[#f0dcc0] bg-[#fdf6ea]",
      icon: "bg-[#b4761f] text-white",
      title: "text-[#7d5316]",
      body: "text-[#7d5316]/85",
    },
    destructive: {
      wrap: "border-[#f0d3cd] bg-[#fbeae7]",
      icon: "bg-[#b2402f] text-white",
      title: "text-[#8a4235]",
      body: "text-[#8a4235]/85",
    },
    info: {
      wrap: "border-border bg-[#eef2f4]",
      icon: "bg-[#3f6d7d] text-white",
      title: "text-[#31525e]",
      body: "text-[#31525e]/85",
    },
  }[tone];

  const Icon = tone === "info" ? Info : TriangleAlert;

  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-3 rounded-lg border px-4 py-3.5",
        styles.wrap,
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full",
          styles.icon,
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-[13.5px] font-semibold", styles.title)}>
          {title}
        </p>
        {description ? (
          <p className={cn("mt-1 text-[12.5px] leading-relaxed", styles.body)}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="ml-auto shrink-0">{action}</div> : null}
    </div>
  );
}

/** 定義リストの1項目（カルテの「生年月日 2026-07-08」など） */
export function Field({
  label,
  value,
  mono = false,
  tone,
  className,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  tone?: "danger";
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[11.5px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-[14px]",
          mono && "tabular",
          tone === "danger" && "font-medium text-[#b2402f]",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/** 数値を大きく見せる統計ブロック */
export function StatBlock({
  label,
  value,
  unit,
  note,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  note?: React.ReactNode;
  tone?: "default" | "danger" | "warning" | "success";
}) {
  const valueTone = {
    default: "text-foreground",
    danger: "text-[#b2402f]",
    warning: "text-[#b4761f]",
    success: "text-[#356a48]",
  }[tone];

  return (
    <div className="min-w-0">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1.5 flex items-baseline gap-1">
        <span className={cn("tabular text-[30px] leading-none", valueTone)}>
          {value}
        </span>
        {unit ? (
          <span className="text-[12px] text-muted-foreground">{unit}</span>
        ) : null}
      </p>
      {note ? (
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  );
}
