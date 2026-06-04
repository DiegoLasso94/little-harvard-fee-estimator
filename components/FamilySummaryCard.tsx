"use client";

import { DownloadPdfButton } from "@/components/DownloadPdfButton";
import { calculateFamilySummary } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import type { Child } from "@/lib/types";

interface FamilySummaryCardProps {
  childList: Child[];
}

export function FamilySummaryCard({
  childList,
}: FamilySummaryCardProps) {
  const summary = calculateFamilySummary(childList);
  const childCount = childList.length;

  return (
    <aside className="sticky top-6 overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-lg shadow-brand-900/20">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold">
          Family Summary
        </h2>

        <p className="mt-0.5 text-sm text-brand-100">
          {childCount}{" "}
          {childCount === 1 ? "child" : "children"}{" "}
          on this plan
        </p>
      </div>

      <div className="space-y-1 px-5 py-4 sm:px-6">
        <div className="rounded-xl bg-white/10 px-4 py-1 backdrop-blur-sm">
          <SummaryRow
            label="Total gross fees"
            value={formatCurrency(summary.totalGrossFees)}
          />

          {summary.totalSiblingDiscount > 0 && (
            <SummaryRow
              label="Total sibling discount"
              value={`−${formatCurrency(
                summary.totalSiblingDiscount
              )}`}
            />
          )}

          <SummaryRow
            label="Total fees after discount"
            value={formatCurrency(summary.totalFees)}
          />

          <SummaryRow
            label="Total ECCE funding"
            value={formatCurrency(summary.totalEcceFunding)}
          />

          <SummaryRow
            label="Total NCS funding"
            value={formatCurrency(summary.totalNcsFunding)}
          />
        </div>

        <div className="mt-4 rounded-xl bg-white px-4 py-4 text-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estimated Monthly Payment
          </p>

          <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-brand-700">
            {formatCurrency(
              summary.estimatedMonthlyInvoice
            )}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Estimated amount payable by parents
            after ECCE and NCS funding.
          </p>
        </div>

        <div className="mt-3 rounded-lg bg-white/10 p-3 text-xs text-brand-50">
          Figures shown are estimates only and may
          vary depending on approved ECCE funding,
          NCS funding rates, attendance patterns and
          eligibility.
        </div>

        <div className="mt-4 px-1 pb-1">
          <DownloadPdfButton childList={childList} />
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2.5 last:border-0">
      <span className="text-sm text-brand-50">
        {label}
      </span>

      <span className="text-sm font-medium tabular-nums text-white">
        {value}
      </span>
    </div>
  );
}