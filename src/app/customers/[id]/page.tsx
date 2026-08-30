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
import { PhotoPlaceholder } from "@/components/animal-detail/photo-placeholder";
import { customer, customerEvents, inquiries } from "@/lib/mock/data";

export function generateStaticParams() {
  return inquiries.map((i) => ({ id: i.id }));
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = inquiries.find((i) => i.id === id);
  if (!inquiry) {
    notFound();
  }

  return (
    <PageBody>
      <BackLink />

      {/* 見出しカード */}
      <Panel className="p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[20px] font-bold tracking-tight">
            {customer.name} 様
          </h1>
          <span className="inline-flex items-center rounded-[5px] bg-[#eaf2ec] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-[#356a48]">
            {customer.stage}
          </span>
          <span className="tabular text-[12.5px] text-muted-foreground">
            {customer.inquiryNo}
          </span>
          <div className="ml-auto flex gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/contracts" />}
              className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              契約を開く
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/animals/a-0142" />}
              variant="outline"
              className="h-9 bg-card"
            >
              モモのカルテ
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-5">
          <Field label="電話番号" value={customer.phone} mono />
          <Field label="住所" value={customer.address} />
          <Field label="希望" value={customer.wish} />
          <Field label="飼育環境" value={customer.environment} />
          <Field label="きっかけ" value={customer.source} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-5">
          <Field label="担当" value={customer.staff} />
          <Field
            label="販売価格"
            value={`${customer.price.toLocaleString("ja-JP")} 円`}
            mono
          />
          <Field
            label="手付金"
            value={`${customer.deposit.toLocaleString("ja-JP")} 円 受領`}
            mono
          />
        </div>
      </Panel>

      {/* 8週齢の警告 */}
      <div className="mt-4">
        <NoticeBar
          tone="destructive"
          title="引渡日が8週齢規制に抵触しています"
          description="予定していた 8月30日 は、モモが生後56日に達する 9月2日 より前です。お客さまへの連絡が必要です。"
          action={
            <Button
              nativeButton={false}
              render={<Link href="/contracts" />}
              className="bg-[#b2402f] text-white hover:bg-[#b2402f]/90"
            >
              契約で日付を直す
            </Button>
          }
        />
      </div>

      {/* 2カラム */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        {/* 対応の記録 */}
        <Panel>
          <PanelHeader title="対応の記録" />
          <div className="p-4 md:p-5">
            <ol className="space-y-0">
              {customerEvents.map((event, index) => (
                <li key={event.id} className="flex gap-3">
                  <span className="tabular w-11 shrink-0 pt-0.5 text-[11.5px] text-muted-foreground">
                    {event.date}
                  </span>
                  <div className="flex shrink-0 flex-col items-center">
                    <span
                      className={
                        "mt-1 size-2.5 shrink-0 rounded-full " +
                        (event.tone === "done"
                          ? "bg-primary"
                          : "bg-[#a95f42]")
                      }
                    />
                    {index < customerEvents.length - 1 ? (
                      <span className="w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 pb-4">
                    <p className="text-[13.5px] font-medium">{event.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {event.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Panel>

        {/* 右カラム */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="この方の予約" />
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-3">
                <PhotoPlaceholder className="size-16 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold">モモ</p>
                  <p className="text-[12.5px] text-muted-foreground">
                    トイ・プードル ／ メス ／ 6週6日
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <Field
                  label="販売価格"
                  value={`¥${customer.price.toLocaleString("ja-JP")}`}
                  mono
                />
                <Field
                  label="手付金"
                  value={`¥${customer.deposit.toLocaleString("ja-JP")} 受領`}
                  mono
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="次にやること" />
            <div className="flex flex-col gap-2 p-4 md:p-5">
              <Button
                nativeButton={false}
                render={<Link href="/contracts" />}
                variant="outline"
                className="h-10 w-full bg-card"
              >
                引渡日を9月2日以降に変更
              </Button>
              <Button variant="outline" className="h-10 w-full bg-card">
                重要事項説明の控えを送付
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </PageBody>
  );
}
