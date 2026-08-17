import assert from "node:assert/strict";
import test from "node:test";

import type { Child } from "./types";
import { getValueForMonth } from "./futureChanges.ts";

const baseChild: Child = {
  id: "1",
  name: "Test Child",
  dateOfBirth: "2020-09-01",
  monthlyFee: 1154,
  siblingDiscountPercent: 0,
  daysPerWeek: 5,
  ncsHourlyRate: 2.14,
  termTimeHoursPerWeek: 45,
  nonTermTimeHoursPerWeek: 45,
  futureChanges: [
    {
      id: "change-1",
      effectiveFrom: "2026-09-01",
      monthlyFee: 1254,
      ncsHourlyRate: 2.23,
    },
    {
      id: "change-2",
      effectiveFrom: "2027-01-01",
      ncsHourlyRate: 2.3,
    },
  ],
};

test("future changes keep previous values unless explicitly changed", () => {
  assert.equal(
    getValueForMonth(baseChild, 2026, 7, "monthlyFee"),
    1154
  );

  assert.equal(
    getValueForMonth(baseChild, 2026, 8, "monthlyFee"),
    1254
  );

  assert.equal(
    getValueForMonth(baseChild, 2027, 0, "ncsHourlyRate"),
    2.3
  );

  assert.equal(
    getValueForMonth(baseChild, 2026, 11, "ncsHourlyRate"),
    2.23
  );
});
