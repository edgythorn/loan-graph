import { CalcTabs } from '@/components/tabs/CalcTabs'
import { ParamsPanel } from '@/components/params/ParamsPanel'
import { ResultsPanel } from '@/components/results/ResultsPanel'

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          Калькулятор досрочного погашения
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Кредита и ипотеки. Разовое и ежемесячное досрочное погашение,
          снижение платежа или сокращение срока.
        </p>
      </header>

      <CalcTabs />

      <section aria-label="Параметры расчёта" className="mt-4">
        <ParamsPanel />
      </section>

      <section aria-label="Результаты расчёта" className="mt-4">
        <ResultsPanel />
      </section>

      <footer className="mt-8 text-xs text-muted-foreground">
        Loan Graph — бесплатный калькулятор досрочного погашения.
      </footer>
    </main>
  )
}