import { useDevPanelOpen } from '../state/DevPanelContext'

export default function HelpBubble() {
  const devPanelOpen = useDevPanelOpen()
  if (devPanelOpen) return null

  return (
    <button
      type="button"
      className="fixed bottom-36 right-4 z-40 flex min-h-[44px] items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-brand-700"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M4 15V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8l-4 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      Have a Question?
    </button>
  )
}
