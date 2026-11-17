import Icon from '../../../components/ui/Icon.jsx';
import { SPRITES } from '../../../lib/sprites.js';
import { tileStyle } from '../../../lib/tileStyle.js';

const TILE_SCALE = 4;

export default function Ground() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-[5] h-28">
      <div aria-hidden="true" className="pixelated h-8 bg-repeat-x" style={tileStyle(SPRITES.grassTile, TILE_SCALE)} />
      <div aria-hidden="true" className="pixelated h-20" style={tileStyle(SPRITES.dirtTile, TILE_SCALE)} />
      <p className="absolute bottom-3 right-4 hidden items-center gap-2 rounded-lg bg-black/25 px-3 py-1.5 font-pixel text-[9px] text-white/90 md:flex">
        <Icon name="keys" className="size-4" />
        ← → move · Space jump · click a brick
      </p>
    </div>
  );
}
