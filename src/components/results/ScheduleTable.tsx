import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CalcResult } from '@/types/loan'
import { formatDate, formatMoney } from '@/lib/calc/format'

interface Props {
  result: CalcResult | undefined
}

export function ScheduleTable({ result }: Props) {
  if (!result) return <p className="text-sm text-muted-foreground p-4">Нет данных для отображения</p>

  return (
    <div className="rounded-md border max-h-[600px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-16">Мес</TableHead>
            <TableHead className="w-28">Дата</TableHead>
            <TableHead className="text-right">Остаток нач.</TableHead>
            <TableHead className="text-right">Платёж</TableHead>
            <TableHead className="text-right">Проценты</TableHead>
            <TableHead className="text-right">Тело</TableHead>
            <TableHead className="text-right">Досрочка</TableHead>
            <TableHead className="text-right">Итог</TableHead>
            <TableHead className="text-right">Остаток кон.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.rows.map((r) => (
            <TableRow key={r.month} className={r.earlyPayment > 0 ? 'bg-muted/30' : ''}>
              <TableCell className="font-mono text-xs">{r.month}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDate(r.date)}</TableCell>
              <TableCell className="text-right font-mono text-xs">{formatMoney(r.openingBalance)}</TableCell>
              <TableCell className="text-right font-mono text-xs">{formatMoney(r.scheduledPayment)}</TableCell>
              <TableCell className="text-right font-mono text-xs text-destructive">{formatMoney(r.interest)}</TableCell>
              <TableCell className="text-right font-mono text-xs">{formatMoney(r.principal)}</TableCell>
              <TableCell className="text-right font-mono text-xs text-emerald-600">
                {r.earlyPayment > 0 ? formatMoney(r.earlyPayment) : '—'}
              </TableCell>
              <TableCell className="text-right font-mono text-xs font-semibold">{formatMoney(r.totalPayment)}</TableCell>
              <TableCell className="text-right font-mono text-xs">{formatMoney(r.closingBalance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}