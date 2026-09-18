import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tour } from '../data/tour'
import { orderedOfferCandidates, useAppDispatch, useAppState } from '../state/AppState'

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

  if (!offeredDate) {
    return (
      <div className="space-y-4 py-8 text-center">
        <h1 className="text-xl font-bold text-brand-900">
          None of your chosen dates are available right now
        </h1>
        <p className="text-brand-600">
          Every date in your request has sold out before reaching you. No payment was taken.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="min-h-[44px] rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
        >
          Back to event
        </button>
      </div>
    )
  }

  if (availability[offeredId] === 'soldout') {
    return (
      <div className="space-y-6 py-6 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">
            {offeredDate.city} · {offeredDate.day} just sold out
          </p>
          <p className="text-sm text-red-700">Nobody was charged. Here's your next option.</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'DECLINE_OFFER' })}
          className="min-h-[44px] w-full rounded-md bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700"
        >
          See next available date
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-brand-900">
          {isFavouriteOffer ? 'Your favourite is available' : 'Your next available date'}
        </h1>
        <p className="text-brand-600">We're holding one ticket set for you.</p>
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

      <div className="rounded-xl border border-brand-200 bg-white p-5 text-center">
        <p className="text-lg font-semibold text-brand-900">
          {offeredDate.city} · {offeredDate.day}
        </p>
        <p className="text-brand-600">{offeredDate.venue}</p>
        <p className="mt-2 text-brand-700">
          {buyer.quantity} × GA ticket{buyer.quantity > 1 ? 's' : ''} · £
          {tour.priceGBP * buyer.quantity}
        </p>
        <p className="mt-4 text-sm uppercase tracking-wide text-brand-500">Held for</p>
        <p className="text-3xl font-bold text-brand-900" aria-live="polite">
          {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'CONFIRM_OFFER' })}
          className="min-h-[44px] w-full rounded-md bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Confirm this date
        </button>
        {candidates.length > buyer.offerIndex + 1 && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'DECLINE_OFFER' })}
            className="min-h-[44px] w-full rounded-md border border-brand-300 px-4 py-3 font-medium text-brand-700 hover:bg-brand-50"
          >
            Not this one — show me the next option
          </button>
        )}
      </div>
    </div>
  )
}
