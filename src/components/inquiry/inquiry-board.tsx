/**
 * 引合いカンバン。ステージごとに列を分け、カードは顧客カルテへのリンクにする。
 */

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Inquiry, InquiryStage } from "@/lib/mock/data";
import { inquiryStageLabel } from "@/lib/mock/data";

/** 列ヘッダーの色ドット。ステージの進み具合を一目で示す */
const stageDotColor: Record<InquiryStage, string> = {
  new: "bg-[#c3c7cb]",
  in_progress: "bg-[#c9a08d]",
  visit_booked: "bg-primary",
  reserved: "bg-[#a95f42]",
  handed_over: "bg-[#23262a]",
};

const chipToneStyles = {
  muted: "bg-muted text-muted-foreground",
  warning: "bg-[#fbeae7] text-[#8a4235]",
  success: "bg-[#eaf2ec] text-[#356a48]",
} satisfies Record<Inquiry["chipTone"], string>;

const STAGES: InquiryStage[] = [
  "new",
  "in_progress",
  "visit_booked",
  "reserved",
  "handed_over",
];

export function InquiryBoard({
  inquiries,
  stageCounts,
}: {
  inquiries: Inquiry[];
  stageCounts: Record<InquiryStage, number>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {STAGES.map((stage) => (
        <InquiryColumn
          key={stage}
          stage={stage}
          count={stageCounts[stage]}
          items={inquiries.filter((i) => i.stage === stage)}
        />
      ))}
    </div>
  );
}

function InquiryColumn({
  stage,
  count,
  items,
}: {
  stage: InquiryStage;
  count: number;
  items: Inquiry[];
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span
          className={cn("size-2 shrink-0 rounded-full", stageDotColor[stage])}
        />
        <span className="text-[13px] font-semibold tracking-tight">
          {inquiryStageLabel[stage]}
        </span>
        <span className="tabular ml-auto text-[12px] text-muted-foreground">
          {count}
        </span>
      </div>
      <div className="space-y-2 p-2">
        {items.map((item) => (
          <InquiryCard key={item.id} inquiry={item} />
        ))}
      </div>
    </div>
  );
}

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  return (
    <Link
      href={`/customers/${inquiry.id}`}
      className="block min-h-11 rounded-md border border-border bg-white px-3 py-2.5 transition-colors hover:bg-muted/40"
    >
      <p className="text-[13.5px] font-semibold tracking-tight">
        {inquiry.name}
      </p>
      <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
        {inquiry.detail}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className="tabular text-[11.5px] text-muted-foreground">
          {inquiry.date}
          {inquiry.time ? ` ${inquiry.time}` : ""}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex shrink-0 items-center rounded-[5px] px-2 py-0.5 text-[11.5px] font-medium",
            chipToneStyles[inquiry.chipTone],
          )}
        >
          {inquiry.chip}
        </span>
      </div>
    </Link>
  );
}
