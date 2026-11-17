import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import StatusDot from '../../../components/ui/StatusDot.jsx';
import { brickColorFor } from '../../../lib/brickColors.js';
import { cn } from '../../../lib/cn.js';
import { containerLabel, containerTone } from '../../../lib/containerStatus.js';
import { SPRITES } from '../../../lib/sprites.js';
import Parachute from './Parachute.jsx';

const PHASE_ANIMATION = {
  dropping: 'animate-brick-drop',
  falling: 'animate-brick-fall pointer-events-none',
  placed: '',
};

export default function Brick({ brick, position, width, height, isSelected, onSelect, onDropEnd, onFallEnd }) {
  const color = brickColorFor(brick.name);
  const tone = containerTone(brick);
  const isStopped = tone === 'off';
  const delay = brick.phase === 'dropping' ? brick.dropDelay : 0;

  const handleAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (brick.phase === 'dropping') {
      onDropEnd(brick.id);
    }
    if (brick.phase === 'falling') {
      onFallEnd(brick.id);
    }
  };

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={cn('absolute transition-[left,bottom] duration-500 ease-out', PHASE_ANIMATION[brick.phase])}
      style={{
        left: position.left,
        bottom: position.bottom,
        width,
        height,
        animationDelay: `${delay}ms`,
      }}
    >
      {brick.phase === 'dropping' && (
        <Parachute color={color.base} width={Math.round(width * 0.8)} delay={delay} />
      )}
      <button
        type="button"
        onClick={() => onSelect(brick.id)}
        aria-label={`${brick.name}, ${containerLabel(brick)}`}
        aria-pressed={isSelected}
        className={cn(
          'brick-ribs relative flex size-full items-center justify-center gap-[6%] overflow-hidden',
          'rounded-md border-[3px] px-2 transition hover:brightness-110 focus-visible:outline-none',
          'shadow-[inset_0_3px_0_rgba(255,255,255,0.35),inset_0_-4px_0_rgba(0,0,0,0.25)]',
          isStopped && 'grayscale-[85%] brightness-90',
          isSelected && 'ring-4 ring-white ring-offset-2 ring-offset-hud'
        )}
        style={{ backgroundColor: color.base, borderColor: color.dark }}
      >
        <PixelSprite sprite={SPRITES.crateIcon} scale={height > 54 ? 3 : 2} className="shrink-0 drop-shadow" />
        <span
          className="truncate font-black text-white [text-shadow:0_2px_0_rgba(0,0,0,0.35)]"
          style={{ fontSize: Math.min(17, Math.max(10, Math.round(height * 0.24))) }}
        >
          {brick.name}
        </span>
        <StatusDot tone={tone} className="absolute right-1.5 top-1.5 size-2.5" />
      </button>
    </div>
  );
}
