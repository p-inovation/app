/**
 * 帳簿・定期報告。動物愛護管理法の帳簿は日々の記録から自動生成され、削除できない前提を表示で伝える。
 * 状態が要らないため Server Component。
 */

import Link from "next/link";

import { PageBody, Panel, PanelHeader, StatBlock } from "@/components/domain/page-parts";
import { LedgerReasonChip } from "@/components/compliance/ledger-reason-chip";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ledgerEntries, ledgerTotals } from "@/lib/mock/data";

function formatYen(price: number | null): React.ReactNode {
  if (price === null) return <span className="text-muted-foreground">−</span>;
  return `¥ ${price.toLocaleString("ja-JP")}`;
}

export default function LedgerPage() {
  return (
    <PageBody className="flex flex-col gap-6">
      <Panel>
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              動物愛護管理法の帳簿
              <span className="text-muted-foreground">／</span>
            </span>
          }
          description="記載事項は5年間保存します。日々の記録から自動でつくられ、削除はできません。"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 bg-card">
                2026年度 ▾
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/ledger/new" />}
                variant="outline"
                size="sm"
                className="h-9 bg-card"
              >
                ＋ 手動で記載
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/reports/new" />}
                size="sm"
                className="h-9 bg-[#23262a] text-white hover:bg-[#23262a]/85"
              >
                定期報告を作成
              </Button>
            </div>
          }
        />

        {/* PC: 表 */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="pl-4 text-[12px]">年月日</TableHead>
                <TableHead className="text-[12px]">事由</TableHead>
                <TableHead className="text-[12px]">個体ID</TableHead>
                <TableHead className="text-[12px]">品種・性別</TableHead>
                <TableHead className="text-[12px]">相手方</TableHead>
                <TableHead className="text-[12px]">価格</TableHead>
                <TableHead className="pr-4 text-[12px]">関連契約</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.map((entry) => (
                <TableRow key={entry.id} className="border-border">
                  <TableCell className="tabular py-3 pl-4 text-[13px] whitespace-nowrap">
                    {entry.date}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap">
                    <LedgerReasonChip reason={entry.reason} />
                  </TableCell>
                  <TableCell className="tabular py-3 text-[13px] whitespace-nowrap">
                    {entry.ledgerNo}
                  </TableCell>
                  <TableCell className="py-3 text-[13px] whitespace-nowrap">
                    {entry.breedSex}
                  </TableCell>
                  <TableCell className="py-3 text-[13px] whitespace-nowrap">
                    {entry.counterparty}
                  </TableCell>
                  <TableCell className="tabular py-3 text-[13px] whitespace-nowrap">
                    {formatYen(entry.price)}
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-[13px] whitespace-nowrap">
                    {entry.contractNo ? (
                      <span className="font-medium text-[#a95f42]">
                        {entry.contractNo}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">−</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* モバイル: カード積み */}
        <div className="flex flex-col gap-2 p-3 md:hidden">
          {ledgerEntries.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="tabular text-[12.5px] text-muted-foreground">
                  {entry.date}
                </span>
                <LedgerReasonChip reason={entry.reason} />
              </div>
              <p className="tabular mt-2 text-[14px] font-medium">
                {entry.ledgerNo}
              </p>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                {entry.breedSex}
              </p>
              <p className="mt-2 text-[12.5px]">{entry.counterparty}</p>
              <div className="mt-3 flex items-center justify-between gap-2 text-[12.5px]">
                <span className="tabular">{formatYen(entry.price)}</span>
                {entry.contractNo ? (
                  <span className="font-medium text-[#a95f42]">
                    {entry.contractNo}
                  </span>
                ) : (
                  <span className="text-muted-foreground">−</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Panel className="p-4">
          <StatBlock label="出生" value={ledgerTotals.births} />
        </Panel>
        <Panel className="p-4">
          <StatBlock label="販売" value={ledgerTotals.sales} />
        </Panel>
        <Panel className="p-4">
          <StatBlock label="死亡" value={ledgerTotals.deaths} />
        </Panel>
        <Panel className="p-4">
          <StatBlock label="譲渡" value={ledgerTotals.transfers} />
        </Panel>
      </div>
    </PageBody>
  );
}
