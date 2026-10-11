import { Card } from '@/components/ui/card'
import type { CalcResult, LoanParams } from '@/types/loan'
import { formatMoney } from '@/lib/calc/format'
import { annuityPayment } from '@/lib/calc/annuity'

interface Props {
  result: CalcResult | undefined
  params: LoanParams
}

export function Summary({ result, params }: Props) {
  if (!result) {
    return <p className="text-sm text-muted-foreground p-4">Нет данных</p>
  }

  // Базовый расчёт без досрочек для сравнения.
  const baseMonths = params.termMonths
  const basePayment = annuityPayment(params.amount, params.rate, baseMonths)
  const baseInterest = basePayment * baseMonths - params.amount

  const savedInterest = baseInterest - result.totalInterest
  const savedMonths = baseMonths - result.actualMonths

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
      <Stat label="Факт. срок" value={`${result.actualMonths} мес`} hint={`было ${baseMonths}`} />
      <Stat label="Итог. проценты" value={formatMoney(result.totalInterest)} hint={`экономия ${formatMoney(savedInterest)}`} highlight />
      <Stat label="Итог. выплаты" value={formatMoney(result.totalPaid)} hint={`сумма ${formatMoney(params.amount)}`} />
      <Stat label="Мин. платёж" value={formatMoney(result.minPayment)} hint="стартовый аннуитет" />
      <Stat label="Экономия месяцев" value={`${savedMonths}`} hint={savedMonths > 0 ? 'сокращение срока' : '—'} />
      <Stat label="Экономия процентов" value={formatMoney(savedInterest)} hint="от базового сценария" highlight />
    </div>
  )
}

function Stat({ label, value, hint, highlight }: { label: string; value: string; hint?: string; highlight?: boolean }) {
  return (
    <Card className="p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold font-mono ${highlight ? 'text-emerald-600' : ''}`}>{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </Card>
  )
}