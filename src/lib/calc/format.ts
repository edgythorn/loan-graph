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

export function formatMonthsAsYears(months: number): string {
    if (months < 12) return ''
    const years = Math.floor(months / 12)
    const rest = months % 12

    const yWord = plural(years, 'год', 'года', 'лет')
    const yLabel = `${years} ${yWord}`

    if (rest === 0) return yLabel
    return `${yLabel} ${rest} мес`
}

function plural(n: number, one: string, few: string, many: string): string {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod10 === 1 && mod100 !== 11) return one
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
    return many
}