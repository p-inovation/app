/**
 * モックデータ。モックアップ（ブリーダー管理システム (1).html）の表示値をそのまま写している。
 * API接続時はこのモジュールをデータ取得層に差し替える。
 */

import type {
  BreedingStatus,
  ChipStatus,
  LedgerCategory,
  MatingCheckResult,
  PedigreeStatus,
  Sex,
  Species,
} from "@/lib/domain/enums";

/** 画面全体の基準日。モックアップのヘッダー表示「2026-08-25 火」に合わせる */
export const TODAY = new Date(2026, 7, 25);

export type Office = {
  name: string;
  licenseNo: string;
  prefecture: string;
};

export const office: Office = {
  name: "白川ケンネル",
  prefecture: "東京都",
  licenseNo: "第26-0412号",
};

export type CurrentUser = {
  name: string;
  title: string;
};

export const currentUser: CurrentUser = {
  name: "田村 志保",
  title: "動物取扱責任者",
};

export type Animal = {
  id: string;
  ledgerNo: string;
  callName: string;
  registeredName: string;
  species: Species;
  breed: string;
  sex: Sex;
  birthDate: Date;
  chipStatus: ChipStatus;
  category: LedgerCategory;
  /** 一覧右端の補足（「予約済・8週齢待ち」など）。モックアップの文言をそのまま持つ */
  note: string;
  pedigreeStatus: PedigreeStatus;
  coatColor?: string;
  currentWeightG?: number;
  litterNo?: string;
  /** 母個体の生涯出産回数（繁殖犬のみ） */
  lifetimeBirthCount?: number;
  maxBirthCount?: number;
  lastDeliveredOn?: Date;
};

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

