import { useState } from 'react'
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppStateProvider } from './state/AppState'
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
    <header className="bg-brand-900">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold tracking-tight text-white">
          Flexible GA Request
          <span className="ml-2 rounded-full bg-brand-500 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Prototype
          </span>
        </Link>
        <nav className="flex gap-2 rounded-full bg-brand-800 p-1 text-sm">
          <Link
            to="/"
            className={`flex min-h-[36px] items-center rounded-full px-3 font-medium ${
              !isOrganiser ? 'bg-white text-brand-900' : 'text-brand-100 hover:text-white'
            }`}
          >
            Buyer view
          </Link>
          <Link
            to="/organiser"
            className={`flex min-h-[36px] items-center rounded-full px-3 font-medium ${
              isOrganiser ? 'bg-white text-brand-900' : 'text-brand-100 hover:text-white'
            }`}
          >
            Organiser settings
          </Link>
        </nav>
      </div>
    </header>
  )
}

function AppShell() {
  const location = useLocation()
  const showDevPanel = location.pathname !== '/organiser'
  const [devPanelOpen, setDevPanelOpen] = useState(false)
  return (
    <div className="min-h-screen">
      <TopNav />
      <main
        className="mx-auto max-w-3xl px-4 py-6"
        style={{ paddingBottom: showDevPanel && devPanelOpen ? 220 : undefined }}
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
