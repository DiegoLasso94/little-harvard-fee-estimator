import { calculateChild } from "./calculations";
import type { Child } from "./types";

const ECCE_FUNDING_BY_DAYS = {
  2: 98.04,
  3: 147.06,
  4: 196.08,
  5: 245.1,
} as const;

export interface MonthlyForecastRow {
  month: string;
  year: number;
  weeks: number;
  fee: number;
  ecce: number;
  ncs: number;
  contribution: number;
}

function countWeeks(year: number, month: number): number {
  let weeks = 0;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    if (date.getDay() === 0) {
      weeks++;
    }
  }

  return weeks;
}

function getNext12Months() {
  const today = new Date();

  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() + index,
      1
    );

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      name: date.toLocaleString("en-IE", {
        month: "long",
      }),
    };
  });
}

function isEcceMonth(month: number): boolean {
  // September (8) -> June (5)
  return month >= 8 || month <= 5;
}

function getEcceStartYear(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);

  return dob.getMonth() >= 8
    ? dob.getFullYear() + 3
    : dob.getFullYear() + 2;
}

function isEcceEligibleForMonth(
  child: Child,
  year: number,
  month: number
): boolean {
  if (!child.dateOfBirth) {
    return false;
  }

  const ecceStartYear =
    getEcceStartYear(child.dateOfBirth);

  const forecastDate = new Date(
    year,
    month,
    1
  );

  const ecceStartDate = new Date(
    ecceStartYear,
    8, // September
    1
  );

  const ecceEndDate = new Date(
    ecceStartYear + 2,
    5, // June
    30
  );

  return (
    forecastDate >= ecceStartDate &&
    forecastDate <= ecceEndDate
  );
}

export function generateMonthlyForecast(
  children: Child[]
): MonthlyForecastRow[] {
  const months = getNext12Months();

  return months.map((monthInfo) => {
    let fee = 0;
    let ecce = 0;
    let ncs = 0;

    const weeks = countWeeks(
      monthInfo.year,
      monthInfo.month
    );

    children.forEach((child) => {
      const calc = calculateChild(child);

      fee += calc.fee;

      const ecceActive =
        isEcceEligibleForMonth(
          child,
          monthInfo.year,
          monthInfo.month
        );

      const useTermHours =
        isEcceMonth(monthInfo.month);

      let weeklyHours = useTermHours
        ? child.termTimeHoursPerWeek
        : child.nonTermTimeHoursPerWeek;

      // When ECCE applies, reduce NCS claimable hours by 15
      if (ecceActive) {
        weeklyHours = Math.max(
          0,
          weeklyHours - 15
        );
      }

      const monthlyNcs =
        weeklyHours *
        child.ncsHourlyRate *
        weeks;

      ncs += monthlyNcs;

      // ECCE only pays September -> June
      if (
        ecceActive &&
        useTermHours
      ) {
        ecce +=
          ECCE_FUNDING_BY_DAYS[
            child.daysPerWeek
          ];
      }
    });

    return {
      month: monthInfo.name,
      year: monthInfo.year,
      weeks,
      fee,
      ecce,
      ncs,
      contribution: Math.max(
        0,
        fee - ecce - ncs
      ),
    };
  });
}