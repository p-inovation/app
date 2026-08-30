"use client";

/**
 * 引合いの登録フォーム（画面 s_f_inquiry.html を再現）。
 * 電話口で聞きながら入力する想定のため、必須はお名前・電話番号のみに絞る。
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
  inquiryInputSchema,
  type InquiryInput,
} from "@/lib/domain/schemas";

import { FormHeaderBar } from "./form-header-bar";

/** 同姓同名チェックのモック対象。既存顧客カルテ（中村様相当）の代わりに石井様で固定 */
const DUPLICATE_CUSTOMER_NAME = "石井 健太";
const DUPLICATE_CUSTOMER_NOTE =
  "石井 健太 様（2024-11-02 ／ 柴を購入済）。同じ方の場合は既存の顧客に追記できます。";

const BREED_OPTIONS = [
  { value: "toy_poodle", label: "トイ・プードル" },
  { value: "shiba", label: "柴" },
  { value: "pomeranian", label: "ポメラニアン" },
  { value: "undecided", label: "まだ決めていない" },
] as const;

const SOURCE_OPTIONS = [
  { value: "website", label: "自社サイト" },
  { value: "referral", label: "紹介" },
  { value: "sns", label: "SNS" },
  { value: "phone", label: "電話" },
  { value: "other", label: "その他" },
] as const;

export function InquiryNewForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquiryInputSchema),
    defaultValues: {
      customerName: "石井 健太",
      phone: "090-2841-7736",
    },
  });

  const customerName = useWatch({ control, name: "customerName" });
  const desiredBreed = useWatch({ control, name: "desiredBreed" });
  const source = useWatch({ control, name: "source" });

  const showDuplicateNotice = customerName === DUPLICATE_CUSTOMER_NAME;

  const onSubmit = () => {
    toast.success("引合いを登録しました");
    router.push("/inquiries");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="引合いの登録"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="お客さまの引合いを1件登録する"
      />

      <FormHeading
        title="お客さまのお名前と連絡先を教えてください"
        description="電話で聞きながら入力できるように、最小限の項目だけにしています。あとから足せます。"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel htmlFor="customerName" required>
            お名前
          </FieldLabel>
          <input
            id="customerName"
            type="text"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("customerName")}
          />
          <FieldError message={errors.customerName?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="phone" required>
            電話番号
          </FieldLabel>
          <input
            id="phone"
            type="tel"
            className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-64"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel hint="任意">希望する犬種</FieldLabel>
          <SegmentGroup<NonNullable<InquiryInput["desiredBreed"]>>
            name="desiredBreed"
            options={BREED_OPTIONS}
            value={desiredBreed}
            onChange={(next) => setValue("desiredBreed", next)}
          />
          <FieldError message={errors.desiredBreed?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel hint="任意">知ったきっかけ</FieldLabel>
          <SegmentGroup<NonNullable<InquiryInput["source"]>>
            name="source"
            options={SOURCE_OPTIONS}
            value={source}
            onChange={(next) => setValue("source", next)}
          />
          <FieldError message={errors.source?.message} />
        </FormRow>

        {showDuplicateNotice ? (
          <NoticeBar
            tone="info"
            title="同姓同名のお客さまが1件あります"
            description={DUPLICATE_CUSTOMER_NOTE}
          />
        ) : null}

        <FormActions
          submitLabel="登録する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