export const animals: Animal[] = [
  {
    id: "a-0142",
    ledgerNo: "IND-2026-0142",
    callName: "モモ",
    registeredName: "Momo of Shirakawa Kennel",
    species: "dog",
    breed: "トイ・プードル",
    sex: "female",
    birthDate: d(2026, 7, 8),
    chipStatus: "registered",
    category: "for_sale",
    note: "予約済・8週齢待ち",
    pedigreeStatus: "applied",
    coatColor: "レッド",
    currentWeightG: 1180,
    litterNo: "LIT-0037",
  },
  {
    id: "a-0143",
    ledgerNo: "IND-2026-0143",
    callName: "コハク",
    registeredName: "Kohaku of Shirakawa Kennel",
    species: "dog",
    breed: "トイ・プードル",
    sex: "male",
    birthDate: d(2026, 7, 8),
    chipStatus: "implanted_only",
    category: "for_sale",
    note: "8週齢待ち",
    pedigreeStatus: "applied",
    coatColor: "アプリコット",
    currentWeightG: 1240,
    litterNo: "LIT-0037",
  },
  {
    id: "a-0141",
    ledgerNo: "IND-2026-0141",
    callName: "ナナ",
    registeredName: "Nana of Shirakawa Kennel",
    species: "dog",
    breed: "トイ・プードル",
    sex: "female",
    birthDate: d(2026, 7, 8),
    chipStatus: "implanted_only",
    category: "for_sale",
    note: "8週齢待ち",
    pedigreeStatus: "applied",
    coatColor: "レッド",
    currentWeightG: 1090,
    litterNo: "LIT-0037",
  },
  {
    id: "a-0138",
    ledgerNo: "IND-2026-0138",
    callName: "ソラ",
    registeredName: "Sora of Shirakawa Kennel",
    species: "dog",
    breed: "柴",
    sex: "male",
    birthDate: d(2026, 6, 2),
    chipStatus: "registered",
    category: "for_sale",
    note: "すぐ引き渡せる",
    pedigreeStatus: "arrived",
    coatColor: "赤",
    currentWeightG: 3200,
  },
  {
    id: "a-0136",
    ledgerNo: "IND-2026-0136",
    callName: "きなこ",
    registeredName: "Kinako of Shirakawa Kennel",
    species: "dog",
    breed: "ポメラニアン",
    sex: "female",
    birthDate: d(2026, 5, 21),
    chipStatus: "registered",
    category: "for_sale",
    note: "予約済・引渡 09-06",
    pedigreeStatus: "arrived",
    coatColor: "オレンジ",
    currentWeightG: 1650,
    litterNo: "LIT-0036",
  },
  {
    id: "a-0088",
    ledgerNo: "IND-2024-0088",
    callName: "ハナ",
    registeredName: "Hana of Shirakawa Kennel",
    species: "dog",
    breed: "トイ・プードル",
    sex: "female",
    birthDate: d(2022, 6, 14),
    chipStatus: "registered",
    category: "breeding",
    note: "交配可・産後休養中",
    pedigreeStatus: "shipped",
    lifetimeBirthCount: 3,
    maxBirthCount: 6,
    lastDeliveredOn: d(2026, 7, 8),
  },
  {
    id: "a-0097",
    ledgerNo: "IND-2024-0097",
    callName: "こむぎ",
    registeredName: "Komugi of Shirakawa Kennel",
    species: "dog",
    breed: "トイ・プードル",
    sex: "female",
    birthDate: d(2023, 7, 19),
    chipStatus: "registered",
    category: "breeding",
    note: "妊娠中・出産 10-01",
    pedigreeStatus: "shipped",
    lifetimeBirthCount: 2,
    maxBirthCount: 6,
    lastDeliveredOn: d(2026, 2, 11),
  },
  {
    id: "a-0061",
    ledgerNo: "IND-2023-0061",
    callName: "レイ",
    registeredName: "Rei of Shirakawa Kennel",
    species: "dog",
    breed: "柴",
    sex: "female",
    birthDate: d(2020, 9, 30),
    chipStatus: "registered",
    category: "breeding",
    note: "交配可・残り36日",
    pedigreeStatus: "shipped",
    lifetimeBirthCount: 4,
    maxBirthCount: 6,
    lastDeliveredOn: d(2025, 10, 2),
  },
  {
    id: "a-0055",
    ledgerNo: "IND-2023-0055",
    callName: "さくら",
    registeredName: "Sakura of Shirakawa Kennel",
    species: "dog",
    breed: "柴",
    sex: "female",
    birthDate: d(2020, 4, 12),
    chipStatus: "registered",
    category: "retired",
    note: "年齢上限超・譲渡先検討",
    pedigreeStatus: "shipped",
    lifetimeBirthCount: 5,
    maxBirthCount: 6,
    lastDeliveredOn: d(2025, 4, 18),
  },
  {
    id: "a-0125",
    ledgerNo: "IND-2026-0125",
    callName: "むぎ",
    registeredName: "Mugi of Shirakawa Kennel",
    species: "dog",
    breed: "柴",
    sex: "male",
    birthDate: d(2026, 3, 2),
    chipStatus: "registered",
    category: "sold",
    note: "08-16 引渡し済",
    pedigreeStatus: "shipped",
    litterNo: "LIT-0035",
  },
];

/** 台帳フィルタの件数。モックアップのタブ表示に合わせる */
export const ledgerCounts = {
  all: 32,
  breeding: 19,
  for_sale: 8,
  retired: 5,
  sold: 118,
} as const;

/** 販売用8頭の内訳（ダッシュボード右カラム） */
export const forSaleBreakdown = {
  ready: 2,
  reserved: 3,
  waiting: 3,
} as const;

export type Task = {
  id: string;
  title: string;
  detail: string;
  tag: "法令" | "健康" | "記録" | "販売" | "繁殖";
  done: boolean;
  href?: string;
};

/** ダッシュボードの「今日やること」 */
export const tasks: Task[] = [
  {
    id: "t1",
    title: "モモ（IND-0142）の引渡日を直す",
    detail: "契約 CT-2026-0088 ／ 8週齢規制に抵触",
    tag: "法令",
    done: false,
    href: "/animals/a-0142",
  },
  {
    id: "t2",
    title: "コハク・ナナのチップを環境省DBに登録",
    detail: "装着済 08-20 ／ 販売前に必須",
    tag: "法令",
    done: false,
  },
  {
    id: "t3",
    title: "第3回混合ワクチン — 4頭",
    detail: "LIT-0037 ／ 白川動物病院 15:00",
    tag: "健康",
    done: false,
    href: "/health/new",
  },
  {
    id: "t4",
    title: "体重測定 — 子犬7頭",
    detail: "毎週火曜 ／ 前回 08-18",
    tag: "記録",
    done: false,
  },
  {
    id: "t5",
    title: "中村様 見学対応 13:00",
    detail: "重要事項説明もこの場で実施",
    tag: "販売",
    done: false,
  },
  {
    id: "t6",
    title: "ハナの交配可否を確認",
    detail: "4歳2か月 ／ 生涯出産3回",
    tag: "繁殖",
    done: false,
    href: "/breeding",
  },
];

