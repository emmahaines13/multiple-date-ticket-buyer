import { Link } from 'react-router-dom'
import { tour } from '../data/tour'
import { useAppState } from '../state/AppState'
import AvailabilityBadge from '../components/AvailabilityBadge'

export default function EventPage() {
  const state = useAppState()
  const pooledDates = tour.dates.filter((d) => state.organiser.pooledDateIds.includes(d.id))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-500">
          General admission
        </p>
        <h1 className="text-2xl font-bold text-brand-900">{tour.name}</h1>
        <p className="text-brand-600">{tour.ticketType}</p>
      </div>

      {state.organiser.flexibleEnabled && pooledDates.length > 1 && (
        <div className="rounded-xl border-2 border-brand-500 bg-brand-100 p-4">
          <h2 className="font-semibold text-brand-800">Any of these dates</h2>
          <p className="mt-1 text-sm text-brand-700">
            Free on more than one night? Join a single queue for every date you'd attend and
            we'll hold one ticket on your favourite, offering the next available date if it
            sells out.
          </p>
          <Link
            to="/flexible"
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
          >
            Choose your dates
          </Link>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-semibold text-brand-800">Choose a single date</h2>
        <ul className="space-y-3">
          {tour.dates.map((date) => {
            const availability = state.availability[date.id]
            return (
              <li
                key={date.id}
                className="flex items-center justify-between rounded-lg border border-brand-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-brand-900">
                    {date.city} · {date.day}
                  </p>
                  <p className="text-sm text-brand-600">{date.venue}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <AvailabilityBadge status={availability} />
                  <button
                    type="button"
                    disabled={availability === 'soldout'}
                    className="min-h-[44px] rounded-md border border-brand-400 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-40"
                  >
                    Buy GA — £{tour.priceGBP}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
