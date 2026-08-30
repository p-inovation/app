/**
 * 今週の見学予約テーブル。重要事項説明の実施状況を状態チップで示す。
 */

import { cn } from "@/lib/utils";
import type { VisitBooking } from "@/lib/mock/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusToneStyles = {
  success: "bg-[#eaf2ec] text-[#356a48]",
  warning: "bg-[#fdf6ea] text-[#7d5316]",
  muted: "bg-muted text-muted-foreground",
} satisfies Record<VisitBooking["statusTone"], string>;

export function VisitBookingTable({ bookings }: { bookings: VisitBooking[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[12px] text-muted-foreground">
              日時
            </TableHead>
            <TableHead className="text-[12px] text-muted-foreground">
              顧客名
            </TableHead>
            <TableHead className="text-[12px] text-muted-foreground">
              対象個体
            </TableHead>
            <TableHead className="text-[12px] text-muted-foreground">
              状態
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="tabular text-[13px]">
                {booking.when}
              </TableCell>
              <TableCell className="text-[13px] font-medium">
                {booking.customer}
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground">
                {booking.target}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-[5px] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
                    statusToneStyles[booking.statusTone],
                  )}
                >
                  {booking.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
