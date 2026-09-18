import type { Availability } from '../data/tour'

const LABEL: Record<Availability, string> = {
  plenty: 'Tickets available',
  low: 'Selling fast',
  soldout: 'Sold out',
}

const STYLE: Record<Availability, string> = {
  plenty: 'bg-green-100 text-green-800',
  low: 'bg-amber-100 text-amber-800',
  soldout: 'bg-red-100 text-red-800',
}

export default function AvailabilityBadge({ status }: { status: Availability }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STYLE[status]}`}>
      {LABEL[status]}
    </span>
  )
}
