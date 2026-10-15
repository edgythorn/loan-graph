import type { LoanParams } from '@/types/loan'

export const DEFAULT_PARAMS: LoanParams = {
  amount: 1_000_000,
  rate: 15,

  termMode: 'months',
  termMonths: 60,
  firstPaymentDate: new Date(),

  earlyMode: 'systematic',
  onceAmount: 0,
  onceMonth: 1,

  strategy: 'reducePayment',
}

export const CURRENCY = 'RUB'
export const LOCALE = 'ru-RU'