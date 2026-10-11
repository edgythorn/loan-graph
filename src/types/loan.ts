export type TermMode = 'months' | 'years' | 'untilDate'
export type EarlyMode = 'none' | 'once' | 'systematic'
export type Strategy = 'reducePayment' | 'reduceTerm'

export interface LoanParams {
  amount: number
  rate: number

  termMode: TermMode
  /** Каноничный срок в месяцах. Из него выводятся годы и дата окончания. */
  termMonths: number
  /** Только для termMode === 'untilDate' — для расчёта разницы. */
  firstPaymentDate: Date

  earlyMode: EarlyMode
  onceAmount: number
  onceMonth: number
  actualPayment?: number

  strategy: Strategy
}

export interface ScheduleRow {
  /** Номер месяца, начиная с 1 */
  month: number
  /** Дата платежа */
  date: Date
  /** Остаток долга на начало месяца */
  openingBalance: number
  /** Начисленные проценты за месяц */
  interest: number
  /** Платёж по графику (до досрочки) */
  scheduledPayment: number
  /** Ушло в тело долга */
  principal: number
  /** Досрочное погашение в этом месяце */
  earlyPayment: number
  /** Итоговый платёж в этом месяце */
  totalPayment: number
  /** Остаток долга на конец месяца */
  closingBalance: number
}

export interface CalcResult {
  rows: ScheduleRow[]
  /** Фактический срок в месяцах */
  actualMonths: number
  /** Сумма всех процентов */
  totalInterest: number
  /** Сумма всех платежей */
  totalPaid: number
  /** Минимальный (стартовый) платёж */
  minPayment: number
}

export interface CalcSession {
  id: string
  name: string
  params: LoanParams
  result?: CalcResult
}