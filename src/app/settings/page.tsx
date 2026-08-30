/**
 * スタッフ・事業者設定。数値規制の判定値はここで事業者が上書きできる（初期値は環境省令）。
 * 入力操作がないため Server Component。
 */

import { Pencil } from "lucide-react";

import { Field, PageBody, Panel, PanelHeader } from "@/components/domain/page-parts";
import { Button } from "@/components/ui/button";
import { officeProfile, staffList, type Staff } from "@/lib/mock/data";
import { defaultThresholds } from "@/lib/domain/thresholds";

const employmentStyle: Record<Staff["employment"], string> = {
  常勤: "bg-[#eaf2ec] text-[#356a48]",
  非常勤: "bg-muted text-muted-foreground",
  外部: "bg-muted text-muted-foreground",
};

const thresholdBoxes = [
  {
    label: "従業員1人あたりの繁殖犬",
    value: defaultThresholds.breedingDogsPerStaff,
    unit: "頭",
  },
  {
    label: "販売・引渡しができる日齢",
    value: defaultThresholds.sellableFromDays,
    unit: "日",
  },
  {
    label: "交配時の雌の年齢上限",
    value: defaultThresholds.damMaxAgeYears,
    unit: "歳",
  },
  {
    label: "生涯出産回数の上限",
    value: defaultThresholds.maxLifetimeBirths,
    unit: "回",
  },
] as const;

export default function SettingsPage() {
  return (
    <PageBody className="flex flex-col gap-4">
      <Panel>
        <PanelHeader title="事業者情報" />
        <div className="p-4 md:p-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4">
            <Field label="事業所の名称" value={officeProfile.name} />
            <Field label="代表者氏名" value={officeProfile.representative} />
            <Field label="登録番号" value={officeProfile.licenseNo} />
            <Field label="登録の有効期限" value={officeProfile.licenseExpiry} mono />
            <Field label="事業所の所在地" value={officeProfile.address} />
            <Field label="取り扱う犬種" value={officeProfile.breeds} />
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="スタッフ"
          description="常勤の人数が飼養できる上限頭数の計算に使われます"
          action={
            <Button variant="outline" size="sm" className="h-8 bg-card">
              ＋ スタッフを追加
            </Button>
          }
        />

        {/* PC: 表 */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-border text-[12px] text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-medium">氏名</th>
                <th className="px-4 py-2.5 text-left font-medium">勤務形態</th>
                <th className="px-4 py-2.5 text-left font-medium">権限</th>
                <th className="px-4 py-2.5 text-left font-medium">資格</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {staff.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap ${employmentStyle[staff.employment]}`}
                    >
                      {staff.employment}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{staff.permission}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {staff.qualification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* モバイル: カード積み */}
        <div className="flex flex-col gap-2 p-3 md:hidden">
          {staffList.map((staff) => (
            <div key={staff.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-medium">{staff.name}</p>
                <span
                  className={`inline-flex items-center rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap ${employmentStyle[staff.employment]}`}
                >
                  {staff.employment}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[12.5px]">
                <div>
                  <p className="text-[11.5px] text-muted-foreground">権限</p>
                  <p className="mt-0.5">{staff.permission}</p>
                </div>
                <div>
                  <p className="text-[11.5px] text-muted-foreground">資格</p>
                  <p className="mt-0.5 text-muted-foreground">{staff.qualification}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="数値規制の判定設定" />
        <div className="p-4 md:p-5">
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            環境省令の上限値を初期値として入れています。自治体の条例で厳しい基準がある場合はここで変更してください。ダッシュボードの警告はこの値で判定されます。
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {thresholdBoxes.map((box) => (
              <div
                key={box.label}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-[12px] text-muted-foreground">{box.label}</p>
                <p className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="tabular text-[28px] leading-none">
                    {box.value}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    {box.unit}
                  </span>
                  <Pencil className="size-3.5 text-muted-foreground" />
                </p>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </PageBody>
  );
}
