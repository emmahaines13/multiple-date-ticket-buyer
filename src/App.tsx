import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppStateProvider } from './state/AppState'
import DevPanel from './components/DevPanel'
import EventPage from './pages/EventPage'
import FlexibleSetupPage from './pages/FlexibleSetupPage'
import QueuePage from './pages/QueuePage'
import FrontOfQueuePage from './pages/FrontOfQueuePage'
import ConfirmationPage from './pages/ConfirmationPage'
import OrganiserSettingsPage from './pages/OrganiserSettingsPage'

function TopNav() {
  const location = useLocation()
  const isOrganiser = location.pathname === '/organiser'
  return (
    <header className="border-b border-brand-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold text-brand-800">
          Flexible GA Request — Prototype
        </Link>
        <nav className="flex gap-2 text-sm">
          <Link
            to="/"
            className={`min-h-[44px] flex items-center rounded-md px-3 ${
              !isOrganiser ? 'bg-brand-100 text-brand-800' : 'text-brand-600 hover:bg-brand-50'
            }`}
          >
            Buyer view
          </Link>
          <Link
            to="/organiser"
            className={`min-h-[44px] flex items-center rounded-md px-3 ${
              isOrganiser ? 'bg-brand-100 text-brand-800' : 'text-brand-600 hover:bg-brand-50'
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
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Routes>
          <Route path="/" element={<EventPage />} />
          <Route path="/flexible" element={<FlexibleSetupPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/offer" element={<FrontOfQueuePage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/organiser" element={<OrganiserSettingsPage />} />
        </Routes>
      </main>
      {showDevPanel && <DevPanel />}
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
