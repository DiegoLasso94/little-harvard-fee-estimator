# Childcare Fee Calculator

A Next.js 15 app for estimating Irish childcare fees, ECCE funding, NCS funding, and parent contributions across multiple children.

## Features

- Add multiple children with individual fee and attendance details
- Automatic ECCE funding by days attending (2–5 days per week)
- NCS funding from term and non-term weekly hours
- Per-child breakdown and family summary with estimated monthly invoice
- Responsive card-based UI built with Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Calculations

| Item | Formula |
|------|---------|
| ECCE funding | Fixed monthly amount by days/week (2→€98.04 … 5→€245.10) |
| Average weekly hours | `((termHours × 38) + (nonTermHours × 14)) / 52` |
| Monthly NCS funding | `averageWeeklyHours × hourlyRate × 52 / 12` |
| Fee after sibling discount | `monthlyFee × (1 − siblingDiscount% / 100)` |
| Parent contribution | `max(0, fee after discount − ECCE − NCS)` |

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
