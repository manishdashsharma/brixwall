import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { cn } from '../../../lib/cn.js';
import { SPRITES } from '../../../lib/sprites.js';
import { useHeroControls } from '../hooks/useHeroControls.js';
import SpeechBubble from './SpeechBubble.jsx';

const GROUND_HEIGHT = 112;
const BUBBLE_GAP = 18;
const WALL_MARGIN = 24;
const IDLE_SPRITES = {
  calm: SPRITES.heroIdle,
  happy: SPRITES.heroHappy,
  worried: SPRITES.heroWorried,
};

const spriteFor = (pose, mood) => {
  if (pose === 'jump') {
    return SPRITES.heroJump;
  }
  if (pose === 'walk') {
    return SPRITES.heroWalk;
  }
  return IDLE_SPRITES[mood];
};

const bubbleBottomFor = ({ anchorX, heroTop, wallSpan }) => {
  const overWall = wallSpan
    && anchorX >= wallSpan.left - WALL_MARGIN
    && anchorX <= wallSpan.right + WALL_MARGIN;
  return overWall ? Math.max(heroTop, GROUND_HEIGHT + wallSpan.height) + BUBBLE_GAP : heroTop + BUBBLE_GAP;
};

export default function Hero({ sceneWidth, message, mood, celebrationId, wallSpan, onMove, onApex }) {
  const scale = sceneWidth < 640 ? 3 : 4;
  const heroWidth = SPRITES.heroIdle.width * scale;
  const heroHeight = SPRITES.heroIdle.height * scale;
  const hero = useHeroControls({ sceneWidth, heroWidth, heroHeight, onMove, onApex });

  if (!hero.ready) {
    return null;
  }

  const anchorX = hero.x + heroWidth / 2;
  const heroTop = GROUND_HEIGHT + heroHeight + hero.y;

  return (
    <>
      <SpeechBubble
        text={message}
        anchorX={anchorX}
        bottom={bubbleBottomFor({ anchorX, heroTop, wallSpan })}
        sceneWidth={sceneWidth}
        width={sceneWidth < 640 ? 180 : 230}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20"
        style={{ left: hero.x, bottom: GROUND_HEIGHT + hero.y }}
      >
        <div key={celebrationId} className={cn(celebrationId > 0 && 'animate-hop')}>
          <PixelSprite
            sprite={spriteFor(hero.pose, mood)}
            scale={scale}
            className={cn('drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]', hero.facing < 0 && '-scale-x-100')}
          />
        </div>
      </div>
    </>
  );
}
