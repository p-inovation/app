# 実装規約（このリポジトリで画面を追加するとき）

モックアップ `docs/system_plan/ブリーダー管理システム (1).html` を Next.js に起こしたもの。
既存の型を崩さないよう、以下に従うこと。

## スタック

Next.js 16（App Router / RSC）/ React 19 / Tailwind v4 / shadcn(base-nova) / zod v4 / react-hook-form / oxlint

## 重要：shadcn は Base UI ベース（Radix ではない）

`asChild` は**使えない**。`render` プロップを使う。

```tsx
// ✗ 動かない
<Button asChild><Link href="/x">a</Link></Button>
// ○ 正しい
<Button render={<Link href="/x" />}>a</Button>
```

## 既存の部品（必ず再利用する。新規に似たものを作らない）

| import | 用途 |
|---|---|
| `@/components/domain/page-parts` | `PageBody` `Panel` `PanelHeader` `BackLink` `NoticeBar` `Field` `StatBlock` |
| `@/components/domain/form-parts` | `FormHeading` `HintBar` `FieldLabel` `FormRow` `FormSectionLabel` `SegmentGroup` `FieldError` `FormActions` |
| `@/components/domain/status-badges` | `CategoryBadge` `ChipStatusLabel` `JudgementBadge` `TaskTag` |
| `@/lib/domain/compliance` | `evaluateCompliance` `formatAge` `formatIsoDate` `formatJpDate` `formatShortDate` `sellableFrom` `daysBetween` |
| `@/lib/domain/enums` | 列挙と日本語ラベル（`speciesLabel` など） |
| `@/lib/domain/schemas` | zod スキーマ |
| `@/lib/domain/thresholds` | 数値規制の判定値 |
| `@/lib/mock/data` | モックデータ。`TODAY` を「今日」として使う（`new Date()` は使わない） |

## デザイン

モックアップの実測値を CSS 変数にしてある。**生の hex を新たに書かない**（既存 `status-badges.tsx` の淡色トーンのみ例外）。

- 面: `bg-background` / カード: `bg-card` / 枠: `border-border`
- 主要: `bg-primary`（森緑 #356a48） / 違反・警告: `#b2402f` 系は `NoticeBar tone="destructive"` を使う
- サイドバー: `bg-sidebar`
- 本文 13〜14px、見出し 14.5〜19px、補足 11.5〜12.5px
- ID・日付・数値には `className="tabular"`（等幅＋桁揃え）

## 書き方

- 既定は **Server Component**。`useState` などが要る画面だけ `"use client"`。
- フォームは `react-hook-form` + `zodResolver(既存スキーマ)`。スキーマが無ければ `schemas.ts` に足す。
- 選択肢は `<select>` ではなく `SegmentGroup`（犬舎で片手・タップ操作するため）。
- 日本語UI。ラベルはモックアップの文言をそのまま使う（「今日やること」など言い換えない）。
- 状態は色だけで伝えない。必ず文字ラベルを添える（要件 §9.5）。
- タップ領域は最低44px（`min-h-11`）。入力欄は16px以上（globals.css で担保済み）。
- コメントは「なぜ」を書く。自明な処理に説明を付けない。

## モバイル

`lg:` 未満でサイドバーはドロワーになる（`AppShell` が担当）。各画面は
グリッドを `grid-cols-1 lg:grid-cols-2` のように畳み、横スクロールさせない。
表は `overflow-x-auto` で包む。

## 完了の条件

```bash
pnpm typecheck && pnpm lint && pnpm build
```

3つとも通ること。`any` は使わない。未使用の import を残さない。
