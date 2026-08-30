/**
 * マイクロチップ管理。2022年6月〜の装着・環境省データベース登録義務の進捗を一覧する。
 * 状態が要らないため Server Component。
 */

import Link from "next/link";

import { PageBody, Panel, PanelHeader, StatBlock } from "@/components/domain/page-parts";
import { ChipStatusChip } from "@/components/compliance/chip-status-chip";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { chipRows, chipSummary } from "@/lib/mock/data";

export default function MicrochipPage() {
  return (
    <PageBody className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Panel className="p-4">
          <StatBlock label="対象頭数" value={chipSummary.total} />
        </Panel>
        <Panel className="p-4">
          <StatBlock
            label="装着・登録まで完了"
            value={chipSummary.completed}
            tone="success"
          />
        </Panel>
        <Panel className="border-[#f0dcc0] bg-[#fdf6ea] p-4">
          <StatBlock
            label="装着済・DB未登録"
            value={chipSummary.implantedOnly}
            tone="warning"
          />
        </Panel>
        <Panel className="border-[#f0d3cd] bg-[#fbeae7] p-4">
          <StatBlock
            label="未装着"
            value={chipSummary.notImplanted}
            tone="danger"
          />
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="登録の進み具合"
          description="2022年6月から、販売する犬はマイクロチップの装着と環境省データベースへの登録が義務です"
          action={
            <Button
              nativeButton={false}
              render={<Link href="/microchip/register" />}
              size="sm"
              className="h-9 bg-[#23262a] text-white hover:bg-[#23262a]/85"
            >
              未登録5件をまとめて申請
            </Button>
          }
        />

        {/* PC: 表 */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="pl-4 text-[12px]">個体ID</TableHead>
                <TableHead className="text-[12px]">呼び名</TableHead>
                <TableHead className="text-[12px]">チップ番号</TableHead>
                <TableHead className="text-[12px]">装着日</TableHead>
                <TableHead className="text-[12px]">状態</TableHead>
                <TableHead className="pr-4 text-[12px]">次にやること</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chipRows.map((row) => (
                <TableRow key={row.animalId} className="border-border">
                  <TableCell className="tabular py-3 pl-4 text-[13px] whitespace-nowrap">
                    {row.ledgerNo}
                  </TableCell>
                  <TableCell className="py-3 text-[14px] font-medium whitespace-nowrap">
                    {row.callName}
                  </TableCell>
                  <TableCell className="tabular py-3 text-[13px] whitespace-nowrap">
                    {row.chipNo ?? (
                      <span className="text-[#b2402f]">−</span>
                    )}
                  </TableCell>
                  <TableCell className="tabular py-3 text-[13px] whitespace-nowrap">
                    {row.implantedOn ?? "−"}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap">
                    <ChipStatusChip status={row.status} label={row.statusLabel} />
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-[13px] whitespace-nowrap">
                    <Link
                      href="/microchip/register"
                      className={
                        row.nextActionUrgent
                          ? "font-medium text-[#a95f42] hover:underline"
                          : "text-muted-foreground hover:underline"
                      }
                    >
                      {row.nextAction}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* モバイル: カード積み */}
        <div className="flex flex-col gap-2 p-3 md:hidden">
          {chipRows.map((row) => (
            <div
              key={row.animalId}
              className="rounded-lg border border-border p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">{row.callName}</p>
                  <p className="tabular mt-0.5 text-[11.5px] text-muted-foreground">
                    {row.ledgerNo}
                  </p>
                </div>
                <ChipStatusChip status={row.status} label={row.statusLabel} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12.5px]">
                <div>
                  <p className="text-[11.5px] text-muted-foreground">チップ番号</p>
                  <p className="tabular mt-0.5">
                    {row.chipNo ?? <span className="text-[#b2402f]">−</span>}
                  </p>
                </div>
                <div>
                  <p className="text-[11.5px] text-muted-foreground">装着日</p>
                  <p className="tabular mt-0.5">{row.implantedOn ?? "−"}</p>
                </div>
              </div>
              <p className="mt-3 text-[12.5px]">
                <span className="text-muted-foreground">次にやること　</span>
                <Link
                  href="/microchip/register"
                  className={
                    row.nextActionUrgent
                      ? "font-medium text-[#a95f42] hover:underline"
                      : "text-muted-foreground hover:underline"
                  }
                >
                  {row.nextAction}
                </Link>
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </PageBody>
  );
}
