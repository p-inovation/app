"use client";

/**
 * 子個体の一括登録フォーム（FR-41）。
 * 生年月日・親・管理帳簿番号は繁殖実施の記録から自動で確定するため、
 * このフォームでは性別・呼び名・チップ番号のみを行ごとに入力する。
 */

import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";

import {
  FieldError,
  FieldLabel,
  FormActions,
  FormHeading,
  FormRow,
  HintBar,
  SegmentGroup,
  type SegmentOption,
} from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import { formatIsoDate, formatJpDate, sellableFrom } from "@/lib/domain/compliance";
import { sexLabel, SEX } from "@/lib/domain/enums";
import {
  offspringBulkSchema,
  type OffspringBulk,
} from "@/lib/domain/schemas";

import { FormHeaderBar } from "./form-header-bar";

const SEX_OPTIONS: SegmentOption<(typeof SEX)[number]>[] = SEX.map((s) => ({
  value: s,
  label: sexLabel[s],
}));

const EMPTY_ROW = { sex: "female" as const, callName: "", microchipNo: "" };

export function OffspringBulkForm({
  planId,
  pairLabel,
  bornOn,
  expectedCount,
}: {
  planId: string;
  pairLabel: string;
  bornOn: Date;
  expectedCount: number;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OffspringBulk>({
    resolver: zodResolver(offspringBulkSchema),
    defaultValues: {
      offspring: Array.from({ length: expectedCount }, () => ({
        ...EMPTY_ROW,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "offspring",
  });

  const offspring = useWatch({ control, name: "offspring" });

  const sellableDate = sellableFrom(bornOn);

  const onSubmit = () => {
    toast.success(`${fields.length}頭を登録しました`);
    router.push(`/breeding/${planId}`);
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="子個体の一括登録"
        breadcrumbFrom="繁殖・産次"
        breadcrumbTo="生まれた子の情報をまとめて入力"
        backHref={`/breeding/${planId}`}
      />

      <FormHeading
        title="生まれた子の情報を入力します"
        description="生年月日・親・管理帳簿番号は繁殖実施の記録から自動で入ります。呼び名はあとから変えられます。"
      />

      <HintBar>
        {pairLabel} の出産（{formatIsoDate(bornOn)} / {expectedCount}頭）に紐づけて登録します
      </HintBar>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => {
            const sexValue = offspring?.[index]?.sex;
            return (
              <div
                key={field.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[13.5px] font-semibold">
                    {index + 1}頭目
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    aria-label={`${index + 1}頭目を削除`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr_1fr]">
                  <FormRow className="mb-0">
                    <FieldLabel required>性別</FieldLabel>
                    <SegmentGroup
                      name={`offspring.${index}.sex`}
                      options={SEX_OPTIONS}
                      value={sexValue}
                      onChange={(next) =>
                        setValue(`offspring.${index}.sex`, next)
                      }
                    />
                    <FieldError
                      message={errors.offspring?.[index]?.sex?.message}
                    />
                  </FormRow>

                  <FormRow className="mb-0">
                    <FieldLabel htmlFor={`callName-${field.id}`} required>
                      呼び名
                    </FieldLabel>
                    <input
                      id={`callName-${field.id}`}
                      type="text"
                      className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      {...register(`offspring.${index}.callName`)}
                    />
                    <FieldError
                      message={errors.offspring?.[index]?.callName?.message}
                    />
                  </FormRow>

                  <FormRow className="mb-0">
                    <FieldLabel
                      htmlFor={`microchipNo-${field.id}`}
                      hint="15桁・任意"
                    >
                      チップ番号
                    </FieldLabel>
                    <input
                      id={`microchipNo-${field.id}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={15}
                      className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] tabular outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      {...register(`offspring.${index}.microchipNo`)}
                    />
                    <FieldError
                      message={errors.offspring?.[index]?.microchipNo?.message}
                    />
                  </FormRow>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => append({ ...EMPTY_ROW })}
            className="min-h-11 rounded-lg border border-dashed border-border bg-card px-4 text-[13px] hover:bg-muted"
          >
            ＋ 頭数を追加
          </button>
        </div>

        <div className="mt-6">
          <NoticeBar
            tone="info"
            title={`登録すると${fields.length}頭の個体が台帳に追加されます`}
            description={`生年月日は出産日（${formatIsoDate(bornOn)}）で固定されます。販売できるのは56日後の ${formatJpDate(sellableDate)} 以降です。`}
          />
        </div>

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
