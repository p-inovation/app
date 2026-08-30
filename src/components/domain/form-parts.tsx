"use client";

/**
 * フォーム共通の部品。
 * モックアップの入力画面は全て同じ型：
 *   大きな問いかけ見出し → 補足文 → 引き継ぎヒント帯 → 項目 → 判定メッセージ → 下部の操作
 *
 * 選択肢はプルダウンではなく大きなタップ領域のセグメントで出す（要件 §9.1 タップ領域44px以上）。
 */

import { cn } from "@/lib/utils";

/** 「どんな記録を追加しますか」のような問いかけ見出し */
export function FormHeading({
  title,
  description,
}: {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-[19px] font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** 前回値の引き継ぎヒント帯（「前回と同じ」ボタンを右に置く） */
export function HintBar({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-[#c7d5cb] bg-[#f7faf8] px-4 py-3">
      <p className="min-w-0 flex-1 text-[12.5px] text-[#4b5054]">{children}</p>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** 項目ラベル。必須/任意の注記を右に添える */
export function FieldLabel({
  htmlFor,
  children,
  hint,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex flex-wrap items-baseline gap-x-2 text-[13px] font-medium"
    >
      {children}
      {required ? (
        <span className="text-[11.5px] font-normal text-muted-foreground">
          必須
        </span>
      ) : null}
      {hint ? (
        <span className="text-[11.5px] font-normal text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/** 入力1件ぶんの縦積み */
export function FormRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-5", className)}>{children}</div>;
}

/** 区切りの小見出し（「生まれ」「基本情報」など） */
export function FormSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-7 mb-3 border-b border-border pb-2 text-[12.5px] font-medium text-[#3f6d7d]">
      {children}
    </p>
  );
}

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  /** 選べない場合の理由。指定するとボタンを無効化する */
  disabledReason?: string;
};

/**
 * セグメント選択。単一選択・複数選択の両方に使う。
 * ネイティブの button を使い、選択状態は aria-pressed で伝える。
 */
export function SegmentGroup<T extends string>({
  options,
  value,
  onChange,
  multiple = false,
  name,
}: {
  options: readonly SegmentOption<T>[];
  value: T | T[] | undefined;
  onChange: (next: T) => void;
  multiple?: boolean;
  name?: string;
}) {
  const selected = (v: T) =>
    multiple ? Array.isArray(value) && value.includes(v) : value === v;

  return (
    <div role={multiple ? "group" : "radiogroup"} aria-label={name} className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const isSelected = selected(opt.value);
        const disabled = Boolean(opt.disabledReason);
        return (
          <button
            key={opt.value}
            type="button"
            role={multiple ? undefined : "radio"}
            aria-checked={multiple ? undefined : isSelected}
            aria-pressed={multiple ? isSelected : undefined}
            aria-disabled={disabled || undefined}
            title={opt.disabledReason}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "min-h-11 min-w-[84px] rounded-lg border px-4 text-[13.5px] transition-colors",
              isSelected
                ? "border-primary bg-primary font-medium text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted",
              disabled &&
                "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-60 hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** 入力欄の下に出すエラー文 */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-[12px] text-[#b2402f]">
      {message}
    </p>
  );
}

/**
 * 下部の操作バー。
 * モバイルでは画面下に固定し、片手で押せる位置に主ボタンを置く。
 */
export function FormActions({
  submitLabel = "登録する",
  onCancel,
  cancelLabel = "やめる",
  hint,
  pending,
}: {
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  hint?: string;
  pending?: boolean;
}) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-5">
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 rounded-lg border border-border bg-card px-5 text-[13.5px] hover:bg-muted"
        >
          {cancelLabel}
        </button>
      ) : null}
      {hint ? (
        <p className="ml-auto hidden text-[12px] text-muted-foreground sm:block">
          {hint}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "min-h-11 rounded-lg bg-primary px-6 text-[13.5px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
          hint ? "" : "ml-auto",
        )}
      >
        {pending ? "送信中…" : submitLabel}
      </button>
    </div>
  );
}
