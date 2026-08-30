/**
 * 体重推移の折れ線グラフ。ライブラリを使わず inline SVG で描く。
 * viewBox を使い幅100%で伸縮させ、モバイルでも横スクロールさせない。
 */

import { formatShortDate } from "@/lib/domain/compliance";

type WeightPoint = {
  measuredOn: Date;
  weightG: number;
};

const WIDTH = 560;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 };

export function WeightChart({ series }: { series: WeightPoint[] }) {
  if (series.length === 0) {
    return (
      <p className="text-[12.5px] text-muted-foreground">
        体重の記録がありません。
      </p>
    );
  }

  const values = series.map((p) => p.weightG);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  // 上下に少し余白を持たせ、線がグラフの端に張り付かないようにする
  const valueRange = Math.max(maxValue - minValue, 1);
  const yMin = Math.max(0, minValue - valueRange * 0.15);
  const yMax = maxValue + valueRange * 0.15;

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const xAt = (index: number) =>
    series.length === 1
      ? PADDING.left + innerWidth / 2
      : PADDING.left + (innerWidth * index) / (series.length - 1);
  const yAt = (weightG: number) =>
    PADDING.top + innerHeight * (1 - (weightG - yMin) / (yMax - yMin));

  const points = series.map((p, i) => ({
    x: xAt(i),
    y: yAt(p.weightG),
    data: p,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${(
    PADDING.top + innerHeight
  ).toFixed(1)} L${points[0].x.toFixed(1)},${(PADDING.top + innerHeight).toFixed(
    1,
  )} Z`;

  const last = points[points.length - 1];
  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(yMin + ((yMax - yMin) * i) / yTicks),
  );

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      aria-label="体重の推移グラフ"
    >
      {/* 横方向の目盛り線 */}
      {tickValues.map((v) => {
        const y = yAt(v);
        return (
          <g key={v}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={y}
              y2={y}
              className="stroke-border"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground tabular"
              fontSize={10}
            >
              {v.toLocaleString("ja-JP")}
            </text>
          </g>
        );
      })}

      {/* 面の塗り */}
      <path d={areaPath} className="fill-primary/10" />

      {/* 折れ線 */}
      <path
        d={linePath}
        fill="none"
        className="stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 各点と横軸ラベル */}
      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        return (
          <g key={p.data.measuredOn.toISOString()}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isLast ? 4.5 : 3}
              className={isLast ? "fill-primary" : "fill-card stroke-primary"}
              strokeWidth={isLast ? 0 : 1.5}
            />
            <text
              x={p.x}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-muted-foreground tabular"
              fontSize={9}
            >
              {formatShortDate(p.data.measuredOn)}
            </text>
          </g>
        );
      })}

      {/* 最後の点の値ラベル */}
      <text
        x={last.x}
        y={last.y - 10}
        textAnchor="middle"
        className="fill-foreground tabular"
        fontSize={11}
        fontWeight={600}
      >
        {last.data.weightG.toLocaleString("ja-JP")}g
      </text>
    </svg>
  );
}
