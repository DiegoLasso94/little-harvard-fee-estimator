function countWeeks(year, month) {
  let weeks = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() === 0) weeks++;
  }
  return weeks;
}

function isEcceMonth(month) {
  return month >= 8 || month <= 5;
}

function getEcceStartYear(dob) {
  const dt = new Date(dob);
  return dt.getFullYear() + 3;
}

function isEcceEligibleForMonth(dob, year, month) {
  if (!dob) return false;
  const ecceStartYear = getEcceStartYear(dob);
  const forecastDate = new Date(year, month, 1);
  const ecceStartDate = new Date(ecceStartYear, 8, 1);
  const ecceEndDate = new Date(ecceStartYear + 2, 5, 30);
  return forecastDate >= ecceStartDate && forecastDate <= ecceEndDate;
}

function getMonthlyNcsFunding(weeklyHours, hourlyRate) {
  return (weeklyHours * hourlyRate * 52) / 12;
}

// Example child (from your screenshots)
const child = {
  dateOfBirth: '2023-03-21',
  daysPerWeek: 5,
  monthlyFee: 797.06,
  ncsHourlyRate: 2.14,
  termTimeHoursPerWeek: 12,
  nonTermTimeHoursPerWeek: 18,
};

// Use September 2026 -> July 2027 to match screenshots
const startYear = 2026;
const months = [8,9,10,11,0,1,2,3,4,5,6]; // Sep..Dec, Jan..Jun, Jul
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

console.log('Month | Sundays | weeklyHrs | weeklyAmt | monthly_by_weeks | monthly_annualized');
for (let i = 0; i < months.length; i++) {
  const m = months[i];
  const y = m >= 8 ? startYear : startYear + 1; // Sep-Dec -> 2026, Jan-Jul -> 2027
  const weeks = countWeeks(y, m);

  let weeklyHours;
  if (m === 6 || m === 7) { // July or August
    weeklyHours = child.nonTermTimeHoursPerWeek;
  } else if (isEcceEligibleForMonth(child.dateOfBirth, y, m)) {
    weeklyHours = child.termTimeHoursPerWeek;
  } else {
    weeklyHours = child.termTimeHoursPerWeek;
  }

  const weeklyAmt = weeklyHours * child.ncsHourlyRate;
  const monthly_by_weeks = weeklyHours * child.ncsHourlyRate * weeks;
  const monthly_annualized = getMonthlyNcsFunding(weeklyHours, child.ncsHourlyRate);

  console.log(
    `${monthNames[m]} ${y} | ${weeks} | ${weeklyHours.toFixed(2)} | €${weeklyAmt.toFixed(2)} | €${monthly_by_weeks.toFixed(2)} | €${monthly_annualized.toFixed(2)}`
  );
}

// Also print the per-child monthly figure used in calculateChild
const avgWeekly = child.termTimeHoursPerWeek; // app shows avg weekly as term time hours
const childMonthlyNcs = getMonthlyNcsFunding(avgWeekly, child.ncsHourlyRate);
console.log('\nPer-child monthly NCS (using avg weekly hours): €' + childMonthlyNcs.toFixed(2));

process.exit(0);
