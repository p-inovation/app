"use client";

/**
 * 健康・ワクチン記録の追加フォーム（画面 s_f_health.html を再現）。
 * 記録の種類（ワクチン/狂犬病/駆虫/検査/通院・治療）で入力項目を出し分ける。
 */

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  FieldError,
  FieldLabel,
  FormActions,
  FormHeading,
  FormRow,
  HintBar,
  SegmentGroup,
} from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import { Textarea } from "@/components/ui/textarea";
import {
  healthRecordInputSchema,
  healthRecordFormSchema,
  type HealthRecordForm as HealthRecordFormValues,
  type HealthRecordInput,
} from "@/lib/domain/schemas";
import {
  HEALTH_FORM_TYPES,
  healthRecordTypeLabel,
  type HealthRecordType,
} from "@/lib/domain/enums";
import { lookupsByKind, TODAY } from "@/lib/mock/data";
import { formatIsoDate } from "@/lib/domain/compliance";

import { FormHeaderBar } from "./form-header-bar";

/** 対象個体（LIT-0037 の3頭）。モックアップの「3頭にまとめて記録」に合わせて固定 */
const TARGET_ANIMAL_IDS = ["a-0142", "a-0143", "a-0141"];

const VACCINE_LOOKUPS = lookupsByKind("vaccine");
const MEDICATION_LOOKUPS = lookupsByKind("medication");
const GENETIC_TEST_LOOKUPS = lookupsByKind("genetic_test");

const VACCINE_OPTIONS = VACCINE_LOOKUPS.map((l) => ({
  value: l.id,
  label: l.name,
}));
const MEDICATION_OPTIONS = MEDICATION_LOOKUPS.map((l) => ({
  value: l.id,
  label: l.name,
}));
const GENETIC_TEST_OPTIONS = GENETIC_TEST_LOOKUPS.map((l) => ({
  value: l.id,
  label: l.name,
}));

/** 前回の記録（HintBar「前回と同じ」で流し込む値） */
const PREVIOUS_RECORD = {
  recordType: "vaccine" as const,
  vaccineId: VACCINE_LOOKUPS.find((l) => l.code === "vac_5")?.id ?? "lk-vac-1",
  lotNo: "MJ-4471",
  veterinarian: "白川動物病院 佐々木",
};

/** 記録の種類の選択肢。狂犬病はワクチンの一種として5つ目に足す */
const RECORD_TYPE_OPTIONS = [
  ...HEALTH_FORM_TYPES.map((value) => ({
    value,
    label: healthRecordTypeLabel[value],
  })),
  { value: "rabies" as const, label: healthRecordTypeLabel.rabies },
];

/**
 * 画面の入力値（animalIds/lotNo/veterinarian を含む）を、
 * API が受ける healthRecordInputSchema の形へ分解する。
 * API は POST /animals/{animalId}/health-records で1頭ずつ受ける設計のため、
 * 対象の各個体に同じ内容を送るにはここでループして分解する必要がある。
 */
function toHealthRecordInputs(
  form: HealthRecordFormValues,
): HealthRecordInput[] {
  const { animalIds, lotNo, veterinarian, ...base } = form;
  void lotNo;
  void veterinarian;
  return animalIds.map(() => ({ ...base }));
}

