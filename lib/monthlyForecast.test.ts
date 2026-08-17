import assert from "node:assert/strict";
import test from "node:test";

import { generateMonthlyForecast } from "./monthlyForecast.ts";

const child = {
  id: "1",
  name: "Test Child",
  dateOfBirth: "2020-09-01",
  monthlyFee: 1200,
  siblingDiscountPercent: 0,
  daysPerWeek: 5,
  ncsHourlyRate: 3,
  termTimeHoursPerWeek: 20,
  nonTermTimeHoursPerWeek: 25,
};

test("monthly forecast should use the actual number of Sundays in each month for NCS", () => {
  const rows = generateMonthlyForecast([child]);
  const weeks = rows.map((row) => row.weeks);

  assert.ok(weeks.every((value) => value >= 4 && value <= 5));
  assert.ok(weeks.includes(4));
  assert.ok(weeks.includes(5));
});

test("monthly forecast should use term-time hours outside July and August, and non-term hours in July and August", () => {
  const rows = generateMonthlyForecast([child]);
  const july = rows.find((row) => row.month === "July");
  const september = rows.find((row) => row.month === "September");

  assert.ok(july);
  assert.ok(september);

  // non-term hours used in July/August
  assert.equal(
    july!.ncs,
    child.nonTermTimeHoursPerWeek * child.ncsHourlyRate * july!.weeks
  );

  // term-time hours used in the rest of the year
  assert.equal(
    september!.ncs,
    child.termTimeHoursPerWeek * child.ncsHourlyRate * september!.weeks
  );
});
