"use client";

/**
 * 帳簿の手動記載フォーム（画面 s_f_ledger.html を再現）。
 * 日々の記録から自動記載されない事由（取得・譲渡・死亡・販売）だけを手で追加する。
 * 帳簿は削除できない前提のため、送信前に強い警告を出す。
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
import {
  ledgerManualInputSchema,
  type LedgerManualInput,
} from "@/lib/domain/schemas";

import { FormHeaderBar } from "./form-header-bar";

const REASON_OPTIONS = [
  { value: "acquire", label: "取得" },
  { value: "transfer", label: "譲渡" },
  { value: "death", label: "死亡" },
  { value: "sale", label: "販売" },
] as const;

export function LedgerManualForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LedgerManualInput>({
    resolver: zodResolver(ledgerManualInputSchema),
    defaultValues: {
      reason: "transfer",
      occurredOn: "2026-06-24",
      counterparty: "多摩ケンネル（第一種／東京都 第24-0119号）",
      price: 180000,
    },
  });

  const reason = useWatch({ control, name: "reason" });

  const onSubmit = () => {
    toast.success("帳簿に記載しました");
    router.push("/ledger");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="帳簿の手動記載"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="自動記載されない事由を1件追加する"
      />

      <FormHeading
        title="どの事由を記載しますか"
        description="日々の記録から自動で記載されない事由だけを手で追加します。記載後の削除はできません。"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel required>事由</FieldLabel>
          <SegmentGroup<LedgerManualInput["reason"]>
            name="reason"
            options={REASON_OPTIONS}
            value={reason}
            onChange={(next) => setValue("reason", next)}
          />
          <FieldError message={errors.reason?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="occurredOn" required>
            年月日
          </FieldLabel>
          <input
            id="occurredOn"
            type="date"
            className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-64"
            {...register("occurredOn")}
          />
          <FieldError message={errors.occurredOn?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="counterparty" hint="事業者の場合は登録番号まで">
            相手方
          </FieldLabel>
          <input
            id="counterparty"
            type="text"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("counterparty")}
          />
          <FieldError message={errors.counterparty?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="price" hint="無償の場合は 0">
            価格
          </FieldLabel>
          <div className="relative w-full md:w-64">
            <input
              id="price"
              type="number"
              inputMode="numeric"
              className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent py-2 pl-3 pr-10 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("price")}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[12.5px] text-muted-foreground">
              円
            </span>
          </div>
          <FieldError message={errors.price?.message} />
        </FormRow>

        <NoticeBar
          tone="warning"
          title="記載すると取り消せません"
          description="帳簿は5年間の保存義務があり、削除できません。訂正が必要な場合は、訂正の履歴が残る形で追記されます。"
        />

        <FormActions
          submitLabel="記載する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
