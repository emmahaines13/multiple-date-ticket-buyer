import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tour } from '../data/tour'
import { useAppState } from '../state/AppState'

export default function ConfirmationPage() {
  const state = useAppState()
  const navigate = useNavigate()
  const { buyer } = state

  useEffect(() => {
    if (buyer.status !== 'confirmed') navigate('/', { replace: true })
  }, [buyer.status, navigate])

  const confirmedDate = tour.dates.find((d) => d.id === buyer.confirmedDateId)
  const releasedDates = tour.dates.filter(
    (d) => buyer.selectedDateIds.includes(d.id) && d.id !== buyer.confirmedDateId,
  )

  if (!confirmedDate) return null

  return (
    <div className="space-y-6 py-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
        ✓
      </div>
      <div>
        <h1 className="text-xl font-bold text-brand-900">You're going!</h1>
        <p className="text-brand-600">One ticket set, one date.</p>
      </div>

      <div className="rounded-xl border border-brand-200 bg-white p-5">
        <p className="text-lg font-semibold text-brand-900">
          {confirmedDate.city} · {confirmedDate.day}
        </p>
        <p className="text-brand-600">{confirmedDate.venue}</p>
        <p className="mt-2 text-brand-700">
          {buyer.quantity} × GA ticket{buyer.quantity > 1 ? 's' : ''} · £
          {tour.priceGBP * buyer.quantity}
        </p>
      </div>

      {releasedDates.length > 0 && (
        <p className="text-sm text-brand-600">
          The other dates you selected ({releasedDates.map((d) => d.city).join(', ')}) have been
          released back for other fans.
        </p>
      )}

      <button
        type="button"
        onClick={() => navigate('/')}
        className="min-h-[44px] w-full rounded-md bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Back to event page
      </button>
    </div>
  )
}
