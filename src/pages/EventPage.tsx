import { Link } from 'react-router-dom'
import { formatListingDate, tour } from '../data/tour'
import { useAppState } from '../state/AppState'
import EventThumbnail from '../components/EventThumbnail'
import HelpBubble from '../components/HelpBubble'

export default function EventPage() {
  const state = useAppState()
  const pooledDates = tour.dates.filter((d) => state.organiser.pooledDateIds.includes(d.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{tour.name}</h1>

        <h2 className="mt-4 font-extrabold text-ink">Series Details</h2>
        <p className="mt-1 text-brand-700">
          Get your tickets to see {tour.name}. General admission, standing, {tour.priceGBP} per
          ticket.
        </p>
      </div>

      {state.organiser.flexibleEnabled && pooledDates.length > 1 && (
        <div className="rounded-lg bg-brand-50 p-4 ring-1 ring-brand-200">
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
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-ink">All Events</h2>
          <div className="flex rounded-full bg-white p-1 text-xs font-bold ring-1 ring-brand-200">
            <span className="rounded-full bg-brand-600 px-3 py-1 text-white">List View</span>
            <span className="px-3 py-1 text-brand-500">Calendar</span>
          </div>
        </div>
        <p className="text-sm text-brand-500">{tour.dates.length} Events</p>

        <ul className="space-y-3">
          {tour.dates.map((date) => {
            const availability = state.availability[date.id]
            const soldOut = availability === 'soldout'
            return (
              <li
                key={date.id}
                className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-brand-200"
              >
                <EventThumbnail label={tour.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">{formatListingDate(date)}</p>
                  <p className="truncate font-bold text-ink">{tour.name}</p>
                  <p className="text-sm text-brand-600">
                    {date.venue}, {date.city}
                  </p>
                </div>
                {soldOut ? (
                  <span className="shrink-0 text-sm font-extrabold text-red-600">SOLD OUT</span>
                ) : (
                  <button
                    type="button"
                    className="min-h-[40px] shrink-0 rounded-full border-2 border-brand-600 px-4 text-sm font-bold text-brand-600 hover:bg-brand-50"
                  >
                    See Event
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="font-extrabold text-ink">Event Dates & Times</h2>
        <div className="rounded-lg bg-brand-50 p-4 ring-1 ring-brand-200">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-500">Doors Open</p>
          <p className="font-semibold text-ink">
            {formatListingDate(tour.dates[0])} onward, per date
          </p>
        </div>

        <div>
          <h2 className="font-extrabold text-ink">{tour.dates[0].venue}</h2>
          <p className="text-brand-700">{tour.dates[0].city}</p>
          <button type="button" className="mt-1 text-sm font-semibold text-brand-600 hover:underline">
            Get Directions
          </button>
        </div>
      </div>

      <HelpBubble />
    </div>
  )
}
