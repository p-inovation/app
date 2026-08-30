/**
 * zod スキーマ。API定義（docs/system_plan/schema/openapi.yaml）の
 * リクエストボディと、DBのCHECK制約（schema.sql）を写したもの。
 *
 * 同じ制約をサーバでも検証する前提で、ここでは「送信前に画面で気づける」ことを目的とする。
 */

import { z } from "zod";
import {
  ANIMAL_STATUS,
  BREEDING_STATUS,
  BUYER_TYPE,
  HEALTH_RECORD_TYPE,
  NEUTER_STATUS,
  PRESENCE,
  REPORT_KIND,
  SEX,
  SPECIES,
  USER_ROLE,
} from "./enums";

/** マイクロチップ番号：15桁数値（schema.sql animals_chip_format_chk） */
export const microchipNoSchema = z
  .string()
  .regex(/^[0-9]{15}$/, "マイクロチップ番号は15桁の数字で入力してください");

/** YYYY-MM-DD */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD の形式で入力してください")
  .refine((v) => !Number.isNaN(Date.parse(v)), "存在しない日付です");

/**
 * 個体登録（openapi.yaml AnimalInput / FR-20）。
 * 段階的入力に対応するため、status=draft のときは識別項目以外を省略できる。
 */
export const animalInputSchema = z
  .object({
    status: z.enum(ANIMAL_STATUS).default("draft"),
    species: z.enum(SPECIES),
    sex: z.enum(SEX),
    callName: z
      .string()
      .min(1, "呼び名を入力してください")
      .max(100, "呼び名は100文字以内で入力してください"),
    isBreedingAnimal: z.boolean().default(false),
    birthDate: isoDateSchema,

    breedId: z.string().uuid().optional(),
    breedOther: z.string().max(100).optional(),
    coatColorId: z.string().uuid().optional(),
    coatColorOther: z.string().max(100).optional(),

    /** メスは必須（schema.sql 出産履歴グループ） */
    priorBirthCount: z.coerce.number().int().min(0).optional(),

    // ▼ 仕入（自家繁殖個体では入力不要）
    acquiredOn: isoDateSchema.optional(),
    acquirePrice: z.coerce.number().int().min(0).optional(),
    breederName: z.string().max(100).optional(),
    breederLicenseNo: z.string().max(50).optional(),
    breederAddress: z.string().max(200).optional(),
    supplierSameAsBreeder: z.boolean().default(false),
    supplierName: z.string().max(100).optional(),
    supplierLicenseNo: z.string().max(50).optional(),
    supplierAddress: z.string().max(200).optional(),

    // ▼ マイクロチップ
    microchipNo: microchipNoSchema.optional(),
    microchipRegisteredOn: isoDateSchema.optional(),
    microchipImplantedOn: isoDateSchema.optional(),
    neuterStatus: z.enum(NEUTER_STATUS).default("unknown"),
    /** 狂犬病予防法にもとづく畜犬登録日 */
    rabiesLicenseOn: isoDateSchema.optional(),
    /** 登録（鑑札）番号 */
    rabiesTagNo: z.string().max(50).optional(),

    // ▼ 血統書
    pedigreeOrgId: z.string().optional(),
    pedigreeNo: z.string().max(50).optional(),
    pedigreeAnimalName: z.string().max(120).optional(),
    pedigreeAppliedOn: isoDateSchema.optional(),
    pedigreeArrivedOn: isoDateSchema.optional(),
    pedigreeShippedOn: isoDateSchema.optional(),

    // ▼ 健康
    /** 「有り」選択時は疾患名を必須（schema.sql animals_genetic_name_chk） */
    geneticDisease: z.enum(PRESENCE).default("unknown"),
    geneticDiseaseName: z.string().max(200).optional(),
    medicalHistory: z.enum(PRESENCE).default("unknown"),
    healthNote: z.string().max(1000).optional(),

    // ▼ 引退（定期報告の繁殖引退チェックの対象）
    breedingAvailable: z.boolean().optional(),
    breedingUnavailableOn: isoDateSchema.optional(),
    retireReasonId: z.string().optional(),
  })
  .refine(
    (v) => v.geneticDisease !== "present" || !!v.geneticDiseaseName?.trim(),
    {
      message: "遺伝性疾患が「有り」のときは疾患名を入力してください",
      path: ["geneticDiseaseName"],
    },
  )
  .refine((v) => v.sex !== "female" || v.priorBirthCount !== undefined, {
    message: "メスはシステム入力前の出産回数を入力してください",
    path: ["priorBirthCount"],
  })
  .refine(
    // 装着日より前の登録日はありえない
    (v) =>
      !v.microchipRegisteredOn ||
      !v.microchipImplantedOn ||
      v.microchipRegisteredOn >= v.microchipImplantedOn,
    {
      message: "登録日は装着日以降の日付を入力してください",
      path: ["microchipRegisteredOn"],
    },
  )
  .refine(
    // 繁殖利用「無し」なら日付を持つ（schema.sql animals_breeding_unavail_chk）
    (v) => v.breedingAvailable !== false || !!v.breedingUnavailableOn,
    {
      message: "繁殖の用に供さない場合はその日付を入力してください",
      path: ["breedingUnavailableOn"],
    },
  );

