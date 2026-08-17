import type { Child, DaysPerWeek } from "./types";

export interface FutureChange {
  id: string;
  effectiveFrom: string;
  monthlyFee?: number;
  ncsHourlyRate?: number;
  termTimeHoursPerWeek?: number;
  nonTermTimeHoursPerWeek?: number;
  daysPerWeek?: DaysPerWeek;
  ecceFunding?: number;
}

export function parseEffectiveFrom(value: string): Date | null {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const numeric = Number(value);

    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return undefined;
}

export function getSortedFutureChanges(child: Child): FutureChange[] {
  return [...(child.futureChanges ?? [])].sort((a, b) => {
    const left = parseEffectiveFrom(a.effectiveFrom)?.getTime() ?? 0;
    const right = parseEffectiveFrom(b.effectiveFrom)?.getTime() ?? 0;

    return left - right;
  });
}

export function getEffectiveChildForMonth(
  child: Child,
  year: number,
  month: number
): Child {
  const targetDate = new Date(year, month, 1);
  const effective: Child = { ...child, futureChanges: [...(child.futureChanges ?? [])] };

  const sortedChanges = getSortedFutureChanges(effective);

  for (const change of sortedChanges) {
    const changeDate = parseEffectiveFrom(change.effectiveFrom);

    if (!changeDate || changeDate > targetDate) {
      continue;
    }

    const monthlyFee = toFiniteNumber(change.monthlyFee);
    const ncsHourlyRate = toFiniteNumber(change.ncsHourlyRate);
    const termTimeHoursPerWeek = toFiniteNumber(change.termTimeHoursPerWeek);
    const nonTermTimeHoursPerWeek = toFiniteNumber(change.nonTermTimeHoursPerWeek);
    const daysPerWeek = Number(change.daysPerWeek);
    const ecceFunding = toFiniteNumber(change.ecceFunding);

    if (monthlyFee !== undefined) {
      effective.monthlyFee = monthlyFee;
    }

    if (ncsHourlyRate !== undefined) {
      effective.ncsHourlyRate = ncsHourlyRate;
    }

    if (termTimeHoursPerWeek !== undefined) {
      effective.termTimeHoursPerWeek = termTimeHoursPerWeek;
    }

    if (nonTermTimeHoursPerWeek !== undefined) {
      effective.nonTermTimeHoursPerWeek = nonTermTimeHoursPerWeek;
    }

    if ([2, 3, 4, 5].includes(daysPerWeek)) {
      effective.daysPerWeek = daysPerWeek as DaysPerWeek;
    }

    if (ecceFunding !== undefined) {
      effective.ecceFundingOverride = ecceFunding;
    }
  }

  return effective;
}

export function getCurrentEffectiveChild(child: Child): Child {
  const now = new Date();

  return getEffectiveChildForMonth(
    child,
    now.getFullYear(),
    now.getMonth()
  );
}

export function getValueForMonth(
  child: Child,
  year: number,
  month: number,
  key: keyof Pick<
    Child,
    | "monthlyFee"
    | "ncsHourlyRate"
    | "termTimeHoursPerWeek"
    | "nonTermTimeHoursPerWeek"
    | "daysPerWeek"
  >
): number | string | DaysPerWeek {
  const effective = getEffectiveChildForMonth(child, year, month);

  return effective[key];
}

export function getUpdatedMonthNote(
  child: Child,
  year: number,
  month: number
): string {
  const targetDate = new Date(year, month, 1);

  const matchingChange = getSortedFutureChanges(child)
    .filter((change) => {
      const effectiveDate = parseEffectiveFrom(change.effectiveFrom);

      return effectiveDate && effectiveDate <= targetDate;
    })
    .at(-1);

  if (!matchingChange) {
    return "";
  }

  const changeDate = parseEffectiveFrom(matchingChange.effectiveFrom);

  if (!changeDate) {
    return "";
  }

  const sameMonth =
    changeDate.getFullYear() === year &&
    changeDate.getMonth() === month;

  return sameMonth ? "Configuration updated" : "";
}
