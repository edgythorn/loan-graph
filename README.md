# Loan Graph

A web app for calculating loan repayment schedules with early repayments.

## Features

- Annuity schedule based on amount, rate, and term.
- Term can be set in months, years, or as an end date.
- Early repayments:
  - **one-time** — a fixed amount in a specific month;
  - **recurring** — an actual monthly payment above the minimum;
- Strategies:
  - **reduce payment** (with capitalization — the reduced payment is recalculated and the difference goes back into early repayment);
  - **reduce term**.
- Multiple independent calculations in tabs, each with its own parameters.
- Payment schedule and summary (term, interest, savings).
- Calculations are saved to `localStorage`.

## Stack

- Vite 8, React 19, TypeScript 6
- Tailwind CSS 4, shadcn/ui (Base UI, Nova preset)
- Zustand (state + persist)
- date-fns
- Vitest

## Getting started

```bash
npm install
npm run dev