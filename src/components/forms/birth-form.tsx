"use client";

/**
 * 出産・産次の登録フォーム（画面 s_f_birth.html を再現）。
 * 生存頭数の分だけ個体レコードを自動作成する前提の画面。判定メッセージは
 * こむぎの生涯出産回数（+今回の1回）を defaultThresholds.maxLifetimeBirths と突き合わせて出す。
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import {
  FieldError,
  FieldLabel,
  FormActions,
  FormHeading,
  FormRow,
  HintBar,
} from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import { defaultThresholds } from "@/lib/domain/thresholds";
import { birthInputSchema, type BirthInput } from "@/lib/domain/schemas";
import { breedingCandidates, breedingPlans } from "@/lib/mock/data";

/** 紐づける交配記録（こむぎ × ゴロー）。モックアップは1件固定で表示している */
const TARGET_PLAN = breedingPlans[0];
const DAM = breedingCandidates.find((c) => c.callName === "こむぎ");

export function BirthForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BirthInput>({
    resolver: zodResolver(birthInputSchema),
    defaultValues: {
      bornOn: "2026-10-01",
      survivorCount: 4,
      stillbornCount: 1,
    },
  });

  const onSubmit = () => {
    toast.success("出産・産次を登録しました");
    router.push("/breeding");
  };

  const nextBirthCount = (DAM?.birthCount ?? 0) + 1;

  return (
    <Panel className="p-5 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/breeding"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted"
          aria-label="戻る"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-[16px] font-semibold tracking-tight">
            出産・産次の登録
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            ダッシュボード から ／ 生存頭数から個体を自動作成
          </p>
        </div>
      </div>

      <FormHeading
        title="何頭生まれましたか"
        description="生存頭数を入れると、その数だけ個体レコードを自動でつくります。呼び名はあとから付けられます。"
      />

      <HintBar
        action={
          <Link
            href="/breeding"
            className="flex min-h-11 items-center rounded-lg border border-border bg-card px-4 text-[13px] hover:bg-muted"
          >
            交配記録を確認
          </Link>
        }
      >
        {TARGET_PLAN?.pair}（{TARGET_PLAN?.matedOn}）に紐づけて登録します
      </HintBar>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel htmlFor="bornOn" required>
            出産日
          </FieldLabel>
          <input
            id="bornOn"
            type="date"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] tabular outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-64"
            {...register("bornOn")}
          />
          <FieldError message={errors.bornOn?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="survivorCount" required>
            生存している頭数
          </FieldLabel>
          <div className="relative w-full md:w-64">
            <input
              id="survivorCount"
              type="number"
              inputMode="numeric"
              className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent px-3 pr-10 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("survivorCount")}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[12.5px] text-muted-foreground">
              頭
            </span>
          </div>
          <FieldError message={errors.survivorCount?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="stillbornCount" hint="該当がなければ 0">
            死産・生後すぐの死亡
          </FieldLabel>
          <div className="relative w-full md:w-64">
            <input
              id="stillbornCount"
              type="number"
              inputMode="numeric"
              className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent px-3 pr-10 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("stillbornCount")}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[12.5px] text-muted-foreground">
              頭
            </span>
          </div>
          <FieldError message={errors.stillbornCount?.message} />
        </FormRow>

        <NoticeBar
          tone="warning"
          title={`こむぎは今回の出産で生涯${nextBirthCount}回目になります`}
          description={`上限は${defaultThresholds.maxLifetimeBirths}回です。次回以降の交配可否は、この記録をもとに自動で判定されます。`}
        />

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
