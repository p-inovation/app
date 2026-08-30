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

/**
 * 不妊去勢措置の実施状況（schema.sql neuter_status）
 */
export const NEUTER_STATUS = ["none", "done", "unknown"] as const;
export type NeuterStatus = (typeof NEUTER_STATUS)[number];
export const neuterStatusLabel: Record<NeuterStatus, string> = {
  none: "未実施",
  done: "実施済",
  unknown: "不明",
};

/** 有無（遺伝性疾患・病歴など。schema.sql presence） */
export const PRESENCE = ["none", "present", "unknown"] as const;
export type Presence = (typeof PRESENCE)[number];
export const presenceLabel: Record<Presence, string> = {
  none: "無し",
  present: "有り",
  unknown: "不明",
};

/** 販売先区分（schema.sql buyer_type） */
export const BUYER_TYPE = ["consumer", "business", "auction"] as const;
export type BuyerType = (typeof BUYER_TYPE)[number];
export const buyerTypeLabel: Record<BuyerType, string> = {
  consumer: "一般消費者",
  business: "事業者",
  auction: "競り・パーク",
};

/** 業態区分（schema.sql business_type / 要件 §3.1） */
export const BUSINESS_TYPE = [
  "breeder",
  "breeder_retail",
  "retail",
  "wholesale",
  "multi_store",
] as const;
export type BusinessType = (typeof BUSINESS_TYPE)[number];
export const businessTypeLabel: Record<BusinessType, string> = {
  breeder: "繁殖業（専業）",
  breeder_retail: "繁殖＋小売",
  retail: "小売（ペットショップ）",
  wholesale: "卸・競り",
  multi_store: "多店舗事業者",
};

/** 選択肢マスタの種別（schema.sql lookup_kind / FR-12） */
export const LOOKUP_KIND = [
  "vaccine",
  "medication",
  "genetic_test",
  "park_venue",
  "pedigree_org",
  "retire_reason",
] as const;
export type LookupKind = (typeof LOOKUP_KIND)[number];
export const lookupKindLabel: Record<LookupKind, string> = {
  vaccine: "ワクチン",
  medication: "投薬名",
  genetic_test: "遺伝子病検査",
  park_venue: "パーク会場",
  pedigree_org: "血統書団体",
  retire_reason: "引退候補理由",
};

/** 交配チェックの判定項目（openapi.yaml MatingCheckResult.findings[].rule / FR-43） */
export const MATING_CHECK_RULE = [
  "inbreeding",
  "dam_age_limit",
  "lifetime_birth_limit",
  "interval_since_last_birth",
  "breeding_prohibited_flag",
  "genetic_test",
] as const;
export type MatingCheckRule = (typeof MATING_CHECK_RULE)[number];
export const matingCheckRuleLabel: Record<MatingCheckRule, string> = {
  inbreeding: "近親度",
  dam_age_limit: "雌の年齢上限",
  lifetime_birth_limit: "生涯出産回数",
  interval_since_last_birth: "前回出産からの間隔",
  breeding_prohibited_flag: "繁殖禁止フラグ",
  genetic_test: "遺伝子病検査",
};

/** ダッシュボードのタスク種別（schema.sql task_kind / FR-03） */
export const TASK_KIND = [
  "inspection_due",
  "vaccine_due",
  "rabies_due",
  "checkup_due",
  "delivery_due",
  "pedigree_pending",
  "annual_report_due",
  "license_renewal_due",
  "microchip_missing",
  "eight_week_reached",
] as const;
export type TaskKind = (typeof TASK_KIND)[number];

/** 通知の3段階（schema.sql task_severity / FR-04）。色だけでなくラベルを併記する（要件 §9.5） */
export const TASK_SEVERITY = ["info", "warning", "overdue"] as const;
export type TaskSeverity = (typeof TASK_SEVERITY)[number];
export const taskSeverityLabel: Record<TaskSeverity, string> = {
  info: "1ヶ月前",
  warning: "2週間前",
  overdue: "期限超過",
};

/** 帳票の種別（schema.sql report_kind / 要件 §8） */
export const REPORT_KIND = [
  "annual_report",
  "retire_check",
  "breeding_ledger",
  "animal_ledger",
  "sales_confirmation",
  "inspection_ledger",
] as const;
export type ReportKind = (typeof REPORT_KIND)[number];
export const reportKindLabel: Record<ReportKind, string> = {
  annual_report: "動物販売業者等定期報告届出書",
  retire_check: "繁殖引退犬・猫チェック",
  breeding_ledger: "繁殖実施状況記録台帳",
  animal_ledger: "犬猫生体管理帳簿",
  sales_confirmation: "販売確認書",
  inspection_ledger: "点検状況記録台帳",
};

/** 生年月日変更依頼の状態（schema.sql birthdate_request_status / FR-26） */
export const BIRTHDATE_REQUEST_STATUS = [
  "pending",
  "approved",
  "rejected",
] as const;
export type BirthdateRequestStatus = (typeof BIRTHDATE_REQUEST_STATUS)[number];
export const birthdateRequestStatusLabel: Record<
  BirthdateRequestStatus,
  string
> = {
  pending: "申請中",
  approved: "承認済",
  rejected: "却下",
};

// ---------------------------------------------------------------------------
// 派生値
// DB に列を持たず、複数列から画面表示用に導出する概念。
// ---------------------------------------------------------------------------

/**
 * 台帳区分を animals.status と animals.is_breeding_animal から導出する。
 * DB に対応する ENUM は無い（表示のためだけの区分）。
 */
export function deriveLedgerCategory(animal: {
  status: AnimalStatus;
  isBreedingAnimal: boolean;
}): LedgerCategory {
  if (animal.status === "sold") return "sold";
  if (animal.status === "retired") return "retired";
  return animal.isBreedingAnimal ? "breeding" : "for_sale";
}

/**
 * チップの状況を animals の2列から導出する。
 * v_animal_compliance の has_microchip / is_microchip_registered と同じ判定。
 */
export function deriveChipStatus(animal: {
  microchipNo: string | null;
  microchipRegisteredOn: string | null;
}): ChipStatus {
  if (!animal.microchipNo) return "none";
  return animal.microchipRegisteredOn ? "registered" : "implanted_only";
}
