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

  const progressPct =
    buyer.queueTotal > 0 ? Math.round(100 - (buyer.queuePosition / buyer.queueTotal) * 100) : 0
  const estimatedMinutes = Math.max(1, Math.ceil(buyer.queuePosition / 120))

  return (
    <div className="flex flex-col items-center space-y-6 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div>
        <h1 className="text-xl font-extrabold text-ink">You're in line</h1>
        <p className="mt-1 max-w-md text-brand-700">
          This is <strong>one queue</strong> covering every date you chose: {dateNames}. You won't
          need a second tab or a second queue.
        </p>
      </div>

      <div className="w-full max-w-xs rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-200">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-500">Your position in line</p>
        <p className="text-4xl font-extrabold text-ink" aria-live="polite">
          {buyer.queuePosition}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-brand-600">
          Estimated wait: about {estimatedMinutes} minute{estimatedMinutes > 1 ? 's' : ''}
        </p>
      </div>

      <p className="text-sm text-brand-500">
        Please don't close this tab or refresh — you'll keep your place in line.
      </p>
    </div>
  )
}
