"use client";

import { useState } from "react";
import { ChildCard } from "@/components/ChildCard";
import { FamilySummaryCard } from "@/components/FamilySummaryCard";
import { MonthlyForecast } from "@/components/MonthlyForecast";
import { createEmptyChild, normalizeChild } from "@/lib/defaults";
import type { Child } from "@/lib/types";

export function CalculatorApp() {
  const [children, setChildren] = useState<Child[]>(() => [
    createEmptyChild(),
  ]);

  const [activeTab, setActiveTab] = useState<"estimate" | "forecast">(
    "estimate"
  );

  const addChild = () => {
    setChildren((prev) => [...prev, createEmptyChild()]);
  };

  const updateChild = (id: string, updated: Child) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? normalizeChild(updated) : c))
    );
  };

  const removeChild = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("estimate")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "estimate"
              ? "bg-brand-600 text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          Quick Estimate
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("forecast")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "forecast"
              ? "bg-brand-600 text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          Monthly Forecast
        </button>
      </div>

      {activeTab === "estimate" && (
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-6">
            {children.map((child, index) => (
              <ChildCard
                key={child.id}
                child={child}
                index={index}
                onChange={(updated) => updateChild(child.id, updated)}
                onRemove={() => removeChild(child.id)}
                canRemove={children.length > 1}
              />
            ))}

            <button
              type="button"
              onClick={addChild}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-4 py-4 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700"
            >
              <PlusIcon />
              Add another child
            </button>
          </div>

          <div className="mt-8 lg:mt-0">
            <FamilySummaryCard childList={children} />
          </div>
        </div>
      )}

      {activeTab === "forecast" && (
        <MonthlyForecast childList={children} />
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}