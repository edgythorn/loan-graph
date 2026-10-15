import { Toaster } from 'sonner'
import { CalcTabs } from '@/components/tabs/CalcTabs'
import { ParamsPanel } from '@/components/params/ParamsPanel'
import { ResultsPanel } from '@/components/results/ResultsPanel'
import { ShareButton } from '@/components/share/ShareButton'

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 max-w-[1400px] mx-auto">
      <h1 className="text-lg font-medium mb-4">
        Калькулятор досрочного погашения
      </h1>

      <CalcTabs />

      <section aria-label="Параметры расчёта" className="mt-4">
        <ParamsPanel />
      </section>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Результаты</span>
        <ShareButton />
      </div>

      <section aria-label="Результаты расчёта" className="mt-2">
        <ResultsPanel />
      </section>

      <footer className="mt-12 text-xs text-muted-foreground space-y-2 max-w-3xl">
        <h2 className="font-medium text-foreground text-sm">О калькуляторе</h2>
        <p>
          Loan Graph — бесплатный калькулятор досрочного погашения кредита и
          ипотеки. Позволяет рассчитать график платежей с разовым или
          ежемесячным досрочным погашением, со снижением платежа или сокращением
          срока.
        </p>
        <p>Все расчёты выполняются в браузере, данные никуда не отправляются.</p>
      </footer>

      <Toaster position="top-right" richColors />
    </main>
  )
}