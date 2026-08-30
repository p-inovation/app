import { notFound } from "next/navigation";
import Link from "next/link";

import {
  BackLink,
  Field,
  NoticeBar,
  PageBody,
  Panel,
  PanelHeader,
} from "@/components/domain/page-parts";
import { CategoryBadge } from "@/components/domain/status-badges";
import { Button } from "@/components/ui/button";
import { PhotoPlaceholder } from "@/components/animal-detail/photo-placeholder";
import { WeightChart } from "@/components/animal-detail/weight-chart";
import {
  animals,
  findAnimal,
  healthEntries,
  TODAY,
  weightSeries,
} from "@/lib/mock/data";
import {
  evaluateCompliance,
  formatAge,
  formatIsoDate,
  formatJpDate,
} from "@/lib/domain/compliance";
import { pedigreeStatusLabel, sexLabel } from "@/lib/domain/enums";

export function generateStaticParams() {
  return animals.map((a) => ({ id: a.id }));
}

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animal = findAnimal(id);
  if (!animal) {
    notFound();
  }

  const compliance = evaluateCompliance({
    birthDate: animal.birthDate,
    chipStatus: animal.chipStatus,
    today: TODAY,
  });

  const ageLabel = formatAge(animal.birthDate, TODAY);
  const isUnderEightWeeks = !compliance.isEightWeeksPassed;

  return (
    <PageBody>
      <BackLink />

      <Panel className="p-4 md:p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
          {/* 写真 */}
          <div>
            <PhotoPlaceholder className="aspect-square w-full" />
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              <PhotoPlaceholder className="aspect-square" label="正面" />
              <PhotoPlaceholder className="aspect-square" label="横" />
              <PhotoPlaceholder className="aspect-square" label="全身" />
              <PhotoPlaceholder className="aspect-square" label="朝の運動" />
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
              タップした写真がトップ写真になります。
            </p>
          </div>

          {/* 基本情報 */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[20px] font-bold tracking-tight">
                {animal.callName}
              </h1>
              <CategoryBadge category={animal.category} />
              <span className="inline-flex items-center rounded-[5px] bg-muted px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-muted-foreground">
                予約済
              </span>
              <span className="tabular text-[12.5px] text-muted-foreground">
                {animal.ledgerNo}
              </span>
              <span className="ml-auto text-[12px] text-muted-foreground">
                項目をタップすると、その場で直せます
              </span>
            </div>

            <p className="mt-1 text-[13px] text-muted-foreground">
              登録名（血統書用）: {animal.registeredName}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-6">
              <Field
                label="週齢（自動計算）"
                value={ageLabel}
                tone={isUnderEightWeeks ? "danger" : undefined}
              />
              <Field
                label="生年月日"
                value={formatIsoDate(animal.birthDate)}
                mono
              />
              <Field label="性別" value={sexLabel[animal.sex]} />
              <Field label="犬種" value={animal.breed} />
              <Field label="毛色" value={animal.coatColor ?? "—"} />
              <Field
                label="現体重"
                value={
                  animal.currentWeightG
                    ? `${animal.currentWeightG.toLocaleString("ja-JP")} g`
                    : "—"
                }
                mono
              />

              <Field
                label="産次"
                value={
                  animal.litterNo ? `${animal.litterNo}（3頭）` : "—"
                }
              />
              <Field
                label="血統書"
                value={`JKC ${pedigreeStatusLabel[animal.pedigreeStatus]}`}
              />
              <Field label="区分" value="販売用（予約済）" />
            </div>

            {animal.litterNo ? (
              <Button
                nativeButton={false}
                render={<Link href="/breeding" />}
                variant="outline"
                size="sm"
                className="mt-4 h-9 bg-card"
              >
                産次 {animal.litterNo} を開く ›
              </Button>
            ) : null}
          </div>
        </div>
      </Panel>

      {/* 8週齢の警告 */}
      {!compliance.isSellable && compliance.daysUntilSellable > 0 ? (
        <div className="mt-4">
          <NoticeBar
            tone="destructive"
            title={`引渡しは ${formatJpDate(compliance.sellableFrom)} 以降にしてください`}
            description="生後56日を経過しない犬は販売・引渡しができません。契約 CT-2026-0088 の引渡予定日は 8月30日 で、解禁日より3日早い設定です。日付を直すか、契約を保留にしてください。"
            action={
              <Button className="bg-[#b2402f] text-white hover:bg-[#b2402f]/90">
                引渡日を直す
              </Button>
            }
          />
        </div>
      ) : null}

      {/* アクション行 */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="h-10 bg-primary text-primary-foreground hover:bg-primary/90">
          ＋ 今日の写真
        </Button>
        <Button variant="outline" className="h-10 bg-card">
          ＋ 健康・ワクチン記録
        </Button>
        <Button variant="outline" className="h-10 bg-card">
          ＋ 体重を記録
        </Button>
        <Button variant="outline" className="h-10 bg-card">
          チップ情報を編集
        </Button>
        <Button variant="outline" className="h-10 bg-card">
          契約 CT-2026-0088 を開く
        </Button>
        <Button variant="outline" className="h-10 bg-card">
          予約者 中村 陽子 様
        </Button>
      </div>

      {/* 日々の写真 */}
      <Panel className="mt-4">
        <PanelHeader
          title="日々の写真"
          action={
            <Button variant="outline" size="sm" className="h-8 bg-card">
              ＋ 写真を登録
            </Button>
          }
        />
        <div className="p-4 md:p-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {["08-24", "08-20", "08-16", "08-12", "08-05"].map((date) => (
              <PhotoPlaceholder
                key={date}
                className="aspect-square"
                label={date}
              />
            ))}
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
            予約者に見せている写真には日付とひとことが付きます。
          </p>
        </div>
      </Panel>

      {/* 体重の推移 / 健康記録 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="体重の推移" />
          <div className="p-4 md:p-5">
            <WeightChart series={weightSeries} />
            <p className="mt-2 text-[12px] text-muted-foreground">
              体重の伸び 標準範囲内
            </p>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="健康・ワクチンの記録"
            action={
              <Button variant="outline" size="sm" className="h-8 bg-card">
                ＋ 通院記録を追加
              </Button>
            }
          />
          <div className="divide-y divide-border">
            {healthEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3 md:px-5"
              >
                <span className="tabular w-[76px] shrink-0 text-[12.5px] text-muted-foreground">
                  {formatIsoDate(entry.recordedOn)}
                </span>
                <span className="inline-flex shrink-0 items-center rounded-[5px] bg-muted px-2 py-0.5 text-[11.5px] font-medium text-muted-foreground">
                  {entry.typeLabel}
                </span>
                <span className="min-w-0 flex-1 text-[13px]">
                  {entry.detail}
                </span>
                <span className="w-full text-[12px] text-muted-foreground md:w-auto md:ml-auto">
                  {entry.by}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageBody>
  );
}
