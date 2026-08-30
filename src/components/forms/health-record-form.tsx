"use client";

/**
 * 健康・ワクチン記録の追加フォーム（画面 s_f_health.html を再現）。
 * 記録の種類（ワクチン/駆虫/検査/通院・治療）で入力項目を出し分ける。
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
  type HealthRecordInput,
} from "@/lib/domain/schemas";
import {
  HEALTH_FORM_TYPES,
  healthRecordTypeLabel,
  type HealthRecordType,
} from "@/lib/domain/enums";

import { FormHeaderBar } from "./form-header-bar";

/** 対象個体（LIT-0037 の3頭）。モックアップの「3頭にまとめて記録」に合わせて固定 */
const TARGET_ANIMAL_IDS = ["a-0142", "a-0143", "a-0141"];

/** ワクチンの種類の選択肢 */
const VACCINE_OPTIONS = [
  { value: "5種混合", label: "5種混合" },
  { value: "7種混合", label: "7種混合" },
  { value: "狂犬病", label: "狂犬病" },
] as const;

/** 前回の記録（HintBar「前回と同じ」で流し込む値） */
const PREVIOUS_RECORD = {
  recordType: "vaccine" as const,
  vaccineName: "5種混合",
  lotNo: "MJ-4471",
  veterinarian: "白川動物病院 佐々木",
};

const RECORD_TYPE_OPTIONS = HEALTH_FORM_TYPES.map((value) => ({
  value,
  label: healthRecordTypeLabel[value],
}));

export function HealthRecordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HealthRecordInput>({
    resolver: zodResolver(healthRecordInputSchema),
    defaultValues: {
      recordedOn: "2026-08-25",
      recordType: "vaccine",
      veterinarian: "白川動物病院 佐々木",
      animalIds: TARGET_ANIMAL_IDS,
    },
  });

  const recordType = useWatch({ control, name: "recordType" });
  const vaccineName = useWatch({ control, name: "vaccineName" });

  const applyPreviousRecord = () => {
    setValue("recordType", PREVIOUS_RECORD.recordType);
    setValue("vaccineName", PREVIOUS_RECORD.vaccineName);
    setValue("lotNo", PREVIOUS_RECORD.lotNo);
    setValue("veterinarian", PREVIOUS_RECORD.veterinarian);
  };

  const onSubmit = () => {
    toast.success("健康・ワクチン記録を登録しました");
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
                name="vaccineName"
                options={VACCINE_OPTIONS}
                value={vaccineName}
                onChange={(next) => setValue("vaccineName", next)}
              />
              <FieldError message={errors.vaccineName?.message} />
            </FormRow>

            <FormRow>
              <FieldLabel htmlFor="lotNo" required>
                ロット番号
              </FieldLabel>
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
            <FieldLabel htmlFor="medicationName">投薬名</FieldLabel>
            <input
              id="medicationName"
              type="text"
              className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("medicationName")}
            />
            <FieldError message={errors.medicationName?.message} />
          </FormRow>
        ) : null}

        {recordType === "genetic_test" ? (
          <>
            <FormRow>
              <FieldLabel htmlFor="geneticTestName">検査名</FieldLabel>
              <input
                id="geneticTestName"
                type="text"
                className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("geneticTestName")}
              />
              <FieldError message={errors.geneticTestName?.message} />
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
          title="3頭に同じ記録が追加されます"
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
