/**
 * 数値規制の判定値。モックアップの「数値規制の判定設定」画面で事業者が変更できる値。
 *
 * 環境省令の上限値を初期値として持ち、自治体の条例で厳しい基準がある場合に上書きする。
 * ダッシュボードの警告・交配可否・販売可否はすべてこの値で判定する。
 */

export type Thresholds = {
  /** 従業員1人あたりの繁殖犬の上限（頭） */
  breedingDogsPerStaff: number;
  /** 販売・引渡しができる日齢（日）＝8週齢規制 */
  sellableFromDays: number;
  /** 交配時の雌の年齢上限（歳） */
  damMaxAgeYears: number;
  /** 生涯出産回数の上限（回） */
  maxLifetimeBirths: number;
  /** マイクロチップ装着から環境省DB登録までの期限（日） */
  chipRegistrationDeadlineDays: number;
};

/** 環境省令の上限値（初期値） */
export const defaultThresholds: Thresholds = {
  breedingDogsPerStaff: 15,
  sellableFromDays: 56,
  damMaxAgeYears: 6,
  maxLifetimeBirths: 6,
  chipRegistrationDeadlineDays: 30,
};