/** 法令チェック帯（ダッシュボード最上部） */
export const complianceSummary = {
  notSellableCount: 3,
  notSellableNote:
    "生後56日未満。最短の解禁は 9月2日（モモ）。予約済の引渡日と衝突しています。",
  chipUnregisteredCount: 2,
  chipUnregisteredNote:
    "装着は済んでいますが環境省データベースに未登録。販売前に登録が必要です。",
  /** 従業員1人あたり飼養頭数（数値規制） */
  perStaffCount: 9.5,
  perStaffLimit: 15,
  perStaffNote: "繁殖犬19頭 ÷ 常勤2名。上限まで残り11頭。",
  licenseExpiryDays: 218,
  licenseExpiryNote: "2027-03-31 満了。更新申請は3か月前から可能です。",
} as const;

/** 引合いの状況（ダッシュボード右下） */
export const inquiryStats = [
  { label: "新規", count: 9, tone: "muted" as const },
  { label: "対応中", count: 6, tone: "accent" as const },
  { label: "見学予約", count: 4, tone: "primary" as const },
];

export type BreedingCandidate = {
  animalId: string;
  callName: string;
  ledgerNo: string;
  ageLabel: string;
  birthCount: number;
  maxBirthCount: number;
  lastDeliveredOn: Date | null;
  nextMating: string;
  judgement: MatingCheckResult | "pregnant";
  judgementLabel: string;
};

/** 繁殖・産次の「繁殖できる母犬」 */
export const breedingCandidates: BreedingCandidate[] = [
  {
    animalId: "a-0088",
    callName: "ハナ",
    ledgerNo: "IND-2024-0088",
    ageLabel: "4歳2か月",
    birthCount: 3,
    maxBirthCount: 6,
    lastDeliveredOn: d(2026, 7, 8),
    nextMating: "2026-11以降 推奨（産後4か月）",
    judgement: "ok",
    judgementLabel: "交配可",
  },
  {
    animalId: "a-0061",
    callName: "レイ",
    ledgerNo: "IND-2023-0061",
    ageLabel: "5歳11か月",
    birthCount: 4,
    maxBirthCount: 6,
    lastDeliveredOn: d(2025, 10, 2),
    nextMating: "誕生日 09-30 で上限到達",
    judgement: "warning",
    judgementLabel: "残り36日",
  },
  {
    animalId: "a-0055",
    callName: "さくら",
    ledgerNo: "IND-2023-0055",
    ageLabel: "6歳4か月",
    birthCount: 5,
    maxBirthCount: 6,
    lastDeliveredOn: d(2025, 4, 18),
    nextMating: "—",
    judgement: "prohibited",
    judgementLabel: "年齢上限超",
  },
  {
    animalId: "a-0097",
    callName: "こむぎ",
    ledgerNo: "IND-2024-0097",
    ageLabel: "3歳1か月",
    birthCount: 2,
    maxBirthCount: 6,
    lastDeliveredOn: d(2026, 2, 11),
    nextMating: "妊娠中（出産 10-01 予定）",
    judgement: "pregnant",
    judgementLabel: "妊娠中",
  },
  {
    animalId: "a-0102",
    callName: "あずき",
    ledgerNo: "IND-2024-0102",
    ageLabel: "2歳8か月",
    birthCount: 1,
    maxBirthCount: 6,
    lastDeliveredOn: d(2026, 5, 21),
    nextMating: "2026-10以降 推奨",
    judgement: "ok",
    judgementLabel: "交配可",
  },
];

export type BreedingPlan = {
  id: string;
  pair: string;
  status: BreedingStatus | "confirming";
  statusLabel: string;
  matedOn: string;
  progress: number;
  rightLabel: string;
};