export type AnimalInput = z.input<typeof animalInputSchema>;
export type AnimalInputParsed = z.output<typeof animalInputSchema>;

/**
 * 健康・ワクチン記録（openapi.yaml HealthRecordInput / FR-27）。
 *
 * 選択肢は lookups マスタ（schema.sql）の id を送り、
 * 一覧に無いものは *Other の自由入力で併存させる（FR-12「その他の場合記入」）。
 */
export const healthRecordInputSchema = z
  .object({
    recordedOn: isoDateSchema,
    recordType: z.enum(HEALTH_RECORD_TYPE),

    vaccineId: z.string().optional(),
    vaccineOther: z.string().max(100).optional(),
    medicationId: z.string().optional(),
    medicationOther: z.string().max(100).optional(),
    treatmentDetail: z.string().max(1000).optional(),
    /** 狂犬病予防注射の接種済票No（schema.sql hr_rabies_chk） */
    rabiesCertNo: z.string().max(50).optional(),
    geneticTestId: z.string().optional(),
    geneticTestOther: z.string().max(100).optional(),
    geneticTestResult: z.string().max(200).optional(),
    breedingProhibited: z.boolean().default(false),
    note: z.string().max(1000).optional(),
  })
  .refine(
    (v) =>
      v.recordType !== "vaccine" || !!v.vaccineId || !!v.vaccineOther?.trim(),
    {
      message: "ワクチンの種類を選んでください",
      path: ["vaccineId"],
    },
  )
  .refine((v) => v.recordType !== "rabies" || !!v.rabiesCertNo?.trim(), {
    message: "狂犬病予防注射は接種済票Noが必須です",
    path: ["rabiesCertNo"],
  })
  .refine((v) => v.recordType !== "treatment" || !!v.treatmentDetail?.trim(), {
    message: "通院・治療の内容を入力してください",
    path: ["treatmentDetail"],
  })
  .refine(
    (v) =>
      v.recordType !== "preventive" ||
      !!v.medicationId ||
      !!v.medicationOther?.trim(),
    {
      message: "投薬名を選んでください",
      path: ["medicationId"],
    },
  );

export type HealthRecordInput = z.input<typeof healthRecordInputSchema>;

