"use client";

/**
 * 個体の新規登録フォーム。
 * 「入手の方法」「産次」はスキーマ外のUI項目（産次を選ぶと基本情報へ自動転記する導線のため）。
 * スキーマに乗る項目は animalInputSchema（react-hook-form + zodResolver）で管理する。
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  FieldError,
  FieldLabel,
  FormActions,
  FormHeading,
  FormRow,
  FormSectionLabel,
  HintBar,
  SegmentGroup,
  type SegmentOption,
} from "@/components/domain/form-parts";
import { NoticeBar } from "@/components/domain/page-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { animalInputSchema, type AnimalInput } from "@/lib/domain/schemas";
import { formatJpDate, sellableFrom } from "@/lib/domain/compliance";

/** 「入手の方法」。動愛法の帳簿区分（出生／取得／譲受）に対応する画面用の選択肢 */
const ACQUISITION_METHODS = [
  { value: "own_breeding", label: "自家繁殖" },
  { value: "acquired", label: "他の事業者から取得" },
  { value: "transferred", label: "一般の飼い主から譲受" },
] as const satisfies readonly SegmentOption<string>[];
type AcquisitionMethod = (typeof ACQUISITION_METHODS)[number]["value"];

const DEFAULT_LITTER =
  "LIT-0037（ハナ × レオン ／ 2026-07-08 出生 ／ 3頭）";

const SEX_OPTIONS = [
  { value: "male", label: "オス" },
  { value: "female", label: "メス" },
] as const satisfies readonly SegmentOption<"male" | "female">[];

export function AnimalNewForm() {
  const router = useRouter();
  const [acquisition, setAcquisition] = useState<AcquisitionMethod>("own_breeding");
  const [litterFollowsDefault, setLitterFollowsDefault] = useState(true);
  const [litter, setLitter] = useState(DEFAULT_LITTER);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnimalInput>({
    resolver: zodResolver(animalInputSchema),
    defaultValues: {
      status: "draft",
      species: "dog",
      sex: "female",
      callName: "",
      birthDate: "2026-07-08",
      breedOther: "トイ・プードル",
      coatColorOther: "",
      microchipNo: "",
    },
  });

  const sex = useWatch({ control, name: "sex" });
  const birthDate = useWatch({ control, name: "birthDate" });

  const sellDate =
    birthDate && !Number.isNaN(Date.parse(birthDate))
      ? sellableFrom(new Date(birthDate))
      : null;

  const onSubmit = handleSubmit(() => {
    // モックのため送信はトーストのみ。実データ接続時はAPIへPOSTする。
    toast.success("個体を登録しました");
    router.push("/animals");
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-[0_1px_2px_rgba(16,18,20,0.04)] md:p-6">
      <div className="mb-5 flex items-center gap-3">
        <Button
          nativeButton={false}
          render={<Link href="/animals" />}
          variant="outline"
          size="icon"
          className="size-9 shrink-0 rounded-full bg-card"
          aria-label="戻る"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold">個体の新規登録</p>
          <p className="truncate text-[11.5px] text-muted-foreground">
            <Link href="/" className="hover:underline">
              ダッシュボード
            </Link>{" "}
            から ／ 個体を登録する
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <FormHeading
          title="個体を登録する"
          description="項目ごとに入れて、最後に「登録する」を押すだけです。産次を選ぶと犬種・生年月日・親が自動で入ります。空欄のままでも登録でき、あとからカルテで直せます。"
        />

        <HintBar
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 bg-card"
              onClick={() => setLitterFollowsDefault(false)}
            >
              別の産次にする
            </Button>
          }
        >
          直前に登録したコハクと同じ産次（LIT-0037）を選んでいます
        </HintBar>

        <FormSectionLabel>生まれ</FormSectionLabel>

        <FormRow>
          <FieldLabel required>入手の方法</FieldLabel>
          <SegmentGroup
            name="入手の方法"
            options={ACQUISITION_METHODS}
            value={acquisition}
            onChange={setAcquisition}
          />
        </FormRow>

        {acquisition === "own_breeding" ? (
          <FormRow>
            <FieldLabel required hint="選ぶと6項目が自動で入ります">
              産次
            </FieldLabel>
            <Input
              className="min-h-11"
              value={litter}
              onChange={(e) => {
                setLitter(e.target.value);
                setLitterFollowsDefault(false);
              }}
              aria-label="産次"
            />
          </FormRow>
        ) : null}

        <FormSectionLabel>基本情報（{litterFollowsDefault ? "産次から引き継いだ値が入っています" : "手動で入力してください"}）</FormSectionLabel>

        <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2">
          <FormRow>
            <FieldLabel
              htmlFor="birthDate"
              required
              hint="引渡し解禁日の計算に使います"
            >
              生年月日
            </FieldLabel>
            <Input
              id="birthDate"
              type="date"
              className="min-h-11"
              {...register("birthDate")}
            />
            <FieldError message={errors.birthDate?.message} />
          </FormRow>

          <FormRow>
            <FieldLabel required>性別</FieldLabel>
            <SegmentGroup
              name="性別"
              options={SEX_OPTIONS}
              value={sex}
              onChange={(v) => setValue("sex", v, { shouldValidate: true })}
            />
            <FieldError message={errors.sex?.message} />
          </FormRow>

          <FormRow>
            <FieldLabel htmlFor="callName" required>
              呼び名
            </FieldLabel>
            <Input
              id="callName"
              className="min-h-11"
              placeholder="例：モモ"
              {...register("callName")}
            />
            <FieldError message={errors.callName?.message} />
          </FormRow>

          <FormRow>
            <FieldLabel htmlFor="breedOther">犬種</FieldLabel>
            <Input
              id="breedOther"
              className="min-h-11"
              {...register("breedOther")}
            />
            <FieldError message={errors.breedOther?.message} />
          </FormRow>

          <FormRow>
            <FieldLabel htmlFor="coatColorOther">毛色</FieldLabel>
            <Input
              id="coatColorOther"
              className="min-h-11"
              placeholder="例：レッド"
              {...register("coatColorOther")}
            />
            <FieldError message={errors.coatColorOther?.message} />
          </FormRow>
        </div>

        <FormSectionLabel>マイクロチップ</FormSectionLabel>

        <FormRow>
          <FieldLabel htmlFor="microchipNo">チップ番号（15桁）</FieldLabel>
          <Input
            id="microchipNo"
            className="min-h-11"
            inputMode="numeric"
            placeholder="例：392141006872341"
            {...register("microchipNo")}
          />
          <FieldError message={errors.microchipNo?.message} />
        </FormRow>

        {sellDate ? (
          <FormRow>
            <NoticeBar
              tone="info"
              title={`この子の引渡し解禁日は ${formatJpDate(sellDate)} です`}
              description="生年月日から56日後です。この日より前の引渡しはできません。"
            />
          </FormRow>
        ) : null}

        <FormActions
          submitLabel="登録する"
          hint="Enter キーでも次へ進めます"
          pending={isSubmitting}
          onCancel={() => router.push("/animals")}
        />
      </form>
    </div>
  );
}
