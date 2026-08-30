/**
 * zod スキーマ。API定義（docs/system_plan/schema/openapi.yaml）の
 * リクエストボディと、DBのCHECK制約（schema.sql）を写したもの。
 *
 * 同じ制約をサーバでも検証する前提で、ここでは「送信前に画面で気づける」ことを目的とする。
 */

import { z } from "zod";
import {
  ANIMAL_STATUS,
  HEALTH_RECORD_TYPE,
  PEDIGREE_STATUS,
  SEX,
  SPECIES,
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

    microchipNo: microchipNoSchema.optional(),
    microchipRegisteredOn: isoDateSchema.optional(),
    microchipImplantedOn: isoDateSchema.optional(),

    pedigreeStatus: z.enum(PEDIGREE_STATUS).default("not_applied"),
    pedigreeNo: z.string().max(50).optional(),
    pedigreeAnimalName: z.string().max(120).optional(),

    /** 「有り」選択時は疾患名を必須（schema.sql animals_genetic_name_chk） */
    geneticDisease: z.enum(["none", "present", "unknown"]).default("unknown"),
    geneticDiseaseName: z.string().max(200).optional(),

    healthNote: z.string().max(1000).optional(),
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
  );

export type AnimalInput = z.input<typeof animalInputSchema>;
export type AnimalInputParsed = z.output<typeof animalInputSchema>;

/**
 * 健康・ワクチン記録（openapi.yaml HealthRecordInput / FR-27）。
 * 区分により有効項目が変わる。モックアップの「記録の種類」セグメントに対応。
 */
export const healthRecordInputSchema = z
  .object({
    recordedOn: isoDateSchema,
    recordType: z.enum(HEALTH_RECORD_TYPE),

    /** ワクチンの種類（5種混合 / 7種混合 / 狂犬病 など） */
    vaccineName: z.string().max(100).optional(),
    /** ロット番号：ワクチン接種のときは必須 */
    lotNo: z.string().max(50).optional(),
    medicationName: z.string().max(100).optional(),
    treatmentDetail: z.string().max(1000).optional(),
    /** 狂犬病予防注射の接種済票No（schema.sql hr_rabies_chk） */
    rabiesCertNo: z.string().max(50).optional(),
    geneticTestName: z.string().max(100).optional(),
    geneticTestResult: z.string().max(200).optional(),
    /** 担当した獣医師 */
    veterinarian: z.string().max(100).optional(),
    breedingProhibited: z.boolean().default(false),
    note: z.string().max(1000).optional(),

    /** 対象個体。まとめて記録できる（モックアップ「同じ内容を3頭にまとめて記録します」） */
    animalIds: z.array(z.string()).min(1, "対象の個体を選んでください"),
  })
  .refine((v) => v.recordType !== "vaccine" || !!v.vaccineName?.trim(), {
    message: "ワクチンの種類を選んでください",
    path: ["vaccineName"],
  })
  .refine((v) => v.recordType !== "vaccine" || !!v.lotNo?.trim(), {
    message: "ワクチン接種のときはロット番号が必須です",
    path: ["lotNo"],
  })
  .refine((v) => v.recordType !== "rabies" || !!v.rabiesCertNo?.trim(), {
    message: "狂犬病予防注射は接種済票Noが必須です",
    path: ["rabiesCertNo"],
  })
  .refine((v) => v.recordType !== "treatment" || !!v.treatmentDetail?.trim(), {
    message: "通院・治療の内容を入力してください",
    path: ["treatmentDetail"],
  });

export type HealthRecordInput = z.input<typeof healthRecordInputSchema>;

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
  buyerType: z.enum(["consumer", "business", "auction"]),
  importantMattersExplainedOn: isoDateSchema.optional(),
  salesRepName: z.string().max(100).optional(),
  lawComplianceConfirmed: z.literal(true, {
    message: "法令遵守の確認にチェックしてください",
  }),
  buyerName: z.string().max(100).optional(),
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
