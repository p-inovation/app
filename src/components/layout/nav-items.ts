/**
 * ナビゲーション定義。
 * モックアップのサイドバーは「日々の記録 / 販売 / 法令対応 / 設定」の4グループ。
 * 要件 §6.1 は5グループ（ダッシュボード/生体/繁殖/帳票/設定）だが、
 * ここではモックアップの実装に合わせる。
 */

export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  heading: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    heading: "日々の記録",
    items: [
      { href: "/", label: "ダッシュボード" },
      { href: "/animals", label: "個体台帳" },
      { href: "/animals/a-0142", label: "個体カルテ" },
      { href: "/breeding", label: "繁殖・産次" },
    ],
  },
  {
    heading: "販売",
    items: [
      { href: "/inquiries", label: "引合い・顧客" },
      { href: "/contracts", label: "契約・重要事項説明" },
    ],
  },
  {
    heading: "法令対応",
    items: [
      { href: "/microchip", label: "マイクロチップ" },
      { href: "/ledger", label: "帳簿・定期報告" },
    ],
  },
  {
    heading: "設定",
    items: [{ href: "/settings", label: "スタッフ・事業者" }],
  },
];

/** パスに対する画面タイトルと補足。ヘッダーに出す */
export const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "ダッシュボード", subtitle: "白川ケンネル ／ 犬の繁殖・販売" },
  "/animals": {
    title: "個体台帳",
    subtitle: "繁殖犬と販売用の子犬を色で区別",
  },
  "/animals/new": { title: "個体の新規登録", subtitle: "台帳に子犬を追加する" },
  "/breeding": { title: "繁殖・産次", subtitle: "交配計画と数値規制の判定" },
  "/breeding/matings/new": {
    title: "交配の登録",
    subtitle: "数値規制を確認しながら登録",
  },
  "/breeding/births/new": {
    title: "出産・産次の登録",
    subtitle: "生存頭数から個体を自動作成",
  },
  "/health/new": {
    title: "健康・ワクチン記録の追加",
    subtitle: "個体カルテに記録を1件足す",
  },
  "/weights/new": {
    title: "体重測定の入力",
    subtitle: "週次の測定をまとめて入力",
  },
  "/photos/new": {
    title: "日々の写真を登録",
    subtitle: "その日の様子をまとめて記録する",
  },
  "/inspections/new": {
    title: "日次点検の記録",
    subtitle: "清掃・消毒・保守点検と異常の有無",
  },
  "/inquiries": { title: "引合い・顧客", subtitle: "問い合わせから引渡しまで" },
  "/inquiries/new": {
    title: "引合いの登録",
    subtitle: "お問い合わせを1件受け付ける",
  },
  "/contracts": {
    title: "契約・重要事項説明",
    subtitle: "販売契約と法定書面",
  },
  "/microchip": {
    title: "マイクロチップ",
    subtitle: "装着と環境省データベース登録の管理",
  },
  "/microchip/register": {
    title: "マイクロチップ登録申請",
    subtitle: "環境省データベースへの登録",
  },
  "/ledger": {
    title: "帳簿・定期報告",
    subtitle: "5年保存 ／ 定期報告の元データ",
  },
  "/ledger/new": {
    title: "帳簿の手動記載",
    subtitle: "自動記載できない事由を追記",
  },
  "/settings": {
    title: "スタッフ・事業者設定",
    subtitle: "登録情報と数値規制の判定値",
  },
};
