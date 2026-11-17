import { cn } from '../../../lib/cn.js';
import { SPRITES } from '../../../lib/sprites.js';
import { tileStyle } from '../../../lib/tileStyle.js';

const TILE_SCALE = 3;

export default function Ledge({ side, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute z-[4] hidden w-36 overflow-hidden lg:block',
        side === 'left' ? 'left-0 rounded-br-2xl' : 'right-0 rounded-bl-2xl',
        className
      )}
    >
      <div className="pixelated h-6" style={tileStyle(SPRITES.grassTile, TILE_SCALE)} />
      <div className="pixelated h-12" style={tileStyle(SPRITES.dirtTile, TILE_SCALE)} />
    </div>
  );
}
