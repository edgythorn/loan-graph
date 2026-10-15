import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCalcStore } from '@/lib/store/useCalcStore'
import { cn } from '@/lib/utils'

export function CalcTabs() {
  const sessions = useCalcStore((s) => s.sessions)
  const activeId = useCalcStore((s) => s.activeId)
  const setActive = useCalcStore((s) => s.setActive)
  const addSession = useCalcStore((s) => s.addSession)
  const removeSession = useCalcStore((s) => s.removeSession)

  return (
    <div className="flex items-center gap-1 border-b pb-2 mb-4">
      {sessions.map((s) => (
        <div
          key={s.id}
          className={cn(
            'group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm cursor-pointer border',
            s.id === activeId
              ? 'bg-secondary text-secondary-foreground border-border'
              : 'border-transparent hover:bg-muted',
          )}
          onClick={() => setActive(s.id)}
        >
          <span>{s.name}</span>
          {sessions.length > 1 && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                removeSession(s.id)
              }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => addSession()}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}