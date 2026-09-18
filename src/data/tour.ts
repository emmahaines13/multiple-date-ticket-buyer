export type Availability = 'plenty' | 'low' | 'soldout'

export type TourDate = {
  id: string
  city: string
  venue: string
  day: string
}

export type Tour = {
  name: string
  ticketType: string
  priceGBP: number
  dates: TourDate[]
}

export const tour: Tour = {
  name: 'The Example Tour',
  ticketType: 'General admission, standing',
  priceGBP: 65,
  dates: [
    { id: 'glasgow-mon', city: 'Glasgow', venue: 'Ovo Hydro', day: 'Mon 12 Oct' },
    { id: 'london-fri', city: 'London', venue: 'The O2', day: 'Fri 16 Oct' },
    { id: 'london-sat', city: 'London', venue: 'The O2', day: 'Sat 17 Oct' },
    { id: 'amsterdam-mon', city: 'Amsterdam', venue: 'Ziggo Dome', day: 'Mon 19 Oct' },
  ],
}

export const initialAvailability: Record<string, Availability> = {
  'glasgow-mon': 'low',
  'london-fri': 'plenty',
  'london-sat': 'plenty',
  'amsterdam-mon': 'low',
}