/**
 * 健康記録フォームの画面入力。
 *
 * API は POST /animals/{animalId}/health-records で1頭ずつ受ける設計だが、
 * 画面は「同じ内容を3頭にまとめて記録」する（モックアップ s_f_health.html）。
 * そのため対象個体と、DB/API に列を持たない補助項目をここで別に持ち、
 * 送信時は個体ごとに healthRecordInputSchema の形へ分解する。
 *
 * lotNo（ロット番号）と veterinarian（担当獣医師）は
 * モックアップにあるが schema.sql・openapi.yaml のどちらにも対応する項目が無い。
 * 現状は note に含めて送る想定。項目として残すなら DB/API 側の追加が必要。
 */
export const healthRecordFormSchema = healthRecordInputSchema.safeExtend({
  animalIds: z.array(z.string()).min(1, "対象の個体を選んでください"),
  lotNo: z.string().max(50).optional(),
  veterinarian: z.string().max(100).optional(),
});

export type HealthRecordForm = z.input<typeof healthRecordFormSchema>;

/**
 * 日次点検（openapi.yaml InspectionInput / FR-29）。
 * 「異常あり」なら備考必須（schema.sql ir_abnormal_note_chk）。
 */
export const inspectionInputSchema = z
  .object({
    inspectedOn: isoDateSchema,
    inspectedAtTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "時刻は HH:MM で入力してください"),
    cleaningDone: z.boolean(),
    disinfectionDone: z.boolean(),
    maintenanceDone: z.boolean(),
    animalCountAbnormal: z.boolean().default(false),
    animalStateAbnormal: z.boolean().default(false),
    inspectorName: z.string().min(1, "点検担当者を入力してください").max(100),
    note: z.string().max(1000).optional(),
  })
  .refine(
    (v) =>
      (!v.animalCountAbnormal && !v.animalStateAbnormal) || !!v.note?.trim(),
    {
      message: "異常ありのときは備考の入力が必須です",
      path: ["note"],
    },
  );

export type InspectionInput = z.input<typeof inspectionInputSchema>;

/** 体重記録（FR-30）。グラム単位で保持する */
export const weightInputSchema = z.object({
  animalId: z.string().min(1),
  measuredOn: isoDateSchema,
  weightG: z.coerce
    .number({ message: "体重を数値で入力してください" })
    .int("体重はグラム単位の整数で入力してください")
    .positive("体重は0より大きい値を入力してください")
    .max(100_000, "体重の値が大きすぎます"),
});

export type WeightInput = z.input<typeof weightInputSchema>;

/**
 * 販売登録（openapi.yaml SaleInput / 要件 §4.2）。
 * 8週齢・チップ登録の検証はサーバ側が正だが、画面でも evaluateCompliance で事前に止める。
 */
export const saleInputSchema = z.object({
  soldOn: isoDateSchema,
  salePrice: z.coerce.number().int().min(0).optional(),
  buyerType: z.enum(BUYER_TYPE),
  importantMattersExplainedOn: isoDateSchema.optional(),
  salesRepName: z.string().max(100).optional(),
  lawComplianceConfirmed: z.literal(true, {
    message: "法令遵守の確認にチェックしてください",
  }),
  buyerName: z.string().max(100).optional(),
  buyerLicenseNo: z.string().max(50).optional(),
  buyerPostalCode: z.string().max(10).optional(),
  buyerAddress: z.string().max(200).optional(),
  buyerPhone: z.string().max(30).optional(),
  buyerEmail: z.email("メールアドレスの形式が正しくありません").optional(),
});

export type SaleInput = z.input<typeof saleInputSchema>;

/**
 * マイクロチップ登録申請（画面 s_f_chip.html）。
 * 表示は3桁区切りだが、送信値は数字15桁のみを保持する（microchipNoSchema で検証）。
 */
export const microchipRegisterInputSchema = z.object({
  microchipNo: microchipNoSchema,
  implantedOn: isoDateSchema,
  veterinarian: z
    .string()
    .min(1, "装着した獣医師を入力してください")
    .max(100, "100文字以内で入力してください"),
});

export type MicrochipRegisterInput = z.input<
  typeof microchipRegisterInputSchema
>;

