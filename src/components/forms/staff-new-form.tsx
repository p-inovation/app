"use client";

/**
 * スタッフの追加フォーム（画面 /staff/new・FR-11）。
 * 常勤を選ぶと、飼養できる上限頭数（従業員数 × 数値規制の上限）がその場でどう変わるかを示す。
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
import { USER_ROLE, userRoleLabel, type UserRole } from "@/lib/domain/enums";
import { staffInputSchema, type StaffInput } from "@/lib/domain/schemas";
import { defaultThresholds } from "@/lib/domain/thresholds";
import { staffList } from "@/lib/mock/data";

import { FormHeaderBar } from "./form-header-bar";

const EMPLOYMENT_OPTIONS = [
  { value: "常勤", label: "常勤" },
  { value: "非常勤", label: "非常勤" },
  { value: "外部", label: "外部" },
] as const;

const ROLE_OPTIONS = USER_ROLE.map((role) => ({
  value: role,
  label: userRoleLabel[role],
}));

const roleDescription: Record<UserRole, string> = {
  admin: "すべての操作が可能。スタッフの権限やしきい値も変更できます。",
  manager: "個体・繁殖・販売・帳簿の登録と閲覧ができます。削除はできません。",
  staff: "削除不可。金額と顧客情報は非表示。",
  viewer: "閲覧のみ。記録の追加・変更はできません。",
};

const CURRENT_FULL_TIME_COUNT = staffList.filter(
  (s) => s.employment === "常勤",
).length;

/** 現在の飼養数（モックアップの表示値。台帳全体の頭数） */
const CURRENT_ANIMAL_COUNT = 32;

export function StaffNewForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StaffInput>({
    resolver: zodResolver(staffInputSchema),
    defaultValues: {
      name: "",
      email: "",
      employment: "常勤",
      role: "staff",
      qualification: "",
    },
  });

  const employment = useWatch({ control, name: "employment" });
  const role = useWatch({ control, name: "role" });

  const isFullTime = employment === "常勤";
  const nextFullTimeCount = CURRENT_FULL_TIME_COUNT + 1;
  const nextLimit = nextFullTimeCount * defaultThresholds.breedingDogsPerStaff;

  const onSubmit = () => {
    toast.success("スタッフを追加しました");
    router.push("/settings");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="スタッフの追加"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="勤務形態と権限を登録"
        backHref="/settings"
      />

      <FormHeading
        title="スタッフを追加します"
        description="常勤の人数は、飼養できる上限頭数の計算に使われます。"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel htmlFor="name" required>
            氏名
          </FieldLabel>
          <input
            id="name"
            type="text"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel htmlFor="email" required>
            メールアドレス
          </FieldLabel>
          <input
            id="email"
            type="email"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel required>勤務形態</FieldLabel>
          <SegmentGroup<StaffInput["employment"]>
            name="employment"
            options={EMPLOYMENT_OPTIONS}
            value={employment}
            onChange={(next) => setValue("employment", next)}
          />
          <FieldError message={errors.employment?.message} />
        </FormRow>

        {isFullTime ? (
          <NoticeBar
            tone="info"
            title={`常勤が${nextFullTimeCount}名になり、飼養できる上限が${nextLimit}頭になります`}
            description={`従業員1人あたり${defaultThresholds.breedingDogsPerStaff}頭が上限です（数値規制）。現在の飼養数は${CURRENT_ANIMAL_COUNT}頭です。`}
          />
        ) : null}

        <FormRow className="mt-5">
          <FieldLabel required>権限</FieldLabel>
          <SegmentGroup<UserRole>
            name="role"
            options={ROLE_OPTIONS}
            value={role}
            onChange={(next) => setValue("role", next)}
          />
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            {roleDescription[role]}
          </p>
          <FieldError message={errors.role?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel
            htmlFor="qualification"
            hint="動物取扱責任者・愛玩動物飼養管理士など"
          >
            資格
          </FieldLabel>
          <input
            id="qualification"
            type="text"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-[13.5px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("qualification")}
          />
          <FieldError message={errors.qualification?.message} />
        </FormRow>

        <FormActions
          submitLabel="追加する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
