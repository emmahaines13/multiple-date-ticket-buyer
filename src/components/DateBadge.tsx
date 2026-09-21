import type { TourDate } from '../data/tour'

export default function DateBadge({ date }: { date: TourDate }) {
  return (
    <div
      className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-600 py-2 text-center text-white"
      aria-hidden="true"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-100">
        {date.weekday.slice(0, 3)}
      </span>
      <span className="text-lg font-bold leading-tight">{date.dayNum}</span>
      <span className="text-[11px] uppercase text-brand-100">{date.month}</span>
    </div>
  )
}
