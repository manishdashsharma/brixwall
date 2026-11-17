const PIECE_COUNT = 48;
const CONFETTI_COLORS = ['#f7c531', '#ef4444', '#3ddc68', '#2f6fde', '#ec4899', '#8b5cf6', '#14b8a6'];
const PIECE_SIZES = ['size-2', 'size-2.5', 'size-3'];

const PIECES = Array.from({ length: PIECE_COUNT }, (_, index) => ({
  id: `piece-${index}`,
  left: `${(index * 37 + 11) % 100}%`,
  delay: (index * 53) % 1400,
  duration: 2400 + ((index * 71) % 1600),
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  size: PIECE_SIZES[index % PIECE_SIZES.length],
}));

export default function Celebration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[26] overflow-hidden">
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className={`absolute -top-4 animate-confetti rounded-[1px] ${piece.size}`}
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${piece.duration}ms`,
          }}
        />
      ))}
      <p className="absolute left-1/2 top-[30%] animate-banner-pop whitespace-nowrap rounded-2xl border-4 border-hud bg-yellow-300 px-6 py-4 font-pixel text-base text-hud shadow-[6px_6px_0_rgba(23,35,66,0.4)] sm:text-xl">
        ALL HEALTHY!
      </p>
    </div>
  );
}
