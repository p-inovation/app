import Link from "next/link";
import { notFound } from "next/navigation";

import {
  BackLink,
  Field,
  NoticeBar,
  PageBody,
  Panel,
  PanelHeader,
} from "@/components/domain/page-parts";
import { Button } from "@/components/ui/button";
import { matingCheckRuleLabel, type MatingCheckRule } from "@/lib/domain/enums";
import { defaultThresholds } from "@/lib/domain/thresholds";
import { breedingCandidates, breedingPlans } from "@/lib/mock/data";

export function generateStaticParams() {
  return breedingPlans.map((p) => ({ id: p.id }));
}

/** 交配1回ぶんの表示行。bp1・bp2 とも交配は1回目のみ記録済み */
type MatingRow = {
  seq: number;
  matedOn: string;
  dueOn: string;
  methodNote: string;
};

const MATING_RECORDS: Record<string, MatingRow[]> = {
  bp1: [
    { seq: 1, matedOn: "2026-07-30", dueOn: "2026-10-01", methodNote: "自然交配" },
  ],
  bp2: [
    { seq: 1, matedOn: "2026-08-18", dueOn: "2026-10-20", methodNote: "自然交配" },
  ],
};

/** 数値規制の判定行。母個体の breedingCandidates と defaultThresholds から組み立てる */
type CheckRow = {
  rule: MatingCheckRule;
  measured: string;
  standard: string;
  ok: boolean;
};

export default async function BreedingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = breedingPlans.find((p) => p.id === id);
  if (!plan) {
    notFound();
  }

  const [damName, sireName] = plan.pair.split(" × ");
  const dam = breedingCandidates.find((c) => c.callName === damName);

  const matings = MATING_RECORDS[plan.id] ?? [];
  const canAddMating = matings.length < 3;

  const checkRows: CheckRow[] = [
    {
      rule: "dam_age_limit",
      measured: dam?.ageLabel ?? "—",
      standard: `${defaultThresholds.damMaxAgeYears}歳まで`,
      ok: true,
    },
    {
      rule: "lifetime_birth_limit",
      measured: dam ? `${dam.birthCount} / ${dam.maxBirthCount}回` : "—",
      standard: `${defaultThresholds.maxLifetimeBirths}回まで`,
      ok: true,
    },
    {
      rule: "inbreeding",
      measured: "近親係数 3.1%",
      standard: "6.25%未満",
      ok: true,
    },
    {
      rule: "genetic_test",
      measured: "実施済（PRA陰性）",
      standard: "主要遺伝性疾患を検査済であること",
      ok: true,
    },
    {
      rule: "breeding_prohibited_flag",
      measured: "フラグ無し",
      standard: "繁殖禁止フラグが立っていないこと",
      ok: true,
    },
    {
      rule: "interval_since_last_birth",
      measured: "前回出産から6か月",
      standard: "4か月以上の間隔",
      ok: true,
    },
  ];

  return (
    <PageBody className="flex flex-col gap-6">
      <BackLink href="/breeding" label="繁殖・産次" />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 md:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[18px] font-semibold tracking-tight">
              {plan.pair}
            </h1>
            <span
              className={
                plan.status === "pregnant"
                  ? "inline-flex items-center rounded-[5px] bg-[#eaf2ec] px-2.5 py-1 text-[12px] font-medium text-[#356a48]"
                  : "inline-flex items-center rounded-[5px] bg-[#fdf3e3] px-2.5 py-1 text-[12px] font-medium text-[#7d5316]"
              }
            >
              {plan.statusLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/breeding/births/new" />}
              size="sm"
            >
              出産を登録
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={`/breeding/${plan.id}/offspring`} />}
              variant="outline"
              size="sm"
              className="bg-card"
            >
              子個体を登録
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-4 py-4 md:grid-cols-4 md:px-5">
          <Field label="母個体" value={damName} />
          <Field label="父個体" value={sireName} />
          <Field
            label="発情日"
            value={matings[0] ? "2026-07-15" : "—"}
            mono
          />
          <Field label="交配日" value={plan.matedOn} mono />
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="交配の記録"
          description="交配は最大3回まで記録できます"
          action={
            <Button variant="outline" size="sm" className="bg-card" disabled={!canAddMating}>
              ＋ 交配を追加（3回まで）
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead>
              <tr className="border-b border-border text-left text-[11.5px] text-muted-foreground">
                <th className="px-4 py-2.5 font-medium md:px-5">回数</th>
                <th className="px-4 py-2.5 font-medium">交配日</th>
                <th className="px-4 py-2.5 font-medium">出産予定日</th>
                <th className="px-4 py-2.5 font-medium">方法備考</th>
              </tr>
            </thead>
            <tbody>
              {matings.map((m) => (
                <tr key={m.seq} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 md:px-5">{m.seq}回目</td>
                  <td className="px-4 py-3 tabular whitespace-nowrap">{m.matedOn}</td>
                  <td className="px-4 py-3 tabular whitespace-nowrap">{m.dueOn}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.methodNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="出産の結果" />
        <div className="p-4 md:p-5">
          {plan.id === "bp1" ? (
            <NoticeBar
              tone="info"
              title="出産予定日は 2026年10月1日 です"
              description="出産後、頭数を登録すると子個体が自動で作られます。"
              action={
                <Button
                  nativeButton={false}
                  render={<Link href="/breeding/births/new" />}
                  size="sm"
                >
                  出産を登録
                </Button>
              }
            />
          ) : (
            <NoticeBar
              tone="info"
              title="妊娠確認待ちです"
              description="エコー検査 2026-09-05 を予定しています。"
            />
          )}
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="数値規制の判定"
          description="判定ロジックの閾値は要件 §10-2 で確認中"
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-border text-left text-[11.5px] text-muted-foreground">
                <th className="px-4 py-2.5 font-medium md:px-5">判定項目</th>
                <th className="px-4 py-2.5 font-medium">実測値</th>
                <th className="px-4 py-2.5 font-medium">基準</th>
                <th className="px-4 py-2.5 font-medium">判定</th>
              </tr>
            </thead>
            <tbody>
              {checkRows.map((row) => (
                <tr key={row.rule} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium md:px-5">
                    {matingCheckRuleLabel[row.rule]}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.measured}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {row.standard}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.ok
                          ? "inline-flex items-center rounded-[5px] bg-[#eaf2ec] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-[#356a48]"
                          : "inline-flex items-center rounded-[5px] bg-[#fdf3e3] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-[#7d5316]"
                      }
                    >
                      {row.ok ? "適合" : "要確認"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageBody>
  );
}
