import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, tour } from '../data/tour'
import {
  hasNextOffer,
  hasPreviousOffer,
  orderedOfferCandidates,
  useAppDispatch,
  useAppState,
} from '../state/AppState'

const HOLD_SECONDS = 90

export default function FrontOfQueuePage() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { buyer, availability } = state
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS)

  const candidates = orderedOfferCandidates(buyer)
  const offeredId = candidates[buyer.offerIndex]
  const offeredDate = tour.dates.find((d) => d.id === offeredId)
  const favouriteDate = tour.dates.find((d) => d.id === buyer.favouriteId)
  const isFavouriteOffer = offeredId === buyer.favouriteId
  const cityChanged = !!offeredDate && !!favouriteDate && offeredDate.city !== favouriteDate.city
  const canGoBack = hasPreviousOffer(state)
  const canGoNext = hasNextOffer(state)

  useEffect(() => {
    if (buyer.status === 'idle') navigate('/flexible', { replace: true })
  }, [buyer.status, navigate])

  useEffect(() => {
    setSecondsLeft(HOLD_SECONDS)
  }, [offeredId])

  useEffect(() => {
    if (!offeredDate) return
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [offeredDate])

  useEffect(() => {
    if (buyer.status === 'confirmed') navigate('/confirmation')
  }, [buyer.status, navigate])

  const backButton = canGoBack && (
    <button
      type="button"
      onClick={() => dispatch({ type: 'PREVIOUS_OFFER' })}
      className="min-h-[44px] w-full rounded-full border-2 border-brand-300 px-4 py-3 font-bold text-brand-700 hover:bg-brand-50"
    >
      Back to previous option
    </button>
  )

  if (!offeredDate) {
    return (
      <div className="space-y-4 py-8 text-center">
        <h1 className="text-xl font-extrabold text-ink">
          None of your chosen dates are available right now
        </h1>
        <p className="text-brand-700">
          Every date in your request has sold out before reaching you. No payment was taken.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          {backButton}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="min-h-[44px] w-full rounded-full bg-brand-600 px-4 py-2 font-bold text-white hover:bg-brand-700"
          >
            Back to event
          </button>
        </div>
      </div>
    )
  }

  if (availability[offeredId] === 'soldout') {
    return (
      <div className="space-y-6 py-6 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">
            {offeredDate.city} · {formatDate(offeredDate)} just sold out
          </p>
          <p className="text-sm text-red-700">Nobody was charged. Here's your next option.</p>
        </div>
        <div className="flex flex-col gap-3">
          {canGoNext ? (
            <button
              type="button"
              onClick={() => dispatch({ type: 'DECLINE_OFFER' })}
              className="min-h-[44px] w-full rounded-full bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
            >
              See next available date
            </button>
          ) : (
            <button
              type="button"
              onClick={() => dispatch({ type: 'DECLINE_OFFER' })}
              className="min-h-[44px] w-full rounded-full bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
            >
              That was your last option — continue
            </button>
          )}
          {backButton}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <h1 className="text-xl font-extrabold text-ink">
          {isFavouriteOffer ? 'Your favourite is available' : 'Your next available date'}
        </h1>
        <p className="text-brand-700">We're holding one ticket set for you.</p>
      </div>

      {cityChanged && (
        <div
          role="alert"
          className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 text-amber-900"
        >
          <p className="font-semibold">This is a different city from your favourite</p>
          <p className="text-sm">
            {favouriteDate?.city} sold out. This offer is in {offeredDate.city} instead.
          </p>
        </div>
      )}

      <div className="rounded-xl bg-white p-5 text-center shadow-sm ring-1 ring-brand-200">
        <p className="text-lg font-bold text-ink">{formatDate(offeredDate)}</p>
        <p className="text-brand-700">
          {offeredDate.city} · {offeredDate.venue}
        </p>
        <p className="mt-2 text-brand-700">
          {buyer.quantity} × GA ticket{buyer.quantity > 1 ? 's' : ''} · £
          {tour.priceGBP * buyer.quantity}
        </p>
        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-brand-500">Hold for</p>
        <p className="text-3xl font-extrabold text-ink" aria-live="polite">
          {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'CONFIRM_OFFER' })}
          className="min-h-[44px] w-full rounded-full bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
        >
          Confirm this date
        </button>
        {canGoNext && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'DECLINE_OFFER' })}
            className="min-h-[44px] w-full rounded-full border-2 border-brand-300 px-4 py-3 font-bold text-brand-700 hover:bg-brand-50"
          >
            Not this one — show me the next option
          </button>
        )}
        {backButton}
      </div>
    </div>
  )
}
