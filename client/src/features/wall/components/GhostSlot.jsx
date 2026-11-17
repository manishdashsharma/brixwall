export default function GhostSlot({ position, width, height }) {
  return (
    <div
      aria-hidden="true"
      className="absolute"
      style={{ left: position.left, bottom: position.bottom, width, height }}
    >
      <div className="size-full rounded-md border-[3px] border-dashed border-white/80 bg-sky-low/40" />
      <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 animate-bob font-pixel text-sm leading-none text-white [text-shadow:0_2px_0_rgba(0,0,0,0.3)]">
        ▼
      </div>
    </div>
  );
}
