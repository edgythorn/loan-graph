import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_PARAMS } from '@/lib/config/defaults'
import { buildSchedule } from '@/lib/calc/schedule'
import type { CalcSession, LoanParams } from '@/types/loan'

interface CalcState {
    sessions: CalcSession[]
    activeId: string | null
    counter: number

    ensureSession: (params?: LoanParams) => void
    addSession: (overrideParams?: LoanParams) => void
    removeSession: (id: string) => void
    setActive: (id: string) => void
    updateParams: (patch: Partial<LoanParams>) => void
    recalc: () => void
}

const makeId = () => Math.random().toString(36).slice(2, 9)

function createSession(name: string, params: LoanParams): CalcSession {
    return { id: makeId(), name, params: { ...params }, result: undefined }
}

function reviveParams(p: LoanParams): LoanParams {
    return {
        ...p,
        firstPaymentDate: p.firstPaymentDate
            ? new Date(p.firstPaymentDate)
            : new Date(),
    }
}

export const useCalcStore = create<CalcState>()(
    persist(
        (set, get) => ({
            sessions: [],
            activeId: null,
            counter: 0,

            ensureSession: (params) => {
                const { sessions } = get()
                if (sessions.length > 0) return
                const next = get().counter + 1
                const session = createSession(
                    `Расчет ${next}`,
                    params ?? { ...DEFAULT_PARAMS },
                )
                set({
                    sessions: [session],
                    activeId: session.id,
                    counter: next,
                })
            },

            addSession: (overrideParams) => {
                const { sessions, activeId, counter } = get()
                const current = sessions.find((s) => s.id === activeId)
                const params = overrideParams
                    ? { ...overrideParams }
                    : current
                        ? { ...current.params }
                        : { ...DEFAULT_PARAMS }
                const next = counter + 1
                const session = createSession(`Расчет ${next}`, params)
                set({
                    sessions: [...sessions, session],
                    activeId: session.id,
                    counter: next,
                })
            },

            removeSession: (id) => {
                const { sessions, activeId } = get()
                if (sessions.length <= 1) return
                const next = sessions.filter((s) => s.id !== id)
                set({
                    sessions: next,
                    activeId: activeId === id ? next[0].id : activeId,
                })
            },

            setActive: (id) => set({ activeId: id }),

            updateParams: (patch) => {
                const { sessions, activeId } = get()
                if (!activeId) return
                set({
                    sessions: sessions.map((s) =>
                        s.id === activeId ? { ...s, params: { ...s.params, ...patch } } : s,
                    ),
                })
            },

            recalc: () => {
                const { sessions, activeId } = get()
                if (!activeId) return
                set({
                    sessions: sessions.map((s) => {
                        if (s.id !== activeId) return s
                        try {
                            return { ...s, result: buildSchedule(s.params) }
                        } catch {
                            return { ...s, result: undefined }
                        }
                    }),
                })
            },
        }),
        {
            name: 'loan-graph:v1',
            partialize: (state) => ({
                sessions: state.sessions.map((s) => ({ ...s, result: undefined })),
                activeId: state.activeId,
                counter: state.counter,
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return
                state.sessions = state.sessions.map((s) => {
                    const params = reviveParams(s.params)
                    let result
                    try {
                        result = buildSchedule(params)
                    } catch {
                        result = undefined
                    }
                    return { ...s, params, result }
                })
            },
        },
    ),
)