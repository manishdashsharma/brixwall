import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { SPRITES } from '../../../lib/sprites.js';

export default function WallProgress({ summary }) {
  const percent = summary.total === 0 ? 0 : Math.round((summary.healthy / summary.total) * 100);
  const stopped = summary.total - summary.running;

  return (
    <section
      aria-label="Wall progress"
      className="absolute left-3 top-20 z-30 w-52 rounded-2xl bg-hud/95 p-3 text-white shadow-hud sm:left-4 sm:w-56"
    >
      <div className="flex items-center gap-3">
        <PixelSprite sprite={SPRITES.heroIdle} scale={2} />
        <div>
          <p className="text-xs font-extrabold text-white/70">Wall Progress</p>
          <p className="text-lg font-black leading-tight text-ok">
            {summary.healthy} / {summary.total}
          </p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Healthy containers"
        className="mt-3 h-3 overflow-hidden rounded-full bg-white/15"
      >
        <div
          className="h-full rounded-full bg-ok transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2.5 flex items-center gap-2 text-xs font-bold text-white/80">
        <PixelSprite sprite={SPRITES.crate} scale={2} />
        {summary.running} running · {stopped} stopped
      </p>
    </section>
  );
}
