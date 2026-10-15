import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCalcStore } from '@/lib/store/useCalcStore'
import { buildShareUrl } from '@/lib/share/url'

export function ShareButton() {
  const session = useCalcStore((s) =>
    s.sessions.find((x) => x.id === s.activeId),
  )

  if (!session) return null

  const handleShare = async () => {
    const url = buildShareUrl(session.params)

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Калькулятор досрочного погашения',
          url,
        })
        return
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success('Ссылка скопирована')
    } catch {
      toast.error('Не удалось скопировать ссылку')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
      <Share2 className="h-4 w-4" />
      Поделиться
    </Button>
  )
}