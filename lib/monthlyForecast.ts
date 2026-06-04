import { calculateChild } from "./calculations";
import type { Child } from "./types";

export interface MonthlyForecastRow {
  month: string;
  year: number;
  Weeks: number;
  fee: number;
  ecce: number;
  ncs: number;
  contribution: number;
}

function countWeeks(year: number, month: number): number {
  let sundays = 0;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    if (date.getDay() === 0) {
      sundays++;
    }
  }

  return sundays;
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
  // September (8) to June (5)
  return month >= 8 || month <= 5;
}

export function generateMonthlyForecast(
  children: Child[]
): MonthlyForecastRow[] {
  const months = getNext12Months();

  return months.map((monthInfo) => {
    let fee = 0;
    let ecce = 0;
    let ncs = 0;

    const sundays = countSundays(
      monthInfo.year,
      monthInfo.month
    );

    children.forEach((child) => {
      const calc = calculateChild(child);

      fee += calc.fee;

      const useTermHours =
        isEcceMonth(monthInfo.month);

      const weeklyHours = useTermHours
        ? child.termTimeHoursPerWeek
        : child.nonTermTimeHoursPerWeek;

      const monthlyNcs =
        weeklyHours *
        child.ncsHourlyRate *
        Weeks;

      ncs += monthlyNcs;

      if (
        useTermHours &&
        calc.ecceEligible
      ) {
        ecce += calc.ecceFunding;
      }
    });

    return {
      month: monthInfo.name,
      year: monthInfo.year,
      Weeks,
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