/** 引合いの登録（画面 s_f_inquiry.html）。犬種・きっかけは任意 */
export const inquiryInputSchema = z.object({
  customerName: z
    .string()
    .min(1, "お名前を入力してください")
    .max(100, "100文字以内で入力してください"),
  phone: z
    .string()
    .min(1, "電話番号を入力してください")
    .max(30, "30文字以内で入力してください"),
  desiredBreed: z
    .enum(["toy_poodle", "shiba", "pomeranian", "undecided"])
    .optional(),
  source: z
    .enum(["website", "referral", "sns", "phone", "other"])
    .optional(),
});

export type InquiryInput = z.input<typeof inquiryInputSchema>;

/** 帳簿の手動記載（画面 s_f_ledger.html）。記載後の削除ができない前提の入力 */
export const ledgerManualInputSchema = z.object({
  reason: z.enum(["acquire", "transfer", "death", "sale"], {
    message: "事由を選んでください",
  }),
  occurredOn: isoDateSchema,
  counterparty: z.string().max(200).optional(),
  price: z.coerce
    .number({ message: "価格を数値で入力してください" })
    .int("価格は整数で入力してください")
    .min(0, "価格は0以上で入力してください")
    .optional(),
});

export type LedgerManualInput = z.input<typeof ledgerManualInputSchema>;

/**
 * 交配の登録（画面 s_f_mating.html）。
 * 交配可否そのものはクライアント側で breedingCandidates の judgement から判定し、
 * prohibited の個体は選ばせない（送信も止める）運用のため、スキーマ側は形式チェックのみ行う。
 */
export const matingInputSchema = z.object({
  damAnimalId: z.string().min(1, "母犬を選んでください"),
  sireName: z.string().min(1, "父個体を入力してください").max(100),
  matingOn: isoDateSchema,
});

export type MatingInput = z.input<typeof matingInputSchema>;

/**
 * 出産・産次の登録（画面 s_f_birth.html）。
 * 生存頭数の分だけ個体レコードを自動作成する前提のため、生存頭数は1以上を必須とする。
 */
export const birthInputSchema = z.object({
  bornOn: isoDateSchema,
  survivorCount: z.coerce
    .number({ message: "生存している頭数を数値で入力してください" })
    .int("生存している頭数は整数で入力してください")
    .min(1, "生存している頭数は1以上で入力してください")
    .max(30, "生存している頭数の値が大きすぎます"),
  stillbornCount: z.coerce
    .number({ message: "死産・生後すぐの死亡数を数値で入力してください" })
    .int("死産・生後すぐの死亡数は整数で入力してください")
    .min(0, "死産・生後すぐの死亡数は0以上で入力してください")
    .max(30, "死産・生後すぐの死亡数の値が大きすぎます"),
});

export type BirthInput = z.input<typeof birthInputSchema>;

/**
 * 事業所間移動（openapi.yaml TransferInput / FR-28）。
 * 自事業所が移動元または移動先である必要がある（検証はサーバ側）。
 */
export const transferInputSchema = z
  .object({
    animalId: z.string().min(1, "対象の個体を選んでください"),
    movedOn: isoDateSchema,
    arrivedOn: isoDateSchema.optional(),
    toOfficeId: z.string().min(1, "移動先の事業所を選んでください"),
  })
  .refine((v) => !v.arrivedOn || v.arrivedOn >= v.movedOn, {
    message: "到着日は移動日以降の日付を入力してください",
    path: ["arrivedOn"],
  });

export type TransferInput = z.input<typeof transferInputSchema>;

/** 交配1回ぶん（openapi.yaml BreedingRecordInput.matings[]）。最大3回まで記録する */
export const matingEntrySchema = z.object({
  seq: z.coerce.number().int().min(1).max(3),
  matedOn: isoDateSchema,
  methodNote: z.string().max(200).optional(),
  note: z.string().max(500).optional(),
});

