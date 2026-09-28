import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatMoney, tour } from '../data/tour'
import { useAppDispatch, useAppState } from '../state/AppState'

export default function PaymentPage() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { buyer } = state

  const confirmedDate = tour.dates.find((d) => d.id === buyer.confirmedDateId)

  useEffect(() => {
    if (buyer.status === 'confirmed') {
      navigate('/confirmation', { replace: true })
    } else if (buyer.status !== 'payment') {
      navigate('/flexible', { replace: true })
    }
  }, [buyer.status, navigate])

  if (!confirmedDate) return null

  const total = tour.priceGBP * buyer.quantity

  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-xl font-extrabold text-ink">Payment</h1>
        <p className="text-brand-700">Payment is out of scope for this prototype.</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200">
        <h2 className="mb-3 font-extrabold text-ink">Order summary</h2>
        <p className="font-bold text-ink">{formatDate(confirmedDate)}</p>
        <p className="text-sm text-brand-700">
          {confirmedDate.city} · {confirmedDate.venue}
        </p>
        <div className="mt-3 flex justify-between border-t border-brand-100 pt-3 text-lg font-extrabold text-ink">
          <span>
            {buyer.quantity} × GA ticket{buyer.quantity > 1 ? 's' : ''}
          </span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'COMPLETE_PAYMENT' })}
        className="min-h-[44px] w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"
      >
        Continue
      </button>
    </div>
  )
}
