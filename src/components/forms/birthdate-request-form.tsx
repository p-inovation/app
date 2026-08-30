"use client";

/**
 * 生年月日の変更依頼フォーム（openapi.yaml birthdate-change-requests / FR-26）。
 * 生年月日は8週齢判定の起点のため、登録後は直接変更できず協会への申請にする。
 * 承認までは元の生年月日のまま運用される（この画面では申請を受け付けるだけ）。
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
} from "@/components/domain/form-parts";
import { Field, NoticeBar, Panel } from "@/components/domain/page-parts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  birthdateChangeRequestSchema,
  type BirthdateChangeRequestInput,
} from "@/lib/domain/schemas";
import { daysBetween, formatJpDate, sellableFrom } from "@/lib/domain/compliance";

import { FormHeaderBar } from "./form-header-bar";

export function BirthdateRequestForm({
  animalId,
  birthDate,
}: {
  animalId: string;
  birthDate: Date;
}) {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BirthdateChangeRequestInput>({
    resolver: zodResolver(birthdateChangeRequestSchema),
    defaultValues: {
      newBirthDate: "",
      reason: "",
    },
  });

  const newBirthDate = useWatch({ control, name: "newBirthDate" });

  const currentSellableFrom = sellableFrom(birthDate);

  const changeNotice = (() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newBirthDate ?? "")) return null;
    const parsed = new Date(newBirthDate);
    if (Number.isNaN(parsed.getTime())) return null;

    const nextSellableFrom = sellableFrom(parsed);
    const diff = daysBetween(currentSellableFrom, nextSellableFrom);
    if (diff === 0) return null;

    const direction = diff > 0 ? "遅く" : "早く";

    return (
      <NoticeBar
        tone="warning"
        title={`販売できる日が ${formatJpDate(nextSellableFrom)} に変わります`}
        description={`現在の解禁日（${formatJpDate(currentSellableFrom)}）から ${Math.abs(diff)}日 ${direction}なります。予約済みの引渡日がある場合は調整が必要です。`}
      />
    );
  })();

  const onSubmit = handleSubmit(() => {
    toast.success("変更を申請しました");
    router.push(`/animals/${animalId}`);
  });

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="生年月日の変更依頼"
        breadcrumbFrom="個体カルテ"
        breadcrumbTo="協会への申請"
        backHref={`/animals/${animalId}`}
      />

      <form onSubmit={onSubmit} noValidate>
        <FormHeading
          title="生年月日の変更を申請します"
          description="生年月日は販売できる日（8週齢）の起点になるため、登録後は直接変更できません。協会の承認が必要です。"
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="現在の生年月日"
            value={formatJpDate(birthDate)}
            mono
          />
          <Field
            label="現在の販売解禁日"
            value={formatJpDate(currentSellableFrom)}
            mono
          />
          <Field label="変更回数" value="0回" mono />
        </div>

        <FormRow className="mt-6">
          <FieldLabel htmlFor="newBirthDate" required>
            変更後の生年月日
          </FieldLabel>
          <Input
            id="newBirthDate"
            type="date"
            className="tabular min-h-11 md:w-64"
            {...register("newBirthDate")}
          />
          <FieldError message={errors.newBirthDate?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="reason" required hint="協会の審査で確認されます">
            変更の理由
          </FieldLabel>
          <Textarea id="reason" rows={4} {...register("reason")} />
          <FieldError message={errors.reason?.message} />
        </FormRow>

        {changeNotice}

        <NoticeBar
          tone="info"
          title="申請後、協会の承認までは元の生年月日で運用されます"
          description="承認されると自動で反映され、変更履歴に残ります。"
        />

        <FormActions
          submitLabel="申請する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
