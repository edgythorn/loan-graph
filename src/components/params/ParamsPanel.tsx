import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useCalcStore } from '@/lib/store/useCalcStore'
import { formatMoney } from '@/lib/calc/format'
import { TermInput } from './TermInput'
import { EarlyInput } from './EarlyInput'

export function ParamsPanel() {
  const session = useCalcStore((s) =>
    s.sessions.find((x) => x.id === s.activeId),
  )
  const updateParams = useCalcStore((s) => s.updateParams)
  const recalc = useCalcStore((s) => s.recalc)

  const params = session?.params
  const minPayment = session?.result?.minPayment ?? 0

  useEffect(() => {
    if (!params) return
    const t = setTimeout(() => recalc(), 200)
    return () => clearTimeout(t)
  }, [params, recalc])

  if (!session || !params) return null

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Сумма кредита / остаток</Label>
          <Input
            type="number"
            value={params.amount}
            onChange={(e) => updateParams({ amount: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Ставка, % годовых</Label>
          <Input
            type="number"
            step="0.1"
            value={params.rate}
            onChange={(e) => updateParams({ rate: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Мин. платёж (расчётный)</Label>
          <Input readOnly value={formatMoney(minPayment)} className="bg-muted" />
        </div>
      </div>

      <TermInput params={params} onChange={updateParams} />
      <EarlyInput
        params={params}
        minPayment={minPayment}
        onChange={updateParams}
      />
    </Card>
  )
}