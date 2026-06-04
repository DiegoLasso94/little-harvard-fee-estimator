export type DaysPerWeek = 2 | 3 | 4 | 5;

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
  grossFee: number;
  siblingDiscountPercent: number;
  siblingDiscountAmount: number;

  fee: number;

  ecceFunding: number;
  ncsFunding: number;

  parentContribution: number;
  averageWeeklyHours: number;

  ecceEligible: boolean;
  ecceStartDate: string;
  ecceEndDate: string;
}

export interface FamilySummary {
  totalGrossFees: number;
  totalSiblingDiscount: number;
  totalFees: number;
  totalEcceFunding: number;
  totalNcsFunding: number;
  estimatedMonthlyInvoice: number;
}
