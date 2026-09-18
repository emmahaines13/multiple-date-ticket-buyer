import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppState } from '../state/AppState'

export default function DevPanel() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleReset() {
    dispatch({ type: 'RESET' })
    navigate('/')
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-300 bg-brand-900 text-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] w-full items-center justify-between px-4 py-2 text-sm font-medium"
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
            className="min-h-[44px] rounded-md bg-brand-700 px-3 py-2 text-sm hover:bg-brand-600 disabled:opacity-40"
          >
            Sell out favourite before I reach the front
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SELL_OUT_SECOND_CHOICE' })}
            disabled={state.buyer.selectedDateIds.length < 2}
            className="min-h-[44px] rounded-md bg-brand-700 px-3 py-2 text-sm hover:bg-brand-600 disabled:opacity-40"
          >
            Sell out my second choice as well
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_QUEUE_SPEED', fast: !state.queueFast })}
            className="min-h-[44px] rounded-md bg-brand-700 px-3 py-2 text-sm hover:bg-brand-600"
          >
            {state.queueFast ? 'Queue speed: fast' : 'Speed up queue'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] rounded-md bg-white px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-100"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
