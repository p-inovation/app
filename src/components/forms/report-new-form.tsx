"use client";

/**
 * 定期報告の作成フォーム（画面 /reports/new・FR-50・要件 §8）。
 * 集計値は帳簿（ledgerTotals）から自動算出するため、画面では年度と帳票の種類だけを選ばせる。
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
import { NoticeBar, Panel, PanelHeader, StatBlock } from "@/components/domain/page-parts";
import { reportKindLabel } from "@/lib/domain/enums";
import { reportInputSchema, type ReportInput } from "@/lib/domain/schemas";
import { ledgerTotals } from "@/lib/mock/data";

import { FormHeaderBar } from "./form-header-bar";

const FISCAL_YEAR_OPTIONS = [
  { value: "2026", label: "2026年度" },
  { value: "2025", label: "2025年度" },
  { value: "2024", label: "2024年度" },
] as const;

const REPORT_KIND_OPTIONS = [
  { value: "annual_report", label: reportKindLabel.annual_report },
  { value: "retire_check", label: reportKindLabel.retire_check },
  { value: "inspection_ledger", label: reportKindLabel.inspection_ledger },
] as const;

export function ReportNewForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReportInput>({
    resolver: zodResolver(reportInputSchema),
    defaultValues: {
      fiscalYear: "2026",
      reportKind: "annual_report",
    },
  });

  const fiscalYear = useWatch({ control, name: "fiscalYear" });
  const reportKind = useWatch({ control, name: "reportKind" });

  const onSubmit = () => {
    toast.success("定期報告を作成しました");
    router.push("/ledger");
  };

  return (
    <Panel className="p-5 md:p-6">
      <FormHeaderBar
        title="定期報告の作成"
        breadcrumbFrom="ダッシュボード"
        breadcrumbTo="帳簿の記録から自動集計してPDFにする"
        backHref="/ledger"
      />

      <FormHeading
        title="定期報告を作成します"
        description="動物販売業者等定期報告届出書を、帳簿の記録から自動で集計してPDFにします。"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormRow>
          <FieldLabel required>対象年度</FieldLabel>
          <SegmentGroup<ReportInput["fiscalYear"]>
            name="fiscalYear"
            options={FISCAL_YEAR_OPTIONS}
            value={fiscalYear}
            onChange={(next) => setValue("fiscalYear", next)}
          />
          <FieldError message={errors.fiscalYear?.message} />
        </FormRow>

        <FormRow>
          <FieldLabel required>帳票の種類</FieldLabel>
          <SegmentGroup<ReportInput["reportKind"]>
            name="reportKind"
            options={REPORT_KIND_OPTIONS}
            value={reportKind}
            onChange={(next) => setValue("reportKind", next)}
          />
          <FieldError message={errors.reportKind?.message} />
        </FormRow>

        <Panel className="mb-5">
          <PanelHeader title="この年度の集計" />
          <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 md:p-5">
            <StatBlock label="出生" value={ledgerTotals.births} unit="頭" />
            <StatBlock label="販売" value={ledgerTotals.sales} unit="頭" />
            <StatBlock label="死亡" value={ledgerTotals.deaths} unit="頭" />
            <StatBlock label="譲渡" value={ledgerTotals.transfers} unit="頭" />
          </div>
          <p className="border-t border-border px-4 py-3 text-[12px] leading-relaxed text-muted-foreground md:px-5">
            帳簿の記録から自動で集計しています。数字を直すには帳簿を訂正してください。
          </p>
        </Panel>

        <NoticeBar
          tone="warning"
          title="提出期限は毎年5月31日です"
          description="前年度（4月1日〜3月31日）の実績を、都道府県知事に届け出る必要があります。"
        />

        <FormActions
          submitLabel="PDFを作成する"
          onCancel={() => router.back()}
          pending={isSubmitting}
        />
      </form>
    </Panel>
  );
}
