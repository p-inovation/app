"use client";

/**
 * 体重測定の入力フォーム（画面 s_f_weight.html を再現）。
 * 行ごとに前回値との差分をその場で計算して表示する。
 */

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { FormActions, FormHeading, HintBar } from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import { animals, TODAY } from "@/lib/mock/data";
import { formatIsoDate } from "@/lib/domain/compliance";
import { weightInputSchema } from "@/lib/domain/schemas";
import { cn } from "@/lib/utils";

import { FormHeaderBar } from "./form-header-bar";

/** 測定対象の7頭。販売済（sold）以外を並び順のまま使う */
const TARGETS = animals.filter((a) => a.category !== "sold").slice(0, 7);

const rowSchema = z.object({
  animalId: weightInputSchema.shape.animalId,
  weightG: z.coerce
    .number({ message: "体重を数値で入力してください" })
    .int("体重はグラム単位の整数で入力してください")
    .positive("体重は0より大きい値を入力してください")
    .max(100_000, "体重の値が大きすぎます")
    .optional(),
});

const weightsFormSchema = z.object({
  measuredOn: weightInputSchema.shape.measuredOn,
  rows: z.array(rowSchema),
});

type WeightsFormValues = z.input<typeof weightsFormSchema>;

export function WeightRecordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<WeightsFormValues>({
    resolver: zodResolver(weightsFormSchema),
    defaultValues: {
      measuredOn: formatIsoDate(TODAY),
      rows: TARGETS.map((a) => ({ animalId: a.id, weightG: undefined })),
    },
  });

  const rows = useWatch({ control, name: "rows" });

  const diffs = TARGETS.map((animal, index) => {
    const raw = rows?.[index]?.weightG;
    const entered =
      raw === undefined || raw === null || raw === ""
        ? undefined
        : Number(raw);
    const previous = animal.currentWeightG;
    const diff =
      entered !== undefined && !Number.isNaN(entered) && previous !== undefined
        ? entered - previous
        : undefined;
    return { animal, diff };
  });

  const decreasedAnimals = diffs
    .filter((d) => d.diff !== undefined && d.diff < 0)
    .map((d) => d.animal.callName);

  const onSubmit = () => {
    toast.success("体重を記録しました");
    router.push("/");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="体重測定の入力"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="週次の測定をまとめて入力"
      />

      <FormHeading
        title="今週の体重を入力してください"
        description="測定が必要な7頭を並べています。上から順に入れていくと自動で次の行に移ります。前回の値との差は右側に出ます。"
      />

      <HintBar
        action={
          <button
            type="button"
            className="min-h-11 rounded-lg border border-border bg-card px-4 text-[13px] hover:bg-muted"
          >
            並び順を変える
          </button>
        }
      >
        先週（08-18）の測定順に並べています。並び順はケージの位置に合わせて変えられます
      </HintBar>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-2 flex items-baseline gap-2 text-[13px]">
          <span className="tabular font-medium">
            測定日 {formatIsoDate(TODAY)}（火）
          </span>
          <span className="ml-auto text-[12px] text-muted-foreground">
            毎週火曜
          </span>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border">
          {TARGETS.map((animal, index) => {
            const { diff } = diffs[index];
            const isDecrease = diff !== undefined && diff < 0;
            return (
              <div
                key={animal.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <div className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
                  <p className="text-[13.5px] font-medium">{animal.callName}</p>
                  <p className="tabular text-[11.5px] whitespace-nowrap text-muted-foreground">
                    {animal.ledgerNo}
                  </p>
                </div>

                <p className="tabular shrink-0 text-[12.5px] text-muted-foreground">
                  前回{" "}
                  {animal.currentWeightG !== undefined
                    ? animal.currentWeightG.toLocaleString("ja-JP")
                    : "—"}{" "}
                  g
                </p>

                <div className="relative shrink-0">
                  <input
                    type="number"
                    inputMode="numeric"
                    aria-label={`${animal.callName}の体重`}
                    className={cn(
                      "tabular min-h-11 w-[120px] rounded-lg border bg-transparent py-1 pr-7 pl-3 text-right text-[14px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      isDecrease
                        ? "border-[#b2402f] bg-[#fbeae7]"
                        : "border-input focus-visible:border-ring",
                    )}
                    {...register(`rows.${index}.weightG`)}
                  />
                  <span className="tabular pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[12.5px] text-muted-foreground">
                    g
                  </span>
                </div>

                <p
                  className={cn(
                    "tabular w-16 shrink-0 text-right text-[12.5px]",
                    diff === undefined
                      ? "text-transparent"
                      : isDecrease
                        ? "font-medium text-[#b2402f]"
                        : "text-muted-foreground",
                  )}
                >
                  {diff !== undefined
                    ? `${diff > 0 ? "+" : ""}${diff.toLocaleString("ja-JP")} g`
                    : "—"}
                </p>
              </div>
            );
          })}
        </div>

        {decreasedAnimals.length > 0 ? (
          <div className="mt-5">
            <NoticeBar
              tone="warning"
              title={`${decreasedAnimals.join("・")}の体重が前週より減っています`}
            />
          </div>
        ) : null}

        <FormActions
          submitLabel="まとめて記録する"
          hint="Enter キーでも次へ進めます"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
