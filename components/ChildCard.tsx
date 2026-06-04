"use client";

import { calculateChild } from "@/lib/calculations";
import { formatCurrency, formatHours } from "@/lib/format";
import type { Child, DaysPerWeek } from "@/lib/types";
import { StatRow } from "./StatRow";
import { Field, NumberInput, SelectInput, TextInput } from "./ui/Field";

const DAYS_OPTIONS: { value: DaysPerWeek; label: string }[] = [
  { value: 2, label: "2 days" },
  { value: 3, label: "3 days" },
  { value: 4, label: "4 days" },
  { value: 5, label: "5 days" },
];

interface ChildCardProps {
  child: Child;
  index: number;
  onChange: (child: Child) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ChildCard({
  child,
  index,
  onChange,
  onRemove,
  canRemove,
}: ChildCardProps) {
  const calc = calculateChild(child);
  const displayName = child.name.trim() || `Child ${index + 1}`;

  const update = <K extends keyof Child>(key: K, value: Child[K]) => {
    onChange({ ...child, [key]: value });
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-brand-50/40 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {index + 1}
          </span>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {displayName}
            </h2>

            <p className="text-xs text-slate-500">
              Child details & funding breakdown
            </p>
          </div>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </header>

      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2">
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Child name" htmlFor={`${child.id}-name`}>
                <TextInput
                  id={`${child.id}-name`}
                  placeholder="e.g. Aoife Murphy"
                  value={child.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
            </div>

            <div>
              <Field label="Date of birth" htmlFor={`${child.id}-dob`}>
                <TextInput
                  id={`${child.id}-dob`}
                  type="date"
                  value={child.dateOfBirth}
                  onChange={(e) =>
                    update("dateOfBirth", e.target.value)
                  }
                />
              </Field>

              {child.dateOfBirth && (
                <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  {calc.ecceEligible ? (
                    <>
                      <div className="font-semibold text-green-600">
                        ✓ ECCE Eligible
                      </div>

                      <div className="mt-1 text-xs text-slate-600">
                        ECCE Period:
                        <br />
                        {calc.ecceStartDate} - {calc.ecceEndDate}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-red-600">
                        ✗ Not ECCE Eligible
                      </div>

                      <div className="mt-1 text-xs text-slate-600">
                        Expected ECCE Start:
                        <br />
                        {calc.ecceStartDate}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Field
              label="Days attending per week"
              htmlFor={`${child.id}-days`}
            >
              <SelectInput
                id={`${child.id}-days`}
                value={child.daysPerWeek}
                onChange={(e) =>
                  update(
                    "daysPerWeek",
                    Number(e.target.value) as DaysPerWeek
                  )
                }
              >
                {DAYS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field label="Monthly fee (€)" htmlFor={`${child.id}-fee`}>
              <NumberInput
                id={`${child.id}-fee`}
                placeholder="0.00"
                value={child.monthlyFee || ""}
                onChange={(e) =>
                  update(
                    "monthlyFee",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </Field>

            <Field
              label="Sibling discount (%)"
              htmlFor={`${child.id}-sibling`}
              hint="Applied to the monthly fee before ECCE and NCS"
            >
              <NumberInput
                id={`${child.id}-sibling`}
                placeholder="0"
                min={0}
                max={100}
                step="0.1"
                value={child.siblingDiscountPercent || ""}
                onChange={(e) =>
                  update(
                    "siblingDiscountPercent",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </Field>

            <Field
              label="NCS hourly rate (€)"
              htmlFor={`${child.id}-rate`}
              hint="National Childcare Scheme rate"
            >
              <NumberInput
                id={`${child.id}-rate`}
                placeholder="0.00"
                step="0.01"
                value={child.ncsHourlyRate || ""}
                onChange={(e) =>
                  update(
                    "ncsHourlyRate",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </Field>

            <Field
              label="Term time hours / week"
              htmlFor={`${child.id}-term`}
            >
              <NumberInput
                id={`${child.id}-term`}
                placeholder="0"
                step="0.5"
                value={child.termTimeHoursPerWeek || ""}
                onChange={(e) =>
                  update(
                    "termTimeHoursPerWeek",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </Field>

            <Field
              label="Non term time hours / week"
              htmlFor={`${child.id}-nonterm`}
            >
              <NumberInput
                id={`${child.id}-nonterm`}
                placeholder="0"
                step="0.5"
                value={child.nonTermTimeHoursPerWeek || ""}
                onChange={(e) =>
                  update(
                    "nonTermTimeHoursPerWeek",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </Field>
          </div>
        </section>

        <section className="flex flex-col">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Monthly breakdown
          </h3>

          <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-2">
            <StatRow
              label="Gross monthly fee"
              value={formatCurrency(calc.grossFee)}
            />

            {calc.siblingDiscountAmount > 0 && (
              <StatRow
                label={`Sibling discount (${calc.siblingDiscountPercent}%)`}
                value={`−${formatCurrency(
                  calc.siblingDiscountAmount
                )}`}
                variant="muted"
              />
            )}

            <StatRow
              label="Fee after discount"
              value={formatCurrency(calc.fee)}
            />

            <StatRow
              label="ECCE funding (September - June)"
              value={formatCurrency(calc.ecceFunding)}
            />

            <StatRow
              label="NCS funding"
              value={formatCurrency(calc.ncsFunding)}
            />

            <StatRow
              label="Parent contribution"
              value={formatCurrency(
                calc.parentContribution
              )}
              variant="highlight"
            />
          </div>

          <div className="mt-3">
            <p className="text-xs text-slate-500">
              Avg. weekly hours:{" "}
              <span className="font-medium text-slate-700">
                {formatHours(calc.averageWeeklyHours)} hrs
              </span>
            </p>

            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              ECCE funding applies during the ECCE programme year
              (September to June only).
              <br />
              <br />
              NCS and ECCE funding amounts shown are estimates only
              and may vary depending on approved funding rates,
              attendance patterns and eligibility.
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}