/** 交配・出産の予定 */
export const breedingPlans: BreedingPlan[] = [
  {
    id: "bp1",
    pair: "こむぎ × ゴロー（外部種オス）",
    status: "pregnant",
    statusLabel: "妊娠中",
    matedOn: "2026-07-30",
    progress: 62,
    rightLabel: "出産予定 2026-10-01（残り37日）",
  },
  {
    id: "bp2",
    pair: "あずき × クロ（外部種オス）",
    status: "confirming",
    statusLabel: "妊娠確認待ち",
    matedOn: "2026-08-18",
    progress: 12,
    rightLabel: "エコー検査 2026-09-05",
  },
];

export type Litter = {
  id: string;
  pair: string;
  bornOn: string;
  summary: string;
  /** 子個体の状態チップ（予=予約済 / 売=販売済 / 保=保有中 / 死=死亡） */
  pups: ("予" | "売" | "保" | "死")[];
};

/** 産次（直近） */
export const litters: Litter[] = [
  {
    id: "LIT-0037",
    pair: "ハナ × レオン",
    bornOn: "2026-07-08",
    summary: "3頭中3頭生存",
    pups: ["予", "保", "保"],
  },
  {
    id: "LIT-0036",
    pair: "あずき × クロ",
    bornOn: "2026-05-21",
    summary: "4頭中4頭生存",
    pups: ["予", "売", "売", "保"],
  },
  {
    id: "LIT-0035",
    pair: "こむぎ × ゴロー",
    bornOn: "2026-03-02",
    summary: "5頭中4頭生存",
    pups: ["売", "売", "売", "保", "死"],
  },
];

/** 体重推移（モモ）。2週間単位で記録する運用に合わせる */
export const weightSeries = [
  { measuredOn: d(2026, 7, 8), weightG: 210 },
  { measuredOn: d(2026, 7, 15), weightG: 380 },
  { measuredOn: d(2026, 7, 22), weightG: 560 },
  { measuredOn: d(2026, 7, 29), weightG: 720 },
  { measuredOn: d(2026, 8, 5), weightG: 880 },
  { measuredOn: d(2026, 8, 12), weightG: 1020 },
  { measuredOn: d(2026, 8, 18), weightG: 1110 },
  { measuredOn: d(2026, 8, 24), weightG: 1180 },
];

export type HealthEntry = {
  id: string;
  recordedOn: Date;
  typeLabel: string;
  detail: string;
  by: string;
};

/** 健康・ワクチンの記録（モモ） */
export const healthEntries: HealthEntry[] = [
  {
    id: "h1",
    recordedOn: d(2026, 8, 22),
    typeLabel: "ワクチン",
    detail: "5種混合（2回目）／ ロット MJ-4471",
    by: "白川動物病院 佐々木",
  },
  {
    id: "h2",
    recordedOn: d(2026, 8, 4),
    typeLabel: "駆虫",
    detail: "内部寄生虫 予防投薬",
    by: "田村 志保",
  },
  {
    id: "h3",
    recordedOn: d(2026, 7, 25),
    typeLabel: "ワクチン",
    detail: "5種混合（1回目）／ ロット MJ-4102",
    by: "白川動物病院 佐々木",
  },
  {
    id: "h4",
    recordedOn: d(2026, 7, 10),
    typeLabel: "健康診断",
    detail: "出生時健康チェック 異常なし",
    by: "白川動物病院 佐々木",
  },
];

export function findAnimal(id: string): Animal | undefined {
  return animals.find((a) => a.id === id);
}

// =============================================================================
// 販売・法令対応まわりのモックデータ
// =============================================================================

export type InquiryStage =
  | "new"
  | "in_progress"
  | "visit_booked"
  | "reserved"
  | "handed_over";

export const inquiryStageLabel: Record<InquiryStage, string> = {
  new: "新規",
  in_progress: "対応中",
  visit_booked: "見学予約",
  reserved: "予約成立",
  handed_over: "引渡し済",
};

export type Inquiry = {
  id: string;
  name: string;
  detail: string;
  date: string;
  /** カード下部のチップ。状況に応じた次の一手を示す */
  chip: string;
  /** チップの色味。要対応は warning */
  chipTone: "muted" | "warning" | "success";
  stage: InquiryStage;
  time?: string;
};

