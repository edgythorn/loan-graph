/**
 * Месячная ставка из годовой (в долях, не в %).
 */
export function monthlyRate(annualPercent: number): number {
  return annualPercent / 100 / 12
}

/**
 * Аннуитетный платёж.
 * @param principal сумма кредита
 * @param annualPercent годовая ставка, %
 * @param months срок в месяцах
 */
export function annuityPayment(
  principal: number,
  annualPercent: number,
  months: number,
): number {
  if (months <= 0) return principal
  const i = monthlyRate(annualPercent)
  if (i === 0) return principal / months
  const k = Math.pow(1 + i, months)
  return (principal * i * k) / (k - 1)
}

/**
 * Остаток долга после n платежей (для режима "до даты").
 */
export function remainingAfter(
  principal: number,
  annualPercent: number,
  totalMonths: number,
  paidMonths: number,
): number {
  const i = monthlyRate(annualPercent)
  const p = annuityPayment(principal, annualPercent, totalMonths)
  if (i === 0) return principal - p * paidMonths
  const k = Math.pow(1 + i, paidMonths)
  return principal * k - p * ((k - 1) / i)
}

/**
 * Эффективный факт. платёж: max(введённый, minPayment). 0/undefined → minPayment.
 */
export const effectiveActual = (
  actualPayment: number | undefined,
  minPayment: number,
): number => Math.max(actualPayment || 0, minPayment)