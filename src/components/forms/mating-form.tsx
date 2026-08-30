"use client";

/**
 * 交配の登録フォーム（画面 s_f_mating.html を再現）。
 * 選んだ母犬の breedingCandidates.judgement に応じて判定メッセージを出し分け、
 * prohibited（年齢上限超）の個体は選べず、選ばれていれば送信も止める。
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import {
  FieldError,
  FieldLabel,
  FormActions,
  FormHeading,
  FormRow,
  SegmentGroup,
  type SegmentOption,
} from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import { formatIsoDate } from "@/lib/domain/compliance";
import { matingInputSchema, type MatingInput } from "@/lib/domain/schemas";
import { TODAY, breedingCandidates } from "@/lib/mock/data";

/** 前回出産からの経過月数（休養期間の目安として表示） */
function monthsSince(from: Date, today: Date): number {
  let months = (today.getFullYear() - from.getFullYear()) * 12 + (today.getMonth() - from.getMonth());
  if (today.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

const DAM_OPTIONS: SegmentOption<string>[] = breedingCandidates.map((c) => ({
  value: c.animalId,
  label: c.callName,
  disabledReason:
    c.judgement === "prohibited" ? "年齢上限超のため交配できません" : undefined,
}));

export function MatingForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MatingInput>({
    resolver: zodResolver(matingInputSchema),
    defaultValues: {
      damAnimalId: "",
      sireName: "ゴロー（外部種オス・貸出）",
      matingOn: "2026-11-10",
    },
  });

  const damAnimalId = useWatch({ control, name: "damAnimalId" });
  const candidate = breedingCandidates.find((c) => c.animalId === damAnimalId);
  const isProhibited = candidate?.judgement === "prohibited";

  const onSubmit = () => {
    toast.success("交配を登録しました");
    router.push("/breeding");
  };

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
            交配の登録
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            ダッシュボード から ／ 数値規制を確認しながら登録
          </p>
        </div>
      </div>

      <FormHeading
        title="どの母個体を交配しますか"
        description="年齢と生涯出産回数から、交配できるかどうかをその場で判定します。判定に引っかかる個体は登録できません。"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel required>母犬</FieldLabel>
          <SegmentGroup<string>
            name="damAnimalId"
            options={DAM_OPTIONS}
            value={damAnimalId}
            onChange={(next) => setValue("damAnimalId", next)}
          />
          <FieldError message={errors.damAnimalId?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="sireName" hint="外部の種オスは名前を入力">
            父個体
          </FieldLabel>
          <input
            id="sireName"
            type="text"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("sireName")}
          />
          <FieldError message={errors.sireName?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="matingOn" required>
            交配予定日
          </FieldLabel>
          <input
            id="matingOn"
            type="date"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] tabular outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-64"
            {...register("matingOn")}
          />
          <FieldError message={errors.matingOn?.message} />
        </FormRow>

        {candidate ? <MatingNotice candidate={candidate} /> : null}

        <FormActions
          submitLabel="登録する"
          hint="Enter キーでも次へ進めます"
          onCancel={() => router.back()}
          pending={isSubmitting || isProhibited}
        />
      </form>
    </Panel>
  );
}

function MatingNotice({
  candidate,
}: {
  candidate: (typeof breedingCandidates)[number];
}) {
  const { callName, judgement, ageLabel, birthCount, maxBirthCount, lastDeliveredOn, nextMating } =
    candidate;

  if (judgement === "pregnant") {
    return (
      <NoticeBar
        tone="warning"
        title={`${callName}は現在妊娠中です`}
      />
    );
  }

  if (judgement === "warning") {
    return (
      <NoticeBar
        tone="warning"
        title={`${callName}は交配できますが、期限が近づいています`}
        description={nextMating}
      />
    );
  }

  if (judgement === "ok") {
    const months = lastDeliveredOn ? monthsSince(lastDeliveredOn, TODAY) : null;
    const lastDeliveredLabel = lastDeliveredOn
      ? formatIsoDate(lastDeliveredOn)
      : "記録なし";
    return (
      <NoticeBar
        tone="info"
        title={`${callName}は交配できます`}
        description={`${ageLabel}・生涯出産${birthCount}回。前回出産（${lastDeliveredLabel}）から${months ?? "—"}か月が経過しており、休養期間も確保できています。`}
      />
    );
  }

  // prohibited
  return (
    <NoticeBar
      tone="destructive"
      title={`${callName}は交配できません`}
      description={`${ageLabel}・生涯出産${birthCount}回（上限${maxBirthCount}回）。年齢上限を超えているため登録できません。`}
    />
  );
}
