import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initSessionsFromUrl } from '@/lib/share/useShareParams'

// До рендера: разобрать URL и создать сессию, если нужно.
initSessionsFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)