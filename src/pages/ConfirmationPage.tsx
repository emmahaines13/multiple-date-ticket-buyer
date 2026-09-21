import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, tour } from '../data/tour'
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
        <h1 className="text-xl font-extrabold text-ink">You're going!</h1>
        <p className="text-brand-700">One ticket set, one date.</p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-brand-200">
        <p className="text-lg font-bold text-ink">{formatDate(confirmedDate)}</p>
        <p className="text-brand-700">
          {confirmedDate.city} · {confirmedDate.venue}
        </p>
        <p className="mt-2 text-brand-700">
          {buyer.quantity} × GA ticket{buyer.quantity > 1 ? 's' : ''} · £
          {tour.priceGBP * buyer.quantity}
        </p>
      </div>

      {releasedDates.length > 0 && (
        <p className="text-sm text-brand-700">
          The other dates you selected ({releasedDates.map((d) => d.city).join(', ')}) have been
          released back for other fans.
        </p>
      )}

      <button
        type="button"
        onClick={() => navigate('/')}
        className="min-h-[44px] w-full rounded-full bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
      >
        Back to event page
      </button>
    </div>
  )
}
