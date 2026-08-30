"use client";

/**
 * 日次点検の記録（要件 FR-29 / §4.3）。
 * 清掃・消毒・保守点検の実施と、動物の数・状態の異常有無を記録する。
 * 「異常あり」を選ぶと備考が必須になる（inspectionInputSchema で検証）。
 */

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { NoticeBar, PageBody, Panel } from "@/components/domain/page-parts";
import {
  FieldError,
  FieldLabel,
  FormActions,
  FormHeading,
  FormRow,
  HintBar,
  SegmentGroup,
} from "@/components/domain/form-parts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  inspectionInputSchema,
  type InspectionInput,
} from "@/lib/domain/schemas";
import { formatIsoDate } from "@/lib/domain/compliance";
import { currentUser, TODAY } from "@/lib/mock/data";

const DONE_OPTIONS = [
  { value: "done", label: "済んだ" },
  { value: "not_yet", label: "まだ" },
] as const;

const ABNORMAL_OPTIONS = [
  { value: "normal", label: "異常なし" },
  { value: "abnormal", label: "異常あり" },
] as const;

export default function NewInspectionPage() {
  const router = useRouter();

  const form = useForm<InspectionInput>({
    resolver: zodResolver(inspectionInputSchema),
    defaultValues: {
      // 点検年月日・時間は現在日時を初期値にする（要件 §7.3）
      inspectedOn: formatIsoDate(TODAY),
      inspectedAtTime: "09:30",
      cleaningDone: true,
      disinfectionDone: true,
      maintenanceDone: true,
      animalCountAbnormal: false,
      animalStateAbnormal: false,
      inspectorName: currentUser.name,
      note: "",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const countAbnormal = useWatch({ control, name: "animalCountAbnormal" });
  const stateAbnormal = useWatch({ control, name: "animalStateAbnormal" });
  const hasAbnormal = Boolean(countAbnormal) || Boolean(stateAbnormal);

  const onSubmit = handleSubmit((values) => {
    toast.success("点検を記録しました", {
      description: `${values.inspectedOn} ${values.inspectedAtTime} ／ ${values.inspectorName}`,
    });
    router.push("/");
  });

  return (
    <PageBody>
      <Panel className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-4 md:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="前の画面に戻る"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold tracking-tight">
              日次点検の記録
            </p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              ダッシュボード から ／ 清掃・消毒・保守点検と異常の有無
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="px-4 py-6 md:px-6">
          <FormHeading
            title="今日の点検を記録します"
            description="毎日1回、飼養施設の点検結果を記録します。異常があった場合は、その内容を必ず書き残してください。"
          />

          <HintBar>
            前回の点検（08-24 09:15 ／ {currentUser.name}）は異常なしでした
          </HintBar>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormRow className="mb-0">
              <FieldLabel htmlFor="inspectedOn" required>
                点検年月日
              </FieldLabel>
              <Input
                id="inspectedOn"
                type="date"
                className="tabular min-h-11"
                {...register("inspectedOn")}
              />
              <FieldError message={errors.inspectedOn?.message} />
            </FormRow>

            <FormRow className="mb-0">
              <FieldLabel htmlFor="inspectedAtTime" required>
                点検時間
              </FieldLabel>
              <Input
                id="inspectedAtTime"
                type="time"
                className="tabular min-h-11"
                {...register("inspectedAtTime")}
              />
              <FieldError message={errors.inspectedAtTime?.message} />
            </FormRow>
          </div>

          <FormRow className="mt-5">
            <FieldLabel required>清掃</FieldLabel>
            <SegmentGroup
              name="清掃"
              options={DONE_OPTIONS}
              value={useWatch({ control, name: "cleaningDone" }) ? "done" : "not_yet"}
              onChange={(v) => setValue("cleaningDone", v === "done")}
            />
          </FormRow>

          <FormRow>
            <FieldLabel required>消毒</FieldLabel>
            <SegmentGroup
              name="消毒"
              options={DONE_OPTIONS}
              value={useWatch({ control, name: "disinfectionDone" }) ? "done" : "not_yet"}
              onChange={(v) => setValue("disinfectionDone", v === "done")}
            />
          </FormRow>

          <FormRow>
            <FieldLabel required>保守点検</FieldLabel>
            <SegmentGroup
              name="保守点検"
              options={DONE_OPTIONS}
              value={useWatch({ control, name: "maintenanceDone" }) ? "done" : "not_yet"}
              onChange={(v) => setValue("maintenanceDone", v === "done")}
            />
          </FormRow>

          <FormRow>
            <FieldLabel required>動物の数</FieldLabel>
            <SegmentGroup
              name="動物の数"
              options={ABNORMAL_OPTIONS}
              value={countAbnormal ? "abnormal" : "normal"}
              onChange={(v) => setValue("animalCountAbnormal", v === "abnormal")}
            />
          </FormRow>

          <FormRow>
            <FieldLabel required>動物の状態</FieldLabel>
            <SegmentGroup
              name="動物の状態"
              options={ABNORMAL_OPTIONS}
              value={stateAbnormal ? "abnormal" : "normal"}
              onChange={(v) => setValue("animalStateAbnormal", v === "abnormal")}
            />
          </FormRow>

          <FormRow>
            <FieldLabel htmlFor="inspectorName" required>
              点検担当者
            </FieldLabel>
            <Input
              id="inspectorName"
              className="min-h-11"
              {...register("inspectorName")}
            />
            <FieldError message={errors.inspectorName?.message} />
          </FormRow>

          <FormRow>
            <FieldLabel
              htmlFor="note"
              required={hasAbnormal}
              hint={hasAbnormal ? undefined : "任意"}
            >
              備考
            </FieldLabel>
            <Textarea
              id="note"
              rows={3}
              placeholder={
                hasAbnormal
                  ? "異常の内容と、とった対応を書いてください"
                  : "気づいたことがあれば書き残せます"
              }
              {...register("note")}
            />
            <FieldError message={errors.note?.message} />
          </FormRow>

          {hasAbnormal ? (
            <NoticeBar
              tone="destructive"
              title="異常ありとして記録されます"
              description="この記録は責任者へすぐに通知されます。備考に、異常の内容ととった対応を必ず書いてください。"
            />
          ) : null}

          <FormActions
            submitLabel="記録する"
            onCancel={() => router.back()}
            hint="毎日1回の記録が必要です"
            pending={isSubmitting}
          />
        </form>
      </Panel>
    </PageBody>
  );
}
