export type Availability = 'plenty' | 'low' | 'soldout'

export type TourDate = {
  id: string
  city: string
  venue: string
  weekday: string
  dayNum: string
  month: string
  year: string
  doorsTime: string
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
    { id: 'glasgow-mon', city: 'Glasgow', venue: 'Ovo Hydro', weekday: 'Monday', dayNum: '12', month: 'Oct', year: '2026', doorsTime: '18:30' },
    { id: 'london-fri', city: 'London', venue: 'The O2', weekday: 'Friday', dayNum: '16', month: 'Oct', year: '2026', doorsTime: '18:30' },
    { id: 'london-sat', city: 'London', venue: 'The O2', weekday: 'Saturday', dayNum: '17', month: 'Oct', year: '2026', doorsTime: '18:30' },
    { id: 'amsterdam-mon', city: 'Amsterdam', venue: 'Ziggo Dome', weekday: 'Monday', dayNum: '19', month: 'Oct', year: '2026', doorsTime: '19:00' },
  ],
}

export function formatDate(date: TourDate): string {
  return `${date.weekday} ${date.dayNum} ${date.month}`
}

export function formatListingDate(date: TourDate): string {
  return `${date.weekday.slice(0, 3).toUpperCase()} ${date.dayNum} ${date.month} ${date.year} - ${date.doorsTime}`
}

export const SERVICE_FEE_PER_TICKET = 8.5
export const ORDER_PROCESSING_FEE = 4.25

export function formatMoney(value: number): string {
  return `£${value.toFixed(2)}`
}

export function orderTotal(quantity: number): number {
  return tour.priceGBP * quantity + SERVICE_FEE_PER_TICKET * quantity + ORDER_PROCESSING_FEE
}

export const initialAvailability: Record<string, Availability> = {
  'glasgow-mon': 'low',
  'london-fri': 'plenty',
  'london-sat': 'plenty',
  'amsterdam-mon': 'low',
}
