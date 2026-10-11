import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCalcStore } from '@/lib/store/useCalcStore'
import { ScheduleTable } from './ScheduleTable'
import { Summary } from './Summary'

export function ResultsPanel() {
  const session = useCalcStore((s) => s.sessions.find((x) => x.id === s.activeId))!
  const result = session.result

  return (
    <Tabs defaultValue="schedule" className="mt-4">
      <TabsList>
        <TabsTrigger value="schedule">График</TabsTrigger>
        <TabsTrigger value="summary">Сводка</TabsTrigger>
      </TabsList>
      <TabsContent value="schedule">
        <ScheduleTable result={result} />
      </TabsContent>
      <TabsContent value="summary">
        <Summary result={result} params={session.params} />
      </TabsContent>
    </Tabs>
  )
}