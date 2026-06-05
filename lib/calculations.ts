import { normalizeChild } from "./defaults";
import type {
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

function isEcceEligible(dateOfBirth: string): boolean {
  if (!dateOfBirth) return false;

  const dob = new Date(dateOfBirth);
  const today = new Date();

  const ageInMonths =
    (today.getFullYear() - dob.getFullYear()) * 12 +
    (today.getMonth() - dob.getMonth());

  return ageInMonths >= 32 && ageInMonths < 66;
}

function getEcceDates(dateOfBirth: string) {
  if (!dateOfBirth) {
    return {
      eligible: false,
      startDate: "",
      endDate: "",
    };
  }

  const dob = new Date(dateOfBirth);

  const startYear =
    dob.getFullYear() + 3;

  return {
    eligible: isEcceEligible(dateOfBirth),
    startDate: `September ${startYear}`,
    endDate: `June ${startYear + 2}`,
  };
}

export function getEcceFunding(
  daysPerWeek: DaysPerWeek,
  dateOfBirth: string
): number {
  if (!isEcceEligible(dateOfBirth)) {
    return 0;
  }

  return ECCE_FUNDING_BY_DAYS[daysPerWeek];
}

export function getAverageWeeklyHours(
  termTimeHoursPerWeek: number,
  nonTermTimeHoursPerWeek: number
): number {
  return termTimeHoursPerWeek;
}

export function getMonthlyNcsFunding(
  weeklyHours: number,
  hourlyRate: number
): number {
  return (weeklyHours * hourlyRate * 52) / 12;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

export function applySiblingDiscount(
  monthlyFee: number,
  siblingDiscountPercent: number
): {
  grossFee: number;
  siblingDiscountPercent: number;
  siblingDiscountAmount: number;
  fee: number;
} {
  const grossFee = Math.max(0, monthlyFee);

  const percent = clampPercent(siblingDiscountPercent);

  const siblingDiscountAmount =
    grossFee * (percent / 100);

  const fee =
    grossFee - siblingDiscountAmount;

  return {
    grossFee,
    siblingDiscountPercent: percent,
    siblingDiscountAmount,
    fee,
  };
}

export function calculateChild(
  child: Child
): ChildCalculations {
  const c = normalizeChild(child);

  const {
    grossFee,
    siblingDiscountPercent,
    siblingDiscountAmount,
    fee,
  } = applySiblingDiscount(
    c.monthlyFee,
    c.siblingDiscountPercent
  );

  const ecceFunding = getEcceFunding(
    c.daysPerWeek,
    c.dateOfBirth
  );

  const ecceDates = getEcceDates(
    c.dateOfBirth
  );

  const averageWeeklyHours =
    getAverageWeeklyHours(
      c.termTimeHoursPerWeek,
      c.nonTermTimeHoursPerWeek
    );

  const ncsFunding =
    getMonthlyNcsFunding(
      averageWeeklyHours,
      c.ncsHourlyRate
    );

  const parentContribution =
    Math.max(
      0,
      fee - ecceFunding - ncsFunding
    );

  return {
    grossFee,
    siblingDiscountPercent,
    siblingDiscountAmount,
    fee,

    ecceFunding,
    ncsFunding,

    parentContribution,
    averageWeeklyHours,

    ecceEligible: ecceDates.eligible,
    ecceStartDate: ecceDates.startDate,
    ecceEndDate: ecceDates.endDate,
  };
}

export function calculateFamilySummary(
  children: Child[]
): FamilySummary {
  return children.reduce(
    (acc, child) => {
      const calc = calculateChild(child);

      return {
        totalGrossFees:
          acc.totalGrossFees +
          calc.grossFee,

        totalSiblingDiscount:
          acc.totalSiblingDiscount +
          calc.siblingDiscountAmount,

        totalFees:
          acc.totalFees +
          calc.fee,

        totalEcceFunding:
          acc.totalEcceFunding +
          calc.ecceFunding,

        totalNcsFunding:
          acc.totalNcsFunding +
          calc.ncsFunding,

        estimatedMonthlyInvoice:
          acc.estimatedMonthlyInvoice +
          calc.parentContribution,
      };
    },
    {
      totalGrossFees: 0,
      totalSiblingDiscount: 0,
      totalFees: 0,
      totalEcceFunding: 0,
      totalNcsFunding: 0,
      estimatedMonthlyInvoice: 0,
    }
  );
}