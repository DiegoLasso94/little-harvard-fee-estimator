/** @type {Record<string, string>} */
export const libFiles = {
  "lib/types.ts": `export type DaysPerWeek = 2 | 3 | 4 | 5;

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  monthlyFee: number;
  siblingDiscountPercent: number;
  daysPerWeek: DaysPerWeek;
  ncsHourlyRate: number;
  termTimeHoursPerWeek: number;
  nonTermTimeHoursPerWeek: number;
}

export interface ChildCalculations {
  fee: number;
  ecceFunding: number;
  ncsFunding: number;
  parentContribution: number;
  averageWeeklyHours: number;
}

export interface FamilySummary {
  totalFees: number;
  totalEcceFunding: number;
  totalNcsFunding: number;
  estimatedMonthlyInvoice: number;
}
`,
  "lib/calculations.ts": `import type {
  Child,
  ChildCalculations,
  DaysPerWeek,
  FamilySummary,
} from "./types";

const ECCE_FUNDING_BY_DAYS: Record<DaysPerWeek, number> = {
  2: 98.04,
  3: 147.06,
  4: 196.08,
  5: 245.1,
};

export function getEcceFunding(daysPerWeek: DaysPerWeek): number {
  return ECCE_FUNDING_BY_DAYS[daysPerWeek];
}

export function getAverageWeeklyHours(
  termTimeHoursPerWeek: number,
  nonTermTimeHoursPerWeek: number
): number {
  return (termTimeHoursPerWeek * 38 + nonTermTimeHoursPerWeek * 14) / 52;
}

export function getMonthlyNcsFunding(
  averageWeeklyHours: number,
  hourlyRate: number
): number {
  return (averageWeeklyHours * hourlyRate * 52) / 12;
}

export function calculateChild(child: Child): ChildCalculations {
  const fee = child.monthlyFee;
  const ecceFunding = getEcceFunding(child.daysPerWeek);
  const averageWeeklyHours = getAverageWeeklyHours(
    child.termTimeHoursPerWeek,
    child.nonTermTimeHoursPerWeek
  );
  const ncsFunding = getMonthlyNcsFunding(
    averageWeeklyHours,
    child.ncsHourlyRate
  );
  const parentContribution = fee - ecceFunding - ncsFunding;

  return {
    fee,
    ecceFunding,
    ncsFunding,
    parentContribution,
    averageWeeklyHours,
  };
}

export function calculateFamilySummary(children: Child[]): FamilySummary {
  return children.reduce(
    (acc, child) => {
      const calc = calculateChild(child);
      return {
        totalFees: acc.totalFees + calc.fee,
        totalEcceFunding: acc.totalEcceFunding + calc.ecceFunding,
        totalNcsFunding: acc.totalNcsFunding + calc.ncsFunding,
        estimatedMonthlyInvoice:
          acc.estimatedMonthlyInvoice + calc.parentContribution,
      };
    },
    {
      totalFees: 0,
      totalEcceFunding: 0,
      totalNcsFunding: 0,
      estimatedMonthlyInvoice: 0,
    }
  );
}
`,
  "lib/format.ts": `export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatHours(hours: number): string {
  return hours.toFixed(2);
}
`,
  "lib/defaults.ts": `import type { Child, DaysPerWeek } from "./types";

function generateId(): string {
  return \`child-\${Date.now()}-\${Math.random().toString(36).slice(2, 9)}\`;
}

export function createEmptyChild(id?: string): Child {
  return {
    id: id ?? generateId(),
    name: "",
    dateOfBirth: "",
    monthlyFee: 0,
    siblingDiscountPercent: 0,
    daysPerWeek: 5 as DaysPerWeek,
    ncsHourlyRate: 0,
    termTimeHoursPerWeek: 0,
    nonTermTimeHoursPerWeek: 0,
  };
}
`,
};

/** @type {Record<string, string>} */
export const appFiles = {
  "app/globals.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth antialiased;
  }

  body {
    @apply min-h-screen bg-slate-100 text-slate-900;
  }
}
`,
  "app/layout.tsx": `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Childcare Fee Calculator",
  description:
    "Calculate ECCE and NCS funding, parent contributions, and estimated monthly invoices for your family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} font-sans\`}
      >
        {children}
      </body>
    </html>
  );
}
`,
  "app/page.tsx": `import { CalculatorApp } from "@/components/CalculatorApp";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
              <CalculatorIcon />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                Ireland childcare
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Fee Calculator
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Estimate ECCE and NCS funding, parent contributions, and your
            family&apos;s monthly invoice. Add each child attending your
            service to see a full breakdown.
          </p>
        </div>
      </header>

      <main>
        <CalculatorApp />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        Figures are estimates for planning purposes. Confirm amounts with your
        childcare provider.
      </footer>
    </div>
  );
}

function CalculatorIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V12zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V12zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V12zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V12zM4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
      />
    </svg>
  );
}
`,
  "app/icon.tsx": `import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0069c6",
          borderRadius: 8,
          color: "white",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        €
      </div>
    ),
    { ...size }
  );
}
`,
};

/** @type {Record<string, string>} */
export const componentFiles = {
  "components/StatRow.tsx": `interface StatRowProps {
  label: string;
  value: string;
  variant?: "default" | "highlight" | "muted";
}

const variantStyles = {
  default: "text-slate-900",
  highlight: "text-brand-700 font-semibold",
  muted: "text-slate-500",
};

