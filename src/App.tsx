import { CalcTabs } from '@/components/tabs/CalcTabs'
import { ParamsPanel } from '@/components/params/ParamsPanel'
import { ResultsPanel } from '@/components/results/ResultsPanel'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-[1400px] mx-auto">
      <CalcTabs />
      <ParamsPanel />
      <ResultsPanel />
    </div>
  )
}