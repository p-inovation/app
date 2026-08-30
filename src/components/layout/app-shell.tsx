"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navGroups, pageMeta } from "./nav-items";
import { currentUser, office, TODAY } from "@/lib/mock/data";
import { formatIsoDate } from "@/lib/domain/compliance";

const WEEKDAY = ["日", "月", "火", "水", "木", "金", "土"];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-6 rounded-md bg-[#c9a08d]"
          />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Kennel Ledger
          </span>
        </div>
        <p className="mt-2 text-[11px] text-sidebar-foreground/55">
          {office.name} ／ {office.prefecture} {office.licenseNo}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.heading} className="mb-1">
            <p className="px-2 pt-4 pb-1.5 text-[11px] font-medium text-sidebar-foreground/45">
              {group.heading}
            </p>
            <ul>
              {group.items.map((item) => {
                // 個体カルテは /animals/xxx なので前方一致だと台帳と衝突する。完全一致で判定する
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "block rounded-md px-3 py-2 text-[13.5px] transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-sidebar-border px-5 py-3.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-[13px] text-white">
          {currentUser.name.trim().at(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] text-white">{currentUser.name}</p>
          <p className="truncate text-[11px] text-sidebar-foreground/55">
            {currentUser.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const meta = pageMeta[pathname] ?? {
    title: "個体カルテ",
    subtitle: "1頭の記録をまとめて見る",
  };

  const dateLabel = `${formatIsoDate(TODAY)} ${WEEKDAY[TODAY.getDay()]}`;

  return (
    <div className="flex min-h-dvh">
      {/* PC：常設サイドバー */}
      <aside className="hidden w-[244px] shrink-0 lg:block">
        <div className="fixed inset-y-0 w-[244px]">
          <NavContent />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-14 flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur md:px-6">
          {/* モバイル：ハンバーガーでドロワー */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="メニューを開く"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-[268px] border-0 p-0">
              <SheetTitle className="sr-only">メニュー</SheetTitle>
              <NavContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-semibold tracking-tight">
              {meta.title}
            </h1>
          </div>
          <p className="hidden truncate text-[12.5px] text-muted-foreground sm:block">
            {meta.subtitle}
          </p>

          <div className="ml-auto flex items-center gap-2">
            <span className="tabular rounded-md border border-border bg-card px-2.5 py-1.5 text-[12px] text-muted-foreground">
              {dateLabel}
            </span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
