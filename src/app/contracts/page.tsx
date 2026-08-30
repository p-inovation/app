/**
 * 契約・重要事項説明。標準契約の条項を採用し、契約書プレビューを生成する画面。
 * チェックボックスで採用条項を切り替えるため Client Component。
 */
"use client";

import { useState } from "react";

import { Field, PageBody, Panel, PanelHeader } from "@/components/domain/page-parts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { animals, contract, contractClauses, findAnimal } from "@/lib/mock/data";
import { daysBetween, sellableFrom } from "@/lib/domain/compliance";

export default function ContractsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(contractClauses.map((c) => [c.code, c.enabled])),
  );

  const animal = findAnimal("a-0142") ?? animals[0];
  const handover = new Date(2026, 7, 30); // contract.handoverOn "2026-08-30"
  const sellable = sellableFrom(animal.birthDate);
  const daysShort = daysBetween(handover, sellable);

  return (
    <PageBody>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* 左カラム */}
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader title="契約の内容" />
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <Field label="契約番号" value={contract.no} mono />
                <Field label="お客さま" value={contract.customer} />
                <Field label="対象の個体" value={contract.animal} mono />
                <Field
                  label="販売価格"
                  value={`¥${contract.price.toLocaleString("ja-JP")}（手付 ¥${contract.deposit.toLocaleString("ja-JP")} 受領）`}
                  mono
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 border-t border-border pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11.5px] text-muted-foreground">引渡予定日</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <div className="tabular rounded-md border border-[#b2402f] bg-[#fbeae7] px-3 py-1.5 text-[14px]">
                      {contract.handoverOn}
                    </div>
                    <span className="text-[12px] text-[#b2402f]">
                      8週齢まで残り{daysShort}日
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[11.5px] text-muted-foreground">健康保証</p>
                  <div className="mt-1 rounded-md border border-border px-3 py-1.5 text-[14px]">
                    {contract.healthGuarantee}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="条項をえらぶ"
              description="標準契約 v3 から 5条項を採用"
            />
            <div className="divide-y divide-border">
              {contractClauses.map((clause) => (
                <div
                  key={clause.code}
                  className="flex min-h-11 items-start gap-3 px-4 py-3 md:px-5"
                >
                  <Checkbox
                    id={`clause-${clause.code}`}
                    checked={enabled[clause.code]}
                    onCheckedChange={(checked) =>
                      setEnabled((prev) => ({
                        ...prev,
                        [clause.code]: checked === true,
                      }))
                    }
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`clause-${clause.code}`}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[13.5px] font-semibold">
                        {clause.title}
                      </span>
                      <code className="font-mono text-[11.5px] text-muted-foreground">
                        {clause.code}
                      </code>
                    </div>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {clause.description}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* 右カラム */}
        <div>
          <Panel>
            <PanelHeader
              title="できあがる書類"
              action={
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 bg-card">
                    PDFで出す
                  </Button>
                  <Button size="sm" className="h-8" disabled>
                    署名を依頼（要修正）
                  </Button>
                </div>
              }
            />
            <div className="p-4 md:p-5">
              <div className="rounded-lg border border-border bg-white p-6 text-[13px] leading-relaxed text-[#23262a]">
                <h3 className="text-center text-[16px] font-bold tracking-[0.3em]">
                  犬 売 買 契 約 書
                </h3>
                <p className="tabular mt-3 text-right text-[12px] text-muted-foreground">
                  {contract.no}
                </p>

                <p className="mt-4">
                  売主 白川ケンネル（第一種動物取扱業 東京都 販売 第26-0412号）と買主
                  中村 陽子は、下記の犬について次のとおり売買契約を締結する。
                </p>

                <table className="mt-4 w-full border-collapse border border-border text-[12.5px]">
                  <tbody>
                    <tr className="border-b border-border">
                      <th className="w-[110px] border-r border-border bg-muted/40 px-2 py-1.5 text-left font-medium">
                        品種
                      </th>
                      <td className="px-2 py-1.5">トイ・プードル（レッド・メス）</td>
                    </tr>
                    <tr className="border-b border-border">
                      <th className="border-r border-border bg-muted/40 px-2 py-1.5 text-left font-medium">
                        生年月日
                      </th>
                      <td className="px-2 py-1.5">2026年7月8日</td>
                    </tr>
                    <tr className="border-b border-border">
                      <th className="border-r border-border bg-muted/40 px-2 py-1.5 text-left font-medium">
                        個体識別番号
                      </th>
                      <td className="tabular px-2 py-1.5">{contract.chipNo}</td>
                    </tr>
                    <tr>
                      <th className="border-r border-border bg-muted/40 px-2 py-1.5 text-left font-medium">
                        代金
                      </th>
                      <td className="tabular px-2 py-1.5">金 480,000 円（消費税込）</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4 space-y-3">
                  <p>
                    <span className="font-semibold">第1条（引渡し）</span>
                    <br />
                    売主は、2026年
                    <span className="font-bold text-[#b2402f]">8月30日</span>
                    に本件犬を買主に引き渡す。ただし出生後56日を経過しない期間は引渡しを行わない。
                  </p>
                  <p>
                    <span className="font-semibold">第2条（健康保証）</span>
                    <br />
                    売主は、引渡し後30日以内に判明した先天性疾患について、獣医師の診断書の提出を条件に治療費を負担する。
                  </p>
                  <p>
                    <span className="font-semibold">第3条（繁殖の制限）</span>
                    <br />
                    買主は、本件犬を営利目的の繁殖に供してはならない。
                  </p>
                </div>

                <p className="mt-5 text-center text-[12px] text-muted-foreground">
                  — 以下 第4条〜第9条 —
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </PageBody>
  );
}
