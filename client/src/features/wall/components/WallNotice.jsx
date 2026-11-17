export default function WallNotice({ title, body }) {
  return (
    <div
      role="status"
      className="absolute inset-x-4 bottom-1/3 z-20 mx-auto max-w-sm rounded-2xl border-4 border-hud-edge bg-hud/95 px-5 py-4 text-center text-white shadow-hud"
    >
      <p className="font-pixel text-[11px] leading-relaxed">{title}</p>
      <p className="mt-2 text-sm font-semibold text-white/80">{body}</p>
    </div>
  );
}
