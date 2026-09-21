import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, tour } from '../data/tour'
import { useAppDispatch, useAppState } from '../state/AppState'

export default function QueuePage() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { buyer } = state

  useEffect(() => {
    if (buyer.status === 'idle') {
      navigate('/flexible', { replace: true })
    }
  }, [buyer.status, navigate])

  useEffect(() => {
    if (buyer.status !== 'queued') return
    const interval = setInterval(() => dispatch({ type: 'TICK_QUEUE' }), 400)
    return () => clearInterval(interval)
  }, [buyer.status, dispatch, state.queueFast])

  useEffect(() => {
    if (buyer.status === 'at-front') {
      dispatch({ type: 'REACH_FRONT' })
      navigate('/offer')
    }
  }, [buyer.status, dispatch, navigate])

  const dateNames = tour.dates
    .filter((d) => buyer.selectedDateIds.includes(d.id))
    .map((d) => `${d.city} (${formatDate(d)})`)
    .join(', ')

  const estimatedMinutes = Math.max(1, Math.ceil(buyer.queuePosition / 120))
  const sessionId = `q_${buyer.selectedDateIds.join('').slice(0, 8) || 'anon'}${buyer.quantity}`

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Ensuring a fair spot for every fan</h1>
        <p className="mt-2 text-brand-700">
          This is <strong>one queue</strong> covering every date you chose: {dateNames}. You
          won't need a second tab or a second queue.
        </p>
      </div>

      <div className="rounded-lg border border-brand-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 border-brand-500 bg-brand-50">
            <svg viewBox="0 0 20 20" className="h-4 w-4 animate-pulse text-brand-500" fill="none">
              <path
                d="M5 10l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-semibold text-ink">Confirming your place in line…</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{
              width: `${buyer.queueTotal > 0 ? Math.round(100 - (buyer.queuePosition / buyer.queueTotal) * 100) : 0}%`,
            }}
          />
        </div>
        <p className="mt-3 text-sm text-brand-600" aria-live="polite">
          Position {buyer.queuePosition} · estimated wait about {estimatedMinutes} minute
          {estimatedMinutes > 1 ? 's' : ''}
        </p>
      </div>

      <p className="text-sm text-brand-700">
        If you still need assistance, please don't close this tab or refresh — you'll keep your
        place in line.
      </p>

      <button
        type="button"
        className="min-h-[44px] w-full rounded-full bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
      >
        Help center
      </button>

      <ul className="space-y-1 text-xs text-brand-400">
        <li>Session: {sessionId}</li>
        <li>Queue reference: {buyer.queueTotal}</li>
      </ul>
    </div>
  )
}
