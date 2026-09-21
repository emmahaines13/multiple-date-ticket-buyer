import { useState } from 'react'
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppStateProvider } from './state/AppState'
import { DevPanelOpenProvider } from './state/DevPanelContext'
import DevPanel from './components/DevPanel'
import EventPage from './pages/EventPage'
import FlexibleSetupPage from './pages/FlexibleSetupPage'
import QueuePage from './pages/QueuePage'
import FrontOfQueuePage from './pages/FrontOfQueuePage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import OrganiserSettingsPage from './pages/OrganiserSettingsPage'

function TopNav() {
  const location = useLocation()
  const isOrganiser = location.pathname === '/organiser'
  return (
    <>
      <header className="bg-brand-900">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="shrink-0 text-2xl font-black italic tracking-tight text-white">
            axs
          </Link>
          <div className="hidden flex-1 items-center rounded-full bg-white px-3 py-2 text-sm text-brand-400 sm:flex">
            <svg viewBox="0 0 20 20" className="mr-2 h-4 w-4" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="m17 17-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            London
          </div>
          <button
            type="button"
            className="hidden min-h-[36px] shrink-0 rounded-full border border-white/40 px-4 text-sm font-semibold text-white sm:block"
          >
            Sign In
          </button>
        </div>
      </header>
      <div className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-400">
            Flexible Request · Internal Prototype
          </span>
          <nav className="flex gap-1 rounded-full bg-brand-50 p-1 text-sm">
            <Link
              to="/"
              className={`flex min-h-[32px] items-center rounded-full px-3 font-medium ${
                !isOrganiser ? 'bg-brand-600 text-white' : 'text-brand-700 hover:bg-brand-100'
              }`}
            >
              Buyer view
            </Link>
            <Link
              to="/organiser"
              className={`flex min-h-[32px] items-center rounded-full px-3 font-medium ${
                isOrganiser ? 'bg-brand-600 text-white' : 'text-brand-700 hover:bg-brand-100'
              }`}
            >
              Organiser settings
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}

function AppShell() {
  const location = useLocation()
  const showDevPanel = location.pathname !== '/organiser'
  const [devPanelOpen, setDevPanelOpen] = useState(false)
  return (
    <DevPanelOpenProvider value={showDevPanel && devPanelOpen}>
      <div className="min-h-screen">
        <TopNav />
        <main
          className="mx-auto max-w-3xl px-4 py-6"
          style={{ paddingBottom: showDevPanel ? (devPanelOpen ? 220 : 72) : undefined }}
        >
          <Routes>
            <Route path="/" element={<EventPage />} />
            <Route path="/flexible" element={<FlexibleSetupPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/offer" element={<FrontOfQueuePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/organiser" element={<OrganiserSettingsPage />} />
          </Routes>
        </main>
        {showDevPanel && <DevPanel open={devPanelOpen} onOpenChange={setDevPanelOpen} />}
      </div>
    </DevPanelOpenProvider>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </AppStateProvider>
  )
}