export function StatRow({ label, value, variant = "default" }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={\`text-sm tabular-nums \${variantStyles[variant]}\`}>
        {value}
      </span>
    </div>
  );
}
`,
  "components/ui/Field.tsx": `import { type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
}

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function TextInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return <input id={id} className={inputClassName} {...props} />;
}

export function NumberInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <input
      id={id}
      type="number"
      min={0}
      step="any"
      className={inputClassName}
      {...props}
    />
  );
}

export function SelectInput({
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { id: string }) {
  return (
    <select id={id} className={inputClassName} {...props}>
      {children}
    </select>
  );
}
`,
  "components/CalculatorApp.tsx": `"use client";

import { useState } from "react";
import { ChildCard } from "@/components/ChildCard";
import { FamilySummaryCard } from "@/components/FamilySummaryCard";
import { createEmptyChild } from "@/lib/defaults";
import type { Child } from "@/lib/types";

export function CalculatorApp() {
  const [children, setChildren] = useState<Child[]>(() => [createEmptyChild()]);

  const addChild = () => {
    setChildren((prev) => [...prev, createEmptyChild()]);
  };

  const updateChild = (id: string, updated: Child) => {
    setChildren((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const removeChild = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
          <FamilySummaryCard children={children} />
        </div>
      </div>
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
`,
  "components/FamilySummaryCard.tsx": `"use client";

import { calculateFamilySummary } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import type { Child } from "@/lib/types";

interface FamilySummaryCardProps {
  children: Child[];
}

export function FamilySummaryCard({ children }: FamilySummaryCardProps) {
  const summary = calculateFamilySummary(children);
  const childCount = children.length;

  return (
    <aside className="sticky top-6 overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-lg shadow-brand-900/20">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold">Family summary</h2>
        <p className="mt-0.5 text-sm text-brand-100">
          {childCount} {childCount === 1 ? "child" : "children"} on this plan
        </p>
      </div>
      <div className="space-y-1 px-5 py-4 sm:px-6">
        <div className="rounded-xl bg-white/10 px-4 py-1 backdrop-blur-sm">
          <SummaryRow label="Total fees" value={formatCurrency(summary.totalFees)} />
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
            Estimated monthly invoice
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-brand-700">
            {formatCurrency(summary.estimatedMonthlyInvoice)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Sum of parent contributions across all children
          </p>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2.5 last:border-0">
      <span className="text-sm text-brand-50">{label}</span>
      <span className="text-sm font-medium tabular-nums text-white">{value}</span>
    </div>
  );
}
`,
  "components/ChildCard.tsx": `"use client";

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
  const displayName = child.name.trim() || \`Child \${index + 1}\`;

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
            <h2 className="text-lg font-semibold text-slate-900">{displayName}</h2>
            <p className="text-xs text-slate-500">Child details & funding breakdown</p>
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
              <Field label="Child name" htmlFor={\`\${child.id}-name\`}>
                <TextInput
                  id={\`\${child.id}-name\`}
                  placeholder="e.g. Aoife Murphy"
                  value={child.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Date of birth" htmlFor={\`\${child.id}-dob\`}>
              <TextInput
                id={\`\${child.id}-dob\`}
                type="date"
                value={child.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </Field>
            <Field label="Days attending per week" htmlFor={\`\${child.id}-days\`}>
              <SelectInput
                id={\`\${child.id}-days\`}
                value={child.daysPerWeek}
                onChange={(e) =>
                  update("daysPerWeek", Number(e.target.value) as DaysPerWeek)
                }
              >
                {DAYS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Monthly fee (€)" htmlFor={\`\${child.id}-fee\`}>
              <NumberInput
                id={\`\${child.id}-fee\`}
                placeholder="0.00"
                value={child.monthlyFee || ""}
                onChange={(e) =>
                  update("monthlyFee", parseFloat(e.target.value) || 0)
                }
              />
            </Field>
            <Field
              label="NCS hourly rate (€)"
              htmlFor={\`\${child.id}-rate\`}
              hint="National Childcare Scheme rate"
            >
              <NumberInput
                id={\`\${child.id}-rate\`}
                placeholder="0.00"
                step="0.01"
                value={child.ncsHourlyRate || ""}
                onChange={(e) =>
                  update("ncsHourlyRate", parseFloat(e.target.value) || 0)
                }
              />
            </Field>
            <Field label="Term time hours / week" htmlFor={\`\${child.id}-term\`}>
              <NumberInput
                id={\`\${child.id}-term\`}
                placeholder="0"
                step="0.5"
                value={child.termTimeHoursPerWeek || ""}
                onChange={(e) =>
                  update("termTimeHoursPerWeek", parseFloat(e.target.value) || 0)
                }
              />
            </Field>
            <Field
              label="Non term time hours / week"
              htmlFor={\`\${child.id}-nonterm\`}
            >
              <NumberInput
                id={\`\${child.id}-nonterm\`}
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
            <StatRow label="Fee" value={formatCurrency(calc.fee)} />
            <StatRow label="ECCE funding" value={formatCurrency(calc.ecceFunding)} />
            <StatRow label="NCS funding" value={formatCurrency(calc.ncsFunding)} />
            <StatRow
              label="Parent contribution"
              value={formatCurrency(calc.parentContribution)}
              variant="highlight"
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Avg. weekly hours:{" "}
            <span className="font-medium text-slate-700">
              {formatHours(calc.averageWeeklyHours)} hrs
            </span>
          </p>
        </section>
      </div>
    </article>
  );
}
`,
};