/**
 * 繁殖実施（openapi.yaml BreedingRecordInput / FR-40・FR-44）。
 * 予約（planned）から出産（delivered）までを同一レコードの状態遷移として扱う。
 */
export const breedingRecordInputSchema = z
  .object({
    status: z.enum(BREEDING_STATUS).default("planned"),
    /** 交配チェックの結果からそのまま作成する場合に指定 */
    matingCheckId: z.string().optional(),
    estrusOn: isoDateSchema.optional(),
    damId: z.string().min(1, "母個体を選んでください"),

    isRentalSire: z.boolean().default(false),
    sireId: z.string().optional(),
    extSireBreed: z.string().max(100).optional(),
    extSireCallName: z.string().max(100).optional(),
    extSireMicrochipNo: microchipNoSchema.optional(),

    matings: z.array(matingEntrySchema).max(3).optional(),

    deliveredOn: isoDateSchema.optional(),
    birthCount: z.coerce.number().int().min(0).optional(),
    newbornHealthy: z.coerce.number().int().min(0).optional(),
    newbornSick: z.coerce.number().int().min(0).optional(),
    newbornDead: z.coerce.number().int().min(0).optional(),
    damCondition: z.string().max(500).optional(),
    deliveryNote: z.string().max(1000).optional(),

    damBreedingAvailable: z.boolean().optional(),
    damBreedingUnavailableOn: isoDateSchema.optional(),
    sireBreedingAvailable: z.boolean().optional(),
    sireBreedingUnavailableOn: isoDateSchema.optional(),
  })
  .refine(
    // レンタルなら外部オス情報、自家なら sireId（schema.sql br_sire_chk）
    (v) =>
      v.isRentalSire ? !!v.extSireCallName?.trim() && !v.sireId : !!v.sireId,
    {
      message: "父個体を選ぶか、外部種オスの呼び名を入力してください",
      path: ["sireId"],
    },
  )
  .refine(
    // 出産済なら出産日と出産数を持つ（schema.sql br_delivered_chk）
    (v) =>
      !["delivered", "registered"].includes(v.status) ||
      (!!v.deliveredOn && v.birthCount !== undefined),
    {
      message: "出産を登録するときは出産日と出産数が必要です",
      path: ["deliveredOn"],
    },
  )
  .refine(
    // 新生子の内訳合計は出産数と一致する（schema.sql br_newborn_sum_chk）
    (v) => {
      if (v.birthCount === undefined) return true;
      const sum =
        Number(v.newbornHealthy ?? 0) +
        Number(v.newbornSick ?? 0) +
        Number(v.newbornDead ?? 0);
      return sum === Number(v.birthCount);
    },
    {
      message: "健康・病気・死亡の合計を出産数と一致させてください",
      path: ["newbornHealthy"],
    },
  );

export type BreedingRecordInput = z.input<typeof breedingRecordInputSchema>;

/**
 * 子個体の一括登録（openapi.yaml OffspringInput / FR-41）。
 * 生年月日・親・管理帳簿番号はサーバ側が繁殖実施レコードから確定するため送らない。
 */
export const offspringInputSchema = z.object({
  sex: z.enum(SEX),
  callName: z.string().min(1, "呼び名を入力してください").max(100),
  breedId: z.string().optional(),
  coatColorId: z.string().optional(),
  coatColorOther: z.string().max(100).optional(),
  microchipNo: microchipNoSchema.optional(),
});

export type OffspringInput = z.input<typeof offspringInputSchema>;

/** 子個体をまとめて登録する画面用 */
export const offspringBulkSchema = z.object({
  offspring: z.array(offspringInputSchema).min(1, "1頭以上を入力してください"),
});

export type OffspringBulk = z.input<typeof offspringBulkSchema>;

/**
 * 生年月日変更依頼（openapi.yaml の birthdate-change-requests / FR-26）。
 * 登録後一定期間を過ぎた個体は直接変更できず、協会へ申請する。
 */
