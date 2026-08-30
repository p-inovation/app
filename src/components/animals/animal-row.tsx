/**
 * 個体台帳の1行分の表示ロジック。PC は表の1行、モバイルはカードとして
 * 同じ内容をレイアウトだけ変えて出す（`variant` で切替）。
 */

import Link from "next/link";

import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  CategoryBadge,
  ChipStatusLabel,
} from "@/components/domain/status-badges";
import {
  formatAge,
  formatIsoDate,
  ageInDays,
  EIGHT_WEEK_DAYS,
} from "@/lib/domain/compliance";
import { sexLabel } from "@/lib/domain/enums";
import { TODAY, type Animal } from "@/lib/mock/data";

/** 区分ごとの左端カラーバー。モックアップの色分けに合わせる */
const CATEGORY_BAR: Record<Animal["category"], string> = {
  breeding: "bg-[#23262a]",
  for_sale: "bg-primary",
  retired: "bg-muted-foreground/40",
  sold: "bg-muted-foreground/40",
};

export function isUnderEightWeeks(birthDate: Date): boolean {
  return ageInDays(birthDate, TODAY) < EIGHT_WEEK_DAYS;
}

export function AnimalTableRow({ animal }: { animal: Animal }) {
  const underEightWeeks = isUnderEightWeeks(animal.birthDate);

  return (
    <TableRow className="group relative border-border">
      <TableCell className="w-0 p-0">
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-1",
            CATEGORY_BAR[animal.category],
          )}
        />
      </TableCell>
      <TableCell className="tabular whitespace-nowrap py-3 pl-4 text-[13px]">
        <Link
          href={`/animals/${animal.id}`}
          className="absolute inset-0"
          aria-label={`${animal.callName}（${animal.ledgerNo}）の詳細を開く`}
        />
        {animal.ledgerNo}
      </TableCell>
      <TableCell className="py-3">
        <p className="text-[14px] font-medium">{animal.callName}</p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
          {animal.registeredName}
        </p>
      </TableCell>
      <TableCell className="py-3 text-[13px] whitespace-nowrap">
        {animal.breed}
      </TableCell>
      <TableCell className="py-3 text-[13px] whitespace-nowrap">
        {sexLabel[animal.sex]}
      </TableCell>
      <TableCell className="tabular py-3 text-[13px] whitespace-nowrap">
        {formatIsoDate(animal.birthDate)}
      </TableCell>
      <TableCell
        className={cn(
          "tabular py-3 text-[13px] whitespace-nowrap",
          underEightWeeks && "font-medium text-[#b2402f]",
        )}
      >
        {formatAge(animal.birthDate, TODAY)}
      </TableCell>
      <TableCell className="py-3 whitespace-nowrap">
        <ChipStatusLabel status={animal.chipStatus} />
      </TableCell>
      <TableCell className="py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <CategoryBadge category={animal.category} />
          <span className="text-[12px] text-muted-foreground">
            {animal.note}
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

/** モバイル用カード。表と同じ情報を縦積みにする */
export function AnimalCard({ animal }: { animal: Animal }) {
  const underEightWeeks = isUnderEightWeeks(animal.birthDate);

  return (
    <Link
      href={`/animals/${animal.id}`}
      className="relative block overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_rgba(16,18,20,0.04)] active:bg-muted/40"
    >
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-1", CATEGORY_BAR[animal.category])}
      />
      <div className="flex flex-col gap-2 py-3 pr-4 pl-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[14px] font-medium">{animal.callName}</p>
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
              {animal.registeredName}
            </p>
          </div>
          <CategoryBadge category={animal.category} className="shrink-0" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12.5px]">
          <div>
            <p className="text-[11px] text-muted-foreground">個体ID</p>
            <p className="tabular mt-0.5">{animal.ledgerNo}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">犬種・性別</p>
            <p className="mt-0.5">
              {animal.breed} / {sexLabel[animal.sex]}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">生年月日</p>
            <p className="tabular mt-0.5">{formatIsoDate(animal.birthDate)}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">年齢</p>
            <p
              className={cn(
                "tabular mt-0.5",
                underEightWeeks && "font-medium text-[#b2402f]",
              )}
            >
              {formatAge(animal.birthDate, TODAY)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">チップ</p>
            <p className="mt-0.5">
              <ChipStatusLabel status={animal.chipStatus} />
            </p>
          </div>
        </div>
        {animal.note ? (
          <p className="text-[12px] text-muted-foreground">{animal.note}</p>
        ) : null}
      </div>
    </Link>
  );
}
