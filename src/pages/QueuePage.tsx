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

  const sessionId = `q_${buyer.selectedDateIds.join('').slice(0, 8) || 'anon'}${buyer.quantity}`

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink">Ensuring a fair fan experience</h1>

      <div className="rounded-lg border border-brand-300 bg-white p-4">
        <label className="flex items-center gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-brand-400">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 animate-pulse text-brand-500" fill="none">
              <path
                d="M5 10l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-ink">
            Confirming your place — one queue for every date you chose ({dateNames})
          </span>
        </label>
      </div>

      <p className="text-brand-700">
        If you still need assistance, our support team is here to help! Please share the
        information below when reaching out.
      </p>

      <button
        type="button"
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
      >
        Help center
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M8 5h7m0 0v7m0-7L6 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul className="space-y-1 text-sm text-brand-400">
        <li>Session: {sessionId}</li>
        <li>Queue reference: {buyer.queueTotal}</li>
      </ul>
    </div>
  )
}
