"use client";

/**
 * マイクロチップ登録申請フォーム（画面 s_f_chip.html を再現）。
 * リーダーで読み取った15桁を3桁ごとの空白区切りで見せつつ、内部値は数字15桁のみを保持する。
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
} from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import {
  microchipRegisterInputSchema,
  type MicrochipRegisterInput,
} from "@/lib/domain/schemas";
import { addDays, daysBetween } from "@/lib/domain/compliance";
import { defaultThresholds } from "@/lib/domain/thresholds";
import { TODAY } from "@/lib/mock/data";

import { FormHeaderBar } from "./form-header-bar";

/** 前回引き継ぎの獣医師（HintBar「変更する」で入力欄にフォーカスを戻す） */
const PREVIOUS_VETERINARIAN = "白川動物病院 佐々木";

/** 数字だけを3桁ごとの空白区切りに整形して表示する */
function formatChipDisplay(digits: string): string {
  return digits.match(/.{1,3}/g)?.join(" ") ?? digits;
}

/** 表示用文字列から数字だけを取り出す（最大15桁） */
function extractDigits(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, 15);
}

export function ChipRegisterForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<MicrochipRegisterInput>({
    resolver: zodResolver(microchipRegisterInputSchema),
    defaultValues: {
      microchipNo: "",
      implantedOn: "2026-08-20",
      veterinarian: PREVIOUS_VETERINARIAN,
    },
  });

  const microchipNo = useWatch({ control, name: "microchipNo" });
  const implantedOn = useWatch({ control, name: "implantedOn" });

  const deadlineDays = (() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(implantedOn)) return null;
    const implanted = new Date(implantedOn);
    if (Number.isNaN(implanted.getTime())) return null;
    const deadline = addDays(
      implanted,
      defaultThresholds.chipRegistrationDeadlineDays,
    );
    return daysBetween(TODAY, deadline);
  })();

  const onSubmit = () => {
    toast.success("マイクロチップの登録申請を受け付けました");
    router.push("/microchip");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="マイクロチップ登録申請"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="環境省データベースへの登録申請を1件進める"
      />

      <FormHeading
        title="チップ番号と装着日を入力してください"
        description="リーダーで読み取った15桁をそのまま入力してください。3桁ごとに自動で区切ります。"
      />

      <HintBar
        action={
          <button
            type="button"
            onClick={() => setFocus("veterinarian")}
            className="min-h-11 rounded-lg border border-border bg-card px-4 text-[13px] hover:bg-muted"
          >
            変更する
          </button>
        }
      >
        装着した獣医師・病院は前回（白川動物病院 佐々木医師）を引き継いでいます
      </HintBar>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            value={formatChipDisplay(microchipNo)}
            onChange={(e) =>
              setValue("microchipNo", extractDigits(e.target.value), {
                shouldValidate: true,
              })
            }
          />
          <FieldError message={errors.microchipNo?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="implantedOn" required>
            装着した日
          </FieldLabel>
          <input
            id="implantedOn"
            type="date"
            className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-64"
            {...register("implantedOn")}
          />
          <FieldError message={errors.implantedOn?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="veterinarian" required>
            装着した獣医師
          </FieldLabel>
          <input
            id="veterinarian"
            type="text"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("veterinarian")}
          />
          <FieldError message={errors.veterinarian?.message} />
        </FormRow>

        {deadlineDays !== null ? (
          <NoticeBar
            tone="warning"
            title={`登録期限まで残り${deadlineDays}日`}
            description="装着から30日以内に環境省データベースへ登録してください。この画面から申請までまとめて進められます。"
          />
        ) : null}

        <FormActions
          submitLabel="登録する"
          hint="Enter キーでも次へ進めます"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
