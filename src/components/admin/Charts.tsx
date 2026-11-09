"use client";

import { useState } from "react";
import { formatINR } from "@/lib/utils";

interface DataPoint {
  label: string;
  value: number;
  subValue?: number;
  date?: string;
}

// -------------------------------------------------------------
// 1. REVENUE AREA & LINE CHART
// -------------------------------------------------------------
interface RevenueAreaChartProps {
  data: Array<{ day: string; date: string; revenue: number; orders: number }>;
  height?: number;
}

export function RevenueAreaChart({ data, height = 240 }: RevenueAreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-xs text-brand-charcoal-400">No data available</div>;
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 55 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.revenue), 10000);
  const roundedMax = Math.ceil(maxVal / 10000) * 10000;

  // Compute points
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.revenue / roundedMax) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Y-axis grid ticks (4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    y: padding.top + chartHeight - pct * chartHeight,
    val: Math.round(pct * roundedMax),
  }));

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible font-sans"
      >
        <defs>
          <linearGradient id="revenueGreenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {yTicks.map((tick, idx) => (
          <g key={idx}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={width - padding.right}
              y2={tick.y}
              stroke="#E2DCD5"
              strokeDasharray={idx === 0 ? "none" : "3 3"}
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={tick.y + 3}
              textAnchor="end"
              className="text-[9px] fill-brand-charcoal-400 font-mono"
            >
              ₹{tick.val >= 1000 ? `${(tick.val / 1000).toFixed(0)}k` : tick.val}
            </text>
          </g>
        ))}

        {/* Gradient Area */}
        <path d={areaPath} fill="url(#revenueGreenGradient)" />

        {/* Primary Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#1B4D3E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & hover triggers */}
        {points.map((p, idx) => (
          <g key={idx}>
            {/* X-axis labels */}
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className={`text-[10px] font-bold ${
                hoveredIdx === idx ? "fill-brand-green-950" : "fill-brand-charcoal-500"
              }`}
            >
              {p.day}
            </text>

            {/* Interactive Dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === idx ? "5" : "3.5"}
              fill={hoveredIdx === idx ? "#10382B" : "#1B4D3E"}
              stroke="#FFFFFF"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          </g>
        ))}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          className="absolute pointer-events-none -top-1 bg-brand-green-950 text-brand-cream-100 px-3 py-1.5 rounded-xl text-xs font-heading shadow-xl border border-brand-green-800 transition-all transform -translate-x-1/2"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
          }}
        >
          <div className="font-mono text-[10px] text-brand-mint-400">
            {points[hoveredIdx].date} ({points[hoveredIdx].day})
          </div>
          <div className="font-bold text-sm text-white">
            {formatINR(points[hoveredIdx].revenue)}
          </div>
          <div className="text-[10px] text-brand-cream-300">
            {points[hoveredIdx].orders} orders
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 2. ORDERS & SALES BAR CHART
// -------------------------------------------------------------
interface BarChartProps {
  data: Array<{ label: string; value: number; subLabel?: string }>;
  height?: number;
  valuePrefix?: string;
}

export function BarChart({ data, height = 200, valuePrefix = "" }: BarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-xs text-brand-charcoal-400">No records</div>;
  }

  const maxVal = Math.max(...data.map((d) => d.value), 10);

  return (
    <div className="w-full space-y-2 select-none">
      <div
        className="flex items-end justify-between gap-2 pt-4 px-2"
        style={{ height: `${height}px` }}
      >
        {data.map((item, idx) => {
          const heightPct = Math.max((item.value / maxVal) * 100, 6);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-8 bg-brand-green-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-10">
                  {valuePrefix}{item.value.toLocaleString("en-IN")}
                </div>
              )}

              {/* Bar */}
              <div
                className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ${
                  isHovered
                    ? "bg-brand-green-800 shadow-sm"
                    : "bg-brand-mint-300 hover:bg-brand-mint-400"
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {/* Label */}
              <span className="text-[10px] font-bold text-brand-charcoal-600 mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. ORDER STATUS BREAKDOWN (DONUT / RING)
// -------------------------------------------------------------
interface StatusBreakdownProps {
  delivered: number;
  processing: number;
  inTransit: number;
  cancelled: number;
}

export function StatusDonutChart({
  delivered,
  processing,
  inTransit,
  cancelled,
}: StatusBreakdownProps) {
  const total = Math.max(delivered + processing + inTransit + cancelled, 1);

  const segments = [
    { label: "Delivered", value: delivered, color: "#1B4D3E", pct: (delivered / total) * 100 },
    { label: "In-Transit", value: inTransit, color: "#2E7D32", pct: (inTransit / total) * 100 },
    { label: "Processing", value: processing, color: "#7BDCB5", pct: (processing / total) * 100 },
    { label: "Cancelled", value: cancelled, color: "#E11D48", pct: (cancelled / total) * 100 },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
      
      {/* Visual Ring representation */}
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#F4F1EA"
            strokeWidth="3.5"
          />

          {/* Slices */}
          {(() => {
            let accumulatedPct = 0;
            return segments.map((seg, idx) => {
              const strokeDasharray = `${seg.pct} ${100 - seg.pct}`;
              const strokeDashoffset = -accumulatedPct;
              accumulatedPct += seg.pct;

              return (
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="3.5"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              );
            });
          })()}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono text-brand-charcoal-400 uppercase tracking-wider">
            Total
          </span>
          <span className="text-xl font-heading font-black text-brand-green-950">
            {total}
          </span>
          <span className="text-[9px] text-brand-charcoal-500">
            Orders
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2 flex-1 w-full text-xs">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="font-heading font-bold text-brand-charcoal-700">
                {seg.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-brand-green-950">
                {seg.value}
              </span>
              <span className="text-[10px] text-brand-charcoal-400 w-8 text-right">
                {Math.round(seg.pct)}%
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

