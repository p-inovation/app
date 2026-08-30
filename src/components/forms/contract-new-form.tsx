"use client";

/**
 * 契約の作成フォーム（画面 /contracts/new・要件 §8「販売確認書」）。
 * 対象個体の生年月日から8週齢の解禁日を計算し、引渡予定日がそれより前なら送信を止める。
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
  type SegmentOption,
} from "@/components/domain/form-parts";
import { NoticeBar, Panel } from "@/components/domain/page-parts";
import { formatIsoDate, formatJpDate, sellableFrom } from "@/lib/domain/compliance";
import { contractInputSchema, type ContractInput } from "@/lib/domain/schemas";
import { animals } from "@/lib/mock/data";

import { FormHeaderBar } from "./form-header-bar";

const FOR_SALE_ANIMALS = animals.filter((a) => a.category === "for_sale");

const ANIMAL_OPTIONS: SegmentOption<string>[] = FOR_SALE_ANIMALS.map((a) => ({
  value: a.id,
  label: a.callName,
}));

const HEALTH_GUARANTEE_OPTIONS = [
  { value: "30", label: "30日" },
  { value: "60", label: "60日" },
  { value: "none", label: "なし" },
] as const;

export function ContractNewForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContractInput>({
    resolver: zodResolver(contractInputSchema),
    defaultValues: {
      animalId: FOR_SALE_ANIMALS[0]?.id ?? "",
      customerName: "中村 陽子",
      price: 480000,
      deposit: 50000,
      handoverOn: FOR_SALE_ANIMALS[0]
        ? formatIsoDate(sellableFrom(FOR_SALE_ANIMALS[0].birthDate))
        : "",
      healthGuarantee: "30",
    },
  });

  const animalId = useWatch({ control, name: "animalId" });
  const handoverOn = useWatch({ control, name: "handoverOn" });
  const healthGuarantee = useWatch({ control, name: "healthGuarantee" });

  const selectedAnimal = FOR_SALE_ANIMALS.find((a) => a.id === animalId);
  const from = selectedAnimal ? sellableFrom(selectedAnimal.birthDate) : null;
  const isBeforeSellable =
    from !== null && !!handoverOn && handoverOn < formatIsoDate(from);

  const onSubmit = () => {
    toast.success("契約を作成しました");
    router.push("/contracts");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="契約の作成"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="販売確認書と8週齢規制の判定"
        backHref="/contracts"
      />

      <FormHeading
        title="どの個体の契約をつくりますか"
        description="対象を選ぶと、生年月日から引渡し可能日が自動で入ります。8週齢より前の日付は選べません。"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel required>対象の個体</FieldLabel>
          <SegmentGroup<string>
            name="animalId"
            options={ANIMAL_OPTIONS}
            value={animalId}
            onChange={(next) => {
              setValue("animalId", next);
              const a = FOR_SALE_ANIMALS.find((x) => x.id === next);
              if (a) {
                setValue("handoverOn", formatIsoDate(sellableFrom(a.birthDate)));
              }
            }}
          />
          <FieldError message={errors.animalId?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="customerName" required>
            お客さま
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
          <FieldLabel htmlFor="price" required>
            販売価格
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

        <FormRow>
          <FieldLabel htmlFor="deposit" hint="未受領なら 0">
            手付金
          </FieldLabel>
          <div className="relative w-full md:w-64">
            <input
              id="deposit"
              type="number"
              inputMode="numeric"
              className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent py-2 pl-3 pr-10 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("deposit")}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[12.5px] text-muted-foreground">
              円
            </span>
          </div>
          <FieldError message={errors.deposit?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="handoverOn" required>
            引渡予定日
          </FieldLabel>
          <input
            id="handoverOn"
            type="date"
            className="tabular min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-64"
            {...register("handoverOn")}
          />
          <FieldError message={errors.handoverOn?.message} />
        </FormRow>

        {isBeforeSellable && from ? (
          <NoticeBar
            tone="destructive"
            title="引渡予定日が8週齢規制に抵触しています"
            description={`${formatJpDate(from)} 以降にしてください`}
          />
        ) : from ? (
          <NoticeBar tone="info" title="この日付で引き渡せます" />
        ) : null}

        <FormRow className="mt-5">
          <FieldLabel required>健康保証</FieldLabel>
          <SegmentGroup<ContractInput["healthGuarantee"]>
            name="healthGuarantee"
            options={HEALTH_GUARANTEE_OPTIONS}
            value={healthGuarantee}
            onChange={(next) => setValue("healthGuarantee", next)}
          />
          <FieldError message={errors.healthGuarantee?.message} />
        </FormRow>

        <FormActions
          submitLabel="契約を作成する"
          onCancel={() => router.back()}
          pending={isSubmitting || isBeforeSellable}
        />
      </form>
    </Panel>
  );
}
