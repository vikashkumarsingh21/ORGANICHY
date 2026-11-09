"use client";

import Link from "next/link";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtext?: string;
  href?: string;
  colorScheme?: "green" | "mint" | "amber" | "rose" | "charcoal";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  trend = "up",
  subtext,
  href,
  colorScheme = "green",
}: StatCardProps) {
  const colorMap = {
    green: {
      bg: "bg-brand-green-950",
      text: "text-brand-mint-400",
      pill: "bg-brand-mint-100 text-brand-green-900 border-brand-mint-200",
    },
    mint: {
      bg: "bg-brand-mint-200",
      text: "text-brand-green-950",
      pill: "bg-brand-mint-100 text-brand-green-900 border-brand-mint-300",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      pill: "bg-amber-50 text-amber-800 border-amber-200",
    },
    rose: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      pill: "bg-rose-50 text-rose-800 border-rose-200",
    },
    charcoal: {
      bg: "bg-brand-charcoal-100",
      text: "text-brand-charcoal-800",
      pill: "bg-brand-cream-100 text-brand-charcoal-700 border-brand-cream-300",
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.green;

  const cardContent = (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4">
      
      {/* Top Row: Title & Icon */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-charcoal-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center shrink-0 shadow-2xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Middle Row: Value */}
      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
          {value}
        </div>
      </div>

      {/* Bottom Row: Trend Pill & Subtext */}
      <div className="flex items-center justify-between gap-2 text-[11px] pt-1 border-t border-brand-cream-200">
        {change && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${scheme.pill}`}>
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3 text-brand-green-700" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3 h-3 text-rose-600" />
            ) : null}
            <span>{change}</span>
          </span>
        )}
        <span className="text-brand-charcoal-500 text-[11px] truncate">
          {subtext || "Real-time records"}
        </span>
      </div>

    </div>
  );

  if (href) {
    return <Link href={href} className="block group">{cardContent}</Link>;
  }

  return cardContent;
}

