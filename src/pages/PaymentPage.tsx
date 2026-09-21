import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  formatDate,
  formatMoney,
  ORDER_PROCESSING_FEE,
  SERVICE_FEE_PER_TICKET,
  tour,
} from '../data/tour'
import { useAppDispatch, useAppState } from '../state/AppState'

const HOLD_SECONDS = 300

function formatCardNumber(digits: string): string {
  return digits.match(/.{1,4}/g)?.join(' ') ?? digits
}

export default function PaymentPage() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { buyer } = state

  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS)
  const [processing, setProcessing] = useState(false)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [postcode, setPostcode] = useState('')

  const confirmedDate = tour.dates.find((d) => d.id === buyer.confirmedDateId)

  useEffect(() => {
    if (buyer.status === 'confirmed') {
      navigate('/confirmation', { replace: true })
    } else if (buyer.status !== 'payment') {
      navigate('/flexible', { replace: true })
    }
  }, [buyer.status, navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!confirmedDate) return null

  const cardDigits = cardNumber.replace(/\D/g, '').slice(0, 16)
  const cvvDigits = cvv.replace(/\D/g, '').slice(0, 3)
  const canPay =
    cardName.trim().length > 1 &&
    cardDigits.length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvvDigits.length === 3 &&
    postcode.trim().length > 1

  const subtotal = tour.priceGBP * buyer.quantity
  const serviceFees = SERVICE_FEE_PER_TICKET * buyer.quantity
  const total = subtotal + serviceFees + ORDER_PROCESSING_FEE

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canPay || processing) return
    setProcessing(true)
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_PAYMENT' })
    }, 900)
  }

  function handleExpiryChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) {
      setExpiry(digits)
    } else {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-xl font-extrabold text-ink">Payment</h1>
        <p className="text-brand-700">
          Complete your order to secure {formatDate(confirmedDate)} · {confirmedDate.city}.
        </p>
      </div>

      <div className="rounded-lg bg-amber-50 px-4 py-2 text-center text-sm font-bold text-amber-900 ring-1 ring-amber-300">
        Order reserved — {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}{' '}
        remaining
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200">
        <h2 className="mb-3 font-extrabold text-ink">Order summary</h2>
        <p className="font-bold text-ink">{formatDate(confirmedDate)}</p>
        <p className="text-sm text-brand-700">
          {confirmedDate.city} · {confirmedDate.venue}
        </p>
        <dl className="mt-3 space-y-1 border-t border-brand-100 pt-3 text-sm text-brand-700">
          <div className="flex justify-between">
            <dt>
              GA ticket × {buyer.quantity} @ {formatMoney(tour.priceGBP)}
            </dt>
            <dd>{formatMoney(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Service fee ({buyer.quantity} × {formatMoney(SERVICE_FEE_PER_TICKET)})</dt>
            <dd>{formatMoney(serviceFees)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Order processing fee</dt>
            <dd>{formatMoney(ORDER_PROCESSING_FEE)}</dd>
          </div>
        </dl>
        <div className="mt-3 flex justify-between border-t border-brand-100 pt-3 text-lg font-extrabold text-ink">
          <span>Order total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200">
        <h2 className="font-extrabold text-ink">Payment details</h2>

        <div className="space-y-1">
          <label htmlFor="cardName" className="block text-sm font-bold text-brand-800">
            Name on card
          </label>
          <input
            id="cardName"
            type="text"
            autoComplete="cc-name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="min-h-[44px] w-full rounded-md border border-brand-300 px-3 py-2"
            placeholder="A. Fan"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cardNumber" className="block text-sm font-bold text-brand-800">
            Card number
          </label>
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={formatCardNumber(cardDigits)}
            onChange={(e) => setCardNumber(e.target.value)}
            className="min-h-[44px] w-full rounded-md border border-brand-300 px-3 py-2"
            placeholder="4242 4242 4242 4242"
            maxLength={19}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label htmlFor="expiry" className="block text-sm font-bold text-brand-800">
              Expiry (MM/YY)
            </label>
            <input
              id="expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={expiry}
              onChange={(e) => handleExpiryChange(e.target.value)}
              className="min-h-[44px] w-full rounded-md border border-brand-300 px-3 py-2"
              placeholder="08/29"
              maxLength={5}
            />
          </div>
          <div className="w-24 space-y-1">
            <label htmlFor="cvv" className="block text-sm font-bold text-brand-800">
              CVV
            </label>
            <input
              id="cvv"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cvvDigits}
              onChange={(e) => setCvv(e.target.value)}
              className="min-h-[44px] w-full rounded-md border border-brand-300 px-3 py-2"
              placeholder="123"
              maxLength={3}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="postcode" className="block text-sm font-bold text-brand-800">
            Billing postcode
          </label>
          <input
            id="postcode"
            type="text"
            autoComplete="postal-code"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="min-h-[44px] w-full rounded-md border border-brand-300 px-3 py-2"
            placeholder="SE10 0DX"
          />
        </div>

        <button
          type="submit"
          disabled={!canPay || processing}
          className="min-h-[44px] w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-40"
        >
          {processing ? 'Processing…' : `Pay ${formatMoney(total)}`}
        </button>

        <p className="text-center text-xs text-brand-500">
          Prototype only — no card details are stored or sent anywhere.
        </p>
      </form>
    </div>
  )
}
