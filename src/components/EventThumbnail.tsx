export default function EventThumbnail({ label, size = 64 }: { label: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-brand-700 to-brand-500 font-black text-white"
      style={{ width: size, height: size, fontSize: size / 2.6 }}
      aria-hidden="true"
    >
      {label.slice(0, 1).toUpperCase()}
    </div>
  )
}
