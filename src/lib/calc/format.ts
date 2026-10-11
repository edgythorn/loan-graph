import { CURRENCY, LOCALE } from '@/lib/config/defaults'

const moneyFmt = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 2,
})

const numberFmt = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 2,
})

export const formatMoney = (n: number): string => moneyFmt.format(n)
export const formatNumber = (n: number): string => numberFmt.format(n)
export const formatPercent = (n: number, digits = 2): string =>
  `${n.toFixed(digits)}%`

export const formatMonthYear = (d: Date): string =>
  new Intl.DateTimeFormat(LOCALE, { month: '2-digit', year: 'numeric' }).format(d)

export const formatDate = (d: Date): string =>
  new Intl.DateTimeFormat(LOCALE).format(d)
