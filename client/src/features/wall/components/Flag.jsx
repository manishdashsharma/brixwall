import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { cn } from '../../../lib/cn.js';
import { SPRITES } from '../../../lib/sprites.js';

export default function Flag({ raised }) {
  return (
    <div
      role="img"
      aria-label={raised ? 'Flag raised: every container is healthy' : 'Flag lowered'}
      className="absolute bottom-28 right-[5%] z-10 hidden h-[min(48vh,360px)] w-24 sm:block"
    >
      <div className="absolute inset-y-0 left-0 w-2 rounded-sm bg-linear-to-r from-slate-100 to-slate-400" />
      <div className="absolute -left-1.5 -top-4 size-5 rounded-full border-2 border-amber-700 bg-amber-400" />
      <div className="absolute -bottom-1 -left-3 h-4 w-8 rounded-sm border-2 border-amber-800 bg-amber-500" />
      <div
        className={cn(
          'absolute left-2 h-14 w-20 transition-[bottom] duration-[1800ms] ease-out',
          raised ? 'bottom-[calc(100%-3.75rem)]' : 'bottom-3'
        )}
      >
        <div className="flex size-full items-center bg-flag pl-2 [clip-path:polygon(0_0,100%_50%,0_100%)]">
          <PixelSprite sprite={SPRITES.crateIcon} scale={2} />
        </div>
      </div>
    </div>
  );
}
