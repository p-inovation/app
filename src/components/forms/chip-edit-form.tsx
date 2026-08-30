"use client";

/**
 * チップ情報の編集フォーム（画面 animals/[id]/chip）。
 * animalInputSchema のマイクロチップ群を chipEditSchema として切り出して使う。
 * 表示は3桁区切りだが、内部値・送信値は数字15桁のみ（chip-register-form.tsx と同じ方式）。
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
  SegmentGroup,
} from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import { Input } from "@/components/ui/input";
import { NEUTER_STATUS, neuterStatusLabel } from "@/lib/domain/enums";
import { chipEditSchema, type ChipEditInput } from "@/lib/domain/schemas";
import { addDays, daysBetween } from "@/lib/domain/compliance";
import { defaultThresholds } from "@/lib/domain/thresholds";
import { TODAY } from "@/lib/mock/data";

import { FormHeaderBar } from "./form-header-bar";

const NEUTER_STATUS_OPTIONS = NEUTER_STATUS.map((value) => ({
  value,
  label: neuterStatusLabel[value],
}));

/** 数字だけを3桁ごとの空白区切りに整形して表示する */
function formatChipDisplay(digits: string): string {
  return digits.match(/.{1,3}/g)?.join(" ") ?? digits;
}

/** 表示用文字列から数字だけを取り出す（最大15桁） */
function extractDigits(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, 15);
}

export function ChipEditForm({
  animalId,
  callName,
  defaultValues,
}: {
  animalId: string;
  callName: string;
  defaultValues: ChipEditInput;
}) {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChipEditInput>({
    resolver: zodResolver(chipEditSchema),
    defaultValues,
  });

  const microchipNo = useWatch({ control, name: "microchipNo" });
  const microchipImplantedOn = useWatch({
    control,
    name: "microchipImplantedOn",
  });
  const microchipRegisteredOn = useWatch({
    control,
    name: "microchipRegisteredOn",
  });
  const neuterStatus = useWatch({ control, name: "neuterStatus" });

  const registrationNotice = (() => {
    if (microchipRegisteredOn) {
      return (
        <NoticeBar
          tone="info"
          title="登録済みです"
          description="販売の要件を満たしています。"
        />
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(microchipImplantedOn ?? "")) return null;
    const implanted = new Date(microchipImplantedOn);
    if (Number.isNaN(implanted.getTime())) return null;

    const deadline = addDays(
      implanted,
      defaultThresholds.chipRegistrationDeadlineDays,
    );
    const remaining = daysBetween(TODAY, deadline);

    if (remaining < 0) {
      return (
        <NoticeBar
          tone="destructive"
          title="まだ環境省データベースに登録されていません"
          description={`期限を${-remaining}日過ぎています。未登録のままでは販売できません。`}
        />
      );
    }

    return (
      <NoticeBar
        tone="warning"
        title="まだ環境省データベースに登録されていません"
        description={`装着日から30日以内（残り${remaining}日）に登録してください。未登録のままでは販売できません。`}
      />
    );
  })();

  const onSubmit = handleSubmit(() => {
    toast.success("チップ情報を更新しました");
    router.push(`/animals/${animalId}`);
  });

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="マイクロチップ情報"
        breadcrumbFrom="個体カルテ"
        breadcrumbTo="装着と環境省データベース登録"
        backHref={`/animals/${animalId}`}
      />

      <form onSubmit={onSubmit} noValidate>
        <FormHeading
          title={`${callName} のチップ情報`}
          description="装着から30日以内に環境省データベースへ登録する義務があります。"
        />

        <FormRow>
          <FieldLabel htmlFor="microchipNo" required>
            チップ番号（15桁）
          </FieldLabel>
          <input
            id="microchipNo"
            type="text"
            inputMode="numeric"
            placeholder="392 141 006 872 35"
            className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={formatChipDisplay(microchipNo ?? "")}
            onChange={(e) =>
              setValue("microchipNo", extractDigits(e.target.value), {
                shouldValidate: true,
              })
            }
          />
          <FieldError message={errors.microchipNo?.message} />
        </FormRow>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormRow className="mb-0">
            <FieldLabel htmlFor="microchipImplantedOn" required>
              装着日
            </FieldLabel>
            <Input
              id="microchipImplantedOn"
              type="date"
              className="tabular min-h-11"
              {...register("microchipImplantedOn")}
            />
            <FieldError message={errors.microchipImplantedOn?.message} />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="microchipRegisteredOn" hint="未登録なら空のまま">
              環境省DBへの登録日
            </FieldLabel>
            <Input
              id="microchipRegisteredOn"
              type="date"
              className="tabular min-h-11"
              {...register("microchipRegisteredOn")}
            />
            <FieldError message={errors.microchipRegisteredOn?.message} />
          </FormRow>
        </div>

        {registrationNotice}

        <FormRow>
          <FieldLabel required>不妊去勢措置</FieldLabel>
          <SegmentGroup
            name="neuterStatus"
            options={NEUTER_STATUS_OPTIONS}
            value={neuterStatus}
            onChange={(next) => setValue("neuterStatus", next)}
          />
          <FieldError message={errors.neuterStatus?.message} />
        </FormRow>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormRow className="mb-0">
            <FieldLabel htmlFor="rabiesLicenseOn" hint="任意">
              狂犬病予防法の畜犬登録日
            </FieldLabel>
            <Input
              id="rabiesLicenseOn"
              type="date"
              className="tabular min-h-11"
              {...register("rabiesLicenseOn")}
            />
            <FieldError message={errors.rabiesLicenseOn?.message} />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="rabiesTagNo" hint="任意">
              登録（鑑札）番号
            </FieldLabel>
            <Input
              id="rabiesTagNo"
              type="text"
              className="tabular min-h-11"
              {...register("rabiesTagNo")}
            />
            <FieldError message={errors.rabiesTagNo?.message} />
          </FormRow>
        </div>

        <FormActions
          submitLabel="更新する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
