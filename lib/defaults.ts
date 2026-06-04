import type { Child, DaysPerWeek } from "./types";

let childCounter = 1;

function generateId(): string {
  return `child-${childCounter++}`;
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

/** Ensures every child has valid numeric fields (e.g. after schema changes). */
export function normalizeChild(child: Child): Child {
  const base = createEmptyChild(child.id);
  const days = Number(child.daysPerWeek);
  const validDays = [2, 3, 4, 5].includes(days) ? (days as DaysPerWeek) : base.daysPerWeek;

  return {
    ...base,
    ...child,
    name: child.name ?? "",
    dateOfBirth: child.dateOfBirth ?? "",
    monthlyFee: Number(child.monthlyFee) || 0,
    siblingDiscountPercent: Number(child.siblingDiscountPercent) || 0,
    daysPerWeek: validDays,
    ncsHourlyRate: Number(child.ncsHourlyRate) || 0,
    termTimeHoursPerWeek: Number(child.termTimeHoursPerWeek) || 0,
    nonTermTimeHoursPerWeek: Number(child.nonTermTimeHoursPerWeek) || 0,
  };
}