/** 引合いカンバン。列ごとの件数は inquiryStageCounts を使う */
export const inquiries: Inquiry[] = [
  { id: "i1", name: "石井 健太", detail: "柴・オス希望／2026年秋", date: "08-24", chip: "HP", chipTone: "muted", stage: "new" },
  { id: "i2", name: "森本 由美", detail: "トイ・プードル レッド", date: "08-23", chip: "紹介", chipTone: "muted", stage: "new" },
  { id: "i3", name: "大西 亮", detail: "きなこ（IND-0136）に関心", date: "08-21", chip: "電話済", chipTone: "muted", stage: "in_progress" },
  { id: "i4", name: "藤井 さおり", detail: "小型犬・室内飼いで検討中", date: "08-19", chip: "資料送付", chipTone: "muted", stage: "in_progress" },
  { id: "i5", name: "中村 陽子", detail: "モモ（IND-0142）", date: "08-25", time: "13:00", chip: "本日", chipTone: "success", stage: "visit_booked" },
  { id: "i6", name: "田口 誠", detail: "ソラ（IND-0138）", date: "08-27", time: "11:00", chip: "説明予定", chipTone: "muted", stage: "visit_booked" },
  { id: "i7", name: "中村 陽子", detail: "モモ／手付 ￥50,000 受領", date: "08-24", chip: "引渡日 要修正", chipTone: "warning", stage: "reserved" },
  { id: "i8", name: "小林 直子", detail: "きなこ／引渡 09-06", date: "08-15", chip: "契約済", chipTone: "muted", stage: "reserved" },
  { id: "i9", name: "山下 貴子", detail: "むぎ／08-16 引渡", date: "08-16", chip: "帳簿記載済", chipTone: "muted", stage: "handed_over" },
];

export const inquiryStageCounts: Record<InquiryStage, number> = {
  new: 9,
  in_progress: 6,
  visit_booked: 4,
  reserved: 3,
  handed_over: 2,
};

export type VisitBooking = {
  id: string;
  when: string;
  customer: string;
  target: string;
  status: string;
  statusTone: "success" | "warning" | "muted";
};

/** 今週の見学予約 */
export const visitBookings: VisitBooking[] = [
  { id: "v1", when: "08-25(火) 13:00", customer: "中村 陽子 様", target: "モモ（IND-2026-0142）", status: "重要事項説明 済", statusTone: "success" },
  { id: "v2", when: "08-27(木) 11:00", customer: "田口 誠 様", target: "ソラ（IND-2026-0138）", status: "説明 未実施", statusTone: "warning" },
  { id: "v3", when: "08-29(土) 10:30", customer: "大西 亮 様", target: "きなこ（IND-2026-0136）", status: "説明 未実施", statusTone: "warning" },
  { id: "v4", when: "08-30(日) 14:00", customer: "森本 由美 様", target: "個体未定（見学のみ）", status: "対象選定から", statusTone: "muted" },
];

export type ChipRow = {
  animalId: string;
  ledgerNo: string;
  callName: string;
  /** 3桁ごとに区切った表示用の番号。未装着は null */
  chipNo: string | null;
  implantedOn: string | null;
  status: "registered" | "implanted_only" | "none";
  statusLabel: string;
  nextAction: string;
  /** 次にやることを強調するか */
  nextActionUrgent: boolean;
};

