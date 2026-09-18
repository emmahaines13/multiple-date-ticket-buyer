import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { tour, initialAvailability, type Availability } from '../data/tour'

export type OrganiserSettings = {
  flexibleEnabled: boolean
  pooledDateIds: string[]
  lockToSameTier: boolean
  quantityCap: number
}

export type OfferStatus = 'idle' | 'queued' | 'at-front' | 'confirmed'

export type BuyerFlow = {
  selectedDateIds: string[]
  favouriteId: string | null
  quantity: number
  status: OfferStatus
  queuePosition: number
  queueTotal: number
  offerIndex: number
  declinedDateIds: string[]
  confirmedDateId: string | null
}

export type AppState = {
  organiser: OrganiserSettings
  availability: Record<string, Availability>
  buyer: BuyerFlow
  queueFast: boolean
}

const initialOrganiser: OrganiserSettings = {
  flexibleEnabled: true,
  pooledDateIds: tour.dates.map((d) => d.id),
  lockToSameTier: true,
  quantityCap: 4,
}

const initialBuyer: BuyerFlow = {
  selectedDateIds: [],
  favouriteId: null,
  quantity: 1,
  status: 'idle',
  queuePosition: 0,
  queueTotal: 0,
  offerIndex: 0,
  declinedDateIds: [],
  confirmedDateId: null,
}

const initialState: AppState = {
  organiser: initialOrganiser,
  availability: { ...initialAvailability },
  buyer: initialBuyer,
  queueFast: false,
}

type Action =
  | { type: 'TOGGLE_DATE'; id: string }
  | { type: 'SET_FAVOURITE'; id: string }
  | { type: 'SET_QUANTITY'; quantity: number }
  | { type: 'ENTER_QUEUE' }
  | { type: 'TICK_QUEUE' }
  | { type: 'REACH_FRONT' }
  | { type: 'CONFIRM_OFFER' }
  | { type: 'DECLINE_OFFER' }
  | { type: 'SET_QUEUE_SPEED'; fast: boolean }
  | { type: 'SELL_OUT'; id: string }
  | { type: 'SELL_OUT_FAVOURITE' }
  | { type: 'SELL_OUT_SECOND_CHOICE' }
  | { type: 'UPDATE_ORGANISER'; settings: Partial<OrganiserSettings> }
  | { type: 'RESET' }

function orderedCandidates(buyer: BuyerFlow): string[] {
  const rest = buyer.selectedDateIds.filter((id) => id !== buyer.favouriteId)
  return buyer.favouriteId ? [buyer.favouriteId, ...rest] : rest
}

function nextAvailableIndex(
  candidates: string[],
  startIndex: number,
  availability: Record<string, Availability>,
): number {
  for (let i = startIndex; i < candidates.length; i++) {
    if (availability[candidates[i]] !== 'soldout') return i
  }
  return candidates.length
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_DATE': {
      const isSelected = state.buyer.selectedDateIds.includes(action.id)
      const selectedDateIds = isSelected
        ? state.buyer.selectedDateIds.filter((id) => id !== action.id)
        : [...state.buyer.selectedDateIds, action.id]
      let favouriteId = state.buyer.favouriteId
      if (isSelected && favouriteId === action.id) {
        favouriteId = selectedDateIds[0] ?? null
      }
      if (!favouriteId && selectedDateIds.length > 0) {
        favouriteId = selectedDateIds[0]
      }
      return { ...state, buyer: { ...state.buyer, selectedDateIds, favouriteId } }
    }
    case 'SET_FAVOURITE':
      return { ...state, buyer: { ...state.buyer, favouriteId: action.id } }
    case 'SET_QUANTITY':
      return { ...state, buyer: { ...state.buyer, quantity: action.quantity } }
    case 'ENTER_QUEUE': {
      const queueTotal = 812
      return {
        ...state,
        buyer: { ...state.buyer, status: 'queued', queuePosition: queueTotal, queueTotal },
      }
    }
    case 'TICK_QUEUE': {
      if (state.buyer.status !== 'queued') return state
      const step = state.queueFast ? 90 : 17
      const nextPosition = Math.max(0, state.buyer.queuePosition - step)
      if (nextPosition === 0) {
        return { ...state, buyer: { ...state.buyer, queuePosition: 0, status: 'at-front' } }
      }
      return { ...state, buyer: { ...state.buyer, queuePosition: nextPosition } }
    }
    case 'REACH_FRONT': {
      const candidates = orderedCandidates(state.buyer)
      const offerIndex = nextAvailableIndex(candidates, 0, state.availability)
      return { ...state, buyer: { ...state.buyer, status: 'at-front', offerIndex } }
    }
    case 'CONFIRM_OFFER': {
      const candidates = orderedCandidates(state.buyer)
      const confirmedDateId = candidates[state.buyer.offerIndex] ?? null
      return {
        ...state,
        buyer: { ...state.buyer, status: 'confirmed', confirmedDateId },
      }
    }
    case 'DECLINE_OFFER': {
      const candidates = orderedCandidates(state.buyer)
      const declinedDateIds = candidates[state.buyer.offerIndex]
        ? [...state.buyer.declinedDateIds, candidates[state.buyer.offerIndex]]
        : state.buyer.declinedDateIds
      const offerIndex = nextAvailableIndex(candidates, state.buyer.offerIndex + 1, state.availability)
      return { ...state, buyer: { ...state.buyer, offerIndex, declinedDateIds } }
    }
    case 'SET_QUEUE_SPEED':
      return { ...state, queueFast: action.fast }
    case 'SELL_OUT': {
      const availability = { ...state.availability, [action.id]: 'soldout' as Availability }
      let buyer = state.buyer
      const candidates = orderedCandidates(buyer)
      const currentId = candidates[buyer.offerIndex]
      if (buyer.status === 'at-front' && currentId === action.id) {
        const offerIndex = nextAvailableIndex(candidates, buyer.offerIndex, availability)
        buyer = { ...buyer, offerIndex }
      }
      return { ...state, availability, buyer }
    }
    case 'SELL_OUT_FAVOURITE': {
      if (!state.buyer.favouriteId) return state
      return reducer(state, { type: 'SELL_OUT', id: state.buyer.favouriteId })
    }
    case 'SELL_OUT_SECOND_CHOICE': {
      const candidates = orderedCandidates(state.buyer)
      const second = candidates[1]
      if (!second) return state
      return reducer(state, { type: 'SELL_OUT', id: second })
    }
    case 'UPDATE_ORGANISER': {
      const organiser = { ...state.organiser, ...action.settings }
      const selectedDateIds = state.buyer.selectedDateIds.filter((id) =>
        organiser.pooledDateIds.includes(id),
      )
      const favouriteId = selectedDateIds.includes(state.buyer.favouriteId ?? '')
        ? state.buyer.favouriteId
        : selectedDateIds[0] ?? null
      return { ...state, organiser, buyer: { ...state.buyer, selectedDateIds, favouriteId } }
    }
    case 'RESET':
      return {
        ...initialState,
        organiser: state.organiser,
        availability: { ...initialAvailability },
      }
    default:
      return state
  }
}

const AppStateContext = createContext<AppState | null>(null)
const AppDispatchContext = createContext<React.Dispatch<Action> | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext)
  if (!ctx) throw new Error('useAppDispatch must be used within AppStateProvider')
  return ctx
}

export function orderedOfferCandidates(buyer: BuyerFlow): string[] {
  return orderedCandidates(buyer)
}
