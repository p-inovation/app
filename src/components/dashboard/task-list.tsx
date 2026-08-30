"use client";

/**
 * 「今日やること」の行。チェック状態は表示のみ（保存はしない）。
 * チェックボックスの操作だけのために画面全体を Client Component にしないよう、ここだけ切り出す。
 */

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskTag } from "@/components/domain/status-badges";
import type { Task } from "@/lib/mock/data";

function TaskRow({ task }: { task: Task }) {
  const [done, setDone] = useState(task.done);

  const content = (
    <div className="flex min-h-11 items-center gap-3 px-4 py-2.5 md:px-5">
      <Checkbox
        checked={done}
        onCheckedChange={setDone}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[13.5px] font-medium",
            done && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
          {task.detail}
        </p>
      </div>
      <TaskTag tag={task.tag} />
      {task.href ? (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      ) : null}
    </div>
  );

  if (task.href) {
    return (
      <Link
        href={task.href}
        className="block border-b border-border transition-colors last:border-b-0 hover:bg-muted/40"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="border-b border-border last:border-b-0">{content}</div>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  return <div>{tasks.map((task) => <TaskRow key={task.id} task={task} />)}</div>;
}
