import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  BackLink,
  Field,
  NoticeBar,
  Panel,
  PanelHeader,
  PageBody,
} from "@/components/domain/page-parts";
import { CategoryBadge } from "@/components/domain/status-badges";
import { Button } from "@/components/ui/button";
import { formatIsoDate, sellableFrom } from "@/lib/domain/compliance";
import { animals, litters } from "@/lib/mock/data";

export function generateStaticParams() {
  return litters.map((l) => ({ id: l.id }));
}

export default async function LitterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const litter = litters.find((l) => l.id === id);
  if (!litter) notFound();

  const pups = animals.filter((a) => a.litterNo === litter.id);
  const survivorCount = litter.pups.filter((p) => p !== "死").length;
  const [damName, sireName] = litter.pair.split(" × ");
  const dam = animals.find((a) => a.callName === damName && a.litterNo === undefined);

  // 出産日は子犬の生年月日から取る（産次データ自体には持たせていないため）
  const bornOnDate = pups[0]?.birthDate;
  const sellableDate = bornOnDate ? sellableFrom(bornOnDate) : null;

  return (
    <PageBody className="flex flex-col gap-6">
      <BackLink href="/breeding" label="繁殖・産次" />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 md:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[18px] font-semibold tracking-tight tabular">
              {litter.id}
            </h1>
            <span className="inline-flex items-center rounded-[5px] bg-[#eef0f1] px-2.5 py-1 text-[12px] font-medium text-[#4b5054]">
              授乳・離乳期
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/photos/new" />}
              size="sm"
            >
              <Plus className="size-4" />
              今日の写真
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/weights/new" />}
              variant="outline"
              size="sm"
              className="bg-card"
            >
              3頭の体重を記録
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/health/new" />}
              variant="outline"
              size="sm"
              className="bg-card"
            >
              3頭にワクチン記録
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-4 py-4 md:grid-cols-3 md:px-5 lg:grid-cols-6">
          <Field
            label="母犬"
            value={dam ? `${dam.callName}（${dam.ledgerNo}）` : damName}
          />
          <Field label="父犬" value={`${sireName}（外部種オス）`} />
          <Field
            label="交配日"
            value="2026-05-06"
            mono
          />
          <Field label="出産日" value={litter.bornOn} mono />
          <Field
            label="出生・生存"
            value={`${litter.pups.length}頭 / ${survivorCount}頭`}
            mono
          />
          <Field
            label="販売できる日"
            value={sellableDate ? formatIsoDate(sellableDate) : "—"}
            mono
          />
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title={`この産次の子犬 ${pups.length}頭`}
          description={
            sellableDate
              ? `${sellableDate.getMonth() + 1}月${sellableDate.getDate()}日から販売・引渡しができます`
              : undefined
          }
        />
        <div className="overflow-x-auto">
          <div className="flex flex-col divide-y divide-border">
            {pups.map((pup) => (
              <Link
                key={pup.id}
                href={`/animals/${pup.id}`}
                className="flex min-w-[560px] items-center gap-4 px-4 py-3.5 hover:bg-muted/50 md:px-5"
              >
                <span className="size-11 shrink-0 rounded-md bg-muted" />
                <div className="w-[140px] shrink-0">
                  <p className="text-[13.5px] font-medium">{pup.callName}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground tabular">
                    {pup.ledgerNo}
                  </p>
                </div>
                <p className="w-[90px] shrink-0 text-[13px] tabular">
                  {pup.currentWeightG?.toLocaleString("ja-JP")} g
                </p>
                <CategoryBadge category={pup.category} className="shrink-0" />
                <p className="min-w-0 flex-1 truncate text-[12.5px] text-muted-foreground">
                  {pup.note}
                </p>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </Panel>

      <NoticeBar
        tone="warning"
        title="ナナの体重が前週より減っています"
        description="−140 g（前週比 −12%）。同じ産次の2頭は順調に増えています。獣医師への相談をおすすめします。"
        action={
          <Button
            nativeButton={false}
            render={<Link href="/health/new" />}
            variant="outline"
            size="sm"
            className="bg-card"
          >
            通院記録を追加
          </Button>
        }
      />
    </PageBody>
  );
}
