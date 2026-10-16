import { HelpCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CalcResult, LoanParams } from '@/types/loan'
import { formatMoney, formatMonthsAsYears } from '@/lib/calc/format'
import { annuityPayment } from '@/lib/calc/annuity'

interface Props {
    result: CalcResult | undefined
    params: LoanParams
}

const MIN_SAVING_RUB = 1
const MIN_SAVING_MONTHS = 1

export function Summary({ result, params }: Props) {
    if (!result) {
        return <p className="text-sm text-muted-foreground p-4">Нет данных</p>
    }

    // Базовый сценарий (без досрочек) для сравнения.
    const baseMonths = params.termMonths
    const basePayment = annuityPayment(params.amount, params.rate, baseMonths)
    const baseInterest = basePayment * baseMonths - params.amount

    const savedInterest = baseInterest - result.totalInterest
    const savedMonths = baseMonths - result.actualMonths

    const hasEarly =
        params.earlyMode !== 'none' &&
        result.rows.some((r) => r.earlyPayment > 0)

    const showSavedInterest = savedInterest >= MIN_SAVING_RUB
    const showSavedMonths = savedMonths >= MIN_SAVING_MONTHS

    const showPaymentHint =
        hasEarly && params.strategy === 'reducePayment'
    const paymentLabel = showPaymentHint
        ? 'Мин. платёж (1-й мес.)'
        : 'Мин. платёж'

    const principal = params.amount

    const termYears = formatMonthsAsYears(result.actualMonths) || undefined
    const savedYears = formatMonthsAsYears(savedMonths) || undefined

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
            <Stat
                label="Срок"
                value={`${result.actualMonths} мес`}
                sub={termYears}
                rows={
                    showSavedMonths
                        ? [{ label: 'было', value: `${baseMonths} мес` }]
                        : undefined
                }
            />

            <Stat
                label="Сумма выплат"
                value={formatMoney(result.totalPaid)}
                rows={[
                    { label: 'долг', value: formatMoney(principal) },
                    {
                        label: 'проценты',
                        value: formatMoney(result.totalInterest),
                        className: 'text-destructive',
                    },
                ]}
            />

            <Stat
                label={paymentLabel}
                value={formatMoney(result.minPayment)}
                tooltip={
                    showPaymentHint
                        ? 'Платёж уменьшается после каждой досрочки'
                        : undefined
                }
            />

            {showSavedMonths && (
                <Stat
                    label="Экономия месяцев"
                    value={`${savedMonths} мес`}
                    sub={savedYears}
                    className="text-emerald-600"
                />
            )}

            {showSavedInterest && (
                <Stat
                    label="Экономия процентов"
                    value={formatMoney(savedInterest)}
                    className="text-emerald-600"
                />
            )}
        </div>
    )
}

interface StatRow {
    label: string
    value: string
    className?: string
}

interface StatProps {
    label: string
    value: string
    sub?: string
    rows?: StatRow[]
    tooltip?: string
    className?: string
}

function Stat({ label, value, sub, rows, tooltip, className }: StatProps) {
    return (
        <Card className="p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {label}
                {tooltip && (
                    <Tooltip>
                        <TooltipTrigger render={<HelpCircle className="h-3 w-3 cursor-help" />} />
                        <TooltipContent>
                            <p className="max-w-xs text-xs">{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            <div className={`text-lg font-semibold font-mono ${className ?? ''}`}>
                {value}
                {sub && (
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        ({sub})
                    </span>
                )}
            </div>

            {rows && rows.length > 0 && (
                <div className="mt-2 space-y-0.5 text-xs">
                    {rows.map((r, i) => (
                        <div key={`${r.label}-${i}`} className="flex justify-between gap-2">
                            <span className="text-muted-foreground">{r.label}</span>
                            <span className={`font-mono ${r.className ?? ''}`}>{r.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}