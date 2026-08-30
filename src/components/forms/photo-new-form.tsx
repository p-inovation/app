"use client";

/**
 * 日々の写真の登録フォーム。
 * 写真そのものはモックのため実ファイルを扱わず、斜線プレースホルダで表現する。
 * animalInputSchema は個体登録用のため、この画面には対応するAPIスキーマが無い。
 * react-hook-form は Enter キー送信・状態管理のために使い、公開先の必須チェックのみ行う。
 */

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  FieldLabel,
  FormActions,
  FormHeading,
  FormRow,
  HintBar,
  SegmentGroup,
  type SegmentOption,
} from "@/components/domain/form-parts";
import { PhotoPlaceholder } from "@/components/animal-detail/photo-placeholder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SUBJECT_OPTIONS = [
  { value: "momo", label: "モモ" },
  { value: "kohaku", label: "コハク" },
  { value: "nana", label: "ナナ" },
  { value: "hana", label: "ハナ" },
  { value: "sora", label: "ソラ" },
  { value: "kinako", label: "きなこ" },
] as const satisfies readonly SegmentOption<string>[];
type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

const VISIBILITY_OPTIONS = [
  { value: "internal", label: "社内だけ" },
  { value: "reserved", label: "予約者にも見せる" },
  { value: "public", label: "自社サイトに載せる" },
] as const satisfies readonly SegmentOption<string>[];
type VisibilityValue = (typeof VISIBILITY_OPTIONS)[number]["value"];

const PHOTO_LABELS = ["朝の運動", "離乳食", "3頭の様子"];

type PhotoFormValues = {
  subjects: SubjectValue[];
  note: string;
  visibility: VisibilityValue;
};

export function PhotoNewForm() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<PhotoFormValues>({
    defaultValues: {
      subjects: ["momo", "kohaku", "nana"],
      note: "離乳食に切り替えて3日目。3頭とも完食。",
      visibility: "reserved",
    },
  });

  const subjects = useWatch({ control, name: "subjects" });
  const visibility = useWatch({ control, name: "visibility" });

  const toggleSubject = (v: SubjectValue) => {
    const next = subjects.includes(v)
      ? subjects.filter((s) => s !== v)
      : [...subjects, v];
    setValue("subjects", next, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(() => {
    // モックのため送信はトーストのみ。実データ接続時はAPIへ写真とタグ付けをPOSTする。
    toast.success("写真を登録しました");
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
          <p className="text-[13px] font-semibold">日々の写真を登録</p>
          <p className="truncate text-[11.5px] text-muted-foreground">
            <Link href="/" className="hover:underline">
              ダッシュボード
            </Link>{" "}
            から ／ 今日の写真を登録します
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <FormHeading
          title="今日の写真を登録します"
          description="撮った写真をまとめて選び、写っている子にチェックを入れるだけです。1枚を複数の子に紐づけられます。"
        />

        <HintBar
          action={
            <Button type="button" variant="outline" size="sm" className="h-9 bg-card">
              対象を変える
            </Button>
          }
        >
          前回（08-22）と同じ「LIT-0037の3頭」を選んでいます
        </HintBar>

        <FormRow>
          <FieldLabel hint="1回に20枚まで">今日の写真</FieldLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PHOTO_LABELS.map((label) => (
              <PhotoPlaceholder
                key={label}
                className="aspect-square"
                label={label}
              />
            ))}
            <button
              type="button"
              className="flex aspect-square min-h-11 items-center justify-center rounded-md border border-dashed border-border text-[13px] text-muted-foreground hover:bg-muted"
            >
              ＋ 追加
            </button>
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
            写真をここにドラッグするか、枠をタップして撮影・選択します
          </p>
        </FormRow>

        <FormRow>
          <FieldLabel hint="複数選べます">写っている子</FieldLabel>
          <SegmentGroup
            name="写っている子"
            multiple
            options={SUBJECT_OPTIONS.map((opt) => ({
              ...opt,
              label: subjects.includes(opt.value) ? `✓ ${opt.label}` : opt.label,
            }))}
            value={subjects}
            onChange={toggleSubject}
          />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="note" hint="任意 ／ 顧客に見せる説明にも使えます">
            ひとこと
          </FieldLabel>
          <Textarea
            id="note"
            className="min-h-11"
            defaultValue="離乳食に切り替えて3日目。3頭とも完食。"
            onChange={(e) => setValue("note", e.target.value)}
          />
        </FormRow>

        <FormRow>
          <FieldLabel required>公開先</FieldLabel>
          <SegmentGroup
            name="公開先"
            options={VISIBILITY_OPTIONS}
            value={visibility}
            onChange={(v) => setValue("visibility", v, { shouldValidate: true })}
          />
        </FormRow>

        <FormActions submitLabel="登録する" pending={isSubmitting} onCancel={() => router.push("/animals")} />
      </form>
    </div>
  );
}
