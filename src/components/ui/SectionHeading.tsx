import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3 mb-10",
        centered ? "text-center mx-auto max-w-2xl" : "text-left",
        className
      )}
    >
      {badge && (
        <Badge variant="mint" className="uppercase tracking-widest text-[10px]">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-brand-charcoal-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export { Badge };
