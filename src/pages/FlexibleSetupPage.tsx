import { useNavigate } from 'react-router-dom'
import { tour } from '../data/tour'
import { useAppDispatch, useAppState } from '../state/AppState'
import AvailabilityBadge from '../components/AvailabilityBadge'
import DateBadge from '../components/DateBadge'

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
          Which dates would you attend? {organiser.lockToSameTier && '(all £' + tour.priceGBP + ')'}
        </legend>
        {pooledDates.map((date) => {
          const checked = buyer.selectedDateIds.includes(date.id)
          const isFavourite = buyer.favouriteId === date.id
          const soldOut = availability[date.id] === 'soldout'
          return (
            <div
              key={date.id}
              className={`rounded-lg bg-white p-4 shadow-sm ring-1 ${
                checked ? 'ring-2 ring-brand-500' : 'ring-brand-200'
              } ${soldOut ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <label className="flex min-h-[44px] flex-1 items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 shrink-0 accent-brand-600"
                    checked={checked}
                    disabled={soldOut}
                    onChange={() => dispatch({ type: 'TOGGLE_DATE', id: date.id })}
                  />
                  <DateBadge date={date} />
                  <span>
                    <span className="block font-bold text-ink">{date.city}</span>
                    <span className="block text-sm text-brand-700">{date.venue}</span>
                  </span>
                </label>
                <AvailabilityBadge status={availability[date.id]} />
              </div>
              {checked && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_FAVOURITE', id: date.id })}
                  aria-pressed={isFavourite}
                  className={`mt-3 min-h-[44px] w-full rounded-lg px-3 py-2 text-sm font-bold ${
                    isFavourite
                      ? 'bg-amber-400 text-ink'
                      : 'border-2 border-brand-300 text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {isFavourite ? '★ Favourite' : '☆ Make favourite'}
                </button>
              )}
            </div>
          )
        })}
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
    </div>
  )
}
