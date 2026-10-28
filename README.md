# Loan Graph

[![Deploy](https://github.com/edgythorn/loan-graph/actions/workflows/deploy.yml/badge.svg)](https://github.com/edgythorn/loan-graph/actions/workflows/deploy.yml)

**🔗 Live demo: [loan.work.gd](https://loan.work.gd/)** · **🔗 Рабочая версия: [loan.work.gd](https://loan.work.gd/)**

[English](#english) · [Русский](#русский)

---

## English

A web app for calculating loan repayment schedules with early repayments.

### Features

- Annuity schedule based on amount, rate, and term.
- Term can be set in months, years, or as an end date.
- Early repayments:
  - **one-time** — a fixed amount in a specific month;
  - **recurring** — an actual monthly payment above the minimum.
- Strategies:
  - **reduce payment** (with capitalization — the reduced payment is recalculated and the difference goes back into early repayment);
  - **reduce term**.
- Multiple independent calculations in tabs, each with its own parameters.
- Payment schedule and summary (term, interest, savings).
- PWA: installable, works offline.
- Calculations are saved to `localStorage`.
- Shareable links: encode a calculation into the URL and share it.
- Rename tabs.

### Stack

- Vite 8, React 19, TypeScript 6
- Tailwind CSS 4, shadcn/ui (Base UI, Nova preset)
- Zustand (state + persist)
- date-fns
- Vitest, vite-plugin-pwa

### Getting started

```bash
    npm install
    npm run dev
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build (`tsc -b && vite build`) |
| `npm run preview` | Preview the production build |
| `npm test` | Run tests (Vitest) |
| `npm run lint` | Lint (Oxlint) |

### Structure

```
    src/
    ├── components/
    │   ├── params/        # Parameters panel
    │   ├── results/       # Schedule and summary
    │   ├── tabs/          # Calculation tabs
    │   └── ui/            # shadcn components
    ├── lib/
    │   ├── calc/          # Annuity, schedule, formatters
    │   ├── config/        # Defaults
    │   └── store/         # Zustand store
    └── types/             # LoanParams, ScheduleRow, CalcResult
```

### Calculation logic

1. Minimum payment — annuity based on the remaining balance and remaining term.
2. Monthly interest — `balance × rate / 12`.
3. Early repayment:
   - `one-time` — specified amount in the specified month;
   - `recurring` — `max(actual payment − scheduled payment, 0)`.
4. With **reduce payment**, after each early repayment the annuity is recalculated for the remaining term.
5. With **reduce term**, the payment stays the same and the number of months shrinks.
6. The loop stops when the balance reaches ≤ 0. No negative values.

### Tests

The core (`src/lib/calc/schedule.ts`) is covered by Vitest: baseline annuity, recurring and one-time early repayments. Run with `npm test`.

### License

MIT

---

## Русский

Веб-приложение для расчёта графика платежей по кредиту с досрочными погашениями.

### Возможности

- Аннуитетный график по сумме, ставке и сроку.
- Срок задаётся в месяцах, годах или датой окончания.
- Досрочные погашения:
  - **разово** — фиксированная сумма в конкретный месяц;
  - **системно** — фактический месячный платёж сверх минимального.
- Стратегии:
  - **снижение платежа** (с капитализацией — уменьшенный платёж пересчитывается, разница снова уходит в досрочку);
  - **сокращение срока**.
- Несколько независимых расчётов на вкладках, каждый со своими параметрами.
- График платежей и сводка (срок, проценты, экономия).
- PWA: устанавливается, работает оффлайн.
- Сохранение расчётов в `localStorage`.
- Ссылки для шаринга: расчёт кодируется в URL и передаётся по ссылке.
- Переименование вкладок.

### Стек

- Vite 8, React 19, TypeScript 6
- Tailwind CSS 4, shadcn/ui (Base UI, пресет Nova)
- Zustand (состояние + persist)
- date-fns
- Vitest, vite-plugin-pwa

### Запуск

```bash
    npm install
    npm run dev
```

### Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Дев-сервер Vite |
| `npm run build` | Сборка (`tsc -b && vite build`) |
| `npm run preview` | Просмотр собранной версии |
| `npm test` | Прогон тестов (Vitest) |
| `npm run lint` | Линтер (Oxlint) |

### Структура

```
    src/
    ├── components/
    │   ├── params/        # Панель параметров
    │   ├── results/       # График и сводка
    │   ├── tabs/          # Вкладки-расчёты
    │   └── ui/            # shadcn-компоненты
    ├── lib/
    │   ├── calc/          # Аннуитет, график, форматтеры
    │   ├── config/        # Дефолты
    │   └── store/         # Zustand-стор
    └── types/             # Типы LoanParams, ScheduleRow, CalcResult
```

### Логика расчёта

1. Минимальный платёж — аннуитет от остатка и оставшегося срока.
2. Проценты за месяц — `остаток × ставка / 12`.
3. Досрочка:
   - `разово` — указанная сумма в указанный месяц;
   - `системно` — `max(факт. платёж − платёж по графику, 0)`.
4. При **снижении платежа** после досрочки аннуитет пересчитывается на оставшийся срок.
5. При **сокращении срока** платёж не меняется, сокращается количество месяцев.
6. Цикл останавливается, когда остаток ≤ 0. Отрицательных значений нет.

### Тесты

Ядро (`src/lib/calc/schedule.ts`) покрыто Vitest: базовый аннуитет, систематические и разовые досрочки. Запуск — `npm test`.

### Лицензия

MIT