/** マイクロチップ管理 */
export const chipRows: ChipRow[] = [
  { animalId: "a-0142", ledgerNo: "IND-2026-0142", callName: "モモ", chipNo: "392 141 006 872 34", implantedOn: "2026-08-05", status: "registered", statusLabel: "登録済（環境省DB）", nextAction: "引渡し時に所有者変更", nextActionUrgent: false },
  { animalId: "a-0143", ledgerNo: "IND-2026-0143", callName: "コハク", chipNo: "392 141 006 872 35", implantedOn: "2026-08-20", status: "implanted_only", statusLabel: "装着済・DB未登録", nextAction: "登録申請する", nextActionUrgent: true },
  { animalId: "a-0141", ledgerNo: "IND-2026-0141", callName: "ナナ", chipNo: "392 141 006 872 33", implantedOn: "2026-08-20", status: "implanted_only", statusLabel: "装着済・DB未登録", nextAction: "登録申請する", nextActionUrgent: true },
  { animalId: "a-0130", ledgerNo: "IND-2026-0130", callName: "ゆず", chipNo: null, implantedOn: null, status: "none", statusLabel: "未装着", nextAction: "装着を予約", nextActionUrgent: true },
  { animalId: "a-0129", ledgerNo: "IND-2026-0129", callName: "あんず", chipNo: null, implantedOn: null, status: "none", statusLabel: "未装着", nextAction: "装着を予約", nextActionUrgent: true },
  { animalId: "a-0128", ledgerNo: "IND-2026-0128", callName: "しろ", chipNo: null, implantedOn: null, status: "none", statusLabel: "未装着（生後3週）", nextAction: "生後4週で装着", nextActionUrgent: false },
  { animalId: "a-0138", ledgerNo: "IND-2026-0138", callName: "ソラ", chipNo: "392 141 006 871 90", implantedOn: "2026-07-01", status: "registered", statusLabel: "登録済（環境省DB）", nextAction: "—", nextActionUrgent: false },
  { animalId: "a-0136", ledgerNo: "IND-2026-0136", callName: "きなこ", chipNo: "392 141 006 871 88", implantedOn: "2026-06-20", status: "registered", statusLabel: "登録済（環境省DB）", nextAction: "引渡し時に所有者変更", nextActionUrgent: false },
];

export const chipSummary = {
  total: 32,
  completed: 27,
  implantedOnly: 2,
  notImplanted: 3,
} as const;

export type LedgerEntry = {
  id: string;
  date: string;
  reason: "販売" | "出生" | "譲渡" | "死亡" | "取得";
  ledgerNo: string;
  breedSex: string;
  counterparty: string;
  price: number | null;
  contractNo: string | null;
};

/** 動物愛護管理法の帳簿 */
export const ledgerEntries: LedgerEntry[] = [
  { id: "l1", date: "2026-08-16", reason: "販売", ledgerNo: "IND-2026-0125", breedSex: "柴・オス", counterparty: "山下 貴子（一般消費者／東京都練馬区）", price: 320000, contractNo: "CT-0085" },
  { id: "l2", date: "2026-08-08", reason: "販売", ledgerNo: "IND-2026-0119", breedSex: "トイ・プードル・メス", counterparty: "岡田 真一（一般消費者／千葉県市川市）", price: 450000, contractNo: "CT-0084" },
  { id: "l3", date: "2026-07-08", reason: "出生", ledgerNo: "IND-2026-0142", breedSex: "トイ・プードル・メス", counterparty: "自家繁殖（母 ハナ／LIT-0037）", price: null, contractNo: null },
  { id: "l4", date: "2026-07-08", reason: "出生", ledgerNo: "IND-2026-0143", breedSex: "トイ・プードル・オス", counterparty: "自家繁殖（母 ハナ／LIT-0037）", price: null, contractNo: null },
  { id: "l5", date: "2026-06-24", reason: "譲渡", ledgerNo: "IND-2025-0104", breedSex: "柴・メス", counterparty: "多摩ケンネル（第一種／東京都 第24-0119号）", price: 180000, contractNo: null },
  { id: "l6", date: "2026-05-21", reason: "出生", ledgerNo: "IND-2026-0136", breedSex: "ポメラニアン・メス", counterparty: "自家繁殖（母 あずき／LIT-0036）", price: null, contractNo: null },
  { id: "l7", date: "2026-04-02", reason: "死亡", ledgerNo: "IND-2026-0121", breedSex: "柴・オス", counterparty: "白川動物病院 死亡診断（先天性心疾患）", price: null, contractNo: null },
  { id: "l8", date: "2026-03-15", reason: "取得", ledgerNo: "IND-2026-0118", breedSex: "ポメラニアン・メス", counterparty: "北関東ケンネル（第一種／栃木県 第23-0077号）", price: 240000, contractNo: null },
];

/** 年度集計（帳簿画面の下部） */
export const ledgerTotals = {
  births: 38,
  sales: 31,
  deaths: 2,
  transfers: 4,
} as const;

export type Staff = {
  id: string;
  name: string;
  employment: "常勤" | "非常勤" | "外部";
  permission: string;
  qualification: string;
};

