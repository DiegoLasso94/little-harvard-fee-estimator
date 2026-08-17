"use client";

import { useState } from "react";
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
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [draft, setDraft] = useState({
    id: "",
    effectiveFrom: "",
    monthlyFee: "",
    ncsHourlyRate: "",
    termTimeHoursPerWeek: "",
    nonTermTimeHoursPerWeek: "",
    daysPerWeek: "",
    ecceFunding: "",
  });

  const update = <K extends keyof Child>(key: K, value: Child[K]) => {
    onChange({ ...child, [key]: value });
  };

  const saveChange = () => {
    if (!draft.effectiveFrom) {
      return;
    }

    const existing = child.futureChanges ?? [];
    const newChange = {
      id: draft.id || crypto.randomUUID(),
      effectiveFrom: draft.effectiveFrom,
      monthlyFee:
        draft.monthlyFee === "" ? undefined : Number(draft.monthlyFee),
      ncsHourlyRate:
        draft.ncsHourlyRate === "" ? undefined : Number(draft.ncsHourlyRate),
      termTimeHoursPerWeek:
        draft.termTimeHoursPerWeek === "" ? undefined : Number(draft.termTimeHoursPerWeek),
      nonTermTimeHoursPerWeek:
        draft.nonTermTimeHoursPerWeek === "" ? undefined : Number(draft.nonTermTimeHoursPerWeek),
      daysPerWeek:
        draft.daysPerWeek === "" ? undefined : (Number(draft.daysPerWeek) as DaysPerWeek),
      ecceFunding:
        draft.ecceFunding === "" ? undefined : Number(draft.ecceFunding),
    };

    const updatedChanges = draft.id
      ? existing.map((item) =>
          item.id === draft.id ? newChange : item
        )
      : [...existing, newChange];

    onChange({
      ...child,
      futureChanges: updatedChanges,
    });

    setDraft({
      id: "",
      effectiveFrom: "",
      monthlyFee: "",
      ncsHourlyRate: "",
      termTimeHoursPerWeek: "",
      nonTermTimeHoursPerWeek: "",
      daysPerWeek: "",
      ecceFunding: "",
    });
    setShowChangeForm(false);
  };

  const removeChange = (changeId: string) => {
    onChange({
      ...child,
      futureChanges: (child.futureChanges ?? []).filter(
        (item) => item.id !== changeId
      ),
    });
  };

  const editChange = (change: NonNullable<Child["futureChanges"]>[number]) => {
    setDraft({
      id: change.id,
      effectiveFrom: change.effectiveFrom,
      monthlyFee: change.monthlyFee?.toString() ?? "",
      ncsHourlyRate: change.ncsHourlyRate?.toString() ?? "",
      termTimeHoursPerWeek: change.termTimeHoursPerWeek?.toString() ?? "",
      nonTermTimeHoursPerWeek: change.nonTermTimeHoursPerWeek?.toString() ?? "",
      daysPerWeek: change.daysPerWeek?.toString() ?? "",
      ecceFunding: change.ecceFunding?.toString() ?? "",
    });
    setShowChangeForm(true);
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

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Funding & Fee Changes
                </h4>
                <p className="text-xs text-slate-500">
                  Configure the funding rates and fee changes that apply to this child.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowChangeForm((value) => !value)}
                className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                + Add Change
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Configuration
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-500">Monthly Fee</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatCurrency(child.monthlyFee)}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-500">NCS Hourly Rate</div>
                  <div className="text-sm font-semibold text-slate-800">
                    €{child.ncsHourlyRate.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-500">NCS Hours/Week</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatHours(child.termTimeHoursPerWeek)}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-500">ECCE Funding</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatCurrency(
                      calculateChild(child).ecceFunding
                    )}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
                  <div className="text-[11px] text-slate-500">ECCE Days/Week</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {child.daysPerWeek} days
                  </div>
                </div>
              </div>
            </div>

            {showChangeForm && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Effective From" htmlFor={`${child.id}-effective-from`}>
                    <TextInput
                      id={`${child.id}-effective-from`}
                      type="date"
                      value={draft.effectiveFrom}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          effectiveFrom: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <div />

                  <Field label="Monthly Fee" htmlFor={`${child.id}-future-fee`}>
                    <NumberInput
                      id={`${child.id}-future-fee`}
                      placeholder="Leave blank to keep current fee"
                      value={draft.monthlyFee}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          monthlyFee: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="NCS Hourly Rate" htmlFor={`${child.id}-future-rate`}>
                    <NumberInput
                      id={`${child.id}-future-rate`}
                      placeholder="Leave blank to keep current rate"
                      value={draft.ncsHourlyRate}
                      step="0.01"
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          ncsHourlyRate: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="NCS Hours/Week" htmlFor={`${child.id}-future-term`}>
                    <NumberInput
                      id={`${child.id}-future-term`}
                      placeholder="Leave blank to keep current hours"
                      value={draft.termTimeHoursPerWeek}
                      step="0.5"
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          termTimeHoursPerWeek: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="NCS Hours/Week (Non-term)" htmlFor={`${child.id}-future-nonterm`}>
                    <NumberInput
                      id={`${child.id}-future-nonterm`}
                      placeholder="Leave blank to keep current hours"
                      value={draft.nonTermTimeHoursPerWeek}
                      step="0.5"
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          nonTermTimeHoursPerWeek: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="ECCE Funding" htmlFor={`${child.id}-future-ecce-funding`}>
                    <NumberInput
                      id={`${child.id}-future-ecce-funding`}
                      placeholder="Leave blank to keep current ECCE"
                      value={draft.ecceFunding}
                      step="0.01"
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          ecceFunding: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="ECCE Days/Week" htmlFor={`${child.id}-future-days`}>
                    <SelectInput
                      id={`${child.id}-future-days`}
                      value={draft.daysPerWeek}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          daysPerWeek: e.target.value,
                        }))
                      }
                    >
                      <option value="">Leave blank to keep current</option>
                      {DAYS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChangeForm(false)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveChange}
                    className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Save change
                  </button>
                </div>
              </div>
            )}

            {(child.futureChanges ?? []).length > 0 && (
              <div className="mt-4 space-y-2">
                {child.futureChanges!.map((change) => (
                  <div
                    key={change.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {change.effectiveFrom}
                      </div>
                      <div className="text-xs text-slate-500">
                        {[
                          change.monthlyFee !== undefined ? "Fee" : null,
                          change.ncsHourlyRate !== undefined ? "NCS" : null,
                          change.daysPerWeek !== undefined ? "ECCE" : null,
                        ]
                          .filter(Boolean)
                          .join(" • ") || "No values changed"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editChange(change)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeChange(change.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              label="ECCE Days per week"
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
                min={0}
                max={45}
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
                min={0}
                max={45}
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