"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, id, disabled, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-heading font-bold text-brand-charcoal-800 tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-xl shadow-xs">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-xl border bg-white pl-3.5 pr-10 py-3 text-sm text-brand-charcoal-900 focus:outline-none focus:ring-2 transition-all cursor-pointer",
              "border-brand-cream-300 focus:border-brand-green-700 focus:ring-brand-mint-200/60",
              error && "border-rose-400 focus:border-rose-500 focus:ring-rose-100 text-rose-900",
              disabled && "bg-brand-cream-100/60 cursor-not-allowed opacity-70",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-brand-charcoal-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-brand-charcoal-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

