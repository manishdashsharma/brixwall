export default function LandingBurst({ delay }) {
  const timing = { animationDelay: `${delay}ms` };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span
        className="absolute -left-1 bottom-0 size-3 rounded-[2px] bg-white/90 animate-dust-left"
        style={timing}
      />
      <span
        className="absolute left-3 bottom-0 size-2 rounded-[2px] bg-white/80 animate-dust-left"
        style={timing}
      />
      <span
        className="absolute -right-1 bottom-0 size-3 rounded-[2px] bg-white/90 animate-dust-right"
        style={timing}
      />
      <span
        className="absolute right-3 bottom-0 size-2 rounded-[2px] bg-white/80 animate-dust-right"
        style={timing}
      />
      <span
        className="absolute -top-3 left-1/2 font-pixel text-xs text-yellow-300 [text-shadow:2px_2px_0_#172342] animate-score-pop"
        style={timing}
      >
        +1
      </span>
    </div>
  );
}
