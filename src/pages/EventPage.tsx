import { Link } from 'react-router-dom'
import { tour } from '../data/tour'
import { useAppState } from '../state/AppState'
import AvailabilityBadge from '../components/AvailabilityBadge'
import DateBadge from '../components/DateBadge'

export default function EventPage() {
  const state = useAppState()
  const pooledDates = tour.dates.filter((d) => state.organiser.pooledDateIds.includes(d.id))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-brand-500">
          General admission
        </p>
        <h1 className="text-2xl font-extrabold text-ink">{tour.name}</h1>
        <p className="text-brand-700">{tour.ticketType}</p>
      </div>

      {state.organiser.flexibleEnabled && pooledDates.length > 1 && (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-brand-200">
          <h2 className="font-extrabold text-ink">Any of these dates</h2>
          <p className="mt-1 text-sm text-brand-700">
            Free on more than one night? Join a single queue for every date you'd attend and
            we'll hold one ticket on your favourite, offering the next available date if it
            sells out.
          </p>
          <Link
            to="/flexible"
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Choose your dates
          </Link>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-extrabold text-ink">Choose a single date</h2>
        <ul className="space-y-3">
          {tour.dates.map((date) => {
            const availability = state.availability[date.id]
            return (
              <li
                key={date.id}
                className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200"
              >
                <DateBadge date={date} />
                <div className="flex-1">
                  <p className="font-bold text-ink">{date.city}</p>
                  <p className="text-sm text-brand-700">{date.venue}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <AvailabilityBadge status={availability} />
                  <button
                    type="button"
                    disabled={availability === 'soldout'}
                    className="min-h-[44px] rounded-lg border-2 border-brand-600 px-4 py-2 text-sm font-bold text-brand-600 hover:bg-brand-50 disabled:border-brand-200 disabled:text-brand-300"
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
