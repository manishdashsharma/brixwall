const EDGE_GAP = 8;
const TAIL_INSET = 18;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function SpeechBubble({ text, anchorX, bottom, sceneWidth, width }) {
  const left = clamp(anchorX - width * 0.35, EDGE_GAP, Math.max(EDGE_GAP, sceneWidth - width - EDGE_GAP));
  const tailLeft = clamp(anchorX - left, TAIL_INSET, width - TAIL_INSET);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute z-20 rounded-xl border-4 border-hud bg-white px-3 py-2.5 font-pixel text-[9px] leading-relaxed text-hud shadow-[4px_4px_0_rgba(23,35,66,0.35)] sm:text-[10px]"
      style={{ left, bottom, width }}
    >
      {text}
      <span
        aria-hidden="true"
        className="absolute top-full size-3 -translate-x-1/2 -translate-y-[6px] rotate-45 border-b-4 border-r-4 border-hud bg-white"
        style={{ left: tailLeft }}
      />
    </div>
  );
}
