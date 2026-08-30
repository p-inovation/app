# Kennel Ledger — 犬猫生体・繁殖管理

モックアップ `docs/system_plan/ブリーダー管理システム (1).html` を Next.js に起こしたもの。
要件は `docs/system_plan/20260831_あんしんペット台帳リニューアル要件定義.md`、
DB/API 設計は `docs/system_plan/schema/` にある。

## スタック

Next.js 16（App Router）/ React 19 / TypeScript / Tailwind v4 /
shadcn ui（base-nova = **Base UI** ベース）/ zod v4 / react-hook-form / oxlint

## 動かす

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm build
```

## 画面（21ルート）

| 区分 | ルート | 内容 |
|---|---|---|
| 日々の記録 | `/` | ダッシュボード（法令チェック・今日やること・頭数） |
| | `/animals` | 個体台帳（絞り込み・検索） |
| | `/animals/[id]` | 個体カルテ（体重推移・健康履歴・法令ステータス） |
| | `/animals/new` | 個体の新規登録 |
| | `/breeding` | 繁殖・産次（交配可否の判定） |
| | `/breeding/matings/new` | 交配の登録 |
| | `/breeding/births/new` | 出産・産次の登録 |
| | `/litters/[id]` | 産次詳細 |
| | `/health/new` | 健康・ワクチン記録 |
| | `/weights/new` | 体重測定 |
| | `/photos/new` | 日々の写真 |
| | `/inspections/new` | 日次点検 |
| 販売 | `/inquiries` `/inquiries/new` | 引合い（カンバン）・登録 |
| | `/customers/[id]` | 顧客カルテ |
| | `/contracts` | 契約・重要事項説明 |
| 法令対応 | `/microchip` `/microchip/register` | マイクロチップ管理・登録申請 |
| | `/ledger` `/ledger/new` | 帳簿・定期報告／手動記載 |
| 設定 | `/settings` | スタッフ・事業者・数値規制の判定値 |

## 構成

```
src/
  app/                     ルート（画面）
  components/
    ui/                    shadcn 生成物（手で触らない・lint 対象外）
    domain/                page-parts / form-parts / status-badges（共通部品）
    layout/                AppShell・ナビゲーション定義
    <画面名>/              画面固有の部品
  lib/
    domain/                enums / schemas(zod) / compliance / thresholds
    mock/                  モックデータ（API接続時に差し替える層）
```

## 法令判定について

8週齢規制・マイクロチップ登録の判定は `lib/domain/compliance.ts` に集約し、
DB側のビュー `pet.v_animal_compliance`（`docs/system_plan/schema/schema.sql`）と同じ規則で評価する。
**サーバ側の検証が正**で、ここでの判定は「操作する前に結果を見せる」ためのもの。

数値規制の閾値（1人あたり15頭・56日・6歳・6回）は `lib/domain/thresholds.ts` にあり、
モックアップ同様に事業所ごとに変更できる想定。

## 実装規約

[`CONVENTIONS.md`](./CONVENTIONS.md) を参照。特に **shadcn は Base UI ベースなので `asChild` ではなく `render`**、
`<Link>` を渡すときは `nativeButton={false}` が要る点に注意。

## 現状

UI のみ。API は未接続で、データは `lib/mock/` の固定値。フォーム送信は toast を出すだけ。
