import { PageBody, Panel, PanelHeader } from "@/components/domain/page-parts";
import { Button } from "@/components/ui/button";
import { InquiryBoard } from "@/components/inquiry/inquiry-board";
import { VisitBookingTable } from "@/components/inquiry/visit-booking-table";
import {
  inquiries,
  inquiryStageCounts,
  visitBookings,
} from "@/lib/mock/data";

export default function InquiriesPage() {
  return (
    <PageBody className="space-y-4">
      <InquiryBoard inquiries={inquiries} stageCounts={inquiryStageCounts} />

      <Panel>
        <PanelHeader
          title="今週の見学予約"
          description="重要事項説明は対面が必要です。見学と同時に済ませる導線を用意しています。"
          action={
            <Button className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
              ＋ 引合いを登録
            </Button>
          }
        />
        <VisitBookingTable bookings={visitBookings} />
      </Panel>
    </PageBody>
  );
}