export const birthdateChangeRequestSchema = z.object({
  newBirthDate: isoDateSchema,
  reason: z
    .string()
    .min(1, "変更の理由を入力してください")
    .max(500, "理由は500文字以内で入力してください"),
});

export type BirthdateChangeRequestInput = z.input<
  typeof birthdateChangeRequestSchema
>;

/** 交配チェック（openapi.yaml /mating-checks / FR-43） */
export const matingCheckRequestSchema = z.object({
  damId: z.string().min(1, "母個体を選んでください"),
  sireId: z.string().optional(),
  plannedMatingOn: isoDateSchema,
});

export type MatingCheckRequest = z.input<typeof matingCheckRequestSchema>;

/**
 * 契約の作成（画面 /contracts/new・要件 §8「販売確認書」）。
 * 8週齢の判定は evaluateCompliance で画面側が事前に行うため、ここでは形式チェックのみ行う。
 */
export const contractInputSchema = z.object({
  animalId: z.string().min(1, "対象の個体を選んでください"),
  customerName: z
    .string()
    .min(1, "お客さまの名前を入力してください")
    .max(100, "100文字以内で入力してください"),
  price: z.coerce
    .number({ message: "販売価格を数値で入力してください" })
    .int("販売価格は整数で入力してください")
    .min(0, "販売価格は0以上で入力してください"),
  deposit: z.coerce
    .number({ message: "手付金を数値で入力してください" })
    .int("手付金は整数で入力してください")
    .min(0, "手付金は0以上で入力してください")
    .optional(),
  handoverOn: isoDateSchema,
  healthGuarantee: z.enum(["30", "60", "none"]),
});

export type ContractInput = z.input<typeof contractInputSchema>;

/** スタッフの追加（画面 /staff/new・FR-11） */
export const staffInputSchema = z.object({
  name: z
    .string()
    .min(1, "氏名を入力してください")
    .max(100, "100文字以内で入力してください"),
  email: z.email("メールアドレスの形式が正しくありません"),
  employment: z.enum(["常勤", "非常勤", "外部"]),
  role: z.enum(USER_ROLE),
  qualification: z.string().max(100, "100文字以内で入力してください").optional(),
});

export type StaffInput = z.input<typeof staffInputSchema>;

/**
 * 定期報告の作成（画面 /reports/new・FR-50・要件 §8）。
 * 帳票の集計値は帳簿から自動算出するため、ここではどの年度・帳票かの選択だけを持つ。
 */
export const reportInputSchema = z.object({
  fiscalYear: z.enum(["2026", "2025", "2024"]),
  reportKind: z.enum([
    "annual_report",
    "retire_check",
    "inspection_ledger",
  ] as const satisfies readonly (typeof REPORT_KIND)[number][]),
});

export type ReportInput = z.input<typeof reportInputSchema>;

/**
 * チップ情報の編集（画面 animals/[id]/chip）。
 * animalInputSchema のマイクロチップ群だけを切り出したもの。
 * 登録日は装着日以降でなければならない制約（schema.sql）を animalInputSchema と同様に持つ。
 */
export const chipEditSchema = z
  .object({
    microchipNo: microchipNoSchema,
    microchipImplantedOn: isoDateSchema,
    microchipRegisteredOn: isoDateSchema.optional(),
    neuterStatus: z.enum(NEUTER_STATUS).default("unknown"),
    rabiesLicenseOn: isoDateSchema.optional(),
    rabiesTagNo: z.string().max(50).optional(),
  })
  .refine(
    (v) =>
      !v.microchipRegisteredOn ||
      v.microchipRegisteredOn >= v.microchipImplantedOn,
    {
      message: "登録日は装着日以降の日付を入力してください",
      path: ["microchipRegisteredOn"],
    },
  );

export type ChipEditInput = z.input<typeof chipEditSchema>;
