import { addMonths } from 'date-fns'
import { annuityPayment, effectiveActual, monthlyRate } from './annuity'
import type { CalcResult, LoanParams, ScheduleRow } from '@/types/loan'

/** Округление до копеек (2 знака). */
const r2 = (n: number) => Math.round(n * 100) / 100

export function resolveTermMonths(p: LoanParams): number {
  if (p.termMonths <= 0) throw new Error('Срок должен быть больше нуля')
  return Math.floor(p.termMonths)
}

export function buildSchedule(p: LoanParams): CalcResult {
  const totalMonths = resolveTermMonths(p)
  const i = monthlyRate(p.rate)

  const minPayment = r2(annuityPayment(p.amount, p.rate, totalMonths))

  // Эффективный факт. платёж (для systematic). Для остальных режимов не используется.
  const effectiveActualPay =
    p.earlyMode === 'systematic' ? effectiveActual(p.actualPayment, minPayment) : 0

  let balance = p.amount
  let scheduledPayment = minPayment

  const rows: ScheduleRow[] = []
  let totalInterest = 0
  let totalPaid = 0

  for (let month = 1; month <= totalMonths; month++) {
    if (balance <= 0) break

    const openingBalance = balance
    const interest = r2(openingBalance * i)
    const date = addMonths(p.firstPaymentDate, month - 1)

    let sched = scheduledPayment
    let early = 0

    if (p.earlyMode === 'systematic') {
      early = Math.max(effectiveActualPay - sched, 0)
    } else if (p.earlyMode === 'once' && month === p.onceMonth) {
      early = p.onceAmount
    }

    const principalFromSched = Math.max(sched - interest, 0)
    const principal = Math.min(principalFromSched, openingBalance)

    const closingAfterPlan = openingBalance - principal
    const actualEarly = Math.min(early, Math.max(closingAfterPlan, 0))
    const closingBalance = Math.max(closingAfterPlan - actualEarly, 0)

    const totalPayment = r2(interest + principal + actualEarly)

    rows.push({
      month,
      date,
      openingBalance: r2(openingBalance),
      interest,
      scheduledPayment: r2(sched),
      principal: r2(principal),
      earlyPayment: r2(actualEarly),
      totalPayment,
      closingBalance: r2(closingBalance),
    })

    totalInterest += interest
    totalPaid += totalPayment
    balance = closingBalance

    if (
      p.earlyMode === 'systematic' &&
      p.strategy === 'reducePayment' &&
      balance > 0
    ) {
      const remaining = totalMonths - month
      if (remaining > 0) {
        sched = annuityPayment(balance, p.rate, remaining)
        scheduledPayment = sched
      }
    }
  }

  return {
    rows,
    actualMonths: rows.length,
    totalInterest: r2(totalInterest),
    totalPaid: r2(totalPaid),
    minPayment,
  }
}