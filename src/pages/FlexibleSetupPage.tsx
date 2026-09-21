import { useNavigate } from 'react-router-dom'
import { formatDate, tour } from '../data/tour'
import { useAppDispatch, useAppState } from '../state/AppState'
import HelpBubble from '../components/HelpBubble'

export default function FlexibleSetupPage() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { organiser, buyer, availability } = state

  const pooledDates = tour.dates.filter((d) => organiser.pooledDateIds.includes(d.id))
  const canEnterQueue = buyer.selectedDateIds.length > 0 && buyer.favouriteId

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink">Any of these dates</h1>
        <p className="text-brand-700">
          Tick every date you'd go to, then star your favourite. You'll join one queue and end
          up with tickets for exactly one date.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="font-extrabold text-ink">
          Available Offers{' '}
          {organiser.lockToSameTier && (
            <span className="font-normal text-brand-600">(all £{tour.priceGBP})</span>
          )}
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pooledDates.map((date) => {
            const checked = buyer.selectedDateIds.includes(date.id)
            const isFavourite = buyer.favouriteId === date.id
            const soldOut = availability[date.id] === 'soldout'
            return (
              <div
                key={date.id}
                className={`relative rounded-lg bg-white p-4 text-center shadow-sm ring-1 ${
                  checked ? 'ring-2 ring-brand-500' : 'ring-brand-200'
                } ${soldOut ? 'opacity-60' : ''}`}
              >
                {isFavourite && (
                  <span
                    className="absolute right-3 top-3 text-lg text-amber-500"
                    aria-label="Favourite"
                  >
                    ★
                  </span>
                )}
                <p className="font-bold text-ink">{formatDate(date)}</p>
                <p className="mt-1 text-sm text-brand-600">
                  {date.city} · {date.venue}
                </p>

                {soldOut ? (
                  <p className="mt-4 text-sm font-extrabold text-red-600">SOLD OUT</p>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'TOGGLE_DATE', id: date.id })}
                      aria-pressed={checked}
                      className={`mt-4 min-h-[44px] w-full rounded-full px-3 py-2 text-sm font-bold ${
                        checked
                          ? 'bg-brand-600 text-white'
                          : 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50'
                      }`}
                    >
                      {checked ? 'Selected ✓' : 'Select'}
                    </button>
                    {checked && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'SET_FAVOURITE', id: date.id })}
                        className="mt-2 block w-full text-sm font-semibold text-brand-600 underline-offset-2 hover:underline"
                      >
                        {isFavourite ? 'Favourite' : 'Make favourite'}
                      </button>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="quantity" className="block font-extrabold text-ink">
          Quantity
        </label>
        <select
          id="quantity"
          value={buyer.quantity}
          onChange={(e) => dispatch({ type: 'SET_QUANTITY', quantity: Number(e.target.value) })}
          className="min-h-[44px] w-full rounded-md border border-brand-300 bg-white px-3 py-2"
        >
          {Array.from({ length: organiser.quantityCap }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} ticket{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200">
        <p className="flex items-center justify-between text-ink">
          <span>Price per ticket</span>
          <span className="font-semibold">£{tour.priceGBP}</span>
        </p>
        <p className="mt-1 flex items-center justify-between text-lg font-bold text-ink">
          <span>Total</span>
          <span>£{tour.priceGBP * buyer.quantity}</span>
        </p>
      </div>

      <button
        type="button"
        disabled={!canEnterQueue}
        onClick={() => {
          dispatch({ type: 'ENTER_QUEUE' })
          navigate('/queue')
        }}
        className="min-h-[44px] w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-40"
      >
        Enter the queue
      </button>
      {!canEnterQueue && (
        <p className="text-sm text-brand-700">Tick at least one date to continue.</p>
      )}

      <HelpBubble />
    </div>
  )
}
