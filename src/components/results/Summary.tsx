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
    const baseTotal = baseInterest + params.amount

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
    const baseYears = formatMonthsAsYears(baseMonths) || undefined
    const savedYears = formatMonthsAsYears(savedMonths) || undefined

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 md:gap-3 md:p-4">
            <Stat
                label="Срок"
                value={`${result.actualMonths} мес`}
                sub={termYears}
                previous={
                    showSavedMonths
                        ? `${baseMonths} мес${baseYears ? ` (${baseYears})` : ''}`
                        : undefined
                }
                saved={
                    showSavedMonths
                        ? `${savedMonths} мес${savedYears ? ` (${savedYears})` : ''}`
                        : undefined
                }
            />

            <Stat
                label="Сумма выплат"
                value={formatMoney(result.totalPaid)}
                previous={showSavedInterest ? formatMoney(baseTotal) : undefined}
                rows={[
                    { label: 'долг', value: formatMoney(principal) },
                    {
                        label: 'проценты',
                        value: formatMoney(result.totalInterest),
                    },
                    ...(showSavedInterest
                        ? [
                              {
                                  label: '',
                                  value: formatMoney(baseInterest),
                                  strike: true,
                              },
                          ]
                        : []),
                ]}
                saved={showSavedInterest ? formatMoney(savedInterest) : undefined}
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
        </div>
    )
}

interface StatRow {
    label: string
    value: string
    className?: string
    strike?: boolean
}

interface StatProps {
    label: string
    value: string
    sub?: string
    previous?: string
    rows?: StatRow[]
    saved?: string
    tooltip?: string
    className?: string
}

function Stat({
    label,
    value,
    sub,
    previous,
    rows,
    saved,
    tooltip,
    className,
}: StatProps) {
    return (
        <Card className="p-2 md:p-3">
            <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                {label}
                {tooltip && (
                    <Tooltip>
                        <TooltipTrigger
                            render={<HelpCircle className="h-3 w-3 cursor-help" />}
                        />
                        <TooltipContent>
                            <p className="max-w-xs text-xs">{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            <div
                className={`text-base md:text-lg font-semibold font-mono ${className ?? ''}`}
            >
                {value}
                {sub && (
                    <span className="ml-1.5 text-[10px] md:text-xs font-normal text-muted-foreground">
                        ({sub})
                    </span>
                )}
            </div>

            {previous && (
                <div className="text-[10px] md:text-xs text-muted-foreground font-mono line-through">
                    {previous}
                </div>
            )}

            {rows && rows.length > 0 && (
                <div className="mt-2 space-y-0.5 text-[10px] md:text-xs">
                    {rows.map((r, i) => (
                        <div
                            key={`${r.label}-${i}`}
                            className="flex justify-between gap-2"
                        >
                            <span className="text-muted-foreground">
                                {r.label}
                            </span>
                            <span
                                className={`font-mono ${
                                    r.strike
                                        ? 'line-through text-muted-foreground'
                                        : ''
                                } ${r.className ?? ''}`}
                            >
                                {r.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {saved && (
                <div className="mt-2 text-[10px] md:text-xs font-mono text-emerald-600">
                    экономия {saved}
                </div>
            )}
        </Card>
    )
}