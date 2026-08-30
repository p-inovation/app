"use client";

/**
 * 販売登録フォーム（openapi.yaml /animals/{animalId}/sell / 要件 §4.2）。
 * 表示できている時点で evaluateCompliance は isSellable=true（ページ側で判定済み）。
 * 法令遵守の確認チェックは lawComplianceConfirmed が z.literal(true) のため未チェックだと送信できない。
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
  FormSectionLabel,
  HintBar,
  SegmentGroup,
} from "@/components/domain/form-parts";
import { Panel } from "@/components/domain/page-parts";
import { FormHeaderBar } from "@/components/forms/form-header-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { BUYER_TYPE, buyerTypeLabel } from "@/lib/domain/enums";
import { saleInputSchema, type SaleInput } from "@/lib/domain/schemas";
import { formatIsoDate } from "@/lib/domain/compliance";
import { TODAY } from "@/lib/mock/data";

const BUYER_TYPE_OPTIONS = BUYER_TYPE.map((value) => ({
  value,
  label: buyerTypeLabel[value],
}));

export function SaleForm({
  animalId,
  callName,
}: {
  animalId: string;
  callName: string;
}) {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SaleInput>({
    resolver: zodResolver(saleInputSchema),
    defaultValues: {
      soldOn: formatIsoDate(TODAY),
      buyerType: "consumer",
      lawComplianceConfirmed: undefined,
    },
  });

  const buyerType = useWatch({ control, name: "buyerType" });

  const onSubmit = handleSubmit(() => {
    toast.success("販売を登録しました");
    router.push(`/animals/${animalId}`);
  });

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title={`${callName}の販売登録`}
        breadcrumbFrom="個体カルテ"
        breadcrumbTo="販売の内容を記録"
        backHref={`/animals/${animalId}`}
      />

      <form onSubmit={onSubmit} noValidate>
        <FormHeading
          title="販売の内容を記録します"
          description="記録すると帳簿に自動で記載されます。あとから取り消せません。"
        />

        <FormSectionLabel>販売</FormSectionLabel>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormRow className="mb-0">
            <FieldLabel htmlFor="soldOn" required>
              販売日
            </FieldLabel>
            <Input
              id="soldOn"
              type="date"
              className="tabular min-h-11"
              {...register("soldOn")}
            />
            <FieldError message={errors.soldOn?.message} />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="salePrice" hint="任意">
              販売価格
            </FieldLabel>
            <div className="relative">
              <Input
                id="salePrice"
                type="number"
                inputMode="numeric"
                className="tabular min-h-11 pr-10"
                {...register("salePrice")}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[12.5px] text-muted-foreground">
                円
              </span>
            </div>
            <FieldError message={errors.salePrice?.message} />
          </FormRow>
        </div>

        <FormRow>
          <FieldLabel required>販売先区分</FieldLabel>
          <SegmentGroup
            name="buyerType"
            options={BUYER_TYPE_OPTIONS}
            value={buyerType}
            onChange={(next) => setValue("buyerType", next)}
          />
          <FieldError message={errors.buyerType?.message} />
        </FormRow>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormRow className="mb-0">
            <FieldLabel htmlFor="importantMattersExplainedOn" hint="任意">
              重要事項説明の実施日
            </FieldLabel>
            <Input
              id="importantMattersExplainedOn"
              type="date"
              className="tabular min-h-11"
              {...register("importantMattersExplainedOn")}
            />
            <FieldError
              message={errors.importantMattersExplainedOn?.message}
            />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="salesRepName" hint="任意">
              販売担当者
            </FieldLabel>
            <Input
              id="salesRepName"
              type="text"
              className="min-h-11"
              {...register("salesRepName")}
            />
            <FieldError message={errors.salesRepName?.message} />
          </FormRow>
        </div>

        <FormSectionLabel>販売先</FormSectionLabel>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormRow className="mb-0">
            <FieldLabel htmlFor="buyerName" hint="任意">
              顧客名
            </FieldLabel>
            <Input
              id="buyerName"
              type="text"
              className="min-h-11"
              {...register("buyerName")}
            />
            <FieldError message={errors.buyerName?.message} />
          </FormRow>

          {buyerType === "business" ? (
            <FormRow className="mb-0">
              <FieldLabel htmlFor="buyerLicenseNo" hint="任意">
                登録番号
              </FieldLabel>
              <Input
                id="buyerLicenseNo"
                type="text"
                className="min-h-11"
                {...register("buyerLicenseNo")}
              />
              <FieldError message={errors.buyerLicenseNo?.message} />
            </FormRow>
          ) : null}

          <FormRow className="mb-0">
            <FieldLabel htmlFor="buyerPostalCode" hint="任意">
              郵便番号
            </FieldLabel>
            <Input
              id="buyerPostalCode"
              type="text"
              className="tabular min-h-11"
              {...register("buyerPostalCode")}
            />
            <FieldError message={errors.buyerPostalCode?.message} />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="buyerAddress" hint="任意">
              住所
            </FieldLabel>
            <Input
              id="buyerAddress"
              type="text"
              className="min-h-11"
              {...register("buyerAddress")}
            />
            <FieldError message={errors.buyerAddress?.message} />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="buyerPhone" hint="任意">
              電話番号
            </FieldLabel>
            <Input
              id="buyerPhone"
              type="text"
              className="tabular min-h-11"
              {...register("buyerPhone")}
            />
            <FieldError message={errors.buyerPhone?.message} />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="buyerEmail" hint="任意">
              メールアドレス
            </FieldLabel>
            <Input
              id="buyerEmail"
              type="email"
              className="min-h-11"
              {...register("buyerEmail")}
            />
            <FieldError message={errors.buyerEmail?.message} />
          </FormRow>
        </div>

        <FormSectionLabel>法令遵守の確認</FormSectionLabel>

        <FormRow>
          <HintBar
            action={
              <label
                htmlFor="lawComplianceConfirmed"
                className="flex min-h-11 items-center gap-2 text-[13px]"
              >
                <Checkbox
                  id="lawComplianceConfirmed"
                  onCheckedChange={(checked) =>
                    setValue(
                      "lawComplianceConfirmed",
                      (checked === true ? true : undefined) as true,
                      { shouldValidate: true },
                    )
                  }
                />
                動物愛護管理法にもとづく対面説明・現物確認を行いました
              </label>
            }
          >
            販売前に対面での説明と現物確認を行ったことを確認してください
          </HintBar>
          <FieldError message={errors.lawComplianceConfirmed?.message} />
        </FormRow>

        <FormActions
          submitLabel="登録する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
