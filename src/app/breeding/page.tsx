import { Plus } from "lucide-react";
import Link from "next/link";

import { PageBody, Panel, PanelHeader } from "@/components/domain/page-parts";
import { JudgementBadge } from "@/components/domain/status-badges";
import { Button } from "@/components/ui/button";
import { BreedingProgressBar } from "@/components/breeding/breeding-progress-bar";
import { PupStatusChip, type PupStatus } from "@/components/breeding/pup-status-chip";
import { formatShortDate } from "@/lib/domain/compliance";
import { breedingCandidates, breedingPlans, litters } from "@/lib/mock/data";

export default function BreedingPage() {
  return (
    <PageBody className="flex flex-col gap-6">
      <Panel>
        <PanelHeader
          title="繁殖できる母犬"
          description="数値規制（交配時の年齢上限・生涯出産回数）を自動判定"
          action={
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                <Plus className="size-4" />
                交配を登録
              </Button>
              <Button variant="outline" size="sm" className="bg-card">
                <Plus className="size-4" />
                出産を登録
              </Button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[13px]">
            <thead>
              <tr className="border-b border-border text-left text-[11.5px] text-muted-foreground">
                <th className="px-4 py-2.5 font-medium md:px-5">母個体</th>
                <th className="px-4 py-2.5 font-medium">年齢</th>
                <th className="px-4 py-2.5 font-medium">生涯出産</th>
                <th className="px-4 py-2.5 font-medium">最終出産</th>
                <th className="px-4 py-2.5 font-medium">次の交配</th>
                <th className="px-4 py-2.5 font-medium">判定</th>
              </tr>
            </thead>
            <tbody>
              {breedingCandidates.map((c) => (
                <tr
                  key={c.animalId}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 md:px-5">
                    <p className="font-medium">{c.callName}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground tabular">
                      {c.ledgerNo}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.ageLabel}</td>
                  <td className="px-4 py-3 whitespace-nowrap tabular">
                    {c.birthCount} / {c.maxBirthCount}回
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap tabular">
                    {c.lastDeliveredOn ? formatShortDate(c.lastDeliveredOn) : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {c.nextMating}
                  </td>
                  <td className="px-4 py-3">
                    <JudgementBadge
                      judgement={c.judgement}
                      label={c.judgementLabel}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="交配・出産の予定" />
          <div className="flex flex-col divide-y divide-border">
            {breedingPlans.map((p) => (
              <div key={p.id} className="px-4 py-3.5 md:px-5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-[13.5px] font-medium">
                      {p.pair}
                    </p>
                    <span
                      className={
                        p.status === "pregnant"
                          ? "inline-flex shrink-0 items-center rounded-[5px] bg-[#eaf2ec] px-2 py-0.5 text-[11.5px] font-medium text-[#356a48]"
                          : "inline-flex shrink-0 items-center rounded-[5px] bg-[#fdf3e3] px-2 py-0.5 text-[11.5px] font-medium text-[#7d5316]"
                      }
                    >
                      {p.statusLabel}
                    </span>
                  </div>
                  <p className="shrink-0 text-[12.5px] text-muted-foreground tabular">
                    交配日 {p.matedOn}
                  </p>
                </div>
                <div className="mt-2.5">
                  <BreedingProgressBar
                    progress={p.progress}
                    tone={p.status === "pregnant" ? "pregnant" : "confirming"}
                  />
                  <p className="mt-1.5 text-right text-[11.5px] text-muted-foreground">
                    {p.rightLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="産次（直近）" />
          <div className="flex flex-col divide-y divide-border">
            {litters.map((l) => (
              <Link
                key={l.id}
                href={`/litters/${l.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 hover:bg-muted/50 md:px-5"
              >
                <p className="w-[92px] shrink-0 text-[13px] font-medium tabular">
                  {l.id}
                </p>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium">
                    {l.pair}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                    {l.bornOn} 出生 ／ {l.summary}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {countPupStatuses(l.pups).map(({ status, index }) => (
                    <PupStatusChip
                      key={`${l.id}-${status}-${index}`}
                      status={status}
                    />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </PageBody>
  );
}

/** 同じ状態が並ぶ子犬チップに、配列位置ではなく状態内の出現順でキーを振る */
function countPupStatuses(
  pups: PupStatus[],
): { status: PupStatus; index: number }[] {
  const seen: Partial<Record<PupStatus, number>> = {};
  return pups.map((status) => {
    const index = (seen[status] ?? 0) + 1;
    seen[status] = index;
    return { status, index };
  });
}
