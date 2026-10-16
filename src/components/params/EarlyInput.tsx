import { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { EarlyMode, LoanParams, Strategy } from '@/types/loan'
import { formatMoney } from '@/lib/calc/format'
import { MoneyInput } from './MoneyInput'

interface Props {
  params: LoanParams
  minPayment: number
  onChange: (patch: Partial<LoanParams>) => void
}

const EARLY_MODES: { value: EarlyMode; label: string }[] = [
  { value: 'none', label: 'нет' },
  { value: 'once', label: 'разово' },
  { value: 'systematic', label: 'системно' },
]

const STRATEGIES: { value: Strategy; label: string }[] = [
  { value: 'reducePayment', label: 'снижение платежа' },
  { value: 'reduceTerm', label: 'сокращение срока' },
]

export function EarlyInput({ params, minPayment, onChange }: Props) {
  const actual = params.actualPayment ?? 0
  const prevMin = useRef(minPayment)

  // Синхронизация только при изменении minPayment (вверх).
  useEffect(() => {
    if (params.earlyMode !== 'systematic') {
      prevMin.current = minPayment
      return
    }
    if (prevMin.current !== minPayment) {
      if (actual < minPayment) {
        onChange({ actualPayment: minPayment })
      }
      prevMin.current = minPayment
    }
  }, [minPayment, actual, params.earlyMode, onChange])

  // По blur: если меньше minPayment — подставляем minPayment.
  const handleBlur = () => {
    if (params.earlyMode === 'systematic' && actual < minPayment) {
      onChange({ actualPayment: minPayment })
    }
  }

  const diff = Math.max(actual - minPayment, 0)

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Досрочные погашения</Label>
        <div className="flex rounded-md border p-0.5 w-fit">
          {EARLY_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onChange({ earlyMode: m.value })}
              className={
                'px-3 py-1 text-sm rounded ' +
                (params.earlyMode === m.value
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-muted')
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {params.earlyMode === 'systematic' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Факт. платёж (в месяц)</Label>
            <MoneyInput
              value={actual}
              onChange={(v) => onChange({ actualPayment: v })}
              onBlur={handleBlur}
              placeholder={formatMoney(minPayment)}
            />
          </div>
          <div className="space-y-2">
            <Label>Досрочное погашение (1 мес.)</Label>
            <Input
              readOnly
              value={diff > 0 ? formatMoney(diff) : '—'}
              className="bg-muted"
            />
          </div>
        </div>
      )}

      {params.earlyMode === 'once' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Сумма</Label>
            <MoneyInput
              value={params.onceAmount}
              onChange={(v) => onChange({ onceAmount: v })}
            />
          </div>
          <div className="space-y-2">
            <Label>Месяц</Label>
            <Input
              type="number"
              min={1}
              value={params.onceMonth}
              onChange={(e) => onChange({ onceMonth: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {params.earlyMode !== 'none' && (
        <div className="space-y-2">
          <Label>Стратегия</Label>
          <div className="flex rounded-md border p-0.5 w-fit">
            {STRATEGIES.map((s) => (
              <button
                key={s.value}
                onClick={() => onChange({ strategy: s.value })}
                className={
                  'px-3 py-1 text-sm rounded ' +
                  (params.strategy === s.value
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-muted')
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}