export function HealthRecordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HealthRecordFormValues>({
    resolver: zodResolver(healthRecordFormSchema),
    defaultValues: {
      recordedOn: formatIsoDate(TODAY),
      recordType: "vaccine",
      veterinarian: "白川動物病院 佐々木",
      animalIds: TARGET_ANIMAL_IDS,
    },
  });

  const recordType = useWatch({ control, name: "recordType" });
  const vaccineId = useWatch({ control, name: "vaccineId" });
  const medicationId = useWatch({ control, name: "medicationId" });
  const geneticTestId = useWatch({ control, name: "geneticTestId" });
  const animalIds = useWatch({ control, name: "animalIds" });

  const applyPreviousRecord = () => {
    setValue("recordType", PREVIOUS_RECORD.recordType);
    setValue("vaccineId", PREVIOUS_RECORD.vaccineId);
    setValue("lotNo", PREVIOUS_RECORD.lotNo);
    setValue("veterinarian", PREVIOUS_RECORD.veterinarian);
  };

  const onSubmit = (values: HealthRecordFormValues) => {
    const parsed = healthRecordFormSchema.parse(values);
    const records = toHealthRecordInputs(parsed).map((r) =>
      healthRecordInputSchema.parse(r),
    );
    toast.success(`${records.length}頭に記録しました`);
    router.push("/");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="健康・ワクチン記録の追加"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="個体カルテに記録を1件足す"
      />

      <FormHeading
        title="どんな記録を追加しますか"
        description="対象の個体（LIT-0037 の3頭）はすでに選択済です。同じ内容を3頭にまとめて記録します。"
      />

      <HintBar
        action={
          <button
            type="button"
            onClick={applyPreviousRecord}
            className="min-h-11 rounded-lg border border-border bg-card px-4 text-[13px] hover:bg-muted"
          >
            前回と同じ
          </button>
        }
      >
        前回の記録（08-22 ／ 5種混合 ／ 白川動物病院 佐々木医師）と同じ内容で入力できます
      </HintBar>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel required>記録の種類</FieldLabel>
          <SegmentGroup<HealthRecordType>
            name="recordType"
            options={RECORD_TYPE_OPTIONS}
            value={recordType}
            onChange={(next) => setValue("recordType", next)}
          />
          <FieldError message={errors.recordType?.message} />
        </FormRow>

        {recordType === "vaccine" ? (
          <>
            <FormRow>
              <FieldLabel required>ワクチンの種類</FieldLabel>
              <SegmentGroup<string>
                name="vaccineId"
                options={VACCINE_OPTIONS}
                value={vaccineId}
                onChange={(next) => setValue("vaccineId", next)}
              />
              <FieldError message={errors.vaccineId?.message} />
            </FormRow>

            {/* lotNo は schema.sql・openapi.yaml のどちらにも対応する列が無い画面専用項目 */}
            <FormRow>
              <FieldLabel htmlFor="lotNo">ロット番号</FieldLabel>
              <input
                id="lotNo"
                type="text"
                placeholder="MJ-4471"
                className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("lotNo")}
              />
              <FieldError message={errors.lotNo?.message} />
            </FormRow>
          </>
        ) : null}

        {recordType === "rabies" ? (
          <>
            <FormRow>
              <FieldLabel htmlFor="rabiesCertNo" required>
                接種済票No
              </FieldLabel>
              <input
                id="rabiesCertNo"
                type="text"
                className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("rabiesCertNo")}
              />
              <FieldError message={errors.rabiesCertNo?.message} />
            </FormRow>

            {/* lotNo は schema.sql・openapi.yaml のどちらにも対応する列が無い画面専用項目 */}
            <FormRow>
              <FieldLabel htmlFor="lotNo">ロット番号</FieldLabel>
              <input
                id="lotNo"
                type="text"
                placeholder="MJ-4471"
                className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("lotNo")}
              />
              <FieldError message={errors.lotNo?.message} />
            </FormRow>
          </>
        ) : null}

        {recordType === "preventive" ? (
          <FormRow>
            <FieldLabel required>投薬名</FieldLabel>
            <SegmentGroup<string>
              name="medicationId"
              options={MEDICATION_OPTIONS}
              value={medicationId}
              onChange={(next) => setValue("medicationId", next)}
            />
            <FieldError message={errors.medicationId?.message} />
          </FormRow>
        ) : null}

        {recordType === "genetic_test" ? (
          <>
            <FormRow>
              <FieldLabel required>検査名</FieldLabel>
              <SegmentGroup<string>
                name="geneticTestId"
                options={GENETIC_TEST_OPTIONS}
                value={geneticTestId}
                onChange={(next) => setValue("geneticTestId", next)}
              />
              <FieldError message={errors.geneticTestId?.message} />
            </FormRow>
            <FormRow>
              <FieldLabel htmlFor="geneticTestResult">結果</FieldLabel>
              <input
                id="geneticTestResult"
                type="text"
                className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("geneticTestResult")}
              />
              <FieldError message={errors.geneticTestResult?.message} />
            </FormRow>
          </>
        ) : null}

        {recordType === "treatment" ? (
          <FormRow>
            <FieldLabel htmlFor="treatmentDetail" required>
              内容
            </FieldLabel>
            <Textarea
              id="treatmentDetail"
              className="min-h-24 text-[13.5px]"
              {...register("treatmentDetail")}
            />
            <FieldError message={errors.treatmentDetail?.message} />
          </FormRow>
        ) : null}

        {/* veterinarian は schema.sql・openapi.yaml のどちらにも対応する列が無い画面専用項目 */}
        <FormRow>
          <FieldLabel htmlFor="veterinarian" required>
            担当した獣医師
          </FieldLabel>
          <input
            id="veterinarian"
            type="text"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("veterinarian")}
          />
          <FieldError message={errors.veterinarian?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="recordedOn" required>
            記録日
          </FieldLabel>
          <input
            id="recordedOn"
            type="date"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] tabular outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-64"
            {...register("recordedOn")}
          />
          <FieldError message={errors.recordedOn?.message} />
        </FormRow>

        <NoticeBar
          tone="info"
          title={`${animalIds?.length ?? 0}頭に同じ記録が追加されます`}
          description="モモ・コハク・ナナのカルテに記録されます。"
        />

        <FormActions
          submitLabel="記録する"
          hint="Enter キーでも次へ進めます"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
