import { useCalcStore } from '@/lib/store/useCalcStore'
import { decodeParams, paramsHash } from './url'

/**
 * Обрабатывает ?c=... в URL и гарантирует, что есть хотя бы одна сессия.
 * Вызывать до createRoot().render().
 */
export function initSessionsFromUrl(): void {
  const store = useCalcStore.getState()
  const url = new URL(window.location.href)
  const c = url.searchParams.get('c')

  if (c) {
    // Всегда чистим URL — даже если decode не удался.
    url.searchParams.delete('c')
    window.history.replaceState({}, '', url.toString())

    const params = decodeParams(c)
    if (params) {
      const sessions = store.sessions
      const hash = paramsHash(params)
      const existing = sessions.find((s) => paramsHash(s.params) === hash)

      if (existing) {
        store.setActive(existing.id)
      } else if (sessions.length === 0) {
        store.ensureSession(params)
      } else {
        store.addSession(params)
      }
      store.recalc()
      return
    }
  }

  // Нет параметров или decode не удался — гарантируем дефолтную сессию.
  store.ensureSession()
  store.recalc()
}