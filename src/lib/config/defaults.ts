import type { LoanParams } from '@/types/loan'

export const DEFAULT_PARAMS: LoanParams = {
  amount: 9_150_000,
  rate: 21.9,

  termMode: 'months',
  termMonths: 240,
  firstPaymentDate: new Date(),

  earlyMode: 'systematic',
  onceAmount: 0,
  onceMonth: 1,

  strategy: 'reducePayment',
}

export const CURRENCY = 'RUB'
export const LOCALE = 'ru-RU'