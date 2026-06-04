"use client";

import { generateMonthlyForecast } from "@/lib/monthlyForecast";
import { formatCurrency } from "@/lib/format";
import type { Child } from "@/lib/types";

interface MonthlyForecastProps {
  childList: Child[];
}

export function MonthlyForecast({
  childList,
}: MonthlyForecastProps) {
  const forecast =
    generateMonthlyForecast(childList);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Monthly Forecast
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Estimated funding and parent contribution month by month.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Month
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                Funded Weeks
              </th>

              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                Fee
              </th>

              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                ECCE
              </th>

              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                NCS
              </th>

              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                Parent Pays
              </th>
            </tr>
          </thead>

          <tbody>
            {forecast.map((row) => (
              <tr
                key={`${row.month}-${row.year}`}
                className="border-b border-slate-100"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {row.month} {row.year}
                </td>

                <td className="px-4 py-3 text-center">
                  {row.Weeks}
                </td>

                <td className="px-4 py-3 text-right">
                  {formatCurrency(row.fee)}
                </td>

                <td className="px-4 py-3 text-right">
                  {formatCurrency(row.ecce)}
                </td>

                <td className="px-4 py-3 text-right">
                  {formatCurrency(row.ncs)}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-brand-700">
                  {formatCurrency(
                    row.contribution
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs text-amber-800">
        Monthly forecast is an estimate based on
        term-time hours during September–June and
        non-term hours during July–August.
        <br />
        NCS funding is calculated using the actual
        number of Sundays in each month.
      </div>
    </div>
  );
}