export const staffList: Staff[] = [
  { id: "s1", name: "田村 志保", employment: "常勤", permission: "管理者（すべての操作）", qualification: "動物取扱責任者" },
  { id: "s2", name: "田村 直人", employment: "常勤", permission: "記録の入力・閲覧", qualification: "—" },
  { id: "s3", name: "小島 かおり", employment: "非常勤", permission: "記録の入力のみ", qualification: "愛玩動物飼養管理士2級" },
  { id: "s4", name: "白川動物病院 佐々木", employment: "外部", permission: "健康記録の閲覧のみ", qualification: "獣医師" },
];

/** 事業者情報（設定画面） */
export const officeProfile = {
  name: "白川ケンネル",
  representative: "田村 志保",
  licenseNo: "東京都 販売 第26-0412号",
  licenseExpiry: "2027-03-31",
  address: "東京都あきる野市二宮 1-4-8",
  breeds: "トイ・プードル／柴／ポメラニアン",
} as const;

/** 契約（契約・重要事項説明の画面） */
export const contract = {
  no: "CT-2026-0088",
  customer: "中村 陽子（東京都杉並区）",
  animal: "モモ / IND-2026-0142",
  price: 480000,
  deposit: 50000,
  /** 8週齢に抵触している引渡予定日 */
  handoverOn: "2026-08-30",
  healthGuarantee: "先天性疾患 30日間",
  chipNo: "392 141 006 872 34",
} as const;

export type ContractClause = {
  code: string;
  title: string;
  description: string;
  enabled: boolean;
};

export const contractClauses: ContractClause[] = [
  { code: "health_guarantee_30d", title: "健康保証（30日）", description: "引渡し後30日以内に判明した先天性疾患の治療費を売主が負担する。獣医師の診断書が必要。", enabled: true },
  { code: "transfer_56days", title: "引渡し（8週齢遵守）", description: "出生後56日を経過するまで引渡しを行わない旨を明記。日付は個体の生年月日から自動計算。", enabled: true },
  { code: "breeding_restriction", title: "繁殖の制限", description: "営利目的の繁殖に供することを禁止する。違反時の損害賠償額も定める。", enabled: true },
  { code: "mc_owner_change", title: "マイクロチップ所有者変更", description: "引渡し時に買主が30日以内に所有者情報の変更登録を行う義務を記載。", enabled: true },
  { code: "return_policy_std", title: "返還・キャンセル", description: "引渡し前のキャンセルは手付金を返還しない。引渡し後の返還条件を定める。", enabled: true },
  { code: "spay_neuter_required", title: "避妊・去勢の義務", description: "生後6か月以降の避妊・去勢手術を義務づける。今回の契約では使用していません。", enabled: false },
];

/** 顧客カルテ（中村様） */
export const customer = {
  inquiryNo: "INQ-2026-0211",
  name: "中村 陽子",
  stage: "予約成立",
  phone: "090-4471-2280",
  address: "東京都杉並区高円寺南 3-2-11",
  wish: "トイ・プードル レッド メス",
  environment: "室内・戸建・先住犬なし",
  source: "自社サイト",
  staff: "田村 志保",
  price: 480000,
  deposit: 50000,
} as const;

export type CustomerEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  /** 対応済みなら done、要対応は alert */
  tone: "done" | "alert";
};

export const customerEvents: CustomerEvent[] = [
  { id: "c1", date: "08-24", title: "重要事項説明を実施（18項目）", detail: "対面 ／ 説明者 田村 志保 ／ 署名取得済", tone: "done" },
  { id: "c2", date: "08-24", title: "手付金 ￥50,000 を受領", detail: "銀行振込 ／ 契約 CT-2026-0088 を作成", tone: "done" },
  { id: "c3", date: "08-21", title: "見学（2回目）", detail: "モモに決定。引渡日を8月30日で仮予定。", tone: "alert" },
  { id: "c4", date: "08-14", title: "見学（1回目）", detail: "モモ・コハクを見学。室内飼い・先住犬なし。", tone: "alert" },
  { id: "c5", date: "08-10", title: "問い合わせ（自社サイト）", detail: "トイ・プードル レッドを希望。予算50万円まで。", tone: "done" },
];
