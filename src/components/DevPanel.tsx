import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppState } from '../state/AppState'

type DevPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DevPanel({ open, onOpenChange }: DevPanelProps) {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function handleReset() {
    dispatch({ type: 'RESET' })
    navigate('/')
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-brand-900 text-white">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex min-h-[44px] w-full items-center justify-between px-4 py-2 text-sm font-bold"
        aria-expanded={open}
      >
        <span>Prototype controls</span>
        <span aria-hidden="true">{open ? '▾' : '▴'}</span>
      </button>
      {open && (
        <div className="flex flex-wrap gap-2 border-t border-brand-700 px-4 py-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SELL_OUT_FAVOURITE' })}
            disabled={!state.buyer.favouriteId}
            className="min-h-[44px] rounded-full bg-brand-700 px-3 py-2 text-sm font-semibold hover:bg-brand-600 disabled:opacity-40"
          >
            Sell out favourite before I reach the front
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SELL_OUT_SECOND_CHOICE' })}
            disabled={state.buyer.selectedDateIds.length < 2}
            className="min-h-[44px] rounded-full bg-brand-700 px-3 py-2 text-sm font-semibold hover:bg-brand-600 disabled:opacity-40"
          >
            Sell out my second choice as well
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_QUEUE_SPEED', fast: !state.queueFast })}
            className="min-h-[44px] rounded-full bg-brand-700 px-3 py-2 text-sm font-semibold hover:bg-brand-600"
          >
            {state.queueFast ? 'Queue speed: fast' : 'Speed up queue'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] rounded-full bg-white px-3 py-2 text-sm font-bold text-ink hover:bg-brand-100"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
