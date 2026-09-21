import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatMoney, orderTotal, tour } from '../data/tour'
import { useAppState } from '../state/AppState'

function BarcodeStrip() {
  const bars = useMemo(
    () => Array.from({ length: 46 }, () => (Math.random() > 0.5 ? 3 : 1.5)),
    [],
  )
  return (
    <div className="flex h-12 items-stretch gap-[2px]" aria-hidden="true">
      {bars.map((w, i) => (
        <div key={i} className="bg-ink" style={{ width: w }} />
      ))}
    </div>
  )
}

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
  const orderNumber = confirmedDate
    ? `GA-${confirmedDate.id.slice(0, 4).toUpperCase()}-${buyer.quantity}042`
    : ''

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

      <div className="overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-brand-200">
        <div className="bg-brand-900 px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-200">
            {tour.name} · General admission
          </p>
        </div>
        <div className="p-5">
          <p className="text-lg font-bold text-ink">{formatDate(confirmedDate)}</p>
          <p className="text-brand-700">
            {confirmedDate.city} · {confirmedDate.venue}
          </p>
          <p className="mt-2 text-brand-700">
            {buyer.quantity} × GA ticket{buyer.quantity > 1 ? 's' : ''}
          </p>
          <p className="mt-1 font-bold text-ink">Total paid: {formatMoney(orderTotal(buyer.quantity))}</p>
        </div>
        <div className="relative border-t-2 border-dashed border-brand-200 p-5">
          <div
            className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#f5f6f8]"
            aria-hidden="true"
          />
          <div
            className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#f5f6f8]"
            aria-hidden="true"
          />
          <BarcodeStrip />
          <p className="mt-2 text-center text-xs tracking-widest text-brand-500">{orderNumber}</p>
        </div>
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
        className="min-h-[44px] w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
      >
        Back to event page
      </button>
    </div>
  )
}
