import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tour } from '../data/tour'
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
    .map((d) => `${d.city} (${d.day})`)
    .join(', ')

  const progressPct =
    buyer.queueTotal > 0 ? Math.round(100 - (buyer.queuePosition / buyer.queueTotal) * 100) : 0

  return (
    <div className="flex flex-col items-center space-y-6 py-8 text-center">
      <h1 className="text-xl font-bold text-brand-900">You're in the queue</h1>
      <p className="max-w-md text-brand-600">
        This is <strong>one queue</strong> covering every date you chose: {dateNames}. You won't
        need a second tab or a second queue.
      </p>

      <div className="w-full max-w-xs rounded-xl border border-brand-200 bg-white p-6">
        <p className="text-sm uppercase tracking-wide text-brand-500">Your position</p>
        <p className="text-4xl font-bold text-brand-900" aria-live="polite">
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
