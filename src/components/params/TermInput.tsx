import { useEffect, useState } from 'react'
import { addMonths, differenceInCalendarMonths, format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LoanParams, TermMode } from '@/types/loan'

interface Props {
  params: LoanParams
  onChange: (patch: Partial<LoanParams>) => void
}

const MODES: { value: TermMode; label: string }[] = [
  { value: 'months', label: 'мес' },
  { value: 'years', label: 'лет' },
  { value: 'untilDate', label: 'до даты' },
]

const parseLocalDate = (s: string): Date | null => {
  // "yyyy-MM-dd" → локальная полночь, без UTC-сдвига
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return isNaN(d.getTime()) ? null : d
}

export function TermInput({ params, onChange }: Props) {
  const endDate = addMonths(params.firstPaymentDate, params.termMonths)
  const years = Math.round((params.termMonths / 12) * 100) / 100

  // Локальные строки для инпутов — чтобы не блокировать ввод.
  const [endDateStr, setEndDateStr] = useState(() => format(endDate, 'yyyy-MM-dd'))
  const [firstDateStr, setFirstDateStr] = useState(() =>
    format(params.firstPaymentDate, 'yyyy-MM-dd'),
  )

  // Синхронизация извне.
  useEffect(() => {
    setEndDateStr(format(endDate, 'yyyy-MM-dd'))
  }, [endDate.getTime()])

  useEffect(() => {
    setFirstDateStr(format(params.firstPaymentDate, 'yyyy-MM-dd'))
  }, [params.firstPaymentDate.getTime()])

  const setMonths = (months: number) =>
    onChange({ termMonths: Math.max(1, Math.floor(months)) })

  const commitEndDate = (s: string) => {
    const d = parseLocalDate(s)
    if (!d) return
    const diff = differenceInCalendarMonths(d, params.firstPaymentDate)
    if (diff > 0) onChange({ termMonths: diff })
  }

  const commitFirstDate = (s: string) => {
    const d = parseLocalDate(s)
    if (!d) return
    const diff = differenceInCalendarMonths(endDate, d)
    onChange({
      firstPaymentDate: d,
      termMonths: diff > 0 ? diff : params.termMonths,
    })
  }

  return (
    <div className="space-y-2">
      <Label>Срок</Label>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-md border p-0.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onChange({ termMode: m.value })}
              className={
                'px-3 py-1 text-sm rounded ' +
                (params.termMode === m.value
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-muted')
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        {params.termMode === 'months' && (
          <Input
            type="number"
            min={1}
            value={params.termMonths}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-24"
          />
        )}

        {params.termMode === 'years' && (
          <Input
            type="number"
            min={1}
            step="0.5"
            value={years}
            onChange={(e) => setMonths(Number(e.target.value) * 12)}
            className="w-24"
          />
        )}

        {params.termMode === 'untilDate' && (
          <Input
            type="date"
            value={endDateStr}
            onChange={(e) => setEndDateStr(e.target.value)}
            onBlur={(e) => commitEndDate(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                commitEndDate((e.target as HTMLInputElement).value)
            }}
            className="w-40"
          />
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Первый платёж:</span>
          <Input
            type="date"
            value={firstDateStr}
            onChange={(e) => setFirstDateStr(e.target.value)}
            onBlur={(e) => commitFirstDate(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                commitFirstDate((e.target as HTMLInputElement).value)
            }}
            className="h-7 w-36 text-xs"
          />
        </div>
        <span>
          {params.termMode === 'untilDate'
            ? `Срок: ${params.termMonths} мес`
            : `Окончание: ${format(endDate, 'dd.MM.yyyy')}`}
        </span>
      </div>
    </div>
  )
}