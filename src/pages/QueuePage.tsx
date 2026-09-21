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

  return (
    <div className="flex flex-col items-center space-y-6 py-8 text-center">
      <h1 className="text-xl font-extrabold text-ink">You're in the queue</h1>
      <p className="max-w-md text-brand-700">
        This is <strong>one queue</strong> covering every date you chose: {dateNames}. You won't
        need a second tab or a second queue.
      </p>

      <div className="w-full max-w-xs rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-200">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-500">Your position</p>
        <p className="text-4xl font-extrabold text-ink" aria-live="polite">
          {buyer.queuePosition}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-brand-500">Please don't refresh — you'll keep your place.</p>
    </div>
  )
}
