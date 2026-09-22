export default function EventThumbnail({ size = 96 }: { size?: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-lg"
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 30% 20%, #93aee8 0%, transparent 55%), linear-gradient(135deg, #0a1a4d 0%, #1439b8 55%, #1e49d6 100%)',
      }}
      aria-hidden="true"
    />
  )
}
