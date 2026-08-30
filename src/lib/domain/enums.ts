/**
 * ドメイン列挙。DBスキーマ（docs/system_plan/schema/schema.sql §1）の ENUM と1対1で対応させる。
 * 値は DB と同じ英字コード、表示は日本語ラベルを引く。
 */

export const SPECIES = ["dog", "cat"] as const;
export type Species = (typeof SPECIES)[number];
export const speciesLabel: Record<Species, string> = {
  dog: "犬",
  cat: "猫",
};

export const SEX = ["male", "female"] as const;
export type Sex = (typeof SEX)[number];
export const sexLabel: Record<Sex, string> = {
  male: "オス",
  female: "メス",
};

/** 個体のライフサイクル状態（要件 §4.1「07 出口」） */
export const ANIMAL_STATUS = [
  "draft",
  "active",
  "sold",
  "transferred",
  "retired",
  "dead",
] as const;
export type AnimalStatus = (typeof ANIMAL_STATUS)[number];
export const animalStatusLabel: Record<AnimalStatus, string> = {
  draft: "下書き",
  active: "飼養中",
  sold: "販売済",
  transferred: "移動済",
  retired: "繁殖引退",
  dead: "死亡",
};

/**
 * 台帳上の区分。モックアップの「繁殖犬 / 販売用 / 繁殖引退 / 販売済」に対応する。
 * status と is_breeding_animal から導出する表示用の区分。
 */
export const LEDGER_CATEGORY = [
  "breeding",
  "for_sale",
  "retired",
  "sold",
] as const;
export type LedgerCategory = (typeof LEDGER_CATEGORY)[number];
export const ledgerCategoryLabel: Record<LedgerCategory, string> = {
  breeding: "繁殖犬",
  for_sale: "販売用",
  retired: "繁殖引退",
  sold: "販売済",
};

/** 健康記録の区分（要件 FR-27） */
export const HEALTH_RECORD_TYPE = [
  "vaccine",
  "rabies",
  "genetic_test",
  "preventive",
  "treatment",
  "daily_note",
  "checkup",
  "other",
] as const;
export type HealthRecordType = (typeof HEALTH_RECORD_TYPE)[number];
export const healthRecordTypeLabel: Record<HealthRecordType, string> = {
  vaccine: "ワクチン",
  rabies: "狂犬病",
  genetic_test: "遺伝子検査",
  preventive: "駆虫・予防薬",
  treatment: "通院・治療",
  daily_note: "日常特記",
  checkup: "健康診断",
  other: "その他",
};

/**
 * 健康記録フォームで前面に出す区分。
 * モックアップは「ワクチン / 駆虫 / 検査 / 通院・治療」の4つをセグメントで提示している。
 */
export const HEALTH_FORM_TYPES = [
  "vaccine",
  "preventive",
  "genetic_test",
  "treatment",
] as const satisfies readonly HealthRecordType[];

/** 繁殖実施の状態遷移（要件 §4.1） */
export const BREEDING_STATUS = [
  "planned",
  "mated",
  "pregnant",
  "delivered",
  "registered",
  "cancelled",
] as const;
export type BreedingStatus = (typeof BREEDING_STATUS)[number];
export const breedingStatusLabel: Record<BreedingStatus, string> = {
  planned: "計画",
  mated: "交配済",
  pregnant: "妊娠中",
  delivered: "出産済",
  registered: "登録済",
  cancelled: "中止",
};

/** 交配チェックの判定結果（要件 FR-43：警告と禁止を区別する） */
export const MATING_CHECK_RESULT = ["ok", "warning", "prohibited"] as const;
export type MatingCheckResult = (typeof MATING_CHECK_RESULT)[number];
export const matingCheckResultLabel: Record<MatingCheckResult, string> = {
  ok: "交配可",
  warning: "要確認",
  prohibited: "交配不可",
};

/** ロール（要件 §3.3） */
export const USER_ROLE = ["admin", "manager", "staff", "viewer"] as const;
export type UserRole = (typeof USER_ROLE)[number];
export const userRoleLabel: Record<UserRole, string> = {
  admin: "管理者",
  manager: "責任者",
  staff: "スタッフ",
  viewer: "閲覧",
};

/** 血統書の進行状態（要件 FR-24） */
export const PEDIGREE_STATUS = [
  "not_applied",
  "applied",
  "arrived",
  "shipped",
] as const;
export type PedigreeStatus = (typeof PEDIGREE_STATUS)[number];
export const pedigreeStatusLabel: Record<PedigreeStatus, string> = {
  not_applied: "未申請",
  applied: "申請中",
  arrived: "到着済",
  shipped: "発送済",
};

/** マイクロチップの登録状況。モックアップの「登録済 / DB未登録 / 未装着」に対応 */
export const CHIP_STATUS = ["registered", "implanted_only", "none"] as const;
export type ChipStatus = (typeof CHIP_STATUS)[number];
export const chipStatusLabel: Record<ChipStatus, string> = {
  registered: "登録済",
  implanted_only: "DB未登録",
  none: "未装着",
};
