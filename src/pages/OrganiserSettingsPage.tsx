import { tour } from '../data/tour'
import { useAppDispatch, useAppState } from '../state/AppState'
import DateBadge from '../components/DateBadge'

export default function OrganiserSettingsPage() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const { organiser } = state

  function togglePooled(id: string) {
    const pooledDateIds = organiser.pooledDateIds.includes(id)
      ? organiser.pooledDateIds.filter((d) => d !== id)
      : [...organiser.pooledDateIds, id]
    dispatch({ type: 'UPDATE_ORGANISER', settings: { pooledDateIds } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink">Organiser settings</h1>
        <p className="text-brand-700">
          Controls the flexible request pool for {tour.name}. Changes here affect what buyers see
          on the setup screen.
        </p>
      </div>

      <label className="flex min-h-[44px] items-center justify-between rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200">
        <span className="font-bold text-ink">Enable flexible ("any of these dates")</span>
        <input
          type="checkbox"
          className="h-5 w-5 accent-brand-600"
          checked={organiser.flexibleEnabled}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_ORGANISER', settings: { flexibleEnabled: e.target.checked } })
          }
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="font-extrabold text-ink">Dates included in the pool</legend>
        {tour.dates.map((date) => (
          <label
            key={date.id}
            className="flex min-h-[44px] items-center gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200"
          >
            <DateBadge date={date} />
            <span className="flex-1">
              <span className="block font-bold text-ink">{date.city}</span>
              <span className="block text-sm text-brand-700">{date.venue}</span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-brand-600"
              checked={organiser.pooledDateIds.includes(date.id)}
              onChange={() => togglePooled(date.id)}
            />
          </label>
        ))}
      </fieldset>

      <label className="flex min-h-[44px] items-center justify-between rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-200">
        <span className="font-bold text-ink">Lock pool to a single price tier</span>
        <input
          type="checkbox"
          className="h-5 w-5 accent-brand-600"
          checked={organiser.lockToSameTier}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_ORGANISER', settings: { lockToSameTier: e.target.checked } })
          }
        />
      </label>

      <div className="space-y-2">
        <label htmlFor="cap" className="block font-extrabold text-ink">
          Quantity cap per request
        </label>
        <select
          id="cap"
          value={organiser.quantityCap}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_ORGANISER',
              settings: { quantityCap: Number(e.target.value) },
            })
          }
          className="min-h-[44px] w-full rounded-md border border-brand-300 bg-white px-3 py-2"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
