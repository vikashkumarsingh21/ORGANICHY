"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-brand-cream-300 pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-sm font-heading font-bold whitespace-nowrap transition-all border-b-2 -mb-px rounded-t-lg",
                isActive
                  ? "border-brand-green-800 text-brand-green-900 bg-brand-cream-100/60"
                  : "border-transparent text-brand-charcoal-500 hover:text-brand-green-800 hover:border-brand-cream-400"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

