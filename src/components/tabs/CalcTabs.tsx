import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCalcStore } from '@/lib/store/useCalcStore'
import { cn } from '@/lib/utils'

export function CalcTabs() {
  const sessions = useCalcStore((s) => s.sessions)
  const activeId = useCalcStore((s) => s.activeId)
  const setActive = useCalcStore((s) => s.setActive)
  const addSession = useCalcStore((s) => s.addSession)
  const removeSession = useCalcStore((s) => s.removeSession)
  const renameSession = useCalcStore((s) => s.renameSession)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setDraftName(name)
  }

  const commitEdit = () => {
    if (editingId) {
      renameSession(editingId, draftName)
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="flex items-center gap-1 border-b pb-2 mb-4">
      {sessions.map((s) => {
        const isEditing = editingId === s.id
        return (
          <div
            key={s.id}
            className={cn(
              'group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm cursor-pointer border',
              s.id === activeId
                ? 'bg-secondary text-secondary-foreground border-border'
                : 'border-transparent hover:bg-muted',
            )}
            onClick={() => !isEditing && setActive(s.id)}
          >
            {isEditing ? (
              <Input
                autoFocus
                value={draftName}
                maxLength={30}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit()
                  if (e.key === 'Escape') cancelEdit()
                }}
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-32 px-1 py-0 text-sm"
              />
            ) : (
              <span
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  startEdit(s.id, s.name)
                }}
                title="Двойной клик для переименования"
              >
                {s.name}
              </span>
            )}
            {sessions.length > 1 && !isEditing && (
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
        )
      })}
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