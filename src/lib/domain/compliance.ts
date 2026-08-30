/**
 * 法令判定。DB側の pet.v_animal_compliance（schema.sql §11）と同じ規則をクライアントでも評価する。
 *
 * サーバ側の検証が正であり、ここでの判定は「操作する前に結果を見せる」ためのもの。
 * 要件 §2 の「操作を試みるまで分からない」課題への対応で、
 * 販売できない個体には販売ボタンを出さない、という判断に使う。
 */

import type { ChipStatus } from "./enums";

/** 8週齢規制：生後56日を経過しない犬猫は販売・引渡しができない */
export const EIGHT_WEEK_DAYS = 56;

/** 日付の時刻成分を落として日単位で比較する */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.floor(ms / 86_400_000);
}

export function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

/** 日齢 */
export function ageInDays(birthDate: Date, today: Date): number {
  return daysBetween(birthDate, today);
}

/**
 * 週齢表示。モックアップは子犬を「6週6日」、成犬を「4歳2か月」と出し分けている。
 * 生後1年未満は週日、それ以上は年月で返す。
 */
export function formatAge(birthDate: Date, today: Date): string {
  const days = ageInDays(birthDate, today);
  if (days < 365) {
    const weeks = Math.floor(days / 7);
    const rest = days % 7;
    return `${weeks}週${rest}日`;
  }
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return months === 0 ? `${years}歳` : `${years}歳${months}か月`;
}

/** 販売解禁日（生年月日 + 56日） */
export function sellableFrom(birthDate: Date): Date {
  return addDays(birthDate, EIGHT_WEEK_DAYS);
}

export type ComplianceRule =
  | "eight_week_rule"
  | "microchip_required"
  | "microchip_not_registered";

export type ComplianceViolation = {
  rule: ComplianceRule;
  message: string;
  /** eight_week_rule のときの販売可能日 */
  sellableFrom?: Date;
};

export type ComplianceInput = {
  birthDate: Date;
  chipStatus: ChipStatus;
  today: Date;
};

export type ComplianceResult = {
  /** 生後56日を経過しているか */
  isEightWeeksPassed: boolean;
  /** 販売解禁日 */
  sellableFrom: Date;
  /** 解禁までの残日数（経過済なら0） */
  daysUntilSellable: number;
  /** 販売登録が可能か。8週齢とチップ登録の両方を満たす必要がある */
  isSellable: boolean;
  violations: ComplianceViolation[];
};

/**
 * 販売可否の判定。
 * v_animal_compliance.is_sellable と同じく「8週齢経過 かつ チップ装着 かつ チップ登録済」を条件とする。
 */
export function evaluateCompliance({
  birthDate,
  chipStatus,
  today,
}: ComplianceInput): ComplianceResult {
  const from = sellableFrom(birthDate);
  const remaining = Math.max(0, daysBetween(today, from));
  const isEightWeeksPassed = remaining === 0;

  const violations: ComplianceViolation[] = [];

  if (!isEightWeeksPassed) {
    violations.push({
      rule: "eight_week_rule",
      message: `生後56日を経過していません。${formatJpDate(from)} 以降に引き渡せます。`,
      sellableFrom: from,
    });
  }
  if (chipStatus === "none") {
    violations.push({
      rule: "microchip_required",
      message: "マイクロチップが未装着です。販売前に装着が必要です。",
    });
  } else if (chipStatus === "implanted_only") {
    violations.push({
      rule: "microchip_not_registered",
      message:
        "装着済みですが環境省データベースに未登録です。販売前に登録が必要です。",
    });
  }

  return {
    isEightWeeksPassed,
    sellableFrom: from,
    daysUntilSellable: remaining,
    isSellable: violations.length === 0,
    violations,
  };
}

/** 2026-09-02 形式 */
export function formatIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 2026年9月2日 形式 */
export function formatJpDate(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 09-02 形式（一覧の省略表示） */
export function formatShortDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}-${day}`;
}
