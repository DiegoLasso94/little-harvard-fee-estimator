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
  // September -> June
  return month >= 8 || month <= 5;
}

function getEcceStartYear(
  dateOfBirth: string
): number {
  const dob = new Date(dateOfBirth);

  return dob.getFullYear() + 3;
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

    const isProgrammeMonth =
      isEcceMonth(monthInfo.month);

    children.forEach((child) => {
      const calc = calculateChild(child);

      fee += calc.fee;

      const ecceEligible =
        isEcceEligibleForMonth(
          child,
          monthInfo.year,
          monthInfo.month
        );

      let weeklyHours: number;

      // July & August
      if (
        monthInfo.month === 6 || // July
        monthInfo.month === 7 // August
      ) {
        weeklyHours =
          child.nonTermTimeHoursPerWeek;
      }
      // ECCE active during programme year
      else if (ecceEligible) {
        weeklyHours = Math.max(
          0,
          child.nonTermTimeHoursPerWeek - 15
        );
      }
      // Not receiving ECCE
      else {
        weeklyHours =
          child.termTimeHoursPerWeek;
      }

      const monthlyNcs =
        weeklyHours *
        child.ncsHourlyRate *
        weeks;

      ncs += monthlyNcs;

      if (
        ecceEligible &&
        isProgrammeMonth
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