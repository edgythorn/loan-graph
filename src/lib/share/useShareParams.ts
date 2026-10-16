import { useCalcStore } from '@/lib/store/useCalcStore'
import { decodeParams, paramsHash } from './url'

export function initSessionsFromUrl(): void {
    const store = useCalcStore.getState()
    const url = new URL(window.location.href)
    const c = url.searchParams.get('c')

    if (c) {
        url.searchParams.delete('c')
        window.history.replaceState({}, '', url.toString())

        const decoded = decodeParams(c)
        if (decoded) {
            const { params, name } = decoded
            const sessions = store.sessions
            const hash = paramsHash(params)
            const existing = sessions.find((s) => paramsHash(s.params) === hash)

            if (existing) {
                store.setActive(existing.id)
            } else if (sessions.length === 0) {
                store.ensureSession(params)
                if (name) {
                    const newId = useCalcStore.getState().activeId
                    if (newId) store.renameSession(newId, name)
                }
            } else {
                store.addSession(params)
                if (name) {
                    const newId = useCalcStore.getState().activeId
                    if (newId) store.renameSession(newId, name)
                }
            }
            store.recalc()
            return
        }
    }

    store.ensureSession()
    store.recalc()
}