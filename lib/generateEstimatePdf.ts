import type { Child } from "./types";

type JsPDFModule = typeof import("jspdf");
type AutoTableFn = typeof import("jspdf-autotable").default;

const BRAND_RGB: [number, number, number] = [0, 105, 198];
const MARGIN = 14;
const PAGE_WIDTH = 210;

function displayName(child: Child, index: number): string {
  return child.name.trim() || `Child ${index + 1}`;
}

function getTableEndY(
  doc: InstanceType<JsPDFModule["jsPDF"]>,
  fallback: number
): number {
  const plugin = doc as InstanceType<JsPDFModule["jsPDF"]> & {
    lastAutoTable?: { finalY: number };
  };
  return plugin.lastAutoTable?.finalY ?? fallback;
}

function addPageIfNeeded(
  doc: InstanceType<JsPDFModule["jsPDF"]>,
  y: number,
  required = 40
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + required > pageHeight - MARGIN) {
    doc.addPage();
    return MARGIN + 8;
  }
  return y;
}

export async function generateEstimatePdf(children: Child[]): Promise<void> {
  const [
    { jsPDF },
    autoTableModule,
    { calculateChild, calculateFamilySummary },
    format,
    { generateMonthlyForecast },
  ] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    import("./calculations"),
    import("./format"),
    import("./monthlyForecast"),
  ]);

  const autoTable = autoTableModule.default as AutoTableFn;
  const { formatCurrencyPdf, formatDate, formatGeneratedAt, formatHours } = format;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const summary = calculateFamilySummary(children);
  let y = MARGIN;

  doc.setFontSize(20);
  doc.setTextColor(...BRAND_RGB);
  doc.text("Childcare Fee Estimate", MARGIN, y);

  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated ${formatGeneratedAt()}`, MARGIN, y);
  doc.text("Monthly estimate - figures for planning purposes only", MARGIN, y + 5);

  y += 14;

  children.forEach((child, index) => {
    const calc = calculateChild(child);
    const name = displayName(child, index);

    y = addPageIfNeeded(doc, y, 70);

    doc.setFontSize(13);
    doc.setTextColor(...BRAND_RGB);
    doc.text(name, MARGIN, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [["Child details", ""]],
      body: [
        ["Date of birth", formatDate(child.dateOfBirth)],
        ["Days attending per week", String(child.daysPerWeek)],
        ["Gross monthly fee", formatCurrencyPdf(calc.grossFee)],
        [
          "Sibling discount",
          calc.siblingDiscountAmount > 0
            ? `${calc.siblingDiscountPercent}% (-${formatCurrencyPdf(calc.siblingDiscountAmount)})`
            : "-",
        ],
        ["NCS hourly rate", formatCurrencyPdf(child.ncsHourlyRate)],
        ["Term time hours / week", formatHours(child.termTimeHoursPerWeek)],
        [
          "Non term time hours / week",
          formatHours(child.nonTermTimeHoursPerWeek),
        ],
        ["Avg. weekly hours", `${formatHours(calc.averageWeeklyHours)} hrs`],
      ],
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 2.5 },
      headStyles: {
        fillColor: BRAND_RGB,
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 62, fontStyle: "bold", textColor: [60, 60, 60] },
        1: { cellWidth: "auto" },
      },
    });

    y = getTableEndY(doc, y + 40) + 4;
    doc.setFillColor(255, 248, 235);
doc.roundedRect(
  MARGIN,
  y,
  PAGE_WIDTH - MARGIN * 2,
  22,
  2,
  2,
  "F"
);

doc.setFontSize(8);
doc.setTextColor(180, 100, 0);

doc.text(
  "ECCE funding applies during the ECCE programme year",
  MARGIN + 3,
  y + 6
);

doc.text(
  "(September to June only).",
  MARGIN + 3,
  y + 10
);

doc.text(
  "NCS and ECCE funding amounts shown are estimates only and",
  MARGIN + 3,
  y + 16
);

doc.text(
  "may vary depending on approved funding rates, attendance",
  MARGIN + 3,
  y + 20
);

doc.text(
  "patterns and eligibility.",
  MARGIN + 3,
  y + 24
);

y += 30;
    y = addPageIfNeeded(doc, y, 35);

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [["Monthly breakdown", "Amount"]],
      body: [
        ["Fee (after sibling discount)", formatCurrencyPdf(calc.fee)],
        ["ECCE funding", formatCurrencyPdf(calc.ecceFunding)],
        ["NCS funding", formatCurrencyPdf(calc.ncsFunding)],
        ["Estimated Monthly Payment", formatCurrencyPdf(calc.parentContribution)],
        ],
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: BRAND_RGB,
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { halign: "right", fontStyle: "bold" },
      },
      didParseCell(data) {
        if (
          data.section === "body" &&
          data.row.index === 3 &&
          data.column.index === 1 &&
          data.cell.styles
        ) {
          data.cell.styles.textColor = BRAND_RGB;
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    y = getTableEndY(doc, y + 30) + 10;
  });

  y = addPageIfNeeded(doc, y, 55);

  doc.setFontSize(14);
  doc.setTextColor(...BRAND_RGB);
  doc.text("Family summary", MARGIN, y);
  y += 4;

  const summaryRows: [string, string][] = [
    ["Total gross fees", formatCurrencyPdf(summary.totalGrossFees)],
  ];
  if (summary.totalSiblingDiscount > 0) {
    summaryRows.push([
      "Total sibling discount",
      `-${formatCurrencyPdf(summary.totalSiblingDiscount)}`,
    ]);
  }
  summaryRows.push(
    ["Total fees after discount", formatCurrencyPdf(summary.totalFees)],
    ["Total ECCE funding", formatCurrencyPdf(summary.totalEcceFunding)],
    ["Total NCS funding", formatCurrencyPdf(summary.totalNcsFunding)],
    [
      "Estimated monthly invoice",
      formatCurrencyPdf(summary.estimatedMonthlyInvoice),
    ]
  );

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    body: summaryRows,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3.5 },
    columnStyles: {
      0: { cellWidth: 95, fontStyle: "bold" },
      1: { halign: "right" },
    },
    didParseCell(data) {
      if (
        data.section === "body" &&
        data.row.index === summaryRows.length - 1 &&
        data.cell.styles
      ) {
        data.cell.styles.fillColor = [240, 247, 255];
        data.cell.styles.textColor = BRAND_RGB;
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 11;
      }
    },
  });
  doc.addPage();

const forecast =
  generateMonthlyForecast(children);

doc.setFontSize(14);
doc.setTextColor(...BRAND_RGB);
doc.text("12 Month Forecast", MARGIN, MARGIN);

autoTable(doc, {
  startY: MARGIN + 8,
  margin: {
    left: MARGIN,
    right: MARGIN,
  },
  head: [[
    "Month",
    "Weeks",
    "ECCE",
    "NCS",
    "Estimated Monthly Payment",
  ]],
  body: forecast.map((row) => [
    `${row.month} ${row.year}`,
    String(row.weeks),
    formatCurrencyPdf(row.ecce),
    formatCurrencyPdf(row.ncs),
    formatCurrencyPdf(row.contribution),
  ]),
  theme: "striped",
  styles: {
    fontSize: 9,
    cellPadding: 3,
  },
  headStyles: {
    fillColor: BRAND_RGB,
    textColor: 255,
    fontStyle: "bold",
  },
});

  y = getTableEndY(doc, y + 40) + 8;

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const disclaimer =
    "This estimate is based on the information entered in the calculator. Confirm all amounts with your childcare provider.";
  const lines = doc.splitTextToSize(disclaimer, PAGE_WIDTH - MARGIN * 2);
  doc.text(lines, MARGIN, y);

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      PAGE_WIDTH - MARGIN,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" }
    );
  }

  const dateSlug = new Date().toISOString().slice(0, 10);
  doc.save(`childcare-fee-estimate-${dateSlug}.pdf`);
}