import { createElement } from 'react';
import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import StatusDot from '../../../components/ui/StatusDot.jsx';
import { brickColorFor } from '../../../lib/brickColors.js';
import { cn } from '../../../lib/cn.js';
import { containerIconFor } from '../../../lib/containerIcon.js';
import { containerLabel, containerTone } from '../../../lib/containerStatus.js';
import { SPRITES } from '../../../lib/sprites.js';
import LandingBurst from './LandingBurst.jsx';
import Parachute from './Parachute.jsx';

const DROP_TOUCHDOWN_MS = 4800;
const MIN_FONT = 10;
const MAX_FONT = 16;
const CHAR_WIDTH_RATIO = 0.56;
const LABEL_CHROME = 30;

const PHASE_ANIMATION = {
  dropping: 'animate-brick-drop',
  falling: 'animate-brick-fall pointer-events-none',
  placed: '',
};

const labelFontSize = (name, width, height, iconSize) => {
  const byHeight = height * 0.28;
  const byWidth = (width - iconSize - LABEL_CHROME) / (name.length * CHAR_WIDTH_RATIO);
  return Math.round(Math.min(MAX_FONT, Math.max(MIN_FONT, Math.min(byHeight, byWidth))));
};

export default function Brick({
  brick,
  position,
  width,
  height,
  isSelected,
  isBumped,
  onSelect,
  onDropEnd,
  onFallEnd,
  onBumpEnd,
}) {
  const color = brickColorFor(brick.name);
  const tone = containerTone(brick);
  const isStopped = tone === 'off';
  const delay = brick.phase === 'dropping' ? brick.dropDelay : 0;
  const iconSize = Math.round(Math.min(22, Math.max(12, height * 0.34)));

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

  const handleBumpEnd = (event) => {
    if (event.target === event.currentTarget && isBumped) {
      onBumpEnd();
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
        <>
          <Parachute color={color.base} width={Math.round(width * 0.8)} delay={delay} />
          <LandingBurst delay={delay + DROP_TOUCHDOWN_MS} />
        </>
      )}
      <button
        type="button"
        onClick={() => onSelect(brick.id)}
        onAnimationEnd={handleBumpEnd}
        title={`${brick.name} · ${containerLabel(brick)}`}
        aria-label={`${brick.name}, ${containerLabel(brick)}`}
        aria-pressed={isSelected}
        className={cn(
          'brick-ribs relative flex size-full items-center justify-center gap-1.5 overflow-hidden',
          'rounded-md border-[3px] pl-2 pr-3.5 transition hover:brightness-110 focus-visible:outline-none',
          'shadow-[inset_0_3px_0_rgba(255,255,255,0.35),inset_0_-4px_0_rgba(0,0,0,0.25)]',
          isStopped && 'grayscale-[85%] brightness-90',
          isSelected && 'ring-4 ring-white ring-offset-2 ring-offset-hud',
          isBumped && 'animate-brick-bump'
        )}
        style={{ backgroundColor: color.base, borderColor: color.dark }}
      >
        {createElement(containerIconFor(brick), {
          'aria-hidden': true,
          size: iconSize,
          strokeWidth: 2.5,
          className: 'shrink-0 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]',
        })}
        <span
          className="truncate font-black text-white [text-shadow:0_2px_0_rgba(0,0,0,0.35)]"
          style={{ fontSize: labelFontSize(brick.name, width, height, iconSize) }}
        >
          {brick.name}
        </span>
        {isStopped && (
          <PixelSprite sprite={SPRITES.crack} className="absolute inset-0 size-full opacity-55" />
        )}
        <StatusDot tone={tone} className="absolute right-1.5 top-1.5 size-2.5" />
      </button>
    </div>
  );
}
