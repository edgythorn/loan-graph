import { describe, it, expect } from 'vitest'
import { buildSchedule } from './schedule'
import type { LoanParams } from '@/types/loan'

const baseParams: LoanParams = {
    amount: 9_150_000,
    rate: 21.9,
    termMode: 'months',
    termMonths: 240,
    firstPaymentDate: new Date(2022, 8, 23), // 23.09.2022
    earlyMode: 'systematic',
    onceAmount: 0,
    onceMonth: 1,
    actualPayment: 169_192,
    strategy: 'reducePayment',
}

describe('buildSchedule', () => {
    it('аннуитет без досрочек совпадает с формулой', () => {
        const r = buildSchedule({ ...baseParams, earlyMode: 'none' })
        expect(r.minPayment).toBeCloseTo(169_192, 0)
        expect(r.actualMonths).toBe(240)
    })

    it('систематическая досрочка 340к сокращает срок и убирает минус', () => {
        const r = buildSchedule({
            ...baseParams,
            earlyMode: 'systematic',
            actualPayment: 340_000, // полный платёж в месяц
        })
        expect(r.actualMonths).toBeLessThan(240)
        expect(r.rows.every((row) => row.closingBalance >= 0)).toBe(true)
        expect(r.rows.at(-1)!.closingBalance).toBe(0)
        // в первом месяце досрочка ≈ 340 000 − 169 192 = 170 808
        expect(r.rows[0].earlyPayment).toBeCloseTo(170_808, 0)
    })

    it('разовое погашение 340к в 1-й месяц', () => {
        const r = buildSchedule({
            ...baseParams,
            earlyMode: 'once',
            onceAmount: 340_000,
            onceMonth: 1,
        })
        expect(r.rows[0].earlyPayment).toBe(340_000)
        expect(r.actualMonths).toBeLessThan(240)
    })
})