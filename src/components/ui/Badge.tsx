import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "mint" | "green" | "gold" | "neutral";
}

export function Badge({
  className,
  variant = "mint",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    mint: "bg-brand-mint-100 text-brand-green-800 border-brand-mint-200",
    green: "bg-brand-green-900 text-brand-cream-100 border-brand-green-800",
    gold: "bg-amber-100 text-amber-900 border-amber-200",
    neutral: "bg-brand-cream-200 text-brand-charcoal-700 border-brand-cream-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

