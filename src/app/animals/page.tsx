"use client";

/**
 * 個体台帳 一覧。フィルタタブ・検索・品種・要対応のみを `useState` で実際に動かす。
 * 件数タブの数字はモックアップ通り `ledgerCounts`（固定値）を出す＝絞り込み結果の件数とは一致しない。
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageBody, Panel } from "@/components/domain/page-parts";
import {
  AnimalCard,
  AnimalTableRow,
  isUnderEightWeeks,
} from "@/components/animals/animal-row";
import { FilterTabs, type LedgerFilter } from "@/components/animals/filter-tabs";
import { animals } from "@/lib/mock/data";

const BREED_ALL = "__all__";

function needsAttention(animal: (typeof animals)[number]): boolean {
  return isUnderEightWeeks(animal.birthDate) || animal.chipStatus !== "registered";
}

export default function AnimalsPage() {
  const [filter, setFilter] = useState<LedgerFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [breed, setBreed] = useState(BREED_ALL);
  const [attentionOnly, setAttentionOnly] = useState(false);

  const breedOptions = useMemo(
    () => Array.from(new Set(animals.map((a) => a.breed))).toSorted(),
    [],
  );

  const attentionCount = useMemo(
    () => animals.filter(needsAttention).length,
    [],
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return animals.filter((a) => {
      if (filter !== "all" && a.category !== filter) return false;
      if (breed !== BREED_ALL && a.breed !== breed) return false;
      if (attentionOnly && !needsAttention(a)) return false;
      if (q) {
        const haystack = `${a.callName} ${a.registeredName} ${a.ledgerNo} ${a.breed}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filter, breed, attentionOnly, keyword]);

  return (
    <PageBody>
      <Panel>
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3.5 md:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <FilterTabs value={filter} onChange={setFilter} />

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="呼び名・個体ID・犬種で検索"
                  className="h-9 w-56 pl-8"
                />
              </div>

              <Select
                value={breed}
                onValueChange={(v) => setBreed(v as string)}
              >
                <SelectTrigger className="h-9 min-w-[104px]">
                  {breed === BREED_ALL ? "品種" : breed}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BREED_ALL}>品種 すべて</SelectItem>
                  {breedOptions.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={attentionOnly}
                onClick={() => setAttentionOnly((v) => !v)}
                className={cn(
                  "h-9 border-transparent bg-[#fbeae7] text-[#8a4235] hover:bg-[#f5dbd6]",
                  attentionOnly && "ring-2 ring-[#b2402f]/40",
                )}
              >
                要対応のみ <span className="tabular">{attentionCount}</span>
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/animals/new" />}
                size="sm"
                className="h-9"
              >
                <Plus className="size-4" />
                個体を登録
              </Button>
            </div>
          </div>
        </div>

        {/* PC: 表 */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-0 p-0" />
                <TableHead className="pl-4 text-[12px]">個体ID</TableHead>
                <TableHead className="text-[12px]">呼び名・登録名</TableHead>
                <TableHead className="text-[12px]">犬種</TableHead>
                <TableHead className="text-[12px]">性別</TableHead>
                <TableHead className="text-[12px]">生年月日</TableHead>
                <TableHead className="text-[12px]">年齢</TableHead>
                <TableHead className="text-[12px]">チップ</TableHead>
                <TableHead className="text-[12px]">区分・状態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((animal) => (
                <AnimalTableRow key={animal.id} animal={animal} />
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-muted-foreground">
              条件に一致する個体がいません。
            </p>
          ) : null}
        </div>

        {/* モバイル: カード積み */}
        <div className="flex flex-col gap-2 p-3 md:hidden">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-muted-foreground">
              条件に一致する個体がいません。
            </p>
          ) : null}
        </div>
      </Panel>
    </PageBody>
  );
}
