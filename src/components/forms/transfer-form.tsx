"use client";

/**
 * 事業所間移動の登録フォーム（openapi.yaml /transfers / FR-28）。
 * 自事業所が移動元または移動先である必要があるが、その検証はサーバ側が正とする。
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
import { FormHeaderBar } from "@/components/forms/form-header-bar";
import { Input } from "@/components/ui/input";
import { formatIsoDate } from "@/lib/domain/compliance";
import { transferInputSchema, type TransferInput } from "@/lib/domain/schemas";
import { animals, TODAY } from "@/lib/mock/data";

// 本来は GET /offices から取得する。ここでは画面確認用に固定値で持つ。
const DESTINATION_OFFICES = [
  { id: "of-2", name: "白川ケンネル 第2犬舎" },
  { id: "of-3", name: "多摩ケンネル" },
  { id: "of-4", name: "北関東ケンネル" },
] as const;

const ANIMAL_OPTIONS: SegmentOption<string>[] = animals
  .filter((a) => a.category !== "sold")
  .slice(0, 6)
  .map((a) => ({ value: a.id, label: a.callName }));

const OFFICE_OPTIONS: SegmentOption<string>[] = DESTINATION_OFFICES.map(
  (o) => ({ value: o.id, label: o.name }),
);

export function TransferForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransferInput>({
    resolver: zodResolver(transferInputSchema),
    defaultValues: {
      animalId: "",
      movedOn: formatIsoDate(TODAY),
      arrivedOn: undefined,
      toOfficeId: "",
    },
  });

  const animalId = useWatch({ control, name: "animalId" });
  const toOfficeId = useWatch({ control, name: "toOfficeId" });

  const onSubmit = handleSubmit(() => {
    toast.success("移動を登録しました");
    router.push("/");
  });

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="事業所間移動の登録"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="個体の移動元・移動先を記録"
      />

      <form onSubmit={onSubmit} noValidate>
        <FormHeading
          title="どの個体を移動しますか"
          description="自分の事業所が移動元または移動先のときだけ登録できます。"
        />

        <FormRow>
          <FieldLabel required>対象の個体</FieldLabel>
          <SegmentGroup
            name="animalId"
            options={ANIMAL_OPTIONS}
            value={animalId}
            onChange={(next) => setValue("animalId", next, { shouldValidate: true })}
          />
          <FieldError message={errors.animalId?.message} />
        </FormRow>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormRow className="mb-0">
            <FieldLabel htmlFor="movedOn" required>
              移動日
            </FieldLabel>
            <Input
              id="movedOn"
              type="date"
              className="tabular min-h-11"
              {...register("movedOn")}
            />
            <FieldError message={errors.movedOn?.message} />
          </FormRow>

          <FormRow className="mb-0">
            <FieldLabel htmlFor="arrivedOn" hint="未着なら空のまま">
              到着日
            </FieldLabel>
            <Input
              id="arrivedOn"
              type="date"
              className="tabular min-h-11"
              {...register("arrivedOn")}
            />
            <FieldError message={errors.arrivedOn?.message} />
          </FormRow>
        </div>

        <FormRow>
          <FieldLabel required>移動先の事業所</FieldLabel>
          <SegmentGroup
            name="toOfficeId"
            options={OFFICE_OPTIONS}
            value={toOfficeId}
            onChange={(next) =>
              setValue("toOfficeId", next, { shouldValidate: true })
            }
          />
          <FieldError message={errors.toOfficeId?.message} />
        </FormRow>

        <NoticeBar
          tone="info"
          title="移動すると台帳の所在が変わります"
          description="移動先の事業所でも同じ個体として扱われます。移動元・移動先のどちらでもない事業所からは編集できません。"
        />

        <FormActions
          submitLabel="登録する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
