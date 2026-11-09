"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-heading font-bold text-brand-charcoal-800 tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-xl shadow-xs transition-all">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-charcoal-400">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-brand-charcoal-900 placeholder:text-brand-charcoal-400 focus:outline-none focus:ring-2 transition-all",
              "border-brand-cream-300 focus:border-brand-green-700 focus:ring-brand-mint-200/60",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-rose-400 focus:border-rose-500 focus:ring-rose-100 text-rose-900 placeholder:text-rose-300",
              disabled && "bg-brand-cream-100/60 cursor-not-allowed opacity-70",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-charcoal-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        ) : hint ? (
          <p className="text-[11px] text-brand-charcoal-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

